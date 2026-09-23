import Fastify, { type FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { prisma } from '@repo/db';
import { config } from './config.js';
import { setupErrorHandler } from './error-handler.js';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { vocabRoutes } from '../modules/vocab/vocab.routes.js';
import { sourceRoutes } from '../modules/scraper/source.routes.js';
import { pipelineRoutes } from '../modules/pipeline/pipeline.routes.js';
import { llmBatchRoutes } from '../modules/pipeline/llm-batch.routes.js';
import { articlesRoutes } from '../modules/articles/articles.routes.js';

export async function buildServer(): Promise<FastifyInstance> {
  const server = Fastify({ logger: true });

  await server.register(helmet);
  await server.register(cors, {
    origin: config.FRONTEND_URL,
    credentials: true,
  });
  await server.register(cookie, {
    secret: config.SESSION_SECRET,
  });

  setupErrorHandler(server);

  server.get('/health', async () => {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: 'connected'
    };
  });

  await server.register(authRoutes);
  await server.register(vocabRoutes);
  await server.register(sourceRoutes);
  await server.register(pipelineRoutes);
  await server.register(llmBatchRoutes);
  await server.register(articlesRoutes);

  return server;
}
