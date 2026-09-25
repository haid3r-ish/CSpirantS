import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../auth/auth.middleware.js';
import { lookupWord } from './vocab.service.js';
import { NotFoundError } from '../../core/errors.js';

const querySchema = z.object({
  word: z.string().min(2).max(50).regex(/^[a-zA-Z-]+$/, 'Only letters and hyphens allowed')
});

export async function vocabRoutes(server: FastifyInstance) {
  server.get('/api/vocab/lookup', { preHandler: [requireAuth] }, async (request, reply) => {
    const query = querySchema.parse(request.query);

    const result = await lookupWord(query.word);
    if (!result) {
      throw new NotFoundError('Word not found');
    }

    return result;
  });
}
