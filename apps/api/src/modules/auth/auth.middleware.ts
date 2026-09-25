import type { FastifyReply, FastifyRequest } from 'fastify';
import { validateSession } from './auth.service.js';
import { UnauthorizedError } from '../../core/errors.js';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.session_id;
  if (!sessionId) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await validateSession(sessionId);
  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  request.user = user;
}
