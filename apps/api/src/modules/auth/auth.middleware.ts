import type { FastifyReply, FastifyRequest } from 'fastify';
import { validateSession } from './auth.service.js';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.session_id;
  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const user = await validateSession(sessionId);
  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  request.user = user;
}
