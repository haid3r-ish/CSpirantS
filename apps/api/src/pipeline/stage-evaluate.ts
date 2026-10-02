import { prisma } from '@repo/db';
import { createLlmProvider } from '@repo/llm-core';
import type { LlmConfig, LlmEvaluationItem, PipelineRunStats } from '@repo/types';
import { config } from '../core/config.js';
import { NotFoundError } from '../core/errors.js';
import { z } from 'zod';

const EVALUATE_TIMEOUT_MS = 5 * 60 * 1000;

export async function runEvaluateStage(pipelineRunId: string): Promise<PipelineRunStats> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`[Evaluate] Stage timed out after ${EVALUATE_TIMEOUT_MS}ms for run ${pipelineRunId}`));
    }, EVALUATE_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      timeoutPromise,
      _runEvaluateStageLogic(pipelineRunId)
    ]);
  } finally {
    clearTimeout(timer!);
  }
}

async function _runEvaluateStageLogic(pipelineRunId: string): Promise<PipelineRunStats> {
  const [articles, pipelineRun] = await Promise.all([
    prisma.article.findMany({
      where: { pipelineRunId, status: 'DISCOVERED' },
      include: { source: true },
    }),
    prisma.pipelineRun.findUnique({
      where: { id: pipelineRunId },
    })
  ]);

  if (!pipelineRun) {
    throw new NotFoundError(`Pipeline run ${pipelineRunId} not found`);
  }

  const statsSchema = z.object({
    discovered: z.number().optional(),
    approved: z.number().optional(),
    rejected: z.number().optional(),
    extracted: z.number().optional(),
    failed: z.number().optional(),
    deduplicated: z.number().optional(),
  }).passthrough();

  const parsedStats = statsSchema.safeParse(pipelineRun.stats);
  const dbStats = parsedStats.success ? parsedStats.data : {};
  const stats: PipelineRunStats = {
    discovered: dbStats.discovered || 0,
    approved: dbStats.approved || 0,
    rejected: dbStats.rejected || 0,
    deduplicated: dbStats.deduplicated || 0,
    extracted: dbStats.extracted || 0,
    failed: dbStats.failed || 0,
  };

  if (articles.length === 0) {
    return stats;
  }

  const items: LlmEvaluationItem[] = articles.map(a => {
    const ext = a.extractedData as Record<string, unknown> | null;
    return {
      hash: a.hash,
      title: a.title,
      description: a.description || undefined,
      sourceGroup: a.source.dedupeGroup || 'default',
      publishedAt: (ext?.publishedAt as string) || a.discoveredAt.toISOString(),
    };
  });

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
    await prisma.$transaction([
      prisma.llmBatch.update({
        where: { id: batch.id },
        data: {
          status: 'AWAITING_MANUAL',
          promptCsv: result.promptCsv || result.rawResponse || '',
        },
      }),
      prisma.pipelineRun.update({
        where: { id: pipelineRunId },
        data: {
          status: 'AWAITING_MANUAL',
          currentStage: 'EVALUATE',
        },
      }),
    ]);

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
    const txUpdates: any[] = [];
    for (const group of result.duplicateGroups) {
      try {
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
            console.warn(`[Evaluate][Run:${pipelineRunId}] Cross-group dedup rejected: ${canonicalGroup} != ${dupGroup} for hashes ${group.canonical} & ${dupHash}`);
            continue;
          }

          // Same group, mark as DEDUPLICATED
          txUpdates.push(prisma.article.update({
            where: { id: dupArticle.id },
            data: {
              status: 'DEDUPLICATED',
              canonicalArticleId: canonicalArticle.id,
              fullContent: null, // clear content to save space as it's a ghost article
              description: null, // also clear description to save space
            },
          }));
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

          txUpdates.push(prisma.article.update({
            where: { id: canonicalArticle.id },
            data: {
              alsoCoveredBy: [...currentAlsoCoveredBy, ...newEntries],
            },
          }));
        }
      } catch (err) {
        console.error(`[Evaluate][Run:${pipelineRunId}] Error during deduplication logic for batch ${batch.id}:`, err);
        // We don't throw - let the pipeline continue
      }
    }

    if (txUpdates.length > 0) {
      await prisma.$transaction(txUpdates);
    }
  }

  const approvedDelta = result.approvedHashes.length - deduplicatedCount;
  const rejectedDelta = rejectedHashes.length;
  const deduplicatedDelta = deduplicatedCount;

  let finalStats = stats;
  await prisma.$transaction(async (tx) => {
    const currentRun = await tx.pipelineRun.findUnique({
      where: { id: pipelineRunId },
      select: { stats: true },
    });

    if (currentRun) {
      const dbStats = (currentRun.stats as any) || {};
      finalStats = {
        discovered: dbStats.discovered || 0,
        approved: (dbStats.approved || 0) + approvedDelta,
        rejected: (dbStats.rejected || 0) + rejectedDelta,
        deduplicated: (dbStats.deduplicated || 0) + deduplicatedDelta,
        extracted: dbStats.extracted || 0,
        failed: dbStats.failed || 0,
      };

      await tx.pipelineRun.update({
        where: { id: pipelineRunId },
        data: {
          stats: finalStats as any,
          currentStage: 'EXTRACT',
        },
      });
    }
  });

  return finalStats;
}
