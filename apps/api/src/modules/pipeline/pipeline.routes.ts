import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../auth/auth.middleware.js';
import * as pipelineService from './pipeline.service.js';
import { NotFoundError } from '../../core/errors.js';

export async function pipelineRoutes(server: FastifyInstance) {
  server.post('/api/pipeline/trigger', { preHandler: [requireAuth] }, async (request, reply) => {
    const run = await pipelineService.triggerPipelineRun();
    return reply.status(201).send(run);
  });

  server.get('/api/pipeline', { preHandler: [requireAuth] }, async (request, reply) => {
    const querySchema = z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10),
    });
    
    const query = querySchema.parse(request.query);
    const runs = await pipelineService.getPipelineRuns(query.page, query.limit);
    return reply.send(runs);
  });

  server.get('/api/pipeline/:runId', { preHandler: [requireAuth] }, async (request, reply) => {
    const paramsSchema = z.object({ runId: z.string().min(1) });
    
    const params = paramsSchema.parse(request.params);
    const run = await pipelineService.getPipelineRun(params.runId);
    if (!run) {
      throw new NotFoundError('Pipeline run not found');
    }
    return reply.send(run);
  });

  server.post('/api/pipeline/:runId/cancel', { preHandler: [requireAuth] }, async (request, reply) => {
    const paramsSchema = z.object({ runId: z.string().min(1) });
    
    const params = paramsSchema.parse(request.params);
    const run = await pipelineService.cancelPipelineRun(params.runId);
    return reply.send(run);
  });
}
