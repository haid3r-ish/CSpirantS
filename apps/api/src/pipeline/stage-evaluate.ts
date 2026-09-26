import { prisma } from '@repo/db';
import { createLlmProvider } from '@repo/llm-core';
import type { LlmConfig, LlmEvaluationItem, PipelineRunStats } from '@repo/types';
import { config } from '../core/config.js';

export async function runEvaluateStage(pipelineRunId: string): Promise<PipelineRunStats> {
  const articles = await prisma.article.findMany({
    where: { pipelineRunId, status: 'DISCOVERED' },
    include: { source: true },
  });

  const pipelineRun = await prisma.pipelineRun.findUnique({
    where: { id: pipelineRunId },
  });

  if (!pipelineRun) {
    throw new Error(`Pipeline run ${pipelineRunId} not found`);
  }

  const stats = (pipelineRun.stats as unknown as PipelineRunStats) || {
    discovered: 0,
    approved: 0,
    rejected: 0,
    deduplicated: 0,
    extracted: 0,
    failed: 0,
  };

  if (articles.length === 0) {
    return stats;
  }

  const items: LlmEvaluationItem[] = articles.map(a => ({
    hash: a.hash,
    title: a.title,
    description: a.description || undefined,
    sourceGroup: a.source.dedupeGroup || 'default',
    publishedAt: a.discoveredAt.toISOString(),
  }));

  const mode = config.LLM_MODE === 'api' ? 'API' : 'MANUAL';

  const batch = await prisma.llmBatch.create({
    data: {
      pipelineRunId,
      mode,
      status: 'PENDING',
      promptCsv: '',
    },
  });

  const llmConfig: LlmConfig = {
    provider: config.LLM_PROVIDER as 'gemini' | 'grok',
    model: config.LLM_MODEL,
    apiKey: config.GEMINI_API_KEY || config.GROQ_API_KEY || '',
    mode: config.LLM_MODE as 'api' | 'manual',
  };

  const provider = createLlmProvider(llmConfig);
  const result = await provider.evaluate(items, batch.id);

  if (result.mode === 'manual') {
    await prisma.llmBatch.update({
      where: { id: batch.id },
      data: {
        status: 'AWAITING_MANUAL',
        promptCsv: result.promptCsv || result.rawResponse || '',
      },
    });

    await prisma.pipelineRun.update({
      where: { id: pipelineRunId },
      data: {
        status: 'AWAITING_MANUAL',
      },
    });

    return stats;
  }

  // mode === 'api'
  const approvedSet = new Set(result.approvedHashes);
  const rejectedHashes = items.filter(i => !approvedSet.has(i.hash)).map(i => i.hash);

  await prisma.llmBatch.update({
    where: { id: batch.id },
    data: {
      status: 'COMPLETED',
      approvedHashes: result.approvedHashes,
      response: result.rawResponse,
      promptTokens: result.tokenUsage?.prompt,
      completionTokens: result.tokenUsage?.completion,
      estimatedCostUsd: result.estimatedCostUsd,
      completedAt: new Date(),
    },
  });

  if (result.approvedHashes.length > 0) {
    await prisma.article.updateMany({
      where: { pipelineRunId, hash: { in: result.approvedHashes } },
      data: { status: 'APPROVED', evaluatedAt: new Date() },
    });
  }

  if (rejectedHashes.length > 0) {
    await prisma.article.updateMany({
      where: { pipelineRunId, hash: { in: rejectedHashes } },
      data: { status: 'REJECTED', evaluatedAt: new Date() },
    });
  }

  // --- Process Deduplication ---
  let deduplicatedCount = 0;
  if (config.DEDUPE_ENABLED && result.duplicateGroups && result.duplicateGroups.length > 0) {
    try {
      for (const group of result.duplicateGroups) {
        // Guard: canonical must be approved
        if (!result.approvedHashes.includes(group.canonical)) continue;

        const canonicalArticle = articles.find(a => a.hash === group.canonical);
        if (!canonicalArticle) continue;

        const canonicalGroup = canonicalArticle.source.dedupeGroup || 'default';
        const validDuplicates = [];

        for (const dupHash of group.duplicates) {
          const dupArticle = articles.find(a => a.hash === dupHash);
          if (!dupArticle) continue;

          const dupGroup = dupArticle.source.dedupeGroup || 'default';
          if (dupGroup !== canonicalGroup) {
            console.warn(`[Pipeline] Cross-group dedup rejected: ${canonicalGroup} != ${dupGroup} for hashes ${group.canonical} & ${dupHash}`);
            continue;
          }

          // Same group, mark as DEDUPLICATED
          await prisma.article.update({
            where: { id: dupArticle.id },
            data: {
              status: 'DEDUPLICATED',
              canonicalArticleId: canonicalArticle.id,
              fullContent: null, // clear content to save space as it's a ghost article
            },
          });
          validDuplicates.push(dupArticle);
          deduplicatedCount++;
        }

        // Update canonical's alsoCoveredBy
        if (validDuplicates.length > 0) {
          const newEntries = validDuplicates.map(d => ({
            source: d.source.name,
            url: d.url,
          }));
          
          let currentAlsoCoveredBy: any[] = [];
          if (canonicalArticle.alsoCoveredBy && Array.isArray(canonicalArticle.alsoCoveredBy)) {
            currentAlsoCoveredBy = canonicalArticle.alsoCoveredBy;
          }
          
          await prisma.article.update({
            where: { id: canonicalArticle.id },
            data: {
              alsoCoveredBy: [...currentAlsoCoveredBy, ...newEntries],
            },
          });
        }
      }
    } catch (err) {
      console.error(`[Pipeline] Error during deduplication logic for batch ${batch.id}:`, err);
      // We don't throw - let the pipeline continue
    }
  }

  stats.approved = (stats.approved || 0) + result.approvedHashes.length - deduplicatedCount;
  stats.rejected = (stats.rejected || 0) + rejectedHashes.length;
  stats.deduplicated = (stats.deduplicated || 0) + deduplicatedCount;

  await prisma.pipelineRun.update({
    where: { id: pipelineRunId },
    data: { stats: stats as any },
  });

  return stats;
}
