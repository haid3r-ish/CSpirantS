export interface AuthUser {
  id: string;
  email: string;
  name: string;
  googleId: string;
  avatarUrl?: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  user: AuthUser;
}
