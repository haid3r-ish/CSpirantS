import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@repo/db';
import { config } from './config.js';

export function setupErrorHandler(server: FastifyInstance) {
  server.setErrorHandler(function (error: Error, request: FastifyRequest, reply: FastifyReply) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        issues: error.issues,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: 'A unique constraint would be violated.',
        });
      }
    }

    server.log.error(error);

    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: config.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
    });
  });
}
