import { type User } from '@repo/db';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}
