import { z } from 'zod';

const configSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string(),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  LLM_PROVIDER: z.enum(['gemini', 'grok']).default('gemini'),
  LLM_MODEL: z.string().optional().default('gemini-3.6-flash'),
  LLM_MODE: z.enum(['api', 'manual']).default('api'),
  FRONTEND_URL: z.string().url(),
  PROCESS_THRESHOLD_START: z.coerce.number().default(20),
  PROCESS_THRESHOLD_REDUCTION: z.coerce.number().default(5),
  PROCESS_THRESHOLD_FLOOR: z.coerce.number().default(5),
  FORCE_PROCESS_HOUR: z.coerce.number().default(0),
  DEDUPE_ENABLED: z.coerce.boolean().default(true),
  DEDUPE_BATCH_SIZE: z.coerce.number().default(30),
  DEDUPE_WINDOW_HOURS: z.coerce.number().default(24),
});

const parsed = configSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const config = parsed.data;
