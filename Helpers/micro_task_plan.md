# DOCUMENT HEADER

## How To Use This Plan

1. Each task is self-contained — read only the task you are working on.
2. Before starting any task, read PROGRESS.md to understand current state.
3. After completing a task, update PROGRESS.md as instructed.
4. If a task says 'see Blueprint Section X', read master_blueprint.md Section X.
5. Never skip tasks — they build on each other in order.
6. If you get stuck, read the Integration Check section of the task carefully.

## Global Rules for All Tasks

1. Always use strict TypeScript — never use `any` type. Use `unknown` and narrow it.
2. Always handle errors — no unhandled promise rejections, no empty catch blocks.
3. Always use Zod for runtime validation of external data (API responses, env vars, request bodies).
4. Never hardcode secrets or API keys in code — always read from process.env.
5. All imports within the monorepo use package names (e.g. `import { X } from '@repo/types'`), not relative paths across packages.
6. All imports within the same package use relative paths with .js extension (e.g. `import { X } from './utils.js'`).
7. Always update PROGRESS.md after each completed task using the exact format shown in the task.
8. Never commit .env files — only commit .env.example with placeholder values.
9. Use async/await, never raw Promise chains.
10. Export types and functions explicitly — do not use `export default` for named utilities.

## Index of Tasks

| Task ID | Name | Lines | Purpose |
|---|---|---|---|
| 0-1 | Initialize Turborepo Monorepo | 46-84 | **Goal**: Monorepo scaffold with pnpm + turborepo. All package.json and tsconfig files created. `pnp... |
| 0-2 | Initialize @repo/db (Prisma) | 85-132 | **Goal**: packages/db exists with full Prisma schema. `pnpm --filter @repo/db db:generate` succeeds.... |
| 0-3 | Initialize @repo/types | 133-170 | **Goal**: packages/types exists. All 6 type files created. `pnpm --filter @repo/types typecheck` suc... |
| 0-4 | Docker Compose & Environment Files | 171-217 | **Goal**: `docker-compose up -d postgres redis` starts both services. Both pass health checks. .env.... |
| 1-1 | Fastify Server Setup | 218-253 | **Goal**: `pnpm --filter @apps/api dev` starts server. `curl http://localhost:3001/health` returns `... |
| 1-2 | Google OAuth & Session Auth | 254-291 | **Goal**: GET /auth/google redirects to Google OAuth. After Google callback, user is created in DB a... |
| 1-3 | Redis & BullMQ Setup | 292-320 | **Goal**: Redis connects on startup. All queues instantiated. orchestrator.triggerPipeline can be ca... |
| 1-4a | Schema & Types Cleanup (Vocab) | 321-366 | **Goal**: Remove the obsolete `VocabEntry` Prisma model and replace the `vocab.types.ts` with the ne... |
| 1-4b | Vocabulary Proxy API | 367-406 | **Goal**: `GET /api/vocab/lookup?word=economy` returns a structured response by proxying the externa... |
| 1-4c | Vocabulary Proxy — Fallback Provider Pattern & Adapters | 407-558 | **Goal**: Refactor `vocab.service.ts` to use a prioritized, multi-provider fallback chain (minimum 2... |
| 1-5 | Scraper Source CRUD API | 559-593 | **Goal**: CRUD endpoints for ScraperSource. All 4 operations work with valid data. Invalid config bo... |
| 2-1 | @repo/scraper-core Package Init & URL Hasher | 594-626 | **Goal**: Package scaffold created. URL hash generator works exactly as specified. |
| 2-2 | JSON-LD Parser & Field Transforms | 627-656 | **Goal**: Parser accurately extracts NewsArticle schema and transforms apply correctly. |
| 2-3 | Declarative Extractor | 657-686 | **Goal**: Extractor falls back correctly and applies transforms. |
| 2-4 | HybridFetchEngine with Playwright Stealth | 687-719 | **Goal**: Hybrid engine falls back to playwright on cloudflare blocks. |
| 3-1 | @repo/llm-core Package Init & Formatter | 720-752 | **Goal**: Formatting and parsing logic for LLM batch processing. |
| 3-2 | Base Provider & Gemini Provider | 753-782 | **Goal**: Robust provider class handling API calls and fallback. |
| 3-2a | Environment-driven LLM Model Configuration | 783-815 | **Goal**: Update the LLM configuration to read the model name from the environment instead of hardco... |
| 3-3 | Prerequisite Task 3-3 (Mini): LlmProviderFactory + Manual Provider | 816-886 | **Goal**: Implement a minimal LlmProviderFactory and a ManualProvider stub. This is the missing fact... |
| 4-1 | Stage 1 — Discover Worker | 887-921 | **Goal**: Worker fetches indexes, hashes URLs, and saves DISCOVERED articles. |
| 4-2 | Stage 2 — Evaluate Worker (Revised) | 922-966 | **Goal**: Single LLM call per run to approve/reject articles. Uses createLlmProvider factory driven ... |
| 4-3 | Stage 3 — Extract Worker | 967-999 | **Goal**: Fetch full content for APPROVED articles. |
| 4-4 | Maintenance Worker & Cron Schedulers | 1000-1030 | **Goal**: Cron logic for TTL and daily triggers. |
| 5-1 | Pipeline Trigger & Status API | 1031-1059 | **Goal**: API to start and track pipeline runs. |
| 5-2 | Manual LLM Batch Resolution API | 1060-1089 | **Goal**: Endpoints for admins to process manual batches. |
| 5-3 | Articles Public API | 1090-1118 | **Goal**: Paginated read access to EXTRACTED articles. |
| 6-1 | Vite App Scaffold & API Client | 1119-1154 | **Goal**: `pnpm --filter @apps/web dev` starts. Axios client ready. |
| 6-2 | Router & Auth Guard | 1155-1185 | **Goal**: Authentication gating for frontend routes. |
| 6-3 | AppShell, Sidebar & Dashboard | 1186-1217 | **Goal**: Main layout and dashboard module grid. |
| 6-4 | News Feed & Article View with Local Vocab Storage | 1218-1254 | **Goal**: News reader with word-click vocab popup. "Save Word" stores to Zustand + IndexedDB (offlin... |
| 7-1 | Pipeline Admin Page | 1255-1285 | **Goal**: Live dashboard for pipeline runs. |
| 7-2 | Manual Batch Admin Page | 1286-1314 | **Goal**: Resolve LLM batches manually via UI. |
| 8-1 | Wire Up All Routes & Workers at Server Start | 1315-1342 | **Goal**: API fully functional on boot. |
| 8-2 | Dockerfiles & Production Build | 1343-1391 | **Goal**: Production ready docker-compose. |
| 1-1a | Global Error Handler Overhaul | 1431-1510 | **Goal**: Centralize all error handling. Remove per-route try/catch anti-pattern. Dev errors must log to console with full stack traces. |
| 4-3b | Fix PipelineRun Status Stuck in RUNNING | 1511-1545 | **Goal**: After extract stage completes, update PipelineRun to status COMPLETED with completedAt timestamp. |
| 2-3c | Dawn Parser Date Guard (Anti-Duplication) | 1546-1700 | **Goal**: Prevent Dawn parser from saving duplicate articles when Dawn serves previous day's page. |
| IP-4 | Vocab API Separate Interfaces | - | **Goal**: Interfaces for DictionaryAPI and FreeDictionaryAPI; raw payload + source tag. |
| IP-5 | DB Cleanup + LlmBatch Status Filter | - | **Goal**: TTL for PipelineRun/LlmBatch; fix batch route query param. |
| IP-6 | LLM Batch Route Path Correction | - | **Goal**: Fix batch routes to `/api/pipeline/llm-batches` + add `getBatchById`. |
| 9-1 | Prisma Schema — Dedupe Fields | - | **Goal**: Add `mergedIntoId`, `alsoCoveredBy`, and indexes. |
| 4-5a | Config — Add Slot & Dedupe Env Vars | - | **Goal**: 7 new pipeline config keys with defaults. |
| 4-5b | Redis Pool Helpers | - | **Goal**: Atomic pool drain and threshold read/write utilities. |
| 4-5c | Slot Lock — Redis NX lock | - | **Goal**: Acquire/release slot lock with 30-min auto-expiry. |
| 4-5d | Slot Scheduler Logic | - | **Goal**: Core slot decision logic (discover → pool → threshold → process/hold). |
| 4-5e | S1chedulers — Wire 4 Cron Slots | - | **Goal**: Replace 4 AM cron with 10, 14, 18, 00 slots. |
| 9-2 | Cross-Source Dedupe Stage | - | **Goal**: Prompt and LLM logic to dedupe articles based on same story. |
| 9-3 | Wire Dedupe into Midnight Slot | - | **Goal**: Execute dedupe at midnight and filter feed from merged articles. |
## Environment Variables Reference

| Variable Name | Used In | Example Value | Required? |
| --- | --- | --- | --- |
| DATABASE_URL | API | postgresql://cssuser:changeme_secure_password@localhost:5432/cssdb | Yes |
| REDIS_URL | API | redis://localhost:6379 | Yes |
| GOOGLE_CLIENT_ID | API | your_google_client_id | Yes |
| GOOGLE_CLIENT_SECRET | API | your_google_client_secret | Yes |
| GOOGLE_CALLBACK_URL | API | http://localhost:3001/auth/google/callback | Yes |
| SESSION_SECRET | API | change_this_to_a_long_random_string_minimum_32_chars | Yes |
| GEMINI_API_KEY | API | your_gemini_api_key | Optional |
| GROQ_API_KEY | API | your_groq_api_key | Optional |
| LLM_PROVIDER | API | gemini | Yes |
| LLM_MODE | API | api | Yes |
| PORT | API | 3001 | Yes |
| NODE_ENV | API | development | Yes |
| FRONTEND_URL | API | http://localhost:3000 | Yes |
| VITE_API_URL | Web | http://localhost:3001 | Yes |

---

### Task 0-1: Initialize Turborepo Monorepo

**Goal**: Monorepo scaffold with pnpm + turborepo. All package.json and tsconfig files created. `pnpm install` succeeds.

**Target Files**:
- `package.json` — CREATE
- `pnpm-workspace.yaml` — CREATE
- `turbo.json` — CREATE
- `packages/ts-config/package.json` — CREATE
- `packages/ts-config/base.json` — CREATE
- `packages/ts-config/node.json` — CREATE
- `packages/ts-config/react.json` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- root `package.json`: name='css-prep-platform', private=true, scripts: { dev: 'turbo run dev', build: 'turbo run build', typecheck: 'turbo run typecheck', lint: 'turbo run lint' }. devDependencies: turbo@latest, typescript@5.6, @types/node@20.
- `pnpm-workspace.yaml`: packages: ['apps/*', 'packages/*']
- `turbo.json`: schema 2.x. Tasks: build (dependsOn ['^build'], outputs ['dist/**']), dev (cache false, persistent true), typecheck (dependsOn ['^typecheck']), lint.
- `packages/ts-config/package.json`: name='@repo/ts-config', private=true, version='0.0.0'. No main/exports needed.
- `packages/ts-config/base.json`: target ES2022, module NodeNext, moduleResolution NodeNext, strict true, esModuleInterop true, skipLibCheck true, forceConsistentCasingInFileNames true, declaration true, declarationMap true, sourceMap true.
- `packages/ts-config/node.json`: extends ./base.json, lib ['ES2022'], types ['node'].
- `packages/ts-config/react.json`: extends ./base.json, lib ['ES2022', 'DOM', 'DOM.Iterable'], jsx react-jsx, types ['node'].

**Integration Check**:
This sets up the foundation. Next tasks will build `packages/db` and `packages/types` using these TS configs.

**Verification**:
Run `pnpm install` at the root. It should succeed without errors.

**PROGRESS.md Update**:
Append this exact text:
```
Task 0-1: Initialize Turborepo Monorepo — COMPLETED [ISO timestamp]
Files: package.json, pnpm-workspace.yaml, turbo.json, packages/ts-config/*
Notes: Created monorepo structure and typescript configs.
```

### Task 0-2: Initialize @repo/db (Prisma)

**Goal**: packages/db exists with full Prisma schema. `pnpm --filter @repo/db db:generate` succeeds. PrismaClient exported from src/index.ts.

**Target Files**:
- `packages/db/package.json` — CREATE
- `packages/db/tsconfig.json` — CREATE
- `packages/db/prisma/schema.prisma` — CREATE
- `packages/db/src/index.ts` — CREATE

**Blueprint References**:
- master_blueprint.md Section 3: Exact Prisma schema

**Detailed LLM Instructions**:
- `package.json`: name='@repo/db', scripts: { db:generate: 'prisma generate', db:push: 'prisma db push', db:migrate: 'prisma migrate dev', db:studio: 'prisma studio' }. deps: @prisma/client. devDeps: prisma, @repo/ts-config. exports: { '.': { types: './src/index.ts', import: './src/index.ts' } }.
- `tsconfig.json`: extends @repo/ts-config/node.json, rootDir=src, outDir=dist, composite=true.
- `schema.prisma`: Copy EXACT schema from master_blueprint.md Section 3. Every model, enum, index included as specified. datasource provider='postgresql', generator provider='prisma-client-js'.
- `src/index.ts`: Prisma singleton using globalThis to prevent hot-reload connection leaks:
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma = globalForPrisma.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

export * from '@prisma/client';
```

**Integration Check**:
Provides database access. `@apps/api` will import `prisma` from `@repo/db`.

**Verification**:
Run `pnpm install` then `pnpm --filter @repo/db db:generate`. It should succeed.

**PROGRESS.md Update**:
Append this exact text:
```
Task 0-2: Initialize @repo/db (Prisma) — COMPLETED [ISO timestamp]
Files: packages/db/*
Notes: Initialized Prisma schema and database package.
```

### Task 0-3: Initialize @repo/types

**Goal**: packages/types exists. All 6 type files created. `pnpm --filter @repo/types typecheck` succeeds.

**Target Files**:
- `packages/types/package.json` — CREATE
- `packages/types/tsconfig.json` — CREATE
- `packages/types/src/scraper.types.ts` — CREATE
- `packages/types/src/llm.types.ts` — CREATE
- `packages/types/src/pipeline.types.ts` — CREATE
- `packages/types/src/vocab.types.ts` — CREATE
- `packages/types/src/auth.types.ts` — CREATE
- `packages/types/src/dashboard.types.ts` — CREATE
- `packages/types/src/index.ts` — CREATE

**Blueprint References**:
- master_blueprint.md Section 4: Interface/type/enum definitions

**Detailed LLM Instructions**:
- Copy EXACT interface/type/enum/constant definitions from master_blueprint.md Section 4 for each respective file.
- `src/index.ts`: export * from each file using `.js` extension (e.g. `export * from './scraper.types.js'`).
- `package.json`: name='@repo/types', exports { '.': { types: './src/index.ts', import: './src/index.ts' } }. devDeps: typescript, @repo/ts-config.
- `tsconfig.json`: extends @repo/ts-config/base.json, rootDir=src.

**Integration Check**:
Types shared across frontend, backend, and other packages.

**Verification**:
Run `pnpm --filter @repo/types typecheck`. It should pass.

**PROGRESS.md Update**:
Append this exact text:
```
Task 0-3: Initialize @repo/types — COMPLETED [ISO timestamp]
Files: packages/types/*
Notes: Created shared typescript definitions.
```

### Task 0-4: Docker Compose & Environment Files

**Goal**: `docker-compose up -d postgres redis` starts both services. Both pass health checks. .env.example exists at root.

**Target Files**:
- `docker-compose.yml` — CREATE
- `.env.example` — CREATE
- `apps/api/.env.example` — CREATE

**Blueprint References**:
- master_blueprint.md Section 9: docker-compose content

**Detailed LLM Instructions**:
- `docker-compose.yml`: Copy EXACT content from master_blueprint.md Section 9. Do not modify.
- `.env.example` (root): All variables with placeholder values:
```
POSTGRES_USER=cssuser
POSTGRES_PASSWORD=changeme_secure_password
POSTGRES_DB=cssdb
DATABASE_URL=postgresql://cssuser:changeme_secure_password@localhost:5432/cssdb
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
SESSION_SECRET=change_this_to_a_long_random_string_minimum_32_chars
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
LLM_PROVIDER=gemini
LLM_MODE=api
FRONTEND_URL=http://localhost:3000
```
- `apps/api/.env.example`: same vars relevant to API + PORT=3001, NODE_ENV=development.

**Integration Check**:
Sets up backing services. Next step requires DB to be running.

**Verification**:
Run `docker-compose up -d postgres redis`. Both should start successfully.

**PROGRESS.md Update**:
Append this exact text:
```
Task 0-4: Docker Compose & Environment Files — COMPLETED [ISO timestamp]
Files: docker-compose.yml, .env.example, apps/api/.env.example
Notes: Set up docker services and environment variables.
```

### Task 1-1: Fastify Server Setup

**Goal**: `pnpm --filter @apps/api dev` starts server. `curl http://localhost:3001/health` returns `{"status":"ok"}`.

**Target Files**:
- `apps/api/package.json` — CREATE
- `apps/api/tsconfig.json` — CREATE
- `apps/api/src/index.ts` — CREATE
- `apps/api/src/core/server.ts` — CREATE
- `apps/api/src/core/config.ts` — CREATE
- `apps/api/src/core/error-handler.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `package.json`: name='@apps/api'. deps: fastify, @fastify/cors, @fastify/helmet, @fastify/cookie, @fastify/oauth2, ioredis, bullmq, zod, @repo/types, @repo/db, @google/generative-ai, groq-sdk. devDeps: typescript, tsx, @repo/ts-config. scripts: { dev: 'tsx watch src/index.ts' }.
- `core/config.ts`: Use Zod to parse process.env. Define Config schema: DATABASE_URL (string url), REDIS_URL (string), PORT (coerce.number, default 3001), NODE_ENV (enum development/production/test, default development), GOOGLE_CLIENT_ID (string), GOOGLE_CLIENT_SECRET (string), GOOGLE_CALLBACK_URL (string url), SESSION_SECRET (string min 32), GEMINI_API_KEY (string optional), GROQ_API_KEY (string optional), LLM_PROVIDER (enum gemini/grok, default gemini), LLM_MODE (enum api/manual, default api), FRONTEND_URL (string url). Export `config`. Throw with readable message if validation fails.
- `core/server.ts`: Create Fastify instance with logger: true. Register @fastify/helmet. Register @fastify/cors (origin: config.FRONTEND_URL, credentials: true). Register @fastify/cookie (secret: config.SESSION_SECRET). Add GET /health route: check DB with `await prisma.$queryRaw\`SELECT 1\``, return { status: 'ok', timestamp: new Date().toISOString(), db: 'connected' }. Export `buildServer(): FastifyInstance`.
- `core/error-handler.ts`: Register Fastify setErrorHandler. Handle: ZodError → 400 with issues array. PrismaClientKnownRequestError with code P2002 → 409 conflict. All others → 500 with message in dev, generic in prod.
- `index.ts`: Import buildServer, call it, start on config.PORT. Log startup.

**Integration Check**:
Provides the API foundation.

**Verification**:
Start DB using docker, run `pnpm install`, run `pnpm --filter @apps/api dev`. Request `/health`.

**PROGRESS.md Update**:
Append this exact text:
```
Task 1-1: Fastify Server Setup — COMPLETED [ISO timestamp]
Files: apps/api/*
Notes: Configured base Fastify server and environment validation.
```

### Task 1-2: Google OAuth & Session Auth

**Goal**: GET /auth/google redirects to Google OAuth. After Google callback, user is created in DB and session cookie is set. GET /api/auth/me returns current user or 401.

**Target Files**:
- `apps/api/src/modules/auth/auth.routes.ts` — CREATE
- `apps/api/src/modules/auth/auth.service.ts` — CREATE
- `apps/api/src/modules/auth/auth.middleware.ts` — CREATE
- `apps/api/src/types.d.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `types.d.ts`: Augment FastifyRequest: `import { User } from '@prisma/client'; declare module 'fastify' { interface FastifyRequest { user?: User } }`
- `auth.service.ts`: Functions:
  - `createOrUpdateUser(googleProfile: { id: string; email: string; name: string; picture?: string })`: upsert User by googleId using Prisma.
  - `createSession(userId: string)`: create Session record with expiresAt = 30 days from now.
  - `validateSession(sessionId: string)`: find Session by id, check expiresAt > now, include User relation. Return user or null.
  - `deleteSession(sessionId: string)`: delete Session by id.
- `auth.middleware.ts`: Export `requireAuth` as FastifyPreHandlerHookHandler. Reads `request.cookies.session_id`. Calls `authService.validateSession`. If null → reply.status(401).send({ error: 'Unauthorized' }). If valid → `request.user = user`.
- `auth.routes.ts`: Register @fastify/oauth2 with Google credentials. Callback route GET /auth/google/callback: get token, call Google userinfo endpoint (GET https://www.googleapis.com/oauth2/v3/userinfo with Bearer token), call createOrUpdateUser, call createSession, set cookie 'session_id' (httpOnly, secure in prod, sameSite strict, path '/'), redirect to config.FRONTEND_URL + '/dashboard'. GET /api/auth/me: preHandler: [requireAuth], return request.user. GET /auth/logout: call deleteSession, clear cookie, redirect to FRONTEND_URL.
- Update `server.ts` to register auth routes.

**Integration Check**:
Secures future API endpoints. Frontend will call `/api/auth/me`.

**Verification**:
Start dev server, hit `/auth/google` in browser, verify redirect and DB user creation.

**PROGRESS.md Update**:
Append this exact text:
```
Task 1-2: Google OAuth & Session Auth — COMPLETED [ISO timestamp]
Files: apps/api/src/modules/auth/*
Notes: Implemented Google OAuth and session management.
```

### Task 1-3: Redis & BullMQ Setup

**Goal**: Redis connects on startup. All queues instantiated. orchestrator.triggerPipeline can be called without error.

**Target Files**:
- `apps/api/src/queue/connection.ts` — CREATE
- `apps/api/src/queue/queues.ts` — CREATE
- `apps/api/src/pipeline/orchestrator.ts` — CREATE

**Blueprint References**:
- master_blueprint.md Section 5: Exact code for these 3 files

**Detailed LLM Instructions**:
- Copy EXACT code from master_blueprint.md Section 5 for all three files. Do not modify the FlowProducer logic. Ensure all imports use .js extension.

**Integration Check**:
Provides task queues. Will be used by the pipeline trigger.

**Verification**:
Ensure API starts without Redis connection errors.

**PROGRESS.md Update**:
Append this exact text:
```
Task 1-3: Redis & BullMQ Setup — COMPLETED [ISO timestamp]
Files: apps/api/src/queue/*, apps/api/src/pipeline/orchestrator.ts
Notes: Initialized Redis connections and BullMQ queues.
```

### Task 1-4a: Schema & Types Cleanup (Vocab)

**Goal**: Remove the obsolete `VocabEntry` Prisma model and replace the `vocab.types.ts` with the new proxy-aligned shape.

**Target Files**:
- `packages/db/prisma/schema.prisma` — MODIFY
- `packages/types/src/vocab.types.ts` — MODIFY

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `schema.prisma`: **Delete** the entire `VocabDifficulty` enum block and the entire `VocabEntry` model block. Then run `npx prisma db push`.
- `vocab.types.ts`: **Replace** entire file contents with:
  ```typescript
  export interface VocabDefinition {
    definition: string;
    example?: string;
  }
  export interface VocabPartOfSpeech {
    partOfSpeech: string;
    definitions: VocabDefinition[];
  }
  export interface VocabLookupResult {
    word: string;
    forms?: string[];
    partsOfSpeech: VocabPartOfSpeech[];
    synonyms: string[];
    antonyms: string[];
  }
  ```

**Integration Check**:
The `packages/types/src/index.ts` already re-exports `vocab.types.ts` via wildcard, so the new types are automatically available everywhere. No other import changes needed.

**Verification**:
Run `npx tsc --noEmit` from `apps/api`. Zero errors expected (no existing code imports the old vocab types).

**PROGRESS.md Update**:
Append this exact text:
```
Task 1-4a: Schema & Types Cleanup (Vocab) — COMPLETED [ISO timestamp]
Files: packages/db/prisma/schema.prisma, packages/types/src/vocab.types.ts
Notes: Removed VocabEntry model and updated vocab types for proxy approach.
```

### Task 1-4b: Vocabulary Proxy API

**Goal**: `GET /api/vocab/lookup?word=economy` returns a structured response by proxying the external English Dictionary API. No DB writes. Protected route.

**Target Files**:
- `apps/api/src/modules/vocab/vocab.routes.ts` — CREATE
- `apps/api/src/modules/vocab/vocab.service.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `vocab.service.ts`: Export `lookupWord(word: string): Promise<VocabLookupResult | null>`:
  1. Normalize: `const normalized = word.toLowerCase().trim()`
  2. Fetch: `GET https://englishdictionaryapi.com/api/v1/words/${encodeURIComponent(normalized)}`
  3. If the response is not `ok` (404 or any error) → return `null`
  4. Parse the JSON. Map and return **only** these fields as a `VocabLookupResult` (handle potentially undefined arrays `forms`, `synonyms`, `antonyms` by falling back to `[]`).
  5. Wrap entire fetch in a `try/catch` → on catch, return `null`.
- `vocab.routes.ts`: Export `vocabRoutes(server: FastifyInstance)`:
  - Import `requireAuth` from `../../modules/auth/auth.middleware.js`
  - Import `lookupWord` from `./vocab.service.js`
  - Define query schema with Zod: `z.object({ word: z.string().min(2).max(50).regex(/^[a-zA-Z-]+$/, 'Only letters and hyphens allowed') })`
  - Register: `GET /api/vocab/lookup`, `preHandler: [requireAuth]`
  - In handler: validate query with schema. Call `lookupWord(query.word)`. If null → `reply.status(404).send({ error: 'Word not found' })`. Else return result.
- `server.ts` — **MODIFY**: Import `vocabRoutes` from `../modules/vocab/vocab.routes.js` and call `await server.register(vocabRoutes)` after `authRoutes`.

**Integration Check**:
The `requireAuth` middleware from Task 1-2 gates this route. The frontend `useVocabLookup.ts` hook (Task 6-4) will call `GET /api/vocab/lookup?word={word}`.

**Verification**:
Start dev server. Hit `GET /api/vocab/lookup?word=parliament` without a session cookie → expect `401 Unauthorized`.

**PROGRESS.md Update**:
Append this exact text:
```
Task 1-4b: Vocabulary Proxy API — COMPLETED [ISO timestamp]
Files: apps/api/src/modules/vocab/*
Notes: Implemented vocabulary dictionary proxy. No DB writes. Routes through englishdictionaryapi.com.
```

### Task 1-4c: Vocabulary Proxy — Fallback Provider Pattern & Adapters

**Goal**: Refactor `vocab.service.ts` to use a prioritized, multi-provider fallback chain (minimum 2 APIs). Each provider has its own typed adapter that normalizes raw third-party JSON into `VocabLookupResult`. The route (`vocab.routes.ts`) and the shared type (`VocabLookupResult`) remain completely unchanged.

**Target Files**:
- `apps/api/src/modules/vocab/vocab.service.ts` — MODIFY (full rewrite)
- `apps/api/src/modules/vocab/vocab.service.test.ts` — MODIFY (update tests for multi-provider chain)

**Integration Check**:
- `VocabLookupResult` (from `@repo/types`) is the normalized output target. It **does not change** — adapters must conform to it.
- `vocab.routes.ts` calls `lookupWord(word)` — the function signature **does not change**. The route is unaware of which provider succeeded.
- Task 6-4 (`useVocabLookup.ts`) calls `GET /api/vocab/lookup?word=...` — the frontend is entirely unaffected.
- Existing Zod schema in `vocab.service.ts` (which validated the `englishdictionaryapi.com` schema) is replaced by **per-adapter Zod schemas**.

**Conflict Report**:
> ⚠️ **Conflict with Task 1-4b implementation**: The existing `vocab.service.ts` hardcodes `englishdictionaryapi.com` with a single Zod schema. This task supersedes that implementation entirely. The existing test file (`vocab.service.test.ts`) mocks a single `fetch` call — after this refactor it will break because the fallback chain calls `fetch` multiple times sequentially. The test file **must also be updated** as part of this task.
>
> ✅ **No conflict with `VocabLookupResult` type**: Adapters produce the same shape as before.
>
> ✅ **No conflict with `vocab.routes.ts`**: Route signature unchanged.
>
> ✅ **No conflict with Task 6-4** (`useVocabLookup.ts`): Frontend only consumes the final normalized JSON response.

**Detailed LLM Instructions**:

**Architecture Overview**: Define a `VocabProvider` interface internally (not exported, just for internal DI). Implement one adapter per API. The main `lookupWord` function iterates the provider list in priority order. On 429 or 5xx, it catches and tries the next. On 404/parse failure, it returns `null` immediately (the word simply doesn't exist).

**Step 1 — Define internal types at the top of `vocab.service.ts`**:
```typescript
import type { VocabLookupResult } from '@repo/types';
import { z } from 'zod';

interface VocabProvider {
  name: string;
  lookup: (word: string) => Promise<VocabLookupResult | null>;
}
```

**Step 2 — Adapter 1: `englishdictionaryapi.com` (primary)**

URL: `https://englishdictionaryapi.com/api/v1/words/${word}`

Zod schema for this provider's raw response:
```typescript
const englishDictSchema = z.object({
  word: z.string(),
  forms: z.array(z.string()).optional(),
  partsOfSpeech: z.array(z.object({
    partOfSpeech: z.string(),
    definitions: z.array(z.object({ definition: z.string(), example: z.string().optional() })).optional(),
    senses: z.array(z.object({ definition: z.string(), example: z.string().optional() })).optional(),
  })).optional(),
  synonyms: z.array(z.string()).optional(),
  antonyms: z.array(z.string()).optional(),
}).passthrough();
```

Adapter function `adaptEnglishDictApi(raw: z.infer<typeof englishDictSchema>): VocabLookupResult`:
- `word`: `raw.word`
- `forms`: `raw.forms ?? []`
- `partsOfSpeech`: map over `raw.partsOfSpeech`, using `pos.senses || pos.definitions || []` for definitions
- `synonyms`: `raw.synonyms ?? []`
- `antonyms`: `raw.antonyms ?? []`

Provider implementation: On HTTP 429 or >= 500 — **throw** `new Error('rate-limit-or-server-error')` so the caller falls back to the next provider. On 404 → return `null`. Parse raw JSON through `englishDictSchema.parse()`. Call adapter.

**Step 3 — Adapter 2: `api.dictionaryapi.dev` (fallback)**

URL: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`

This API returns an **array** of entry objects. Zod schema:
```typescript
const freeDictEntrySchema = z.object({
  word: z.string(),
  phonetics: z.array(z.object({ text: z.string().optional() })).optional(),
  meanings: z.array(z.object({
    partOfSpeech: z.string(),
    definitions: z.array(z.object({
      definition: z.string(),
      example: z.string().optional(),
      synonyms: z.array(z.string()).optional(),
      antonyms: z.array(z.string()).optional(),
    })),
    synonyms: z.array(z.string()).optional(),
    antonyms: z.array(z.string()).optional(),
  })),
});
const freeDictResponseSchema = z.array(freeDictEntrySchema).min(1);
```

Adapter function `adaptFreeDictionaryApi(raw: z.infer<typeof freeDictResponseSchema>): VocabLookupResult`:
- Use the first entry (`raw[0]`).
- `word`: `raw[0].word`
- `forms`: `[]` (this API does not provide word forms)
- `partsOfSpeech`: map over `raw[0].meanings` — for each meaning, map its `definitions` array.
- `synonyms`: collect all `meaning.synonyms` across all meanings, flatten, deduplicate with `[...new Set(...)]`, take first 10.
- `antonyms`: same dedup pattern for `meaning.antonyms`.

Provider implementation: On HTTP 429 or >= 500 — **throw**. On 404 → return `null`. Parse with `freeDictResponseSchema.parse()`. Call adapter.

**Step 4 — Fallback Chain in `lookupWord`**:
```typescript
const PROVIDERS: VocabProvider[] = [
  englishDictProvider,
  freeDictionaryProvider,
];

export async function lookupWord(word: string): Promise<VocabLookupResult | null> {
  const normalized = word.toLowerCase().trim();
  for (const provider of PROVIDERS) {
    try {
      const result = await provider.lookup(normalized);
      return result; // null means 404 — word not found, stop chain
    } catch (error: unknown) {
      // Log and continue to next provider only on rate-limit/server errors
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[VocabProxy] Provider "${provider.name}" failed: ${msg}. Trying next...`);
      continue;
    }
  }
  // All providers exhausted
  console.error('[VocabProxy] All providers exhausted. Returning null.');
  return null;
}
```

> **Critical Rule**: A provider MUST throw an `Error` on 429/5xx so the chain continues. It MUST return `null` on 404 (word not found) which immediately terminates the chain without trying other providers. This prevents wasting quota on words that genuinely don't exist.

**Step 5 — Update `vocab.service.test.ts`**:

The existing tests mock a single `fetch`. These must be rewritten to account for the multi-provider chain. Use `vi.fn()` for `global.fetch` but control call sequences with `mockResolvedValueOnce` chaining.

Required test cases:
1. **Primary success**: First `fetch` call succeeds → returns `VocabLookupResult`. `fetch` called exactly once.
2. **Primary 429, fallback success**: First `fetch` returns `{ status: 429, ok: false }` → second `fetch` succeeds with free dict schema → returns `VocabLookupResult`.
3. **Primary 404, no fallback**: First `fetch` returns `{ status: 404, ok: false }` → returns `null`. `fetch` called exactly once (fallback NOT triggered on 404).
4. **All providers fail (rate-limited)**: Both `fetch` calls throw/return 5xx → returns `null`.
5. **Schema parse failure falls back**: First `fetch` returns `ok: true` but invalid JSON (missing `word` field) → Zod throws → falls to fallback → fallback succeeds → returns result. *(This validates that catch-and-continue works for unexpected schema errors too.)*

**Verification**:
1. Run `npx vitest run apps/api/src/modules/vocab/vocab.service.test.ts` — all 5 tests pass.
2. Run `npx tsc --noEmit` in `apps/api` — 0 errors.
3. Manually: start dev server, call `GET /api/vocab/lookup?word=parliament` (authenticated) — returns `VocabLookupResult` JSON.

**PROGRESS.md Update**:
Append this exact text:
```
Task 1-4c: Vocab Proxy — Fallback Provider Pattern & Adapters — COMPLETED [ISO timestamp]
Files: apps/api/src/modules/vocab/vocab.service.ts, vocab.service.test.ts
Notes: Refactored vocab proxy with 2-provider fallback chain. englishdictionaryapi.com (primary) → dictionaryapi.dev (fallback). Per-adapter Zod schemas. Route and shared types unchanged.
```

### Task 1-5: Scraper Source CRUD API

**Goal**: CRUD endpoints for ScraperSource. All 4 operations work with valid data. Invalid config body returns 400.

**Target Files**:
- `apps/api/src/modules/scraper/source.routes.ts` — CREATE
- `apps/api/src/modules/scraper/source.service.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `source.service.ts`:
  - `getAllSources()` — findMany where isActive=true
  - `getSourceById(id: string)` — findUnique
  - `createSource(data)` — create. Config stored as-is in JSONB.
  - `updateSource(id: string, data)` — update by id
  - `deactivateSource(id: string)` — update isActive=false (soft delete)
- `source.routes.ts`: All routes preHandler [requireAuth]. Define Zod schema for ScraperSource config body (must have: name string, domain string, category string, config object). GET /api/sources → getAllSources. POST /api/sources → validate body → createSource. PUT /api/sources/:id → updateSource. DELETE /api/sources/:id → deactivateSource.
- Update `server.ts` to register.

**Integration Check**:
Used by pipeline config and admin dashboard.

**Verification**:
POST to `/api/sources` with valid JSON payload (authenticated).

**PROGRESS.md Update**:
Append this exact text:
```
Task 1-5: Scraper Source CRUD API — COMPLETED [ISO timestamp]
Files: apps/api/src/modules/scraper/*
Notes: Built CRUD for scraper sources.
```

### Task 2-1: @repo/scraper-core Package Init & URL Hasher

**Goal**: Package scaffold created. URL hash generator works exactly as specified.

**Target Files**:
- `packages/scraper-core/package.json` — CREATE
- `packages/scraper-core/tsconfig.json` — CREATE
- `packages/scraper-core/src/hasher/canonical-url.ts` — CREATE
- `packages/scraper-core/src/index.ts` — CREATE

**Blueprint References**:
- master_blueprint.md Section 7: `generateArticleHash` implementation

**Detailed LLM Instructions**:
- `package.json`: name='@repo/scraper-core'. deps: cheerio, got-scraping, playwright, playwright-extra, puppeteer-extra-plugin-stealth, crypto. Internal deps: @repo/types.
- `tsconfig.json`: extends base, rootDir=src.
- Copy EXACT `generateArticleHash` implementation from master_blueprint.md Section 7. Strip specific tracking params, lowercase host, strip www, remove trailing slash, SHA-256, return 16-char hex.
- `index.ts`: export { generateArticleHash } from './hasher/canonical-url.js';

**Integration Check**:
Core util for deduplication.

**Verification**:
Test generation with same URL and different tracking params returns same hash.

**PROGRESS.md Update**:
Append this exact text:
```
Task 2-1: @repo/scraper-core Package Init & URL Hasher — COMPLETED [ISO timestamp]
Files: packages/scraper-core/*
Notes: Created scraper package and URL hash logic.
```

### Task 2-2: JSON-LD Parser & Field Transforms

**Goal**: Parser accurately extracts NewsArticle schema and transforms apply correctly.

**Target Files**:
- `packages/scraper-core/src/extractor/json-ld.ts` — CREATE
- `packages/scraper-core/src/extractor/transforms.ts` — CREATE

**Blueprint References**:
- master_blueprint.md Section 8: Exact implementations(line 1332-1587)

**Detailed LLM Instructions**:
- Copy EXACT implementations from master_blueprint.md Section 8 for both files.
- `json-ld.ts`: `parseJsonLd($)` — scans script tags, parses JSON, returns NewsArticle/Article. `getJsonLdField(jsonLd, path)` — dot-notation access.
- `transforms.ts`: `applyTransforms(value, transforms, pageUrl)` — trim, clean-whitespace, strip-tags, parse-date-iso, resolve-url, regex-extract.

**Integration Check**:
Used by the declarative extractor.

**Verification**:
`applyTransforms('  test  ', [{ type: 'trim' }], '')` === 'test'

**PROGRESS.md Update**:
Append this exact text:
```
Task 2-2: JSON-LD Parser & Field Transforms — COMPLETED [ISO timestamp]
Files: packages/scraper-core/src/extractor/json-ld.ts, transforms.ts
Notes: Added JSON-LD parsing and text transformation functions.
```

### Task 2-3: Declarative Extractor

**Goal**: Extractor falls back correctly and applies transforms.

**Target Files**:
- `packages/scraper-core/src/extractor/declarative.ts` — CREATE

**Blueprint References**:
- master_blueprint.md Section 8: Exact implementation (line 1332-1587)

**Detailed LLM Instructions**:
- Copy EXACT implementation from master_blueprint.md Section 8.
- For CSS source with multiple matching elements (e.g. `p` tags): join their text with double newline.
- Fallbacks tried in array order until non-empty value found.
- Update `index.ts` to export: `{ DeclarativeExtractor } from './extractor/declarative.js'`

**Integration Check**:
Used by both Discover and Extract stages in the API.

**Verification**:
Test extraction logic with dummy HTML.

**PROGRESS.md Update**:
Append this exact text:
```
Task 2-3: Declarative Extractor — COMPLETED [ISO timestamp]
Files: packages/scraper-core/src/extractor/declarative.ts
Notes: Built the core declarative extraction engine.
```

### Task 2-4: HybridFetchEngine with Playwright Stealth

**Goal**: Hybrid engine falls back to playwright on cloudflare blocks.

**Target Files**:
- `packages/scraper-core/src/engine/cheerio-adapter.ts` — CREATE
- `packages/scraper-core/src/engine/playwright-adapter.ts` — CREATE
- `packages/scraper-core/src/engine/hybrid-fetch.ts` — CREATE

**Blueprint References**:
- master_blueprint.md Section 7: Exact implementations (line 1116-1331)

**Detailed LLM Instructions**:
- Copy EXACT implementations from master_blueprint.md Section 7.
- `cheerio-adapter.ts`: delay logic, got-scraping, cloudflare detection.
- `playwright-adapter.ts`: dynamic import stealth plugin, singleton browser, block resources (images, fonts).
- `hybrid-fetch.ts`: fallback logic.
- Update `index.ts` to export `{ HybridFetchEngine }`.

**Integration Check**:
This handles actual network fetching for workers.

**Verification**:
Engine fetches successfully.

**PROGRESS.md Update**:
Append this exact text:
```
Task 2-4: HybridFetchEngine with Playwright Stealth — COMPLETED [ISO timestamp]
Files: packages/scraper-core/src/engine/*
Notes: Built hybrid fetch engine with Cheerio and Playwright stealth.
```

### Task 3-1: @repo/llm-core Package Init & Formatter

**Goal**: Formatting and parsing logic for LLM batch processing.

**Target Files**:
- `packages/llm-core/package.json` — CREATE
- `packages/llm-core/tsconfig.json` — CREATE
- `packages/llm-core/src/prompts/css-pms-filter.ts` — CREATE
- `packages/llm-core/src/formatter/pipe-delimited.ts` — CREATE

**Blueprint References**:
- master_blueprint.md Section 6: Prompts and formatters (line 741-1115)

**Detailed LLM Instructions**:
- `package.json`: name='@repo/llm-core'. deps: @google/generative-ai, groq-sdk, @repo/types.
- Copy EXACT CSS_PMS_SYSTEM_PROMPT.
- Copy EXACT formatters: `sanitize(text)`, `formatBatchPayload(items)`, `parseApprovedHashes(llmResponse)`, `generateManualPromptOutput(batchId, items)`.
- Key behavior of parseApprovedHashes: return [] on empty/'NONE', strip markdown, replace newlines with commas, split, trim, filter regex `/^[a-f0-9]{16}$/i`.

**Integration Check**:
Provides core LLM utilities.

**Verification**:
`parseApprovedHashes('1234567890abcdef\nNONE')` returns `['1234567890abcdef']`.

**PROGRESS.md Update**:
Append this exact text:
```
Task 3-1: @repo/llm-core Package Init & Formatter — COMPLETED [ISO timestamp]
Files: packages/llm-core/*
Notes: Initialized LLM package with prompt and payload formatters.
```

### Task 3-2: Base Provider & Gemini Provider

**Goal**: Robust provider class handling API calls and fallback.

**Target Files**:
- `packages/llm-core/src/providers/base.provider.ts` — CREATE
- `packages/llm-core/src/providers/gemini.provider.ts` — CREATE

**Blueprint References**:
- master_blueprint.md Section 6: Base and Gemini providers(line 741-1115)

**Detailed LLM Instructions**:
- Copy EXACT implementations.
- `BaseLlmProvider.evaluate()`: wraps API call with Promise.race (timeout). On ANY error → returns manual mode fallback using `generateManualPromptOutput`.
- `GeminiProvider.callApi()`: uses GoogleGenerativeAI with systemInstruction.

**Integration Check**:
Used by pipeline evaluate worker.

**Verification**:
Test API failure returns manual output.

**PROGRESS.md Update**:
Append this exact text:
```
Task 3-2: Base Provider & Gemini Provider — COMPLETED [ISO timestamp]
Files: packages/llm-core/src/providers/base.provider.ts, gemini.provider.ts
Notes: Created base LLM logic and Gemini implementation.
```

### Task 3-2a: Environment-driven LLM Model Configuration

**Goal**: Update the LLM configuration to read the model name from the environment instead of hardcoding deprecated models.

**Target Files**:
- `packages/types/src/llm.types.ts` — MODIFY
- `apps/api/src/core/config.ts` — MODIFY
- `apps/api/src/pipeline/stage-evaluate.ts` — MODIFY
- `packages/llm-core/src/providers/gemini.provider.ts` — MODIFY

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `llm.types.ts`: Add `model?: string;` to `LlmConfig` if it does not already exist.
- `config.ts`: Add `LLM_MODEL` to the Zod schema as `z.string().optional().default('gemini-3.6-flash')`.
- `stage-evaluate.ts`: Pass `model: config.LLM_MODEL` when constructing the `llmConfig` object.
- `gemini.provider.ts`: In the constructor, change the fallback from `'gemini-2.0-flash'` to `'gemini-3.6-flash'` so it reads: `this.modelName = config.model ?? 'gemini-3.6-flash';`. (If Groq is implemented, it will also use `config.model`).

**Integration Check**:
Ensures that API calls do not fail due to hardcoded deprecated models, and allows operators to easily change the model via the `.env` file.

**Verification**:
Run `npx tsc --noEmit` in `apps/api` to verify types. Ensure the pipeline evaluate stage uses the correct model.

**PROGRESS.md Update**:
Append this exact text:
```text
Task 3-2a: Environment-driven LLM Model Configuration — COMPLETED [ISO timestamp]
Files: packages/types/src/llm.types.ts, apps/api/src/core/config.ts, apps/api/src/pipeline/stage-evaluate.ts, packages/llm-core/src/providers/gemini.provider.ts
Notes: Added support for `LLM_MODEL` env var and updated default Gemini model to `gemini-3.6-flash`.
```

### Task 3-3: Prerequisite Task 3-3 (Mini): LlmProviderFactory + Manual Provider

**Goal**: Implement a minimal LlmProviderFactory and a ManualProvider stub. This is the missing factory that stage-evaluate.ts must use to remain provider-agnostic.

**Target Files**:
- `packages/llm-core/src/providers/manual.provider.ts` — CREATE
- `packages/llm-core/src/providers/factory.ts` — CREATE
- `packages/llm-core/src/index.ts` — MODIFY
- `apps/api/package.json` — MODIFY

**Detailed LLM Instructions**:

`manual.provider.ts` — A provider that skips the API and goes directly to manual fallback:
```typescript
import type { LlmConfig, LlmEvaluationItem, LlmEvaluationResult, ManualPromptOutput } from '@repo/types';
import { BaseLlmProvider } from './base.provider.js';
export class ManualProvider extends BaseLlmProvider {
  readonly providerType = 'manual' as const;
  constructor(config: LlmConfig) {
    super(config);
  }
  protected async callApi(_userPayload: string, _systemPrompt: string): Promise<{ text: string }> {
    // ManualProvider never calls an API — it always throws to trigger the base class fallback
    throw new Error('Manual mode: no API call');
  }
}
```

`factory.ts` — Switch on config.provider and config.mode:
```typescript
import type { ILlmProvider, LlmConfig } from '@repo/types';
import { GeminiProvider } from './gemini.provider.js';
import { ManualProvider } from './manual.provider.js';
export function createLlmProvider(config: LlmConfig): ILlmProvider {
  if (config.mode === 'manual') {
    return new ManualProvider(config);
  }
  switch (config.provider) {
    case 'gemini':
      return new GeminiProvider(config);
    default:
      throw new Error(`Unknown LLM provider: ${config.provider}`);
  }
}
```

`packages/llm-core/src/index.ts` — Add exports:
```typescript
export { GeminiProvider } from './providers/gemini.provider.js';
export { ManualProvider } from './providers/manual.provider.js';
export { createLlmProvider } from './providers/factory.js';
export { formatBatchPayload, parseApprovedHashes, generateManualPromptOutput } from './formatter/pipe-delimited.js';
export { CSS_PMS_SYSTEM_PROMPT } from './prompts/css-pms-filter.js';
```

`apps/api/package.json` — Add dependency:
```json
"@repo/llm-core": "workspace:*"
```

**Verification**: Run `npx tsc --noEmit` inside `packages/llm-core` — must be 0 errors.

**PROGRESS.md Update**:
Append this exact text:
```
Task 3-3: Prerequisite Task 3-3 (Mini): LlmProviderFactory + Manual Provider — COMPLETED [ISO timestamp]
Files: packages/llm-core/src/providers/manual.provider.ts, factory.ts, index.ts, apps/api/package.json
Notes: Implemented LlmProviderFactory and ManualProvider stub.
```


### Task 4-1: Stage 1 — Discover Worker

**Goal**: Worker fetches indexes, hashes URLs, and saves DISCOVERED articles.

**Target Files**:
- `apps/api/src/pipeline/stage-discover.ts` — CREATE
- `apps/api/src/pipeline/workers/discover.worker.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `stage-discover.ts`: `runDiscoverStage(pipelineRunId, sourceId)`
  1. Fetch source, config, create HybridFetchEngine.
  2. For each indexPage, fetch HTML.
  3. Extract title, url using `$(indexPage.listSelector)` mapping.
  4. Generate hash. Check if exists.
  5. If new: create Article { status: 'DISCOVERED' }.
  6. Return stats.
- `discover.worker.ts`: Worker on 'pipeline-discover' queue calling `runDiscoverStage`.

**Integration Check**:
First step of the pipeline. Feeds into Evaluate worker via orchestrator.

**Verification**:
Worker starts and connects to Redis.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-1: Stage 1 — Discover Worker — COMPLETED [ISO timestamp]
Files: apps/api/src/pipeline/stage-discover.ts, discover.worker.ts
Notes: Built discovery worker.
```

### Task 4-2: Stage 2 — Evaluate Worker (Revised)

**Goal**: Single LLM call per run to approve/reject articles. Uses createLlmProvider factory driven by env config.

**Target Files**:
- `apps/api/src/pipeline/stage-evaluate.ts` — CREATE
- `apps/api/src/pipeline/workers/evaluate.worker.ts` — CREATE
- `apps/api/src/index.ts` — MODIFY (add evaluate worker import)

**Detailed LLM Instructions**:

`stage-evaluate.ts` — `runEvaluateStage(pipelineRunId: string)`:
- Query all Article where `{ pipelineRunId, status: 'DISCOVERED' }`. If none, return early.
- Map to `LlmEvaluationItem[]` — `{ hash, title, description }`.
- Create LlmBatch in DB: `{ pipelineRunId, mode: (LLM_MODE==='api' ? 'API' : 'MANUAL'), status: 'PENDING', promptCsv: '' }`.
- Build LlmConfig from config (env): `{ provider: config.LLM_PROVIDER, apiKey: config.GEMINI_API_KEY || '', mode: config.LLM_MODE }`.
- Call `createLlmProvider(llmConfig)` from `@repo/llm-core`.
- Call `provider.evaluate(items, batch.id)` → `LlmEvaluationResult`.
- If `result.mode === 'manual'`: Update `LlmBatch.status = 'AWAITING_MANUAL'`, `LlmBatch.promptCsv = result.rawResponse`. Update `PipelineRun.status = 'AWAITING_MANUAL'`. Return stats.
- If `result.mode === 'api'`: Update `LlmBatch.status = 'COMPLETED'`, `LlmBatch.approvedHashes = result.approvedHashes`. Batch-update all `result.approvedHashes` articles to APPROVED. Batch-update all `result.rejectedHashes` articles to REJECTED. Update stats.
- Return `PipelineRunStats`.

`evaluate.worker.ts` — Worker on pipeline-evaluate queue:
- Import `redisConnection` from `../../queue/connection.js` (same pattern as `discover.worker.ts`).
- Job data: `{ pipelineRunId: string }`.
- Call `runEvaluateStage(job.data.pipelineRunId)`.
- Listen to `failed` event and log.

`apps/api/src/index.ts` — Add after existing discover worker import:
```typescript
import './pipeline/workers/evaluate.worker.js';
```

**Integration Check**: `stage-evaluate.ts` is the consumer of `@repo/llm-core`'s public API. The LlmBatch DB record created here is what the manual resolution endpoint (Task 5-x) will query and update later. The APPROVED/REJECTED status updates here directly feed Stage 3 (Extract Worker).

**Verification**: Run `npx tsc --noEmit` in `apps/api` — 0 errors. Both worker imports present in `index.ts`.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-2: Stage 2 — Evaluate Worker (Revised) — COMPLETED [ISO timestamp]
Files: apps/api/src/pipeline/stage-evaluate.ts, evaluate.worker.ts, index.ts
Notes: Implemented evaluate worker using createLlmProvider factory.
```

### Task 4-3: Stage 3 — Extract Worker

**Goal**: Fetch full content for APPROVED articles.

**Target Files**:
- `apps/api/src/pipeline/stage-extract.ts` — CREATE
- `apps/api/src/pipeline/workers/extract.worker.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `stage-extract.ts`: `runExtractStage(pipelineRunId)`
  1. Query `status='APPROVED'` for run.
  2. For each: extract HTML, pull `content` field.
  3. Calculate wordCount, store extra fields in JSONB.
  4. Update Article to EXTRACTED with fullContent and expiresAt dates.
- `extract.worker.ts`: Worker on 'pipeline-extract' queue.

**Integration Check**:
Final stage of article pipeline.

**Verification**:
Worker starts.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-3: Stage 3 — Extract Worker — COMPLETED [ISO timestamp]
Files: apps/api/src/pipeline/stage-extract.ts, extract.worker.ts
Notes: Built full-content extraction worker.
```

### Task 4-4: Maintenance Worker & Cron Schedulers

**Goal**: Cron logic for TTL and daily triggers.

**Target Files**:
- `apps/api/src/queue/schedulers.ts` — CREATE
- `apps/api/src/pipeline/workers/maintenance.worker.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `schedulers.ts`: upsertJobScheduler for 'ttl-cleanup' and 'daily-pipeline'.
- `maintenance.worker.ts`: Worker handles two job names:
  1. 'enforce-ttl-policies': NULL old fullContent, batch delete REJECTED and fully expired records via raw SQL.
  2. 'trigger-daily-pipeline': fetch active sources, create PipelineRun, call `triggerPipeline`.

**Integration Check**:
Keeps database clean automatically.

**Verification**:
Worker starts without errors.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-4: Maintenance Worker & Cron Schedulers — COMPLETED [ISO timestamp]
Files: apps/api/src/queue/schedulers.ts, maintenance.worker.ts
Notes: Added background maintenance and cron schedulers.
```

### Task 5-1: Pipeline Trigger & Status API

**Goal**: API to start and track pipeline runs.

**Target Files**:
- `apps/api/src/modules/pipeline/pipeline.routes.ts` — CREATE
- `apps/api/src/modules/pipeline/pipeline.service.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `pipeline.service.ts`: `triggerPipelineRun` (creates run + calls orchestrator), `getPipelineRuns` (pagination), `getPipelineRun` (includes article status grouping), `cancelPipelineRun`.
- `pipeline.routes.ts`: POST `/api/pipeline/trigger`, GET `/api/pipeline`, GET `/api/pipeline/:runId`, POST `/api/pipeline/:runId/cancel`.

**Integration Check**:
Frontend admin uses these endpoints.

**Verification**:
Endpoints return appropriate data/404s.

**PROGRESS.md Update**:
Append this exact text:
```
Task 5-1: Pipeline Trigger & Status API — COMPLETED [ISO timestamp]
Files: apps/api/src/modules/pipeline/pipeline.*
Notes: Created pipeline execution API.
```

### Task 5-2: Manual LLM Batch Resolution API

**Goal**: Endpoints for admins to process manual batches.

**Target Files**:
- `apps/api/src/modules/pipeline/llm-batch.routes.ts` — CREATE
- `apps/api/src/modules/pipeline/llm-batch.service.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `llm-batch.service.ts`: `getPendingBatches`, `getBatchPrompt`, `resolveBatch`.
- `resolveBatch` logic: Validate hashes regex. Update articles for approved hashes to APPROVED, others DISCOVERED to REJECTED. Update Batch to COMPLETED. Update Run to RUNNING/EXTRACT. Enqueue `stage-extract`.
- `llm-batch.routes.ts`: GET pending, GET prompt, POST resolve.

**Integration Check**:
Unblocks pipelines stuck in AWAITING_MANUAL.

**Verification**:
Post valid array of hashes returns success.

**PROGRESS.md Update**:
Append this exact text:
```
Task 5-2: Manual LLM Batch Resolution API — COMPLETED [ISO timestamp]
Files: apps/api/src/modules/pipeline/llm-batch.*
Notes: Added API to manually resolve LLM batches.
```

### Task 5-3: Articles Public API

**Goal**: Paginated read access to EXTRACTED articles.

**Target Files**:
- `apps/api/src/modules/articles/articles.routes.ts` — CREATE
- `apps/api/src/modules/articles/articles.service.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `articles.service.ts`: `getArticles` (cursor pagination, filters: category, sourceId, date range, search). `getArticle` (by ID, includes source).
- `articles.routes.ts`: GET `/api/articles`, GET `/api/articles/:id`. Validate query params via Zod.

**Integration Check**:
Frontend news feed consumes this.

**Verification**:
API returns correctly formatted article JSON.

**PROGRESS.md Update**:
Append this exact text:
```
Task 5-3: Articles Public API — COMPLETED [ISO timestamp]
Files: apps/api/src/modules/articles/*
Notes: Exposed extracted articles via API.
```

### Task 6-1: Vite App Scaffold & API Client

**Goal**: `pnpm --filter @apps/web dev` starts. Axios client ready.

**Target Files**:
- `apps/web/package.json` — CREATE
- `apps/web/tsconfig.json` — CREATE
- `apps/web/vite.config.ts` — CREATE
- `apps/web/index.html` — CREATE
- `apps/web/src/main.tsx` — CREATE
- `apps/web/src/App.tsx` — CREATE
- `apps/web/src/shared/lib/api-client.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- Create standard Vite React TS template.
- Install deps: react, react-dom, react-router-dom, @tanstack/react-query, zustand, axios, tailwindcss.
- `vite.config.ts`: Proxy `/api` and `/auth` to port 3001.
- `api-client.ts`: Axios instance with interceptor redirecting 401 to `/login`.

**Integration Check**:
Frontend base setup.

**Verification**:
Web app runs on 3000 and serves HTML.

**PROGRESS.md Update**:
Append this exact text:
```
Task 6-1: Vite App Scaffold & API Client — COMPLETED [ISO timestamp]
Files: apps/web/*
Notes: Initialized Vite frontend and API client.
```

### Task 6-2: Router & Auth Guard

**Goal**: Authentication gating for frontend routes.

**Target Files**:
- `apps/web/src/core/router.tsx` — CREATE
- `apps/web/src/core/providers/index.tsx` — CREATE
- `apps/web/src/modules/auth/pages/LoginPage.tsx` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- AuthGuard component using TanStack Query to fetch `/api/auth/me`. Redirects to login on 401.
- `router.tsx`: Define routes (dashboard, news, admin). Wrap in AuthGuard. Unprotected login route.
- `LoginPage.tsx`: Simple UI with Google login button `href={import.meta.env.VITE_API_URL + '/auth/google'}`.

**Integration Check**:
Forces login before accessing app.

**Verification**:
Visiting `/` redirects to `/login`.

**PROGRESS.md Update**:
Append this exact text:
```
Task 6-2: Router & Auth Guard — COMPLETED [ISO timestamp]
Files: apps/web/src/core/router.tsx, auth/*
Notes: Built router and auth guard.
```

### Task 6-3: AppShell, Sidebar & Dashboard

**Goal**: Main layout and dashboard module grid.

**Target Files**:
- `apps/web/src/core/layout/AppShell.tsx` — CREATE
- `apps/web/src/core/layout/Sidebar.tsx` — CREATE
- `apps/web/src/core/layout/Header.tsx` — CREATE
- `apps/web/src/modules/dashboard/pages/DashboardPage.tsx` — CREATE
- `apps/web/src/modules/dashboard/components/ModuleCard.tsx` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- Build responsive AppShell (sidebar + header + main).
- Dashboard loops over DASHBOARD_MODULES. Active modules linkable, inactive have 'Coming Soon' overlay.

**Integration Check**:
Core navigation UI.

**Verification**:
Dashboard renders correctly.

**PROGRESS.md Update**:
Append this exact text:
```
Task 6-3: AppShell, Sidebar & Dashboard — COMPLETED [ISO timestamp]
Files: apps/web/src/core/layout/*, dashboard/*
Notes: Built shell and dashboard UI.
```

### Task 6-4: News Feed & Article View with Local Vocab Storage

**Goal**: News reader with word-click vocab popup. "Save Word" stores to Zustand + IndexedDB (offline-first). No backend DB calls for saving.

**Target Files**:
- `apps/web/src/modules/newspaper/pages/NewsFeed.tsx` — CREATE
- `apps/web/src/modules/newspaper/pages/ArticleView.tsx` — CREATE
- `apps/web/src/modules/newspaper/components/ArticleCard.tsx` — CREATE
- `apps/web/src/modules/newspaper/components/VocabPopup.tsx` — CREATE
- `apps/web/src/modules/newspaper/hooks/useArticles.ts` — CREATE
- `apps/web/src/modules/newspaper/hooks/useVocabLookup.ts` — CREATE
- `apps/web/src/modules/vocab/store/useVocabStore.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `useVocabStore.ts`: Zustand store with `persist` middleware using **`idb-keyval`** as the storage engine (add `idb-keyval` to `apps/web/package.json`). Create `VocabStore` interface with `savedWords`, `saveWord`, `removeWord`, `isWordSaved`. Use `createJSONStorage(() => ({ getItem: get, setItem: set, removeItem: del }))` for IndexedDB persistence. Key: `'vocab-saved-words'`.
- `useVocabLookup.ts`: TanStack Query hook calling `apiClient.get<VocabLookupResult>(\`/api/vocab/lookup?word=${word}\`)`. `staleTime: 1000 * 60 * 60`.
- `VocabPopup.tsx`: Absolute-positioned card appearing on word click. Shows loading skeleton, word, first `partsOfSpeech` entry with its definition and example, synonyms (up to 5). **"Save Word" button**: calls `vocabStore.saveWord(result)`. If already saved, button becomes "✓ Saved" (disabled).
- `ArticleView.tsx`: Splits `article.fullContent` into words by regex `\b(\w+)\b`. Wraps each alphabetic word (`/^[a-zA-Z]+$/`) in `<span className="cursor-pointer hover:bg-yellow-100 rounded px-0.5">` with an `onClick` handler. On click: sets `selectedWord` state and calculates position from `e.clientX / e.clientY`. Renders `<VocabPopup>` when `selectedWord` is set.
- `useArticles.ts`: TanStack Query infinite query for `/api/articles`.

**Integration Check**:
Frontend calls `/api/vocab/lookup` (Task 1-4b proxy). Saved words live in IndexedDB via Zustand. The `/modules/vocab` page (future task) reads from `useVocabStore` entirely offline.

**Verification**:
Open an article, click a word → popup appears with definition → click "Save Word" → refresh page → saved word still appears in the vocab module list (persisted in IndexedDB).

**PROGRESS.md Update**:
Append this exact text:
```
Task 6-4 (Revised): News Feed & Article View — COMPLETED [ISO timestamp]
Files: apps/web/src/modules/newspaper/*, apps/web/src/modules/vocab/store/*
Notes: Built news reader with offline-first vocab storage via Zustand + IndexedDB.
```

### Task 7-1: Pipeline Admin Page

**Goal**: Live dashboard for pipeline runs.

**Target Files**:
- `apps/web/src/modules/admin/pages/PipelineAdmin.tsx` — CREATE
- `apps/web/src/modules/admin/components/PipelineRunCard.tsx` — CREATE
- `apps/web/src/modules/admin/hooks/usePipeline.ts` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `usePipeline.ts`: Queries with 5s refetch interval.
- `PipelineRunCard.tsx`: Display stats bar and active status.
- Add 'Trigger Pipeline' modal.

**Integration Check**:
Uses pipeline API.

**Verification**:
UI updates automatically when pipeline runs.

**PROGRESS.md Update**:
Append this exact text:
```
Task 7-1: Pipeline Admin Page — COMPLETED [ISO timestamp]
Files: apps/web/src/modules/admin/pipeline/*
Notes: Built pipeline admin view.
```

### Task 7-2: Manual Batch Admin Page

**Goal**: Resolve LLM batches manually via UI.

**Target Files**:
- `apps/web/src/modules/admin/pages/BatchAdmin.tsx` — CREATE
- `apps/web/src/modules/admin/components/BatchResolveForm.tsx` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `BatchAdmin.tsx`: List AWAITING_MANUAL batches.
- `BatchResolveForm.tsx`: Textarea to show promptCsv (with copy button), textarea to input hashes, submit POSTs to resolve endpoint.

**Integration Check**:
Interfaces with batch resolution API.

**Verification**:
Can submit hashes and see success toast.

**PROGRESS.md Update**:
Append this exact text:
```
Task 7-2: Manual Batch Admin Page — COMPLETED [ISO timestamp]
Files: apps/web/src/modules/admin/batch/*
Notes: Built manual LLM batch resolution UI.
```

### Task 8-1: Wire Up All Routes & Workers at Server Start

**Goal**: API fully functional on boot.

**Target Files**:
- `apps/api/src/index.ts` — MODIFY
- `apps/api/src/core/server.ts` — MODIFY

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- `index.ts`: Import and register all route plugins. Import all workers. Start schedulers. Handle SIGTERM gracefully by closing queues and servers.

**Integration Check**:
Brings backend fully online.

**Verification**:
Server starts and workers connect to Redis.

**PROGRESS.md Update**:
Append this exact text:
```
Task 8-1: Wire Up All Routes & Workers at Server Start — COMPLETED [ISO timestamp]
Files: apps/api/src/index.ts
Notes: Wired up all routes and workers.
```

### Task 8-2: Dockerfiles & Production Build

**Goal**: Production ready docker-compose.

**Target Files**:
- `apps/api/Dockerfile` — CREATE
- `apps/web/Dockerfile` — CREATE
- `apps/web/nginx.conf` — CREATE

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:
- Create multistage Dockerfiles for `apps/api` (Node) and `apps/web` (Nginx).
- `nginx.conf`: setup SPA routing.

**Integration Check**:
Final deployment artifacts.

**Verification**:
`docker-compose build` succeeds.

**PROGRESS.md Update**:
Append this exact text:
```
Task 8-2: Dockerfiles & Production Build — COMPLETED [ISO timestamp]
Files: Dockerfiles, nginx.conf
Notes: Created production Docker build files.
```

---

## Pivot 1 Addendum (Missing Tasks Log)

The following tasks were dynamically generated during the Pivot 1 Architecture Refactor and are officially part of the completed timeline (as recorded in PROGRESS.md):

1. **Task 0-2a: Prisma Schema Pivot Migrations**
   - Goal: Remove `config` JSONB field from `ScraperSource`.
2. **Task 1-5a: Scraper Source CRUD Config Field Removal**
   - Goal: Update `source.routes.ts` and `source.service.ts` to reflect the removed schema config.
3. **Task 2-3a: @repo/scraper-core Base Parser & Registry**
   - Goal: Establish `BaseSiteParser` class and registry pattern.
4. **Task 2-3b: Dawn News Parser Implementation**
   - Goal: Implement the concrete parser for dawn.com.
5. **Task 4-1a: Stage 1 Discover — Code-First Parser Integration**
   - Goal: Rewrite the discover worker to use the parser registry instead of the declarative engine.
6. **Task 4-3a: Stage 3 Extract — Code-First Parser Integration**
   - Goal: Rewrite the extract worker to use the parser registry.

---

## Bug Fix Addendum (Post Phase 5 Patches)

The following tasks address bugs discovered during manual testing of the completed pipeline. They must be implemented in order (1-1a → 4-3b → 2-3c) as 4-3b depends on 1-1a's `errors.ts` file.

### Task 1-1a: Global Error Handler Overhaul

**Goal**: Centralize all error handling. Remove per-route `try/catch` anti-pattern. In development, all errors must be logged to console with full stack traces and returned in the HTTP response.

**Target Files**:
- `apps/api/src/core/errors.ts` — CREATE
- `apps/api/src/core/error-handler.ts` — MODIFY
- `apps/api/src/core/server.ts` — MODIFY
- `apps/api/src/modules/pipeline/pipeline.routes.ts` — MODIFY
- `apps/api/src/modules/pipeline/llm-batch.routes.ts` — MODIFY
- `apps/api/src/modules/articles/articles.routes.ts` — MODIFY
- `apps/api/src/modules/articles/articles.service.ts` — MODIFY
- `apps/api/src/modules/scraper/source.routes.ts` — MODIFY
- `apps/api/src/modules/vocab/vocab.routes.ts` — MODIFY

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:

**Step 1** — Create `apps/api/src/core/errors.ts`:
```typescript
export class AppError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') { super(404, message); }
}
export class BadRequestError extends AppError {
  constructor(message: string) { super(400, message); }
}
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') { super(401, message); }
}
export class ConflictError extends AppError {
  constructor(message: string) { super(409, message); }
}
```

**Step 2** — Modify `apps/api/src/core/error-handler.ts`:
- Import `AppError` from `./errors.js`.
- In `setErrorHandler`: first check `instanceof AppError` and reply with `error.statusCode` + `error.message`.
- For unhandled errors (statusCode >= 500), **always** call `server.log.error(error)`.
- If `config.NODE_ENV === 'development'`, include `stack: error.stack` in the 500 JSON body.
- After the `setErrorHandler`, call `server.setNotFoundHandler((request, reply) => { reply.status(404).send({ statusCode: 404, error: 'Not Found', message: `Route ${request.method}:${request.url} not found` }); })`.

**Step 3** — Strip `try/catch` from routes. For each of the following files, remove ALL `try/catch` blocks and all manual `reply.status(4xx).send(...)` calls. Let errors bubble up to the global handler:
- `pipeline.routes.ts`: Remove all 4 try/catch wrappers.
- `llm-batch.routes.ts`: Remove all 3 try/catch wrappers.
- `articles.routes.ts`: Remove all 2 try/catch wrappers.
- `source.routes.ts`: Remove all try/catch wrappers.

**Step 4** — Fix `vocab.routes.ts`. Change `safeParse` to throwing `parse()`:
```typescript
// BEFORE (remove this pattern):
const query = querySchema.safeParse(request.query);
if (!query.success) { return reply.status(400).send(...); }

// AFTER (use this instead):
const query = querySchema.parse(request.query); // throws ZodError, caught globally
```
The `if (!result)` check for word not found can remain as a direct `throw new NotFoundError('Word not found')`.

**Step 5** — In `articles.service.ts`, change `throw new Error('Article not found')` to `throw new NotFoundError('Article not found')`, importing from `../../core/errors.js`.

**⚠️ Conflict Check**:
- `auth.routes.ts` already has no `try/catch` wrappers — do NOT touch it.
- `ZodError` handling already exists in `error-handler.ts` — preserve it.

**Integration Check**:
After this task, the global error handler in `error-handler.ts` is the single source of truth for all error responses. No route handler should return an error response directly.

**Verification**:
1. Hit `GET /api/pipeline/llm-batches` (wrong URL) → must get `{ statusCode: 404, error: "Not Found", message: "Route GET:/api/pipeline/llm-batches not found" }`.
2. Hit `GET /api/articles?limit=abc` → must get `{ statusCode: 400, error: "Bad Request", message: "Validation failed", issues: [...] }`.
3. Hit a valid route while the DB is disconnected → must see full stack trace in terminal AND in response body (dev only).

**PROGRESS.md Update**:
Append this exact text:
```
Task 1-1a: Global Error Handler Overhaul — COMPLETED [ISO timestamp]
Files: apps/api/src/core/errors.ts (created), error-handler.ts (modified), server.ts (modified), pipeline.routes.ts (modified), llm-batch.routes.ts (modified), articles.routes.ts (modified), articles.service.ts (modified), source.routes.ts (modified), vocab.routes.ts (modified)
Notes: Centralized error handling. Removed try/catch anti-pattern from all route files. Added NotFoundHandler and AppError hierarchy.
```

---

### Task 4-3b: Fix PipelineRun Status Stuck in RUNNING

**Goal**: After the extract stage completes, the `PipelineRun` record must be updated to `status: 'COMPLETED'` with a `completedAt` timestamp.

**Target Files**:
- `apps/api/src/pipeline/stage-extract.ts` — MODIFY

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:

In `stage-extract.ts`, locate the final `prisma.pipelineRun.update` call near the bottom of the `runExtractStage` function (currently around line 98). It currently only updates `stats`. Change it to also set `status` and `completedAt`:

```typescript
// BEFORE:
await prisma.pipelineRun.update({
  where: { id: pipelineRunId },
  data: { stats: stats as unknown as object },
});

// AFTER:
await prisma.pipelineRun.update({
  where: { id: pipelineRunId },
  data: {
    stats: stats as unknown as object,
    status: 'COMPLETED',
    completedAt: new Date(),
  },
});
```

**⚠️ Conflict Check**:
- `completedAt DateTime?` and the `COMPLETED` status enum value already exist in the Prisma schema. No schema migration needed.
- Do NOT change the `status: 'EXTRACTING'` or `status: 'EXTRACTED'` / `status: 'FAILED'` updates on individual `Article` records. Only the `PipelineRun` record needs this fix.

**Integration Check**:
The `GET /api/pipeline/:runId` endpoint reads the `PipelineRun` record's `status` directly from DB. Once this fix is applied, polling that endpoint after a successful run will return `status: "COMPLETED"`.

**Verification**:
1. Trigger a full pipeline run via `POST /api/pipeline/trigger`.
2. Wait for extraction to complete (check terminal logs for `[ExtractWorker] Job completed`).
3. Hit `GET /api/pipeline/:runId` → status must be `"COMPLETED"` and `completedAt` must be a valid timestamp.
4. Open Prisma Studio → `PipelineRun` table → confirm `status = COMPLETED` and `completedAt` is populated.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-3b: Fix PipelineRun Status Stuck in RUNNING — COMPLETED [ISO timestamp]
Files: apps/api/src/pipeline/stage-extract.ts (modified)
Notes: Added status: COMPLETED and completedAt to the final pipelineRun.update call in runExtractStage.
```

---

### Task 2-3c: Dawn Parser Date Guard (Anti-Duplication)

**Goal**: Prevent the Dawn parser from scraping and saving duplicate articles when Dawn's server silently serves the previous day's index page.

**Target Files**:
- `packages/scraper-core/src/parsers/errors.ts` — CREATE
- `packages/scraper-core/src/parsers/base.parser.ts` — MODIFY
- `packages/scraper-core/src/parsers/dawn.parser.ts` — MODIFY
- `packages/scraper-core/src/index.ts` — MODIFY
- `apps/api/src/pipeline/stage-discover.ts` — MODIFY

**Blueprint References**:
- N/A

**Detailed LLM Instructions**:

**Step 1** — Create `packages/scraper-core/src/parsers/errors.ts`:
```typescript
export class StaleDataError extends Error {
  constructor(public readonly requestedDate: string, public readonly foundDate: string) {
    super(`Stale page detected: requested ${requestedDate}, page shows ${foundDate}`);
    this.name = 'StaleDataError';
  }
}
```

**Step 2** — Modify `packages/scraper-core/src/parsers/base.parser.ts`:
- Add optional `dateSelector?: string` — CSS selector that points to the date element on the index page.
- Add optional method `normalizeDateString(raw: string): string` — converts the raw extracted string to `YYYY-MM-DD`. Default implementation returns the string as-is.
- Add a concrete `verifyPageDate(html: string, targetDate: string): void` method:
  ```typescript
  import * as cheerio from 'cheerio';
  import { StaleDataError } from './errors.js';
  
  verifyPageDate(html: string, targetDate: string): void {
    if (!this.dateSelector) return; // guard: skip if parser has no selector
    const $ = cheerio.load(html);
    const raw = $(this.dateSelector).first().text().trim();
    if (!raw) return; // can't determine date, skip guard
    const normalized = this.normalizeDateString(raw);
    if (normalized !== targetDate) {
      throw new StaleDataError(targetDate, normalized);
    }
  }
  ```
- Change the `discoverLinks` signature to: `abstract discoverLinks(html: string, baseUrl: string, targetDate?: string): DiscoveredLink[]`

**Step 3** — Modify `packages/scraper-core/src/parsers/dawn.parser.ts`:
- Set `dateSelector = 'nav.story-date time, .timestamp, [class*="date"]'` — inspect the actual Dawn HTML to find the correct selector for the archive date heading (e.g., "Tuesday, September 23, 2026"). Update the selector string accordingly.
- Override `normalizeDateString(raw: string): string`:
  ```typescript
  normalizeDateString(raw: string): string {
    // Dawn format: "Tuesday, September 23, 2026" → "2026-09-23"
    const d = new Date(raw.replace(/^[A-Za-z]+,\s*/, '')); // strip day name
    if (isNaN(d.getTime())) return raw;
    return d.toISOString().split('T')[0];
  }
  ```
- At the start of `discoverLinks(html, baseUrl, targetDate?)`, before the Cheerio `.each()` loop, add:
  ```typescript
  if (targetDate) {
    this.verifyPageDate(html, targetDate);
  }
  ```

**Step 4** — Export from `packages/scraper-core/src/index.ts`:
Add `export { StaleDataError } from './parsers/errors.js';`

**Step 5** — Modify `apps/api/src/pipeline/stage-discover.ts`:
- Extract `targetDate` from the pipeline run:
  ```typescript
  const pipelineRun = await prisma.pipelineRun.findUnique({ where: { id: pipelineRunId } });
  const targetDate = pipelineRun!.createdAt.toISOString().split('T')[0];
  ```
- Pass `targetDate` to `discoverLinks`:
  ```typescript
  // BEFORE:
  const discoveredLinks = parser.discoverLinks(result.html, url);
  // AFTER:
  const discoveredLinks = parser.discoverLinks(result.html, url, targetDate);
  ```
- Import `StaleDataError` from `@repo/scraper-core` and catch it specifically in the per-URL try/catch:
  ```typescript
  } catch (error) {
    if (error instanceof StaleDataError) {
      console.warn(`[Discover] Skipping stale page ${url}: ${error.message}`);
      continue; // skip URL, don't increment failed counter
    }
    // re-throw all other errors
    throw error;
  }
  ```

**⚠️ Conflict Check**:
- The `discoverLinks` signature change (adding optional `targetDate?`) is backward-compatible. The `?` makes it optional, so parsers that don't implement date verification continue to work without any changes.
- The `stage-extract.ts` also calls parser methods but uses `extractArticle()` — not `discoverLinks()` — so no conflict there.
- The `4-3b` task only touches `stage-extract.ts`. This task only touches `stage-discover.ts`. No overlap.

**Integration Check**:
- If Dawn's index URL returns yesterday's articles (stale), `discoverLinks` throws `StaleDataError`.
- `stage-discover.ts` catches it, logs a warning, and skips to the next URL — the pipeline run does not fail.
- All other URLs in the `indexUrls` list continue to be processed normally.

**Verification**:
1. Temporarily set all Dawn index URLs to tomorrow's date (e.g., `2026-09-24`).
2. Trigger a pipeline run.
3. Check terminal logs: must see `[Discover] Skipping stale page ... Stale page detected` warning for each Dawn URL.
4. Check DB: 0 articles should be DISCOVERED for the dawn.com source in this run.
5. Restore URLs to today's date and confirm normal discovery resumes.

**PROGRESS.md Update**:
Append this exact text:
```
Task 2-3c: Dawn Parser Date Guard — COMPLETED [ISO timestamp]
Files: packages/scraper-core/src/parsers/errors.ts (created), base.parser.ts (modified), dawn.parser.ts (modified), scraper-core/src/index.ts (modified), apps/api/src/pipeline/stage-discover.ts (modified)
Notes: Added StaleDataError and verifyPageDate mechanism to BaseSiteParser. Dawn parser now calls verifyPageDate() at start of discoverLinks. stage-discover.ts extracts targetDate from the pipeline run and passes it through. Stale pages are gracefully skipped.
```

### Task IP-4: Vocab API Separate Interfaces

**Goal**: Define provider interfaces for DictionaryAPI and FreeDictionaryAPI; split service logic.

**Target Files**:
- `packages/types/src/vocab.interfaces.ts` — CREATE
- `apps/api/src/modules/vocab/vocab.service.ts` — MODIFY

**Blueprint References**:
- Implementation Plan Issue 4

**Detailed LLM Instructions**:
- `vocab.interfaces.ts`: define `interface DictionaryApiResponse`, `interface FreeDictionaryApiResponse`, `interface VocabProvider { lookup(word: string): Promise<NormalizedVocabEntry> }`.
- `NormalizedVocabEntry`: `{ word, phonetic, meanings: { partOfSpeech, definitions: string[] }[] }`.
- `vocab.service.ts`: Implement two provider classes for `VocabProvider`. Primary = DictionaryAPI; fallback = FreeDictionaryAPI. Call primary; on failure, call fallback.
- Do NOT write to DB (current architecture: proxy only).

**Integration Check**:
`GET /api/vocab/lookup?word=economy` returns same structure.

**Verification**:
Mock 500 for DictionaryAPI; verify fallback provider responds correctly.

**PROGRESS.md Update**:
Append this exact text:
```
Task IP-4: Vocab API Separate Interfaces — COMPLETED [ISO timestamp]
Files: packages/types/src/vocab.interfaces.ts, apps/api/src/modules/vocab/vocab.service.ts
Notes: Defined VocabProvider interface; DictionaryAPI primary, FreeDictionaryAPI fallback.
```

### Task IP-5: DB Cleanup + LlmBatch Status Filter

**Goal**: TTL cleanup for PipelineRun/LlmBatch; fix batch route to accept all statuses.

**Target Files**:
- `apps/api/src/pipeline/workers/maintenance.worker.ts` — MODIFY
- `apps/api/src/modules/pipeline/llm-batch.routes.ts` — MODIFY
- `apps/api/src/modules/pipeline/llm-batch.service.ts` — MODIFY

**Blueprint References**:
- Implementation Plan Issue 5

**Detailed LLM Instructions**:
- `maintenance.worker.ts`: in `enforce-ttl-policies`, add Prisma Raw SQL: `DELETE FROM "LlmBatch" WHERE "createdAt" < NOW() - INTERVAL '7 days'`.
- Also add: `DELETE FROM "PipelineRun" WHERE "completedAt" < NOW() - INTERVAL '7 days' AND status != 'RUNNING'`.
- `llm-batch.routes.ts` GET route: add optional Zod filter: `status: z.enum(['PENDING','SENT','AWAITING_MANUAL','COMPLETED','FAILED']).optional()`.
- `llm-batch.service.ts` `getPendingBatches`: accept optional `status` param; use as filter; if omitted, return all statuses.

**Integration Check**:
Admin UI that currently relies on `AWAITING_MANUAL` filter must now pass `?status=AWAITING_MANUAL`.

**Verification**:
`GET /api/pipeline/batches` returns all statuses.

**PROGRESS.md Update**:
Append this exact text:
```
Task IP-5: DB Cleanup + LlmBatch Status Filter — COMPLETED [ISO timestamp]
Files: apps/api/src/pipeline/workers/maintenance.worker.ts, llm-batch.routes.ts, llm-batch.service.ts
Notes: Added TTL for PipelineRun/LlmBatch; GET batch route accepts status filter.
```

### Task IP-6: LLM Batch Route Path Correction + getBatchById

**Goal**: Fix all batch routes to `/api/pipeline/llm-batches`; add GET by ID.

**Target Files**:
- `apps/api/src/modules/pipeline/llm-batch.routes.ts` — MODIFY
- `apps/api/src/modules/pipeline/llm-batch.service.ts` — MODIFY

**Blueprint References**:
- Implementation Plan Issue 6

**Detailed LLM Instructions**:
- Rename route prefixes: `GET /api/pipeline/batches` → `GET /api/pipeline/llm-batches`, and `/:id/prompt`, `/:id/resolve`.
- Add new route: `GET /api/pipeline/llm-batches/:id`; Zod validate `:id`.
- `llm-batch.service.ts`: add `getBatchById(id: string)` → `prisma.llmBatch.findUnique({ where: { id }, include: { pipelineRun: true } })`; throw `NotFoundError` if null.

**Integration Check**:
Old path `/api/pipeline/batches` will now 404.

**Verification**:
`GET /api/pipeline/llm-batches/:validId` returns batch; invalid ID returns 404.

**PROGRESS.md Update**:
Append this exact text:
```
Task IP-6: LLM Batch Route Path Correction + getBatchById — COMPLETED [ISO timestamp]
Files: apps/api/src/modules/pipeline/llm-batch.routes.ts, llm-batch.service.ts
Notes: Renamed routes to /llm-batches; added getBatchById endpoint.
```

### Task 9-1: Prisma Schema — Dedupe Fields

**Goal**: Add dedupe schema fields to Article and create migration.

**Target Files**:
- `packages/db/prisma/schema.prisma` — MODIFY

**Blueprint References**:
- Target Architecture (Cross-Source Deduplication)

**Detailed LLM Instructions**:
- Add `mergedIntoId String?` with self-relation FK, `onDelete: SetNull`.
- Add `alsoCoveredBy String[] @default([])`.
- Add `@@index([mergedIntoId])` and `@@index([status, discoveredAt])`.
- Run `pnpm --filter @repo/db db:migrate dev --name add_dedupe_fields`.

**Integration Check**:
Existing articles get `mergedIntoId = NULL` automatically.

**Verification**:
`db:generate` compiles without error.

**PROGRESS.md Update**:
Append this exact text:
```
Task 9-1: Prisma Schema Dedupe Fields — COMPLETED [ISO timestamp]
Files: packages/db/prisma/schema.prisma
Notes: Added mergedIntoId (self-FK), alsoCoveredBy (String[]), and indexes.
```

### Task 4-5a: Config — Add Slot & Dedupe Env Vars

**Goal**: Add 7 new pipeline config keys with defaults.

**Target Files**:
- `apps/api/src/core/config.ts` — MODIFY

**Blueprint References**:
- Target Architecture (Config)

**Detailed LLM Instructions**:
- Add to Zod schema (optional with defaults): `PROCESS_THRESHOLD_START` (20), `PROCESS_THRESHOLD_REDUCTION` (5), `PROCESS_THRESHOLD_FLOOR` (5), `FORCE_PROCESS_HOUR` (0), `DEDUPE_ENABLED` (true), `DEDUPE_BATCH_SIZE` (30), `DEDUPE_WINDOW_HOURS` (24).

**Integration Check**:
Server boots with defaults if env vars are missing.

**Verification**:
Verify validation logic sets default correctly if empty.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-5a: Config Slot & Dedupe Env Vars — COMPLETED [ISO timestamp]
Files: apps/api/src/core/config.ts
Notes: Added 7 new pipeline scheduling and dedupe config keys.
```

### Task 4-5b: Redis Pool Helpers

**Goal**: Atomic pool drain and threshold read/write utilities.

**Target Files**:
- `apps/api/src/queue/pool-state.ts` — CREATE

**Blueprint References**:
- Target Architecture (Redis State)

**Detailed LLM Instructions**:
- Export `addToPool(articleIds: string[])`, `drainPool(): Promise<string[]>`, `getThreshold(dateKey: string): Promise<number>`, `setThreshold(dateKey: string, value: number): Promise<void>`.
- Use Redis `pipeline:threshold:YYYY-MM-DD` for threshold. Use `RPUSH` for `addToPool`. Use atomic Lua script or multi/exec `LRANGE 0 -1` then `DEL` for `drainPool`.

**Integration Check**:
Does not touch Prisma. Pure Redis.

**Verification**:
Call `addToPool` then `drainPool`; verify it is empty on next read.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-5b: Redis Pool State Helpers — COMPLETED [ISO timestamp]
Files: apps/api/src/queue/pool-state.ts
Notes: Atomic pool drain + day-scoped threshold key management.
```

### Task 4-5c: Slot Lock — Redis NX lock

**Goal**: Acquire/release a Redis slot lock before pipeline trigger.

**Target Files**:
- `apps/api/src/queue/slot-lock.ts` — CREATE

**Blueprint References**:
- Target Architecture (Constraints)

**Detailed LLM Instructions**:
- Export `acquireSlotLock(): Promise<boolean>` (`SET pipeline:slot-running 1 NX EX 1800`).
- Export `releaseSlotLock(): Promise<void>` (`DEL pipeline:slot-running`).

**Integration Check**:
Prevents overlap of runs across 30 mins.

**Verification**:
Acquire lock returns true; acquire again returns false.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-5c: Slot Lock — COMPLETED [ISO timestamp]
Files: apps/api/src/queue/slot-lock.ts
Notes: Redis NX slot lock with 30-min auto-expiry.
```

### Task 4-5d: Slot Scheduler Logic

**Goal**: Core slot decision function.

**Target Files**:
- `apps/api/src/pipeline/slot-scheduler.ts` — CREATE

**Blueprint References**:
- Target Architecture (Scheduling)

**Detailed LLM Instructions**:
- Export `runSlot(hour: number): Promise<void>`.
- `acquireSlotLock()`; if false, return.
- `runDiscoverStage` across all sources; push new IDs to pool (`addToPool`).
- Read pool size and threshold.
- If hour == `FORCE_PROCESS_HOUR` OR pool >= threshold: trigger pipeline, drain pool, reset threshold to `PROCESS_THRESHOLD_START`.
- Else: reduce threshold (clamped to `PROCESS_THRESHOLD_FLOOR`), hold pool.
- Log decision. `releaseSlotLock()` in `finally`.

**Integration Check**:
`triggerPipeline` called safely.

**Verification**:
Dry-run test to verify threshold resets only on condition matching.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-5d: Slot Scheduler Logic — COMPLETED [ISO timestamp]
Files: apps/api/src/pipeline/slot-scheduler.ts
Notes: Core slot decision logic (discover → pool → threshold → trigger).
```

### Task 4-5e: Schedulers — Wire 4 Cron Slots

**Goal**: Replace 4 AM cron with 10, 14, 18, 00 slots.

**Target Files**:
- `apps/api/src/queue/schedulers.ts` — MODIFY
- `apps/api/src/pipeline/workers/maintenance.worker.ts` — MODIFY

**Blueprint References**:
- Target Architecture (Scheduling)

**Detailed LLM Instructions**:
- `schedulers.ts`: Add `slot-10`, `slot-14`, `slot-18`, `slot-00` job schedulers (cron: `0 10 * * *`, etc.) passing `{ hour: N }`.
- Remove `daily-pipeline-scheduler`.
- `maintenance.worker.ts`: handler for `run-pipeline-slot` calls `runSlot(job.data.hour)`.

**Integration Check**:
TTL jobs are preserved.

**Verification**:
`setupSchedulers()` executes cleanly.

**PROGRESS.md Update**:
Append this exact text:
```
Task 4-5e: Schedulers 4-Slot Cron — COMPLETED [ISO timestamp]
Files: apps/api/src/queue/schedulers.ts, apps/api/src/pipeline/workers/maintenance.worker.ts
Notes: Replaced daily cron with 4 specific hour slots calling runSlot.
```

### Task 9-2: Cross-Source Dedupe Stage

**Goal**: Dedupe service that calls LLM and writes merged fields.

**Target Files**:
- `packages/llm-core/src/prompts/cross-source-dedupe.ts` — CREATE
- `apps/api/src/pipeline/stage-dedupe.ts` — CREATE

**Blueprint References**:
- Target Architecture (Cross-Source Deduplication)

**Detailed LLM Instructions**:
- Create prompt template instructing LLM to group articles representing the same story into `{ groupId, articleIndices: number[] }`.
- `stage-dedupe.ts`: fetch articles in `DEDUPE_WINDOW_HOURS` with `mergedIntoId IS NULL` and `status = 'EXTRACTED'`.
- Batch into `DEDUPE_BATCH_SIZE`. Call LLM.
- For each returned group, earliest is primary. Others are updated with `mergedIntoId = primary.id`. Primary is updated with `alsoCoveredBy` list.

**Integration Check**:
Idempotent process that guards with `mergedIntoId IS NULL`.

**Verification**:
Run function on array of mock duplicate articles; verify PRISMA update logic handles the list correctly.

**PROGRESS.md Update**:
Append this exact text:
```
Task 9-2: Cross-Source Dedupe Stage — COMPLETED [ISO timestamp]
Files: packages/llm-core/src/prompts/cross-source-dedupe.ts, apps/api/src/pipeline/stage-dedupe.ts
Notes: LLM batch dedupe logic using Zod validation and self-FK updates.
```

### Task 9-3: Wire Dedupe into Midnight Slot

**Goal**: Execute dedupe at midnight and filter feed from merged articles.

**Target Files**:
- `apps/api/src/pipeline/slot-scheduler.ts` — MODIFY
- `apps/api/src/modules/articles/articles.service.ts` — MODIFY

**Blueprint References**:
- Target Architecture (Cross-Source Deduplication)

**Detailed LLM Instructions**:
- `slot-scheduler.ts`: If `hour === 0` and `config.DEDUPE_ENABLED`, call `runDedupeStage()`. Wrap in try/catch to not crash the slot.
- `articles.service.ts`: Update feed query to `where: { mergedIntoId: null }` and include `alsoCoveredBy` in the select.

**Integration Check**:
Dedupe executes after midnight processing. Feed excludes merged items.

**Verification**:
`GET /api/articles` payload shape contains `alsoCoveredBy: string[]` and drops the duplicates.

**PROGRESS.md Update**:
Append this exact text:
```
Task 9-3: Wire Dedupe into Midnight Slot — COMPLETED [ISO timestamp]
Files: apps/api/src/pipeline/slot-scheduler.ts, apps/api/src/modules/articles/articles.service.ts
Notes: Dedupe execution at hour 0; feed API updated to exclude merged articles.
```

