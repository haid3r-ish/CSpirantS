import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../auth/auth.middleware.js';
import * as sourceService from './source.service.js';

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
    const body = createSourceSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid config body', details: body.error.format() });
    }

    try {
      const newSource = await sourceService.createSource(body.data as { name: string; domain: string });
      return reply.status(201).send(newSource);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return reply.status(400).send({ error: 'Source name must be unique' });
      }
      throw error;
    }
  });

  server.put('/api/sources/:id', { preHandler: [requireAuth] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateSourceSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: 'Invalid config body', details: body.error.format() });
    }

    try {
      const updated = await sourceService.updateSource(id, body.data as Prisma.ScraperSourceUpdateInput);
      return updated;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ error: 'Source not found' });
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
        return reply.status(404).send({ error: 'Source not found' });
      }
      throw error;
    }
  });
}
