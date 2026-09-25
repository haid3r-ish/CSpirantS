import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@repo/db';
import { config } from './config.js';
import { AppError } from './errors.js';

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

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
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

    const isDev = config.NODE_ENV === 'development';
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: isDev ? error.message : 'An unexpected error occurred',
      ...(isDev ? { stack: error.stack } : {})
    });
  });

  server.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`
    });
  });
}
