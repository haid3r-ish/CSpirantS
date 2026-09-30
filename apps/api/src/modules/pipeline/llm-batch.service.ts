import { prisma } from '@repo/db';
import { extractQueue } from '../../queue/queues.js';
import { NotFoundError, BadRequestError, ConflictError } from '../../core/errors.js';

import { LlmBatchStatus } from '@repo/db';

export async function getPendingBatches(page = 1, limit = 10, status?: LlmBatchStatus) {
  const skip = (page - 1) * limit;
  const whereClause = status ? { status } : {};

  const [batches, total] = await Promise.all([
    prisma.llmBatch.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        pipelineRun: {
          select: { id: true, startedAt: true, currentStage: true }
        }
      }
    }),
    prisma.llmBatch.count({ where: whereClause }),
  ]);

  return {
    batches,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBatchById(id: string) {
  const batch = await prisma.llmBatch.findUnique({
    where: { id },
    include: { pipelineRun: true }
  });
  if (!batch) throw new NotFoundError('Batch not found');
  return batch;
}

export async function getBatchPrompt(id: string) {
  const batch = await prisma.llmBatch.findUnique({
    where: { id },
    select: { id: true, promptCsv: true, status: true }
  });
  if (!batch) throw new NotFoundError('Batch not found');
  return batch;
}

export async function resolveBatch(id: string, payload: { rawResponse?: string; approvedHashes?: string[] }) {
  const { parseEvaluationResponse } = await import('@repo/llm-core');
  const { config } = await import('../../core/config.js');

  let approvedHashes: string[] = [];
  let duplicateGroups: { canonical: string; duplicates: string[] }[] = [];

  if (payload.rawResponse) {
    const parsed = parseEvaluationResponse(payload.rawResponse);
    approvedHashes = parsed.approvedHashes;
    duplicateGroups = parsed.duplicateGroups;
  } else if (payload.approvedHashes) {
    approvedHashes = payload.approvedHashes;
  }

  // Validate hashes regex
  const validHashRegex = /^[a-f0-9]{16}$/i;
  for (const hash of approvedHashes) {
    if (!validHashRegex.test(hash)) {
      throw new BadRequestError(`Invalid hash format: ${hash}`);
    }
  }

  const batch = await prisma.llmBatch.findUnique({ where: { id } });
  if (!batch) throw new NotFoundError('Batch not found');
  if (batch.status !== 'AWAITING_MANUAL') {
    throw new ConflictError(`Batch is not awaiting manual resolution. Current status: ${batch.status}`);
  }

  return prisma.$transaction(async (tx) => {
    // Update Batch to COMPLETED
    const updatedBatch = await tx.llmBatch.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        approvedHashes,
      },
    });

    // Update articles for approved hashes to APPROVED
    if (approvedHashes.length > 0) {
      await tx.article.updateMany({
        where: {
          pipelineRunId: batch.pipelineRunId,
          status: 'DISCOVERED',
          hash: { in: approvedHashes }
        },
        data: { status: 'APPROVED' }
      });
    }

    // Update others DISCOVERED to REJECTED
    await tx.article.updateMany({
      where: {
        pipelineRunId: batch.pipelineRunId,
        status: 'DISCOVERED',
      },
      data: { status: 'REJECTED' }
    });

    // --- Deduplication Logic for Manual Mode ---
    let deduplicatedCount = 0;
    if (config.DEDUPE_ENABLED && duplicateGroups && duplicateGroups.length > 0) {
      const articles = await tx.article.findMany({
        where: { pipelineRunId: batch.pipelineRunId, hash: { in: [...approvedHashes, ...duplicateGroups.flatMap(g => g.duplicates)] } },
        include: { source: true },
      });

      for (const group of duplicateGroups) {
        if (!approvedHashes.includes(group.canonical)) continue;

        const canonicalArticle = articles.find((a: any) => a.hash === group.canonical);
        if (!canonicalArticle) continue;

        const canonicalGroup = canonicalArticle.source.dedupeGroup || 'default';
        const validDuplicates = [];

        for (const dupHash of group.duplicates) {
          const dupArticle = articles.find((a: any) => a.hash === dupHash);
          if (!dupArticle) continue;

          const dupGroup = dupArticle.source.dedupeGroup || 'default';
          if (dupGroup !== canonicalGroup) continue;

          await tx.article.update({
            where: { id: dupArticle.id },
            data: {
              status: 'DEDUPLICATED',
              canonicalArticleId: canonicalArticle.id,
              fullContent: null,
              description: null,
            },
          });
          validDuplicates.push(dupArticle);
          deduplicatedCount++;
        }

        if (validDuplicates.length > 0) {
          const newEntries = validDuplicates.map(d => ({ source: d.source.name, url: d.url }));
          let currentAlsoCoveredBy: any[] = [];
          if (canonicalArticle.alsoCoveredBy && Array.isArray(canonicalArticle.alsoCoveredBy)) {
            currentAlsoCoveredBy = canonicalArticle.alsoCoveredBy;
          }
          await tx.article.update({
            where: { id: canonicalArticle.id },
            data: { alsoCoveredBy: [...currentAlsoCoveredBy, ...newEntries] },
          });
        }
      }
    }

    // Update Run to RUNNING/EXTRACT
    const currentRun = await tx.pipelineRun.findUnique({ where: { id: batch.pipelineRunId } });
    if (currentRun) {
      const stats = (currentRun.stats as any) || {};
      stats.approved = (stats.approved || 0) + approvedHashes.length - deduplicatedCount;
      stats.deduplicated = (stats.deduplicated || 0) + deduplicatedCount;
      // Note: rejected is updated roughly in Evaluate Stage. Manual resolution is tricky for precise counting without full items list.

      await tx.pipelineRun.update({
        where: { id: batch.pipelineRunId },
        data: {
          status: 'RUNNING',
          currentStage: 'EXTRACT',
          stats
        }
      });
    }

    // Enqueue stage-extract
    await extractQueue.add('stage-extract', { pipelineRunId: batch.pipelineRunId });

    return updatedBatch;
  });
}
