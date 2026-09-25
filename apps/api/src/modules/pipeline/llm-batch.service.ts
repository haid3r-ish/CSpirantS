import { prisma } from '@repo/db';
import { extractQueue } from '../../queue/queues.js';
import { NotFoundError, BadRequestError, ConflictError } from '../../core/errors.js';

export async function getPendingBatches(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [batches, total] = await Promise.all([
    prisma.llmBatch.findMany({
      where: { status: 'AWAITING_MANUAL' },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        pipelineRun: {
          select: { id: true, startedAt: true, currentStage: true }
        }
      }
    }),
    prisma.llmBatch.count({ where: { status: 'AWAITING_MANUAL' } }),
  ]);

  return {
    batches,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBatchPrompt(id: string) {
  const batch = await prisma.llmBatch.findUnique({
    where: { id },
    select: { id: true, promptCsv: true, status: true }
  });
  if (!batch) throw new NotFoundError('Batch not found');
  return batch;
}

export async function resolveBatch(id: string, approvedHashes: string[]) {
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

    // Update Run to RUNNING/EXTRACT
    await tx.pipelineRun.update({
      where: { id: batch.pipelineRunId },
      data: {
        status: 'RUNNING',
        currentStage: 'EXTRACT'
      }
    });

    // Enqueue stage-extract
    await extractQueue.add('stage-extract', { pipelineRunId: batch.pipelineRunId });

    return updatedBatch;
  });
}
