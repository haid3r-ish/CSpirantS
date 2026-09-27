import { prisma } from '@repo/db';
import { acquireSlotLock, releaseSlotLock } from '../queue/slot-lock.js';
import { triggerPipeline } from './orchestrator.js';

export async function runSlot(hour: number): Promise<void> {
  const locked = await acquireSlotLock();
  if (!locked) {
    console.log(`[Slot] Pipeline already running, skipping slot ${hour}`);
    return;
  }

  let pipelineRunId: string | null = null;
  
  try {
    const sources = await prisma.scraperSource.findMany({ 
      where: { isActive: true } 
    });
    
    if (sources.length === 0) {
      console.log(`[Slot] Hour ${hour} — No active sources found, skipping pipeline run.`);
      return;
    }
    
    const sourceIds = sources.map(s => s.id);

    const pipelineRun = await prisma.pipelineRun.create({
      data: {
        status: 'RUNNING',
        currentStage: 'DISCOVER',
        sourceIds,
        startedAt: new Date(),
        stats: {
          discovered: 0,
          approved: 0,
          rejected: 0,
          deduplicated: 0,
          extracted: 0,
          failed: 0,
        }
      }
    });
    pipelineRunId = pipelineRun.id;

    await triggerPipeline(sourceIds, pipelineRun.id);
    
    console.log(`[Slot] Hour ${hour} — triggered pipeline run ${pipelineRun.id} for ${sourceIds.length} sources.`);
  } catch (error) {
    console.error(`[Slot] Error running slot ${hour}:`, error);
    if (pipelineRunId) {
      try {
        await prisma.pipelineRun.update({
          where: { id: pipelineRunId },
          data: {
            status: 'FAILED',
            error: error instanceof Error ? error.message : String(error),
            completedAt: new Date(),
          }
        });
      } catch (updateError) {
        console.error(`[Slot] Failed to update pipeline status to FAILED for run ${pipelineRunId}:`, updateError);
      }
    }
  } finally {
    await releaseSlotLock();
  }
}
