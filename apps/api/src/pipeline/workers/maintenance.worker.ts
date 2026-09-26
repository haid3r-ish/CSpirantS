import { Worker, Job } from 'bullmq';
import { redisConnection } from '../../queue/connection.js';
import { prisma } from '@repo/db';
import { triggerPipeline } from '../orchestrator.js';

export const maintenanceWorker = new Worker(
  'maintenance',
  async (job: Job) => {
    console.log(`[MaintenanceWorker] Starting job: ${job.name} (id: ${job.id})`);

    if (job.name === 'enforce-ttl-policies') {
      try {
        const now = new Date();
        
        // 1. NULL fullContent where contentExpiresAt < now
        const nullContentCount = await prisma.$executeRaw`
          UPDATE "Article"
          SET "fullContent" = NULL
          WHERE "contentExpiresAt" < ${now}
            AND "fullContent" IS NOT NULL;
        `;
        console.log(`[MaintenanceWorker] NULLed fullContent for ${nullContentCount} articles.`);

        // 2. Delete REJECTED records or records where metadataExpiresAt < now
        const deleteCount = await prisma.$executeRaw`
          DELETE FROM "Article"
          WHERE "status" = 'REJECTED'
             OR ("metadataExpiresAt" IS NOT NULL AND "metadataExpiresAt" < ${now});
        `;
        console.log(`[MaintenanceWorker] Deleted ${deleteCount} expired or rejected articles.`);

        // 3. Delete old LlmBatch records
        const deletedBatches = await prisma.$executeRaw`
          DELETE FROM "LlmBatch"
          WHERE "createdAt" < NOW() - INTERVAL '7 days';
        `;
        console.log(`[MaintenanceWorker] Deleted ${deletedBatches} old LLM batches.`);

        // 4. Delete old PipelineRun records (avoid deleting ones stuck in RUNNING without completedAt)
        const deletedRuns = await prisma.$executeRaw`
          DELETE FROM "PipelineRun"
          WHERE "completedAt" < NOW() - INTERVAL '7 days'
            AND status != 'RUNNING';
        `;
        console.log(`[MaintenanceWorker] Deleted ${deletedRuns} old pipeline runs.`);

        return { nullContentCount, deleteCount, deletedBatches, deletedRuns };
      } catch (error: unknown) {
        console.error(`[MaintenanceWorker] Failed to enforce TTL policies:`, error);
        throw error;
      }
    }

    if (job.name === 'trigger-daily-pipeline') {
      try {
        const activeSources = await prisma.scraperSource.findMany({
          where: { isActive: true },
          select: { id: true },
        });

        if (activeSources.length === 0) {
          console.log('[MaintenanceWorker] No active sources found for daily pipeline.');
          return { pipelineRunId: null };
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
        console.log(`[MaintenanceWorker] Triggered daily pipeline run: ${pipelineRun.id}`);

        return { pipelineRunId: pipelineRun.id };
      } catch (error: unknown) {
        console.error(`[MaintenanceWorker] Failed to trigger daily pipeline:`, error);
        throw error;
      }
    }

    console.warn(`[MaintenanceWorker] Unknown job name: ${job.name}`);
    return null;
  },
  { connection: redisConnection }
);

maintenanceWorker.on('failed', (job, err) => {
  console.error(`[MaintenanceWorker] Job ${job?.id} (${job?.name}) failed:`, err.message);
});
