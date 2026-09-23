import { prisma, type User, type Session } from '@repo/db';

export async function createOrUpdateUser(googleProfile: { id: string; email: string; name: string; picture?: string }): Promise<User> {
  const user = await prisma.user.upsert({
    where: { googleId: googleProfile.id },
    update: {
      email: googleProfile.email,
      name: googleProfile.name,
      avatarUrl: googleProfile.picture,
    },
    create: {
      googleId: googleProfile.id,
      email: googleProfile.email,
      name: googleProfile.name,
      avatarUrl: googleProfile.picture,
    },
  });
  return user;
}

export async function createSession(userId: string): Promise<Session> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });
  return session;
}

export async function validateSession(sessionId: string): Promise<User | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await deleteSession(sessionId);
    return null;
  }

  return session.user;
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await prisma.session.delete({
      where: { id: sessionId },
    });
  } catch (error) {
    // Ignore error if session already doesn't exist
  }
}
