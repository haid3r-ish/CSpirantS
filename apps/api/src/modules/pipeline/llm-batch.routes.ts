import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../auth/auth.middleware.js';
import * as llmBatchService from './llm-batch.service.js';

export async function llmBatchRoutes(server: FastifyInstance) {
  server.get('/api/pipeline/llm-batches', { preHandler: [requireAuth] }, async (request, reply) => {
    const querySchema = z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10),
      status: z.enum(['PENDING','SENT','AWAITING_MANUAL','COMPLETED','FAILED']).optional(),
    });

    const query = querySchema.parse(request.query);
    const batches = await llmBatchService.getPendingBatches(query.page, query.limit, query.status as any);
    return reply.send(batches);
  });

  server.get('/api/pipeline/llm-batches/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().min(1) });
    const params = paramsSchema.parse(request.params);
    const batch = await llmBatchService.getBatchById(params.id);
    return reply.send(batch);
  });

  server.get('/api/pipeline/llm-batches/:id/prompt', { preHandler: [requireAuth] }, async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().min(1) });

    const params = paramsSchema.parse(request.params);
    const promptData = await llmBatchService.getBatchPrompt(params.id);
    return reply.send(promptData);
  });

  server.post('/api/pipeline/llm-batches/:id/resolve', { preHandler: [requireAuth] }, async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().min(1) });
    const bodySchema = z.object({
      approvedHashes: z.array(z.string().regex(/^[a-f0-9]{16}$/i)),
    });

    const params = paramsSchema.parse(request.params);
    const body = bodySchema.parse(request.body);

    const batch = await llmBatchService.resolveBatch(params.id, body.approvedHashes);
    return reply.send(batch);
  });
}
