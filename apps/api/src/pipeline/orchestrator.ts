import { FlowProducer } from 'bullmq';
import { redisConnection } from '../queue/connection.js';
import { discoverQueue } from '../queue/queues.js';
import { prisma } from '@repo/db';

export interface TriggerPipelineOptions {
  manual?: boolean; // If true, skip LLM evaluation — go straight to AWAITING_MANUAL
}

const defaultJobOpts = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 5000 },
};

export async function triggerPipeline(
  sourceIds: string[],
  pipelineRunId: string,
  options: TriggerPipelineOptions = {}
): Promise<void> {
  if (options.manual) {
    // Manual mode: only run discover stage, then pause for human input
    // Create discover jobs but no evaluate/extract flow
    const flow = new FlowProducer({ connection: redisConnection });
    // We still discover articles but skip evaluate — pipeline will await manual resolution
    
    await discoverQueue.addBulk(
      sourceIds.map((sourceId) => ({
        name: `discover-${sourceId}`,
        data: { pipelineRunId, sourceId, skipEvaluate: true },
        opts: defaultJobOpts,
      }))
    );

    await prisma.pipelineRun.update({
      where: { id: pipelineRunId },
      data: { status: 'AWAITING_MANUAL', currentStage: 'DISCOVER' },
    });
    return;
  }

  // Automatic mode: full FlowProducer pipeline
  // extract (parent) → evaluate (child) → discover[] (grandchildren)
  const flow = new FlowProducer({ connection: redisConnection });

  await flow.add({
    name: 'stage-extract',
    queueName: 'pipeline-extract',
    data: { pipelineRunId },
    opts: defaultJobOpts,
    children: [
      {
        name: 'stage-evaluate',
        queueName: 'pipeline-evaluate',
        data: { pipelineRunId },
        opts: defaultJobOpts,
        children: sourceIds.map((sourceId) => ({
          name: `discover-${sourceId}`,
          queueName: 'pipeline-discover',
          data: { pipelineRunId, sourceId },
          opts: defaultJobOpts,
        })),
      },
    ],
  });
}
