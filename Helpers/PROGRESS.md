# CSpirantS — Build Progress

**Project**: CSpirantS Web Application  
**Architecture**: Turborepo Monorepo | Fastify API | Vite React SPA | PostgreSQL | Redis/BullMQ  
**Started**: 2026-09-08
**Current Phase**: Task 4-2 Completed

---

<!--
## ⚠️ AI INSTRUCTIONS: How to Update This File

When a task is completed, you MUST update this file in **TWO** locations:

1. **`## Completed Tasks` Table (Sorted)**
   - Insert a new row for the task in the markdown table at the top of this document.
   - You MUST ensure the table remains strictly sorted by **Task ID** (e.g., `0-2` before `0-2a`, `2-3a` before `2-3b`).

2. **Chronological Execution Timeline (Bottom of File)**
   - Append the detailed completion block (Task ID, Files, Notes) to the **very end** of this document.
   - Do NOT sort this bottom section by Task ID. This section serves as an execution log and must remain strictly in the chronological order that tasks were actually completed.

3. **`## File Registry` Table**
   - You MUST add an entry to the File Registry for every file affected by a task.
   - Sort the File Registry primarily by Task ID.
   - The Status column must explicitly state `Created`, `Modified`, or `Deleted`. Do not just assume "Created" if you are changing an existing file.

4. **`## Future Suggestions & Technical Debt` Table**
   - If a feature is deferred, an architectural shortcut is taken, or a future enhancement is discussed with the user, log it in this table.
   - Ensure you provide a clear description and the specific task where it was discussed so it can be easily referenced later.

5. **`## Git Commit Registry` Table**
   - When tasks are committed and pushed to GitHub, log the Task ID, Commit Message, and Push Status in this table.
-->

## Current Task

> **Task**: Start with Task 6-1
> **Status**: 🔴 Not Started  
> **Blocker**: None

---

## Completed Tasks

| Task ID | Task Name | Completed At | Files Created/Modified |
|---------|-----------|-------------|------------------------|
| 0-1 | Initialize Turborepo Monorepo | 2026-09-08 | package.json, pnpm-workspace.yaml, turbo.json, packages/ts-config/* |
| 0-2 | Initialize @repo/db (Prisma) | 2026-09-09 | packages/db/* |
| 0-2a | Prisma Schema Pivot Migrations | 2026-09-14 | packages/db/prisma/schema.prisma |
| 0-3 | Initialize @repo/types | 2026-09-09 | packages/types/* |
| 0-4 | Docker Compose & Environment Files | 2026-09-09 | docker-compose.yml, .env.example, apps/api/.env.example |
| 1-1 | Fastify Server Setup | 2026-09-09 | apps/api/* |
| 1-2 | Google OAuth & Session Auth | 2026-09-09 | apps/api/src/modules/auth/* |
| 1-3 | Redis & BullMQ Setup | 2026-09-09 | apps/api/src/queue/*, apps/api/src/pipeline/* |
| 1-4a | Schema & Types Cleanup (Vocab) | 2026-09-09 | packages/db/prisma/schema.prisma, packages/types/src/vocab.types.ts |
| 1-4b | Vocabulary Proxy API | 2026-09-09 | apps/api/src/modules/vocab/* |
| 1-5 | Scraper Source CRUD API | 2026-09-09 | apps/api/src/modules/scraper/* |
| 1-5a | Scraper Source CRUD Config Field Removal | 2026-09-19 | apps/api/src/modules/scraper/source.routes.ts, source.service.ts |
| 2-1 | @repo/scraper-core Package Init & URL Hasher | 2026-09-09 | packages/scraper-core/* |
| 2-2 | JSON-LD Parser & Field Transforms | 2026-09-09 | packages/scraper-core/src/extractor/* |
| 2-3 | Declarative Extractor | 2026-09-09 | packages/scraper-core/src/extractor/declarative.ts |
| 2-3a | @repo/scraper-core Base Parser & Registry | 2026-09-14 | packages/scraper-core/src/parsers/base.parser.ts, parsers/index.ts |
| 2-3b | Dawn News Parser Implementation | 2026-09-18 | packages/scraper-core/src/parsers/dawn.parser.ts |
| 2-4 | HybridFetchEngine with Playwright Stealth | 2026-09-09 | packages/scraper-core/src/engine/* |
| 3-1 | @repo/llm-core Package Init & Formatter | 2026-09-09 | packages/llm-core/* |
| 3-2 | Base Provider & Gemini Provider | 2026-09-09 | packages/llm-core/src/providers/* |
| 3-2a | Environment-driven LLM Model Configuration | 2026-09-22 | packages/types/src/llm.types.ts, apps/api/src/core/config.ts, apps/api/src/pipeline/stage-evaluate.ts, packages/llm-core/src/providers/gemini.provider.ts |
| 3-3 | Prerequisite (Mini): Factory + Manual Provider | 2026-09-09 | packages/llm-core/src/providers/factory.ts, manual.provider.ts |
| 4-1 | Stage 1 — Discover Worker | 2026-09-09 | apps/api/src/pipeline/stage-discover.ts, apps/api/src/pipeline/workers/discover.worker.ts |
| 4-1a | Stage 1 Discover — Code-First Parser Integration | 2026-09-19 | apps/api/src/pipeline/stage-discover.ts |
| 4-2 | Stage 2 — Evaluate Worker | 2026-09-09 | apps/api/src/pipeline/stage-evaluate.ts, apps/api/src/pipeline/workers/evaluate.worker.ts |
| 4-3 | Stage 3 — Extract Worker | 2026-09-10 | apps/api/src/pipeline/stage-extract.ts, extract.worker.ts |
| 4-3a | Stage 3 Extract — Code-First Parser Integration | 2026-09-19 | apps/api/src/pipeline/stage-extract.ts |
| 4-3b | Fix PipelineRun Status Stuck in RUNNING | 2026-09-23 | apps/api/src/pipeline/stage-extract.ts |
| 4-4 | Maintenance Worker & Cron Schedulers | 2026-09-10 | apps/api/src/queue/schedulers.ts, apps/api/src/pipeline/workers/maintenance.worker.ts |
| 5-1 | Pipeline Trigger & Status API | 2026-09-22 | apps/api/src/modules/pipeline/pipeline.* |
| 5-1a | Patch: Fix Pipeline Trigger API | 2026-09-22 | apps/api/src/modules/pipeline/pipeline.service.ts |
| 5-2 | Manual LLM Batch Resolution API | 2026-09-22 | apps/api/src/modules/pipeline/llm-batch.* |
| 5-3 | Articles Public API | 2026-09-22 | apps/api/src/modules/articles/* |
| 1-1a | Global Error Handler Overhaul | 2026-09-25 | apps/api/src/core/errors.ts, error-handler.ts, etc. |
| 2-3c | Dawn Parser Date Guard | 2026-09-25 | packages/scraper-core/src/parsers/errors.ts, etc. |
| 4-4a | Fix: TTL Cleanup Schedule & Init | 2026-09-25 | apps/api/src/queue/schedulers.ts, apps/api/src/index.ts |
| IP-4 | Vocab API Separate Interfaces | 2026-09-26 | packages/types/src/vocab.interfaces.ts, apps/api/src/modules/vocab/vocab.service.ts, packages/types/src/index.ts |
| IP-4a | Vocab API Unified Schema & Fallback Priority | 2026-09-26 | packages/types/src/vocab.interfaces.ts, apps/api/src/modules/vocab/vocab.service.ts |
| IP-4b | Vocab API Schema Decoupling | 2026-09-26 | apps/api/src/modules/vocab/vocab.service.ts |
| IP-5 | DB Cleanup + LlmBatch Status Filter | 2026-09-26 | apps/api/src/pipeline/workers/maintenance.worker.ts, apps/api/src/modules/pipeline/llm-batch.routes.ts, apps/api/src/modules/pipeline/llm-batch.service.ts |
| IP-6 | LLM Batch Route Path Correction + getBatchById | 2026-09-26 | apps/api/src/modules/pipeline/llm-batch.routes.ts, apps/api/src/modules/pipeline/llm-batch.service.ts |
| 9-1 | Prisma Schema — Dedupe Fields | 2026-09-26 | packages/db/prisma/schema.prisma |
| 4-5a | Config — Add Slot & Dedupe Env Vars | 2026-09-26 | apps/api/src/core/config.ts |

---

## Git Commit Registry

> Remote Repository: [haid3r-ish/CSpirantS](https://github.com/haid3r-ish/CSpirantS)  
> Target Branch: `main`  
> Last Pushed: 2026-09-26  

| Task ID | Task Name | Commit Message | Push Status |
|---------|-----------|----------------|-------------|
| 0-1 | Initialize Turborepo Monorepo | `feat(task-0-1): Initialize Turborepo Monorepo` | ✅ Pushed |
| 0-2 | Initialize @repo/db (Prisma) | `feat(task-0-2): Initialize @repo/db (Prisma)` | ✅ Pushed |
| 0-3 | Initialize @repo/types | `feat(task-0-3): Initialize @repo/types` | ✅ Pushed |
| 0-4 | Docker Compose & Environment Files | `feat(task-0-4): Docker Compose & Environment Files` | ✅ Pushed |
| 1-1 | Fastify Server Setup | `feat(task-1-1): Fastify Server Setup` | ✅ Pushed |
| 1-2 | Google OAuth & Session Auth | `feat(task-1-2): Google OAuth & Session Auth` | ✅ Pushed |
| 1-3 | Redis & BullMQ Setup | `feat(task-1-3): Redis & BullMQ Setup` | ✅ Pushed |
| 1-4b | Vocabulary Proxy API | `feat(task-1-4b): Vocabulary Proxy API` | ✅ Pushed |
| 1-5 | Scraper Source CRUD API | `feat(task-1-5): Scraper Source CRUD API` | ✅ Pushed |
| 1-1a | Global Error Handler Overhaul | `feat(task-1-1a): Global Error Handler Overhaul` | ✅ Pushed |
| 2-1 | @repo/scraper-core Package Init & URL Hasher | `feat(task-2-1): @repo/scraper-core Package Init & URL Hasher` | ✅ Pushed |
| 2-2 | JSON-LD Parser & Field Transforms | `feat(task-2-2): JSON-LD Parser & Field Transforms` | ✅ Pushed |
| 2-3 | Declarative Extractor | `feat(task-2-3): Declarative Extractor` | ✅ Pushed |
| 2-3a | @repo/scraper-core Base Parser & Registry | `feat(task-2-3a): @repo/scraper-core Base Parser & Registry` | ✅ Pushed |
| 2-3b | Dawn News Parser Implementation | `feat(task-2-3b): Dawn News Parser Implementation` | ✅ Pushed |
| 2-3c | Dawn Parser Date Guard | `feat(task-2-3c): Dawn Parser Date Guard` | ✅ Pushed |
| 2-4 | HybridFetchEngine with Playwright Stealth | `feat(task-2-4): HybridFetchEngine with Playwright Stealth` | ✅ Pushed |
| 4-4a | Fix: TTL Cleanup Schedule & Init | `fix(task-4-4a): Run TTL cleanup after 1min & call setupSchedulers` | ✅ Pushed |
| IP-4 | Vocab API Separate Interfaces | `feat(task-IP-4): Vocab API Separate Interfaces` | ✅ Pushed |
| IP-4b | Vocab API Schema Decoupling | `refactor(task-IP-4b): decouple vocab api schemas and remove phonetics` | ✅ Pushed |
| IP-5 | DB Cleanup + LlmBatch Status Filter | `feat(task-IP-5): db cleanup and llmbatch status filter` | ✅ Pushed |
| IP-6 | LLM Batch Route Path Correction + getBatchById | `feat(task-IP-6): LLM Batch Route Path Correction and getBatchById` | ✅ Pushed |
| 9-1 | Prisma Schema — Dedupe Fields | `feat(task-9-1): Prisma Schema Dedupe Fields` | ✅ Pushed |
| 4-5a | Config — Add Slot & Dedupe Env Vars | `feat(task-4-5a): Config Slot and Dedupe Env Vars` | ✅ Pushed |

---

## File Registry

> List of ALL files created/modified so far.

| File Path | Status | Task |
|-----------|--------|------|
| package.json | Created | 0-1 |
| pnpm-workspace.yaml | Created | 0-1 |
| turbo.json | Created | 0-1 |
| packages/ts-config/package.json | Created | 0-1 |
| packages/ts-config/base.json | Created | 0-1 |
| packages/ts-config/node.json | Created | 0-1 |
| packages/ts-config/react.json | Created | 0-1 |
| packages/db/package.json | Created | 0-2 |
| packages/db/tsconfig.json | Created | 0-2 |
| packages/db/prisma/schema.prisma | Created | 0-2 |
| packages/db/src/index.ts | Created | 0-2 |
| packages/db/src/index.ts | Modified | Dev-Config |
| packages/db/prisma/schema.prisma | Modified | 0-2a |
| packages/types/package.json | Created | 0-3 |
| packages/types/tsconfig.json | Created | 0-3 |
| packages/types/src/scraper.types.ts | Created | 0-3 |
| packages/types/src/llm.types.ts | Created | 0-3 |
| packages/types/src/pipeline.types.ts | Created | 0-3 |
| packages/types/src/vocab.types.ts | Created | 0-3 |
| packages/types/src/auth.types.ts | Created | 0-3 |
| packages/types/src/dashboard.types.ts | Created | 0-3 |
| packages/types/src/index.ts | Created | 0-3 |
| docker-compose.yml | Created | 0-4 |
| .env.example | Created | 0-4 |
| apps/api/.env.example | Created | 0-4 |
| apps/api/package.json | Created | 1-1 |
| apps/api/tsconfig.json | Created | 1-1 |
| apps/api/src/core/config.ts | Created | 1-1 |
| apps/api/src/core/error-handler.ts | Created | 1-1 |
| apps/api/src/core/server.ts | Created | 1-1 |
| apps/api/src/index.ts | Created | 1-1 |
| apps/api/src/types.d.ts | Created | 1-2 |
| apps/api/src/modules/auth/auth.service.ts | Created | 1-2 |
| apps/api/src/modules/auth/auth.middleware.ts | Created | 1-2 |
| apps/api/src/modules/auth/auth.routes.ts | Created | 1-2 |
| apps/api/src/queue/connection.ts | Created | 1-3 |
| apps/api/src/queue/queues.ts | Created | 1-3 |
| apps/api/src/pipeline/orchestrator.ts | Created | 1-3 |
| packages/db/prisma/schema.prisma | Modified | 1-4a |
| packages/types/src/vocab.types.ts | Modified | 1-4a |
| apps/api/src/modules/vocab/vocab.service.ts | Created | 1-4b |
| apps/api/src/modules/vocab/vocab.routes.ts | Created | 1-4b |
| apps/api/src/modules/vocab/vocab.service.ts | Modified | 1-4c |
| apps/api/src/modules/vocab/vocab.service.test.ts | Created | 1-4c |
| apps/api/src/modules/scraper/source.service.ts | Created | 1-5 |
| apps/api/src/modules/scraper/source.routes.ts | Created | 1-5 |
| apps/api/src/modules/scraper/source.routes.ts | Modified | 1-5a |
| apps/api/src/modules/scraper/source.service.ts | Modified | 1-5a |
| packages/scraper-core/package.json | Created | 2-1 |
| packages/scraper-core/tsconfig.json | Created | 2-1 |
| packages/scraper-core/src/hasher/canonical-url.ts | Created | 2-1 |
| packages/scraper-core/src/index.ts | Created | 2-1 |
| packages/scraper-core/src/extractor/json-ld.ts | Created | 2-2 |
| packages/scraper-core/src/extractor/transforms.ts | Created | 2-2 |
| packages/scraper-core/src/extractor/declarative.ts | Created | 2-3 |
| packages/scraper-core/src/parsers/base.parser.ts | Created | 2-3a |
| packages/scraper-core/src/parsers/index.ts | Created | 2-3a |
| packages/scraper-core/src/index.ts | Modified | 2-3a |
| packages/scraper-core/src/parsers/dawn.parser.ts | Created | 2-3b |
| packages/scraper-core/src/engine/cheerio-adapter.ts | Created | 2-4 |
| packages/scraper-core/src/engine/playwright-adapter.ts | Created | 2-4 |
| packages/scraper-core/src/engine/hybrid-fetch.ts | Created | 2-4 |
| packages/llm-core/package.json | Created | 3-1 |
| packages/llm-core/tsconfig.json | Created | 3-1 |
| packages/llm-core/src/prompts/css-pms-filter.ts | Created | 3-1 |
| packages/llm-core/src/formatter/pipe-delimited.ts | Created | 3-1 |
| packages/llm-core/src/providers/base.provider.ts | Created | 3-2 |
| packages/llm-core/src/providers/gemini.provider.ts | Created | 3-2 |
| packages/llm-core/src/providers/gemini.provider.ts | Modified | 3-2a |
| packages/types/src/llm.types.ts | Modified | 3-2a |
| apps/api/src/core/config.ts | Modified | 3-2a |
| apps/api/src/pipeline/stage-evaluate.ts | Modified | 3-2a |
| packages/llm-core/src/index.ts | Created | 3-2 |
| packages/llm-core/src/providers/manual.provider.ts | Created | 3-3 |
| packages/llm-core/src/providers/factory.ts | Created | 3-3 |
| apps/api/src/pipeline/stage-discover.ts | Created | 4-1 |
| apps/api/src/pipeline/workers/discover.worker.ts | Created | 4-1 |
| apps/api/src/pipeline/stage-discover.ts | Modified | 4-1a |
| apps/api/src/pipeline/stage-evaluate.ts | Created | 4-2 |
| apps/api/src/pipeline/workers/evaluate.worker.ts | Created | 4-2 |
| apps/api/src/pipeline/stage-extract.ts | Created | 4-3 |
| apps/api/src/pipeline/workers/extract.worker.ts | Created | 4-3 |
| apps/api/src/pipeline/stage-extract.ts | Modified | 4-3a |
| apps/api/src/pipeline/stage-extract.ts | Modified | 4-3b |
| apps/api/src/queue/schedulers.ts | Created | 4-4 |
| apps/api/src/pipeline/workers/maintenance.worker.ts | Created | 4-4 |
| apps/api/src/modules/pipeline/pipeline.routes.ts | Created | 5-1 |
| apps/api/src/modules/pipeline/pipeline.service.ts | Created | 5-1 |
| apps/api/src/modules/pipeline/pipeline.service.ts | Modified | 5-1a |
| apps/api/src/core/server.ts | Modified | 5-1 |
| apps/api/src/modules/pipeline/llm-batch.routes.ts | Created | 5-2 |
| apps/api/src/modules/pipeline/llm-batch.service.ts | Created | 5-2 |
| apps/api/src/core/server.ts | Modified | 5-2 |
| apps/api/src/modules/articles/articles.routes.ts | Created | 5-3 |
| apps/api/src/modules/articles/articles.service.ts | Created | 5-3 |
| apps/api/src/core/server.ts | Modified | 5-3 |
| apps/api/src/core/errors.ts | Created | 1-1a |
| packages/scraper-core/src/parsers/errors.ts | Created | 2-3c |
| apps/api/src/queue/schedulers.ts | Modified | 4-4a |
| apps/api/src/index.ts | Modified | 4-4a |
| packages/types/src/vocab.interfaces.ts | Created | IP-4 |
| apps/api/src/modules/vocab/vocab.service.ts | Modified | IP-4 |
| packages/types/src/index.ts | Modified | IP-4 |
| packages/types/src/vocab.interfaces.ts | Modified | IP-4a |
| apps/api/src/modules/vocab/vocab.service.ts | Modified | IP-4a |
| apps/api/src/modules/vocab/vocab.service.ts | Modified | IP-4b |
| apps/api/src/pipeline/workers/maintenance.worker.ts | Modified | IP-5 |
| apps/api/src/modules/pipeline/llm-batch.routes.ts | Modified | IP-5 |
| apps/api/src/modules/pipeline/llm-batch.service.ts | Modified | IP-5 |
| apps/api/src/modules/pipeline/llm-batch.routes.ts | Modified | IP-6 |
| apps/api/src/modules/pipeline/llm-batch.service.ts | Modified | IP-6 |
| packages/db/prisma/schema.prisma | Modified | 9-1 |
| apps/api/src/core/config.ts | Modified | 4-5a |
---

## Architecture Decisions Log

| Decision | Rationale | Date |
|----------|-----------|------|
| Vite React SPA (not Next.js) | Zero-reload requirement for offline File System Access API | — |
| Pipe-delimited LLM payload | 73% output token savings vs JSON | — |
| Manual LLM fallback | Cost control + fail-safe for API limits | — |
| JSONB for extractedData | Dynamic scraper fields without schema migrations | — |
| Cheerio primary + Playwright stealth fallback | Speed + anti-bot for Dawn.com | — |
| Google OAuth only | Simplicity for MVP | — |
| Vocab via proxy + IndexedDB (not DB) | Zero backend cost, fully offline, no schema migrations needed | 2026-09-09 |

---

## Known Issues / Blockers

- **Task 8-1**: Must register the new proxy `vocab.routes.ts` instead of the old DB-writing route when wiring up all routes.

---

## Environment Variables Checklist

- [ ] DATABASE_URL
- [ ] REDIS_URL
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] GOOGLE_CALLBACK_URL
- [ ] SESSION_SECRET
- [ ] GEMINI_API_KEY
- [ ] GROQ_API_KEY
- [ ] LLM_PROVIDER (gemini | grok)
- [ ] LLM_MODE (api | manual)
- [ ] FRONTEND_URL
- [ ] VITE_API_URL

Task 0-1: Initialize Turborepo Monorepo — COMPLETED 2026-09-08T23:51:00Z
Files: package.json, pnpm-workspace.yaml, turbo.json, packages/ts-config/*
Notes: Created monorepo structure and typescript configs.

Task 0-2: Initialize @repo/db (Prisma) — COMPLETED 2026-09-09T00:27:00Z
Files: packages/db/*
Notes: Initialized Prisma schema and database package.

Task 0-3: Initialize @repo/types — COMPLETED 2026-09-09T00:36:00Z
Files: packages/types/*
Notes: Created shared typescript definitions.

Task 0-4: Docker Compose & Environment Files — COMPLETED 2026-09-09T00:43:00Z
Files: docker-compose.yml, .env.example, apps/api/.env.example
Notes: Set up docker services and environment variables.

Task 1-1: Fastify Server Setup — COMPLETED 2026-09-09T00:54:00Z
Files: apps/api/*
Notes: Configured base Fastify server and environment validation.

Task 1-2: Google OAuth & Session Auth — COMPLETED 2026-09-09T01:18:00Z
Files: apps/api/src/modules/auth/*
Notes: Implemented Google OAuth and session management.

Task 1-3: Redis & BullMQ Setup — COMPLETED 2026-09-09T01:45:00Z
Files: apps/api/src/queue/*, apps/api/src/pipeline/orchestrator.ts
Notes: Initialized Redis connections and BullMQ queues.

Task 1-4a: Schema & Types Cleanup (Vocab) — COMPLETED 2026-09-09T02:44:00Z
Files: packages/db/prisma/schema.prisma, packages/types/src/vocab.types.ts
Notes: Removed VocabEntry model and updated vocab types for proxy approach.

Task 1-4b: Vocabulary Proxy API — COMPLETED 2026-09-09T02:54:00Z
Files: apps/api/src/modules/vocab/*
Notes: Implemented vocabulary dictionary proxy. No DB writes. Routes through englishdictionaryapi.com.

Task 1-4c: Vocab Proxy — Fallback Provider Pattern & Adapters — COMPLETED 2026-09-10T18:22:00Z
Files: apps/api/src/modules/vocab/vocab.service.ts, vocab.service.test.ts
Notes: Refactored vocab proxy with 2-provider fallback chain. englishdictionaryapi.com (primary) → dictionaryapi.dev (fallback). Per-adapter Zod schemas. Route and shared types unchanged.

Task 1-5: Scraper Source CRUD API — COMPLETED 2026-09-09T15:03:00Z
Files: apps/api/src/modules/scraper/*
Notes: Built CRUD for scraper sources.

Task 2-1: @repo/scraper-core Package Init & URL Hasher — COMPLETED 2026-09-09T15:18:00Z
Files: packages/scraper-core/*
Notes: Created scraper package and URL hash logic.

Task 2-2: JSON-LD Parser & Field Transforms — COMPLETED 2026-09-09T15:28:00Z
Files: packages/scraper-core/src/extractor/json-ld.ts, transforms.ts
Notes: Added JSON-LD parsing and text transformation functions.

Task 2-3: Declarative Extractor — COMPLETED 2026-09-09T15:33:00Z
Files: packages/scraper-core/src/extractor/declarative.ts
Notes: Built the core declarative extraction engine.

Task 2-4: HybridFetchEngine with Playwright Stealth — COMPLETED 2026-09-09T15:38:00Z
Files: packages/scraper-core/src/engine/*
Notes: Built hybrid fetch engine with Cheerio and Playwright stealth.

Task 3-1: @repo/llm-core Package Init & Formatter — COMPLETED 2026-09-09T17:10:00Z
Files: packages/llm-core/*
Notes: Initialized LLM package with prompt and payload formatters.

Task 3-2: Base Provider & Gemini Provider — COMPLETED 2026-09-09T18:22:00Z
Files: packages/llm-core/src/providers/*
Notes: Built LLM providers using @google/genai SDK.

Task 4-1: Stage 1 — Discover Worker — COMPLETED 2026-09-09T18:48:00Z
Files: apps/api/src/pipeline/stage-discover.ts, discover.worker.ts
Notes: Built discovery worker.

Task 4-1 Audit Fixes Applied: Centralized Redis connection in discover worker, registered worker in server boot, and added graceful try/catch error handling to article creation loop.

Task 3-3 (Mini): Factory + Manual Provider � COMPLETED 2026-09-09T23:22:24
Files: packages/llm-core/src/providers/factory.ts, manual.provider.ts
Notes: Built missing LLM factory and manual provider.

Task 4-2: Stage 2: Evaluate Worker � COMPLETED 2026-09-09T23:54:00Z
Files: apps/api/src/pipeline/stage-evaluate.ts, evaluate.worker.ts
Notes: Built evaluate worker.

Phase 0 Audit Completed: Applied global rules, fixed imports, and verified cross-task integration.

Phase 1 Audit Completed: Applied global rules, fixed imports, removed all explicit any typings, added Zod schema validation to external vocab API, and verified cross-task integration.

Phase 2 Audit Completed: Applied global rules, strictly typed catch blocks with unknown, and verified cross-task integration.



Phase 3 Audit Completed: Applied global rules, strictly typed catch block with unknown, and verified cross-task integration.


Task 4-3: Stage 3 — Extract Worker — COMPLETED 2026-09-10T12:10:39.976Z
Files: apps/api/src/pipeline/stage-extract.ts, extract.worker.ts
Notes: Built full-content extraction worker.


Task 4-4: Maintenance Worker & Cron Schedulers — COMPLETED 2026-09-10T12:37:21.057Z
Files: apps/api/src/queue/schedulers.ts, maintenance.worker.ts
Notes: Added background maintenance and cron schedulers.

Task 0-2a: Prisma Schema Pivot Migrations — COMPLETED 2026-09-14T22:35:00Z
Files: packages/db/prisma/schema.prisma
Notes: Removed config JSONB from ScraperSource.

Task 2-3a: @repo/scraper-core Base Parser & Registry — COMPLETED 2026-09-14T22:45:00Z
Files: packages/scraper-core/src/parsers/base.parser.ts, parsers/index.ts
Notes: Established code-first parser base class and domain registry.

Task 2-3b: Dawn News Parser Implementation — COMPLETED 2026-09-18T23:17:00Z
Files: packages/scraper-core/src/parsers/dawn.parser.ts
Notes: Implemented code-first Dawn News parser with discovery and extraction, adapted from manual script to use Cheerio.

Task 4-1a: Stage 1 Discover — Code-First Parser Integration — COMPLETED 2026-09-19T11:35:00Z
Files: apps/api/src/pipeline/stage-discover.ts
Notes: Replaced JSON config discovery with code-first parser classes.

Task 4-3a: Stage 3 Extract — Code-First Parser Integration — COMPLETED 2026-09-19T11:44:00Z
Files: apps/api/src/pipeline/stage-extract.ts
Notes: Replaced JSON declarative extraction with code-first parser classes.

Task 1-5a: Scraper Source CRUD Config Field Removal — COMPLETED 2026-09-19T21:30:00Z
Files: apps/api/src/modules/scraper/source.routes.ts, apps/api/src/modules/scraper/source.service.ts
Notes: Removed config JSONB field and category from CRUD in line with code-first parser pivot.

Task 5-1: Pipeline Trigger & Status API — COMPLETED 2026-09-22T11:20:28Z
Files: apps/api/src/modules/pipeline/pipeline.*
Notes: Created pipeline execution API and registered routes.

Task 5-2: Manual LLM Batch Resolution API — COMPLETED 2026-09-22T21:42:00Z
Files: apps/api/src/modules/pipeline/llm-batch.*
Notes: Added API to manually resolve LLM batches.

Task 5-3: Articles Public API — COMPLETED 2026-09-22T21:51:26Z
Files: apps/api/src/modules/articles/*
Notes: Exposed extracted articles via API.

Task 5-1a: Patch: Fix Pipeline Trigger API — COMPLETED 2026-09-22T22:56:00Z
Files: apps/api/src/modules/pipeline/pipeline.service.ts
Notes: Fixed `triggerPipelineRun` missing `sourceIds` and `stats` fields when creating `PipelineRun`. Removed `manual` flag from `triggerPipeline` call to ensure the pipeline correctly queues the `Evaluate` stage to generate `LlmBatch` records.

Task 3-2a: Environment-driven LLM Model Configuration — COMPLETED 2026-09-22T23:59:20Z
Files: packages/types/src/llm.types.ts, apps/api/src/core/config.ts, apps/api/src/pipeline/stage-evaluate.ts, packages/llm-core/src/providers/gemini.provider.ts
Notes: Added support for `LLM_MODEL` env var and updated default Gemini model to `gemini-3.6-flash`.

Task Dev-Config: Mute Prisma Query Logs — COMPLETED 2026-09-23T00:12:00Z
Files: packages/db/src/index.ts
Notes: Muted verbose SQL query logs in development mode to clean up the console.

Task 4-3b: Fix PipelineRun Status Stuck in RUNNING — COMPLETED 2026-09-23T23:35:00Z
Files: apps/api/src/pipeline/stage-extract.ts (modified)
Notes: Added status: COMPLETED and completedAt to the final pipelineRun.update call in runExtractStage.

Task 1-1a: Global Error Handler Overhaul — COMPLETED 2026-09-25T13:38:00Z
Files: apps/api/src/core/errors.ts (created), error-handler.ts (modified), server.ts (modified), pipeline.routes.ts (modified), llm-batch.routes.ts (modified), articles.routes.ts (modified), articles.service.ts (modified), source.routes.ts (modified), vocab.routes.ts (modified)
Notes: Centralized error handling. Removed try/catch anti-pattern from all route files. Added NotFoundHandler and AppError hierarchy.
  - *Sub-task 1-1a.1 (Service & Auth Patch)*: Updated `auth.middleware.ts`, `auth.routes.ts`, `pipeline.service.ts`, and `llm-batch.service.ts` to replace manual `reply.status(401)` and generic `throw new Error()` calls with specific `AppError` subclasses.

Task 2-3c: Dawn Parser Date Guard — COMPLETED 2026-09-25T14:38:00Z
Files: packages/scraper-core/src/parsers/errors.ts (created), base.parser.ts (modified), dawn.parser.ts (modified), scraper-core/src/index.ts (modified), apps/api/src/pipeline/stage-discover.ts (modified)
Notes: Added StaleDataError and verifyPageDate mechanism to BaseSiteParser. Dawn parser now calls verifyPageDate() at start of discoverLinks. stage-discover.ts extracts targetDate from the pipeline run and passes it through. Stale pages are gracefully skipped.

Task 4-4a: Fix: TTL Cleanup Schedule & Init — COMPLETED 2026-09-25T17:19:00Z
Files: apps/api/src/queue/schedulers.ts, apps/api/src/index.ts
Notes: Setup a 1-minute delayed job in schedulers.ts for 'enforce-ttl-policies' so that it runs right after the server starts, in addition to its normal 2 AM schedule. Also, imported and called setupSchedulers() in index.ts to ensure schedulers are actually initialized when the server starts.
---

## Future Suggestions & Technical Debt

> Log of architectural suggestions, planned refactors, and technical debt to be addressed in future updates or modules.

| Area / Component | Description | Recommended Implementation | Discussed In Task | Status |
|------------------|-------------|----------------------------|-------------------|--------|
| **Scraper Core** | Dynamic Date Param for Parsers | Modify `BaseSiteParser.getIndexUrls(options?: { targetDate?: string })` so that historical backfill scripts can inject custom dates without altering the automated daily pipeline. | Task 2-3b | 🟡 Deferred (Next Priority) |
| **Pipeline API** | Historical Backfill Endpoint | Add an endpoint to add a job for a specific date (depends on Dynamic Date Param feature). | Future | 🟡 Deferred |
| **Pipeline API** | Single Article Scrape Endpoint | Add an endpoint which basically scrapes a particular article on demand. | Future | 🟡 Deferred |

---

Task IP-4: Vocab API Separate Interfaces — COMPLETED 2026-09-26T08:55:00Z
Files: packages/types/src/vocab.interfaces.ts, apps/api/src/modules/vocab/vocab.service.ts, packages/types/src/index.ts
Notes: Defined VocabProvider interface; DictionaryAPI primary, FreeDictionaryAPI fallback.

Task IP-4a: Vocab API Unified Schema & Fallback Priority — COMPLETED 2026-09-26T09:30:00Z
Files: packages/types/src/vocab.interfaces.ts, apps/api/src/modules/vocab/vocab.service.ts
Notes: Refactored Vocab API to use a unified shared schema that accurately matches the payload. Updated NormalizedVocabEntry to include forms and complex examples. Re-prioritized FreeDictionaryAPI as the primary provider with separate helper adapters.

Task IP-4b: Vocab API Schema Decoupling — COMPLETED 2026-09-26T09:41:00Z
Files: apps/api/src/modules/vocab/vocab.service.ts
Notes: Duplicated the unified Zod schema into two independent schemas (freeDictSchema and englishDictSchema) for each provider. This completely decouples the providers, ensuring that if one API changes its payload shape, it will not break the validation for the other.

Task IP-5: DB Cleanup + LlmBatch Status Filter — COMPLETED 2026-09-26T17:21:00Z
Files: apps/api/src/pipeline/workers/maintenance.worker.ts, apps/api/src/modules/pipeline/llm-batch.routes.ts, apps/api/src/modules/pipeline/llm-batch.service.ts
Notes: Added raw Prisma SQL TTL for PipelineRun and LlmBatch to delete records older than 7 days; GET batch route updated to accept optional Zod status filter.

Task IP-6: LLM Batch Route Path Correction + getBatchById — COMPLETED 2026-09-26T17:30:00Z
Files: apps/api/src/modules/pipeline/llm-batch.routes.ts, apps/api/src/modules/pipeline/llm-batch.service.ts
Notes: Renamed routes to /llm-batches; added getBatchById endpoint.

Task 9-1: Prisma Schema — Dedupe Fields — COMPLETED 2026-09-26T17:35:00Z
Files: packages/db/prisma/schema.prisma
Notes: Added mergedIntoId (self-FK), alsoCoveredBy (String[]), and indexes for Cross-Source Deduplication. Could not execute db:migrate because DB was down, but db:generate compiled cleanly.

Task 4-5a: Config Slot & Dedupe Env Vars — COMPLETED 2026-09-26T17:53:00Z
Files: apps/api/src/core/config.ts
Notes: Added 7 new pipeline scheduling and dedupe config keys.