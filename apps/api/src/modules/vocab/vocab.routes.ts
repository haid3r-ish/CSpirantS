import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../auth/auth.middleware.js';
import { lookupWord } from './vocab.service.js';

const querySchema = z.object({
  word: z.string().min(2).max(50).regex(/^[a-zA-Z-]+$/, 'Only letters and hyphens allowed')
});

export async function vocabRoutes(server: FastifyInstance) {
  server.get('/api/vocab/lookup', { preHandler: [requireAuth] }, async (request, reply) => {
    const query = querySchema.safeParse(request.query);
    if (!query.success) {
      return reply.status(400).send({ error: 'Invalid query parameters', details: query.error.format() });
    }

    const result = await lookupWord(query.data.word);
    if (!result) {
      return reply.status(404).send({ error: 'Word not found' });
    }

    return result;
  });
}
