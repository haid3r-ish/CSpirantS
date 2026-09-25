import { prisma } from '@repo/db';
import { triggerPipeline } from '../../pipeline/orchestrator.js';
import { config } from '../../core/config.js';
import { BadRequestError, NotFoundError, ConflictError } from '../../core/errors.js';

export async function triggerPipelineRun() {
  const activeSources = await prisma.scraperSource.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  if (activeSources.length === 0) {
    throw new BadRequestError('No active sources found to trigger pipeline.');
  }

  const sourceIds = activeSources.map((s) => s.id);

  const pipelineRun = await prisma.pipelineRun.create({
    data: {
      status: 'RUNNING',
      currentStage: 'DISCOVER',
      sourceIds,
      stats: {
        discovered: 0,
        approved: 0,
        rejected: 0,
        extracted: 0,
        failed: 0,
      },
    },
  });

  await triggerPipeline(sourceIds, pipelineRun.id);

  return pipelineRun;
}

export async function getPipelineRuns(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [runs, total] = await Promise.all([
    prisma.pipelineRun.findMany({
      skip,
      take: limit,
      orderBy: { startedAt: 'desc' },
    }),
    prisma.pipelineRun.count(),
  ]);

  return {
    runs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPipelineRun(id: string) {
  const run = await prisma.pipelineRun.findUnique({
    where: { id },
    include: {
      llmBatch: true,
    }
  });

  if (!run) return null;

  // Group article status
  const articleStats = await prisma.article.groupBy({
    by: ['status'],
    where: { pipelineRunId: id },
    _count: {
      id: true,
    },
  });

  const stats = articleStats.reduce((acc, curr) => {
    acc[curr.status] = curr._count.id;
    return acc;
  }, {} as Record<string, number>);

  return { ...run, articleStats: stats };
}

export async function cancelPipelineRun(id: string) {
  const run = await prisma.pipelineRun.findUnique({ where: { id } });
  if (!run) throw new NotFoundError('Pipeline run not found');
  if (run.status === 'COMPLETED' || run.status === 'FAILED') {
    throw new ConflictError('Pipeline run already finished');
  }

  const updatedRun = await prisma.pipelineRun.update({
    where: { id },
    data: { status: 'FAILED' },
  });

  return updatedRun;
}
