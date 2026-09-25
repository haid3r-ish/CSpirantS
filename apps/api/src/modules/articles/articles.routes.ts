import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import * as articlesService from './articles.service.js';

export async function articlesRoutes(server: FastifyInstance) {
  server.get('/api/articles', async (request, reply) => {
    const querySchema = z.object({
      cursor: z.string().optional(),
      limit: z.coerce.number().min(1).max(100).default(20),
      category: z.string().optional(),
      sourceId: z.string().optional(),
      startDate: z.string().datetime().optional(), // ISO 8601 string
      endDate: z.string().datetime().optional(),
      search: z.string().optional(),
    });

    const query = querySchema.parse(request.query);
    const result = await articlesService.getArticles(query);
    return reply.send(result);
  });

  server.get('/api/articles/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().min(1) });
    
    const params = paramsSchema.parse(request.params);
    const article = await articlesService.getArticle(params.id);
    return reply.send(article);
  });
}
