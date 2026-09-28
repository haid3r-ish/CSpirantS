import type { FastifyInstance } from 'fastify';
import { fastifyOauth2 } from '@fastify/oauth2';
import { config } from '../../core/config.js';
import * as authService from './auth.service.js';
import { requireAuth } from './auth.middleware.js';
import { UnauthorizedError, wrapError } from '../../core/errors.js';

export async function authRoutes(server: FastifyInstance) {
  server.register(fastifyOauth2, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: config.GOOGLE_CLIENT_ID,
        secret: config.GOOGLE_CLIENT_SECRET
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION
    },
    startRedirectPath: '/auth/google',
    callbackUri: config.GOOGLE_CALLBACK_URL
  });

  server.get('/auth/google/callback', async (request, reply) => {
    // @ts-expect-error fastify/oauth2 dynamically adds this decorator
    const { token } = await server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const userinfoResponse = await wrapError(
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token.access_token}` },
        signal: AbortSignal.timeout(10000)
      }),
      new UnauthorizedError('Google authentication service is currently unavailable')
    );

    if (!userinfoResponse.ok) {
      throw new UnauthorizedError('Failed to fetch user info from Google');
    }

    const rawData = await userinfoResponse.json();
    if (
      !rawData ||
      typeof rawData !== 'object' ||
      typeof (rawData as any).sub !== 'string' ||
      typeof (rawData as any).email !== 'string' ||
      typeof (rawData as any).name !== 'string'
    ) {
      throw new UnauthorizedError('Invalid user info from Google');
    }
    const googleProfile = rawData as { sub: string; email: string; name: string; picture?: string };

    const user = await authService.createOrUpdateUser({
      id: googleProfile.sub,
      email: googleProfile.email,
      name: googleProfile.name,
      picture: googleProfile.picture
    });

    const session = await authService.createSession(user.id);

    console.log(`[AUTH] User logged in successfully. User ID: ${user.id}`);

    reply.setCookie('session_id', session.id, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return reply.redirect(`${config.FRONTEND_URL}/dashboard`);
  });



  server.get('/api/auth/me', { preHandler: [requireAuth] }, async (request, reply) => {
    return request.user;
  });

  server.get('/auth/logout', async (request, reply) => {
    const sessionId = request.cookies.session_id;
    if (sessionId) {
      await authService.deleteSession(sessionId);
    }
    reply.clearCookie('session_id', { path: '/' });
    return reply.redirect(config.FRONTEND_URL);
  });
}
