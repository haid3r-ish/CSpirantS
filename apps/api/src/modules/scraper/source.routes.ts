import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../auth/auth.middleware.js';
import * as sourceService from './source.service.js';
import { NotFoundError } from '../../core/errors.js';
import { Prisma } from '@repo/db';

const createSourceSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1)
});

const updateSourceSchema = createSourceSchema.partial();

export async function sourceRoutes(server: FastifyInstance) {
  server.get('/api/sources', { preHandler: [requireAuth] }, async (request, reply) => {
    const sources = await sourceService.getAllSources();
    return sources;
  });

  server.post('/api/sources', { preHandler: [requireAuth] }, async (request, reply) => {
    const body = createSourceSchema.parse(request.body);
    const newSource = await sourceService.createSource(body as { name: string; domain: string });
    return reply.status(201).send(newSource);
  });

  server.put('/api/sources/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateSourceSchema.parse(request.body);
    
    try {
      const updated = await sourceService.updateSource(id, body as Prisma.ScraperSourceUpdateInput);
      return updated;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Source not found');
      }
      throw error;
    }
  });

  server.delete('/api/sources/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const deactivated = await sourceService.deactivateSource(id);
      return deactivated;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Source not found');
      }
      throw error;
    }
  });
}
