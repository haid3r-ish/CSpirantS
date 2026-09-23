## Table of Contents

- [Section 1: Project Overview & Tech Stack](#section-1-project-overview--tech-stack)
- [Section 2: Complete Monorepo Folder Tree](#section-2-complete-monorepo-folder-tree)
- [Section 3: Complete Prisma Schema](#section-3-complete-prisma-schema)
- [Section 4: Core TypeScript Interfaces](#section-4-core-typescript-interfaces)
- [Section 5: BullMQ Queue Configuration](#section-5-bullmq-queue-configuration)
- [Section 6: LLM Module — Full Implementation](#section-6-llm-module--full-implementation)
- [Section 7: HybridFetchEngine with Playwright Stealth](#section-7-hybridfetchengine-with-playwright-stealth)
- [Section 8: Declarative Extractor (scraper-core)](#section-8-declarative-extractor-scraper-core)
- [Section 9: Docker Compose](#section-9-docker-compose)
- [Section 10: PROGRESS.md Template](#section-10-progressmd-template)
- [Section 11: Key Architecture Decisions Summary](#section-11-key-architecture-decisions-summary)

## Section 1: Project Overview & Tech Stack

List the final decided stack:
- Monorepo: Turborepo + pnpm workspaces
- Backend: Node.js 20 + TypeScript 5.6 + Fastify
- Frontend: Vite 6 + React 19 + TypeScript + React Router 7 + Zustand + TanStack Query + Tailwind CSS 4 + shadcn/ui
- Database: PostgreSQL 16 + Prisma ORM
- Cache/Queue: Redis 7 + BullMQ
- Auth: Google OAuth only (via @fastify/oauth2, sessions in PostgreSQL)
- LLM: Gemini 1.5 Flash (primary) + Llama 3.1 via Groq API (secondary) + Manual fallback
- Scraper: got-scraping (Cheerio, primary) + Playwright + playwright-extra + puppeteer-extra-plugin-stealth (fallback)
- Deployment: Docker Compose (single VPS)

## Section 2: Complete Monorepo Folder Tree

```
css-prep-platform/
├── PROGRESS.md
├── docker-compose.yml
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── packages/
│ ├── ts-config/
│ │ ├── package.json
│ │ ├── base.json
│ │ ├── node.json
│ │ └── react.json
│ ├── types/
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── src/
│ │ ├── index.ts
│ │ ├── scraper.types.ts
│ │ ├── llm.types.ts
│ │ ├── pipeline.types.ts
│ │ ├── vocab.types.ts
│ │ ├── auth.types.ts
│ │ └── dashboard.types.ts
│ ├── db/
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── prisma/
│ │ └── schema.prisma
│ │ └── src/
│ │ ├── index.ts
│ │ └── repositories/
│ │ ├── article.repo.ts
│ │ ├── source.repo.ts
│ │ └── llm-batch.repo.ts
│ ├── scraper-core/
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── src/
│ │ ├── index.ts
│ │ ├── engine/
│ │ │ ├── hybrid-fetch.ts
│ │ │ ├── cheerio-adapter.ts
│ │ │ └── playwright-adapter.ts
│ │ ├── extractor/
│ │ │ ├── declarative.ts
│ │ │ ├── json-ld.ts
│ │ │ └── transforms.ts
│ │ └── hasher/
│ │ └── canonical-url.ts
│ └── llm-core/
│ ├── package.json
│ ├── tsconfig.json
│ └── src/
│ ├── index.ts
│ ├── formatter/
│ │ └── pipe-delimited.ts
│ ├── prompts/
│ │ └── css-pms-filter.ts
│ └── providers/
│ ├── base.provider.ts
│ ├── gemini.provider.ts
│ ├── grok.provider.ts
│ └── manual.provider.ts
├── apps/
│ ├── api/
│ │ ├── Dockerfile
│ │ ├── package.json
│ │ ├── tsconfig.json
│ │ └── src/
│ │ ├── index.ts
│ │ ├── core/
│ │ │ ├── server.ts
│ │ │ ├── config.ts
│ │ │ └── error-handler.ts
│ │ ├── queue/
│ │ │ ├── connection.ts
│ │ │ ├── queues.ts
│ │ │ └── schedulers.ts
│ │ ├── pipeline/
│ │ │ ├── orchestrator.ts
│ │ │ ├── stage-discover.ts
│ │ │ ├── stage-evaluate.ts
│ │ │ ├── stage-extract.ts
│ │ │ └── workers/
│ │ │ ├── discover.worker.ts
│ │ │ ├── evaluate.worker.ts
│ │ │ ├── extract.worker.ts
│ │ │ └── maintenance.worker.ts
│ │ └── modules/
│ │ ├── auth/
│ │ │ ├── auth.routes.ts
│ │ │ ├── auth.service.ts
│ │ │ └── auth.middleware.ts
│ │ ├── vocab/
│ │ │ ├── vocab.routes.ts
│ │ │ └── vocab.service.ts
│ │ ├── scraper/
│ │ │ ├── source.routes.ts
│ │ │ └── source.service.ts
│ │ ├── pipeline/
│ │ │ ├── pipeline.routes.ts
│ │ │ ├── pipeline.service.ts
│ │ │ ├── llm-batch.routes.ts
│ │ │ └── llm-batch.service.ts
│ │ └── articles/
│ │ ├── articles.routes.ts
│ │ └── articles.service.ts
│ └── web/
│ ├── Dockerfile
│ ├── package.json
│ ├── tsconfig.json
│ ├── vite.config.ts
│ ├── index.html
│ └── src/
│ ├── main.tsx
│ ├── App.tsx
│ ├── core/
│ │ ├── router.tsx
│ │ ├── providers/
│ │ │ └── index.tsx
│ │ └── layout/
│ │ ├── AppShell.tsx
│ │ ├── Sidebar.tsx
│ │ └── Header.tsx
│ ├── shared/
│ │ └── lib/
│ │ └── api-client.ts
│ └── modules/
│ ├── auth/
│ │ └── pages/
│ │ └── LoginPage.tsx
│ ├── dashboard/
│ │ ├── pages/
│ │ │ └── DashboardPage.tsx
│ │ └── components/
│ │ └── ModuleCard.tsx
│ ├── newspaper/
│ │ ├── pages/
│ │ │ ├── NewsFeed.tsx
│ │ │ └── ArticleView.tsx
│ │ ├── components/
│ │ │ ├── ArticleCard.tsx
│ │ │ └── VocabPopup.tsx
│ │ └── hooks/
│ │ ├── useArticles.ts
│ │ └── useVocabLookup.ts
│ └── admin/
│ ├── pages/
│ │ ├── PipelineAdmin.tsx
│ │ └── BatchAdmin.tsx
│ ├── components/
│ │ ├── PipelineRunCard.tsx
│ │ └── BatchResolveForm.tsx
│ └── hooks/
│ └── usePipeline.ts
```

## Section 3: Complete Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ArticleStatus {
  DISCOVERED
  EVALUATING
  APPROVED
  REJECTED
  EXTRACTING
  EXTRACTED
  FAILED
}

enum PipelineStatus {
  RUNNING
  AWAITING_MANUAL
  COMPLETED
  PARTIAL
  FAILED
}

enum PipelineStage {
  DISCOVER
  EVALUATE
  EXTRACT
  CLEANUP
}

enum LlmBatchMode {
  API
  MANUAL
}

enum LlmBatchStatus {
  PENDING
  SENT
  AWAITING_MANUAL
  COMPLETED
  FAILED
}

enum VocabDifficulty {
  EASY
  MEDIUM
  HARD
}

model User {
  id         String    @id @default(cuid())
  email      String    @unique
  name       String
  googleId   String    @unique
  avatarUrl  String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  sessions   Session[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([expiresAt])
}

model ScraperSource {
  id        String    @id @default(cuid())
  name      String    @unique
  domain    String
  category  String
  config    Json      @db.JsonB
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  articles  Article[]

  @@index([config], type: Gin)
}

model PipelineRun {
  id           String         @id @default(cuid())
  status       PipelineStatus @default(RUNNING)
  currentStage PipelineStage  @default(DISCOVER)
  sourceIds    String[]
  stats        Json           @db.JsonB
  startedAt    DateTime       @default(now())
  completedAt  DateTime?
  error        String?
  articles     Article[]
  llmBatch     LlmBatch?
}

model Article {
  id               String        @id @default(cuid())
  hash             String        @unique
  sourceId         String
  source           ScraperSource @relation(fields: [sourceId], references: [id])
  pipelineRunId    String
  pipelineRun      PipelineRun   @relation(fields: [pipelineRunId], references: [id])
  title            String
  url              String
  description      String?
  category         String?
  status           ArticleStatus @default(DISCOVERED)
  fullContent      String?       @db.Text
  extractedData    Json?         @db.JsonB
  metadataExpiresAt DateTime?
  contentExpiresAt DateTime?
  discoveredAt     DateTime      @default(now())
  evaluatedAt      DateTime?
  extractedAt      DateTime?
  updatedAt        DateTime      @updatedAt

  @@index([pipelineRunId, status])
  @@index([hash])
  @@index([metadataExpiresAt])
  @@index([contentExpiresAt])
  @@index([extractedData], type: Gin)
}

model LlmBatch {
  id               String         @id @default(cuid())
  pipelineRunId    String         @unique
  pipelineRun      PipelineRun    @relation(fields: [pipelineRunId], references: [id])
  mode             LlmBatchMode
  status           LlmBatchStatus @default(PENDING)
  promptCsv        String         @db.Text
  response         String?        @db.Text
  approvedHashes   String[]       @default([])
  promptTokens     Int?
  completionTokens Int?
  estimatedCostUsd Float?
  createdAt        DateTime       @default(now())
  completedAt      DateTime?
}

model VocabEntry {
  id         String          @id @default(cuid())
  word       String          @unique
  definition String          @db.Text
  source     String
  difficulty VocabDifficulty @default(MEDIUM)
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt

  @@index([word])
}
```

## Section 4: Core TypeScript Interfaces

### `packages/types/src/scraper.types.ts`
```typescript
export type ExtractionSource = 'json-ld' | 'meta' | 'css';

export type TransformType =
  | 'trim'
  | 'strip-tags'
  | 'parse-date-iso'
  | 'resolve-url'
  | 'clean-whitespace'
  | 'regex-extract';

export interface TransformRule {
  type: TransformType;
  params?: {
    pattern?: string;
    matchIndex?: number;
    dateFormat?: string;
  };
}

export interface FieldExtractor {
  source: ExtractionSource;
  path: string;
  attribute?: string;
  transforms?: TransformRule[];
  required?: boolean;
  fallbacks?: FieldExtractor[];
}

export interface IndexPageConfig {
  url: string;
  category: string;
  listSelector: string;
  pagination?: {
    type: 'next-button' | 'page-number';
    selector: string;
    maxPages?: number;
  };
}

export interface SiteScraperConfig {
  id: string;
  name: string;
  domain: string;
  engine: 'cheerio' | 'playwright' | 'hybrid';
  discovery: {
    rssFeeds?: string[];
    indexPages?: IndexPageConfig[];
    articleUrlPattern: string;
  };
  // Anti-ban configuration
  rateLimit?: {
    maxRequestsPerMinute: number;
  };
  randomDelayMs?: {
    min: number;
    max: number;
  };
  proxy?: string | string[];
  // Field extraction rules
  indexFields: {
    title: FieldExtractor;
    url: FieldExtractor;
    description?: FieldExtractor;
    imageUrl?: FieldExtractor;
  };
  articleFields: {
    content: FieldExtractor; // Required - becomes fullContent
    [key: string]: FieldExtractor | undefined; // All other fields go into extractedData JSONB
  };
}

export interface DiscoveredArticle {
  hash: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  sourceId: string;
  category: string;
}

export interface ExtractedArticle {
  hash: string;
  fullContent: string;
  extractedData: Record<string, unknown>; // author, publishedAt, imageUrl, wordCount, tags, etc.
}
```

### `packages/types/src/llm.types.ts`
```typescript
export type LlmMode = 'api' | 'manual';
export type LlmProviderType = 'gemini' | 'grok';

export interface LlmConfig {
  provider: LlmProviderType;
  model?: string;
  apiKey: string;
  mode: LlmMode;
  timeoutMs?: number; // default 30000
}

export interface LlmEvaluationItem {
  hash: string;
  title: string;
  description?: string;
}

export interface LlmTokenUsage {
  prompt: number;
  completion: number;
}

export interface LlmEvaluationResult {
  batchId: string;
  mode: LlmMode;
  approvedHashes: string[];
  rejectedHashes: string[];
  rawResponse?: string;
  promptCsv?: string; // Set when mode='manual', contains the full prompt to copy-paste
  tokenUsage?: LlmTokenUsage;
  estimatedCostUsd?: number;
}

export interface ManualPromptOutput {
  batchId: string;
  promptCsv: string; // The full pipe-delimited prompt ready to paste into any LLM
  instructions: string;
  itemCount: number;
}

export interface ILlmProvider {
  readonly providerType: LlmProviderType | 'manual';
  evaluate(items: LlmEvaluationItem[], batchId: string): Promise<LlmEvaluationResult>;
  generateManualPrompt(items: LlmEvaluationItem[], batchId: string): ManualPromptOutput;
}
```

### `packages/types/src/pipeline.types.ts`
```typescript
export enum ArticleStatus {
  DISCOVERED = 'DISCOVERED',
  EVALUATING = 'EVALUATING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXTRACTING = 'EXTRACTING',
  EXTRACTED = 'EXTRACTED',
  FAILED = 'FAILED',
}

export enum PipelineStatus {
  RUNNING = 'RUNNING',
  AWAITING_MANUAL = 'AWAITING_MANUAL',
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
}

export enum PipelineStage {
  DISCOVER = 'DISCOVER',
  EVALUATE = 'EVALUATE',
  EXTRACT = 'EXTRACT',
  CLEANUP = 'CLEANUP',
}

export interface PipelineRunStats {
  discovered: number;
  approved: number;
  rejected: number;
  extracted: number;
  failed: number;
}

export interface TtlPolicy {
  metadataRetentionDays: number; // Default 30
  contentRetentionDays: number; // Default 7
  rejectedRetentionDays: number; // Default 1
}
```

### `packages/types/src/vocab.types.ts`
```typescript
export enum VocabDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface VocabEntry {
  id: string;
  word: string;
  definition: string;
  source: string;
  difficulty: VocabDifficulty;
  createdAt: Date;
  updatedAt: Date;
}

export interface VocabLookupResult {
  word: string;
  definition: string;
  difficulty: VocabDifficulty;
  source: string;
  cached: boolean; // true if from DB, false if freshly fetched
}
```

### `packages/types/src/auth.types.ts`
```typescript
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
```

### `packages/types/src/dashboard.types.ts`
```typescript
export type ModuleStatus = 'active' | 'coming-soon';

export interface DashboardModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  status: ModuleStatus;
  color: string; // Tailwind color class e.g. 'blue', 'green'
}

// The 8 planned modules — export this constant
export const DASHBOARD_MODULES: DashboardModule[] = [
  { id: 'newspaper', name: 'Daily Newspaper', description: 'Read CSS-relevant news filtered by AI', icon: '📰', route: '/news', status: 'active', color: 'blue' },
  { id: 'mcq', name: 'MCQ Engine', description: 'Practice multiple choice questions offline', icon: '📝', route: '/mcq', status: 'coming-soon', color: 'green' },
  { id: 'vocabulary', name: 'Vocabulary Tracker', description: 'Track and memorize difficult words', icon: '📖', route: '/vocabulary', status: 'coming-soon', color: 'purple' },
  { id: 'quote-vault', name: 'Quote & Data Vault', description: 'Memorize quotes with spaced repetition', icon: '💎', route: '/quotes', status: 'coming-soon', color: 'amber' },
  { id: 'timeline', name: 'Current Affairs Timeline', description: 'Visual timeline of current events', icon: '📅', route: '/timeline', status: 'coming-soon', color: 'red' },
  { id: 'whos-who', name: "Who's Who Tracker", description: 'Key officials and appointments directory', icon: '👤', route: '/whos-who', status: 'coming-soon', color: 'teal' },
  { id: 'data-dashboard', name: 'Pakistan Data Dashboard', description: 'Key statistics with sparkline trends', icon: '📊', route: '/data', status: 'coming-soon', color: 'indigo' },
  { id: 'important-days', name: 'Important Days & Dates', description: 'Calendar of nationally observed days', icon: '🗓️', route: '/dates', status: 'coming-soon', color: 'rose' },
];
```

### `packages/types/src/index.ts`
```typescript
export * from './scraper.types.js';
export * from './llm.types.js';
export * from './pipeline.types.js';
export * from './vocab.types.js';
export * from './auth.types.js';
export * from './dashboard.types.js';
```

## Section 5: BullMQ Queue Configuration

### `apps/api/src/queue/connection.ts`
```typescript
import IORedis from 'ioredis';
import { config } from '../core/config.js';

// CRITICAL: maxRetriesPerRequest must be null for BullMQ blocking commands
export const redisConnection = new IORedis(config.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

export async function connectRedis(): Promise<void> {
  await redisConnection.connect();
  console.log('[Redis] Connected successfully');
}
```

### `apps/api/src/queue/queues.ts`
```typescript
import { Queue } from 'bullmq';
import { redisConnection } from './connection.js';

export const discoverQueue = new Queue('pipeline-discover', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { age: 86400, count: 500 },
    removeOnFail: { age: 604800 },
  },
});

export const evaluateQueue = new Queue('pipeline-evaluate', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: 'exponential', delay: 10000 },
    removeOnComplete: { age: 86400, count: 100 },
    removeOnFail: { age: 604800 },
  },
});

export const extractQueue = new Queue('pipeline-extract', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: { age: 86400, count: 500 },
    removeOnFail: { age: 604800 },
  },
});

export const maintenanceQueue = new Queue('maintenance', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'fixed', delay: 5000 },
    removeOnComplete: { age: 86400, count: 50 },
    removeOnFail: { age: 604800 },
  },
});
```

### `apps/api/src/pipeline/orchestrator.ts`
```typescript
import { FlowProducer } from 'bullmq';
import { redisConnection } from '../queue/connection.js';
import { discoverQueue } from '../queue/queues.js';
import { prisma } from '@repo/db';

export interface TriggerPipelineOptions {
  manual?: boolean; // If true, skip LLM evaluation — go straight to AWAITING_MANUAL
}

export async function triggerPipeline(
  sourceIds: string[],
  pipelineRunId: string,
  options: TriggerPipelineOptions = {}
): Promise<void> {
  if (options.manual) {
    // Manual mode: only run discover stage, then pause for human input
    // Create discover jobs but no evaluate/extract flow
    const flow = new FlowProducer({ connection: redisConnection });
    // We still discover articles but skip evaluate — pipeline will await manual resolution
    for (const sourceId of sourceIds) {
      await discoverQueue.add(`discover-${sourceId}`, { pipelineRunId, sourceId, skipEvaluate: true });
    }
    await prisma.pipelineRun.update({
      where: { id: pipelineRunId },
      data: { status: 'AWAITING_MANUAL', currentStage: 'DISCOVER' },
    });
    return;
  }

  // Automatic mode: full FlowProducer pipeline
  // extract (parent) → evaluate (child) → discover[] (grandchildren)
  const flow = new FlowProducer({ connection: redisConnection });

  await flow.add({
    name: 'stage-extract',
    queueName: 'pipeline-extract',
    data: { pipelineRunId },
    children: [
      {
        name: 'stage-evaluate',
        queueName: 'pipeline-evaluate',
        data: { pipelineRunId },
        children: sourceIds.map((sourceId) => ({
          name: `discover-${sourceId}`,
          queueName: 'pipeline-discover',
          data: { pipelineRunId, sourceId },
          opts: {
            attempts: 3,
            backoff: { type: 'exponential' as const, delay: 5000 },
          },
        })),
      },
    ],
  });
}
```

## Section 6: LLM Module — Full Implementation

### `packages/llm-core/src/prompts/css-pms-filter.ts`
```typescript
export const CSS_PMS_SYSTEM_PROMPT = `You are an automated content relevance classifier for CSS/PMS (Civil Services) exam preparation in Pakistan.

TASK: Evaluate each news article and determine if it is relevant to CSS/PMS exam preparation.

APPROVE articles about:
- National and international politics, governance, democracy
- Economy and finance (GDP, trade, IMF, SBP, budget, fiscal/monetary policy, inflation)
- Editorials and opinion pieces (analytical writing on policy, society, governance)
- International relations (diplomacy, treaties, bilateral relations, conflicts)
- Constitutional and legal developments in Pakistan
- Science and technology policy (AI regulation, space, nuclear)
- Social issues relevant to policy (education, health, demographics, gender)
- Environment and climate change policy
- Military affairs and national security (strategic level, not tactical crime)
- Regional affairs (South Asia, Middle East, China, US relations with Pakistan)

REJECT articles about:
- Sports (cricket, football, etc.) unless about policy/funding
- Entertainment, celebrities, film, music
- Crime and police reports (unless it is a high-level political/policy crime)
- Weather reports and natural disaster updates (unless policy response)
- Lifestyle, food, fashion, travel
- Obituaries (unless a major political figure)
- Advertisements or sponsored content
- Stock market price tickers (unless broader economic analysis)

INPUT FORMAT:
One article per line: hash|title|description

OUTPUT FORMAT:
Respond with ONLY a comma-separated list of hashes of the APPROVED articles.
Do NOT include any explanation, reasoning, markdown formatting, code blocks, or extra text.
Example output: a1b2c3d4e5f60001,a1b2c3d4e5f60002,a1b2c3d4e5f60003

If no articles are relevant, respond with: NONE`;
```

### `packages/llm-core/src/formatter/pipe-delimited.ts`
```typescript
import type { LlmEvaluationItem, ManualPromptOutput } from '@repo/types';
import { CSS_PMS_SYSTEM_PROMPT } from '../prompts/css-pms-filter.js';

/** Replace pipe characters in user text to prevent column corruption */
function sanitize(text: string): string {
  return text.replace(/\|/g, '-').replace(/\n/g, ' ').trim();
}

/**
 * Format evaluation items into pipe-delimited payload.
 * Format: hash|title|description (one per line)
 * URLs are EXCLUDED — zero LLM value, massive token waste.
 */
export function formatBatchPayload(items: LlmEvaluationItem[]): string {
  return items
    .map((item) => {
      const title = sanitize(item.title);
      const desc = sanitize(item.description ?? '');
      return `${item.hash}|${title}|${desc}`;
    })
    .join('\n');
}

/**
 * Parse LLM response back into approved hash array.
 * Handles various response formats gracefully.
 * Only accepts valid 16-char hex strings.
 */
export function parseApprovedHashes(llmResponse: string): string[] {
  if (!llmResponse || llmResponse.trim().toUpperCase() === 'NONE') {
    return [];
  }

  // Strip markdown code blocks if LLM adds them despite instructions
  const cleaned = llmResponse
    .replace(/```[a-z]*\n?/g, '')
    .replace(/```/g, '')
    .replace(/\n/g, ',') // treat newlines as separators too
    .trim();

  return cleaned
    .split(',')
    .map((h) => h.trim())
    .filter((h) => /^[a-f0-9]{16}$/i.test(h));
}

/**
 * Generate the full manual prompt for admin copy-paste.
 */
export function generateManualPromptOutput(
  batchId: string,
  items: LlmEvaluationItem[]
): ManualPromptOutput {
  const payload = formatBatchPayload(items);
  const promptCsv = `${CSS_PMS_SYSTEM_PROMPT}\n\n---\n\n${payload}`;

  const instructions = [
    '1. Copy the entire prompt below (including the system instructions above the --- separator).',
    '2. Paste it into any LLM (ChatGPT, Claude, Gemini, etc.).',
    '3. Copy the comma-separated hash response from the LLM.',
    `4. Go to Admin > Batch Management in the app, find Batch ID: ${batchId}`,
    '5. Paste the hashes into the "Approved Hashes" field and click "Resume Pipeline".',
    `6. Or call: POST /api/pipeline/batches/${batchId}/resolve with body { "approvedHashes": ["hash1","hash2"] }`,
  ].join('\n');

  return {
    batchId,
    promptCsv,
    instructions,
    itemCount: items.length,
  };
}
```

### `packages/llm-core/src/providers/base.provider.ts`
```typescript
import type {
  ILlmProvider,
  LlmConfig,
  LlmEvaluationItem,
  LlmEvaluationResult,
  LlmProviderType,
  ManualPromptOutput,
} from '@repo/types';
import { formatBatchPayload, parseApprovedHashes, generateManualPromptOutput } from '../formatter/pipe-delimited.js';
import { CSS_PMS_SYSTEM_PROMPT } from '../prompts/css-pms-filter.js';

export abstract class BaseLlmProvider implements ILlmProvider {
  abstract readonly providerType: LlmProviderType | 'manual';

  constructor(protected readonly config: LlmConfig) {}

  protected buildSystemPrompt(): string {
    return CSS_PMS_SYSTEM_PROMPT;
  }

  protected formatPayload(items: LlmEvaluationItem[]): string {
    return formatBatchPayload(items);
  }

  protected parseResponse(raw: string): string[] {
    return parseApprovedHashes(raw);
  }

  /**
   * Abstract: each provider implements their own API call.
   * Returns raw text response and optional token usage.
   */
  protected abstract callApi(
    userPayload: string,
    systemPrompt: string
  ): Promise<{ text: string; usage?: { prompt: number; completion: number } }>;

  generateManualPrompt(items: LlmEvaluationItem[], batchId: string): ManualPromptOutput {
    return generateManualPromptOutput(batchId, items);
  }

  async evaluate(items: LlmEvaluationItem[], batchId: string): Promise<LlmEvaluationResult> {
    const systemPrompt = this.buildSystemPrompt();
    const userPayload = this.formatPayload(items);
    const allHashes = items.map((i) => i.hash);

    try {
      // Apply timeout wrapper
      const timeoutMs = this.config.timeoutMs ?? 30000;
      const apiCallWithTimeout = Promise.race([
        this.callApi(userPayload, systemPrompt),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`LLM API timeout after ${timeoutMs}ms`)), timeoutMs)
        ),
      ]);

      const { text, usage } = await apiCallWithTimeout;
      const approvedHashes = this.parseResponse(text);
      const rejectedHashes = allHashes.filter((h) => !approvedHashes.includes(h));

      return {
        batchId,
        mode: 'api',
        approvedHashes,
        rejectedHashes,
        rawResponse: text,
        tokenUsage: usage,
        estimatedCostUsd: undefined, // Calculated per-provider if needed
      };
    } catch (error) {
      // FAIL-SAFE: Any error → automatic switch to manual mode
      console.error(`[LLM] API call failed for batch ${batchId}, switching to manual mode:`, error);
      const manualOutput = this.generateManualPrompt(items, batchId);

      return {
        batchId,
        mode: 'manual',
        approvedHashes: [],
        rejectedHashes: [],
        promptCsv: manualOutput.promptCsv,
        rawResponse: manualOutput.promptCsv,
      };
    }
  }
}
```

### `packages/llm-core/src/providers/gemini.provider.ts`
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LlmConfig } from '@repo/types';
import { BaseLlmProvider } from './base.provider.js';

export class GeminiProvider extends BaseLlmProvider {
  readonly providerType = 'gemini' as const;
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName: string;

  constructor(config: LlmConfig) {
    super(config);
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.modelName = config.model ?? 'gemini-1.5-flash';
  }

  protected async callApi(
    userPayload: string,
    systemPrompt: string
  ): Promise<{ text: string; usage?: { prompt: number; completion: number } }> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPayload);
    const response = result.response;
    const text = response.text();
    const usageMeta = response.usageMetadata;

    return {
      text,
      usage: usageMeta
        ? {
            prompt: usageMeta.promptTokenCount ?? 0,
            completion: usageMeta.candidatesTokenCount ?? 0,
          }
        : undefined,
    };
  }
}
```

### `packages/llm-core/src/providers/grok.provider.ts`
```typescript
import Groq from 'groq-sdk';
import type { LlmConfig } from '@repo/types';
import { BaseLlmProvider } from './base.provider.js';

export class GrokProvider extends BaseLlmProvider {
  readonly providerType = 'grok' as const;
  private readonly groq: Groq;
  private readonly modelName: string;

  constructor(config: LlmConfig) {
    super(config);
    this.groq = new Groq({ apiKey: config.apiKey });
    this.modelName = config.model ?? 'llama-3.1-8b-instant';
  }

  protected async callApi(
    userPayload: string,
    systemPrompt: string
  ): Promise<{ text: string; usage?: { prompt: number; completion: number } }> {
    const completion = await this.groq.chat.completions.create({
      model: this.modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPayload },
      ],
      temperature: 0.1, // Low temperature for deterministic classification
      max_tokens: 500, // Hashes only — output is short
    });

    const text = completion.choices[0]?.message?.content ?? '';
    const usage = completion.usage;

    return {
      text,
      usage: usage
        ? {
            prompt: usage.prompt_tokens,
            completion: usage.completion_tokens,
          }
        : undefined,
    };
  }
}
```

### `packages/llm-core/src/providers/manual.provider.ts`
```typescript
import type {
  ILlmProvider,
  LlmConfig,
  LlmEvaluationItem,
  LlmEvaluationResult,
  ManualPromptOutput,
} from '@repo/types';
import { generateManualPromptOutput } from '../formatter/pipe-delimited.js';
import { CSS_PMS_SYSTEM_PROMPT } from '../prompts/css-pms-filter.js';

/**
 * ManualProvider never calls any external API.
 * It generates the formatted prompt and signals the pipeline
 * to pause and await human input.
 */
export class ManualProvider implements ILlmProvider {
  readonly providerType = 'manual' as const;

  constructor(private readonly _config?: LlmConfig) {}

  generateManualPrompt(items: LlmEvaluationItem[], batchId: string): ManualPromptOutput {
    return generateManualPromptOutput(batchId, items);
  }

  async evaluate(items: LlmEvaluationItem[], batchId: string): Promise<LlmEvaluationResult> {
    const manualOutput = this.generateManualPrompt(items, batchId);

    // Return mode='manual' with empty approvedHashes.
    // The evaluate worker will detect mode='manual' and:
    // 1. Store promptCsv in LlmBatch.promptCsv
    // 2. Set PipelineRun.status = AWAITING_MANUAL
    // 3. Stop the pipeline — it will be resumed via API when admin pastes hashes
    return {
      batchId,
      mode: 'manual',
      approvedHashes: [],
      rejectedHashes: [],
      promptCsv: manualOutput.promptCsv,
      rawResponse: manualOutput.promptCsv,
    };
  }
}
```

### `packages/llm-core/src/index.ts`
```typescript
export { GeminiProvider } from './providers/gemini.provider.js';
export { GrokProvider } from './providers/grok.provider.js';
export { ManualProvider } from './providers/manual.provider.js';
export { formatBatchPayload, parseApprovedHashes, generateManualPromptOutput } from './formatter/pipe-delimited.js';
export { CSS_PMS_SYSTEM_PROMPT } from './prompts/css-pms-filter.js';

import type { ILlmProvider, LlmConfig } from '@repo/types';
import { GeminiProvider } from './providers/gemini.provider.js';
import { GrokProvider } from './providers/grok.provider.js';
import { ManualProvider } from './providers/manual.provider.js';

export class LlmProviderFactory {
  static create(config: LlmConfig): ILlmProvider {
    // If mode is explicitly set to manual, always use ManualProvider
    if (config.mode === 'manual') {
      return new ManualProvider(config);
    }

    switch (config.provider) {
      case 'gemini':
        return new GeminiProvider(config);
      case 'grok':
        return new GrokProvider(config);
      default:
        throw new Error(`Unknown LLM provider: ${config.provider}`);
    }
  }
}
```

## Section 7: HybridFetchEngine with Playwright Stealth

### `packages/scraper-core/src/engine/cheerio-adapter.ts`
```typescript
import { gotScraping } from 'got-scraping';
import type { SiteScraperConfig } from '@repo/types';

export interface CheerioFetchResult {
  html: string;
  statusCode: number;
}

export async function fetchWithCheerio(
  url: string,
  config: SiteScraperConfig
): Promise<CheerioFetchResult> {
  // Apply random delay if configured
  if (config.randomDelayMs) {
    const { min, max } = config.randomDelayMs;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const response = await gotScraping({
    url,
    timeout: { request: 15000 },
    headers: {
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  return { html: response.body, statusCode: response.statusCode };
}

export function isCloudflareBlocked(html: string, statusCode: number): boolean {
  if (statusCode === 403 || statusCode === 503) return true;
  if (html.includes('Just a moment') && html.includes('challenge-platform')) return true;
  if (html.includes('cf-browser-verification')) return true;
  return false;
}
```

### `packages/scraper-core/src/engine/playwright-adapter.ts`
```typescript
import { chromium, type Browser, type BrowserContext } from 'playwright';
import type { SiteScraperConfig } from '@repo/types';

// Use playwright-extra with stealth plugin for anti-bot evasion
// NOTE: At runtime, import playwright-extra dynamically to avoid ESM issues
let browser: Browser | null = null;

async function getBrowser(proxy?: string): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    // Dynamically import playwright-extra and stealth plugin
    const { chromium: chromiumExtra } = await import('playwright-extra');
    const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
    chromiumExtra.use(StealthPlugin());

    const launchOptions: Parameters<typeof chromiumExtra.launch>[0] = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    };

    if (proxy) {
      launchOptions.proxy = { server: proxy };
    }

    browser = await chromiumExtra.launch(launchOptions);
  }
  return browser;
}

export async function fetchWithPlaywright(
  url: string,
  config: SiteScraperConfig
): Promise<{ html: string; statusCode: number }> {
  // Apply random delay
  if (config.randomDelayMs) {
    const { min, max } = config.randomDelayMs;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Resolve proxy — if array, pick randomly
  let proxy: string | undefined;
  if (config.proxy) {
    proxy = Array.isArray(config.proxy)
      ? config.proxy[Math.floor(Math.random() * config.proxy.length)]
      : config.proxy;
  }

  const browserInstance = await getBrowser(proxy);
  const context: BrowserContext = await browserInstance.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    // Block unnecessary resources to maximize speed
    await page.route('**/*.{png,jpg,jpeg,gif,webp,svg,css,woff,woff2,ttf,eot,mp4,mp3}', (route) =>
      route.abort()
    );
    await page.route('**/{analytics,tracking,ads,doubleclick}**', (route) => route.abort());

    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 25000,
    });

    const html = await page.content();
    return { html, statusCode: response?.status() ?? 200 };
  } finally {
    await page.close();
    await context.close();
  }
}

export async function closePlaywrightBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
```

### `packages/scraper-core/src/engine/hybrid-fetch.ts`
```typescript
import type { SiteScraperConfig } from '@repo/types';
import { fetchWithCheerio, isCloudflareBlocked } from './cheerio-adapter.js';
import { fetchWithPlaywright } from './playwright-adapter.js';

export type FetchEngineUsed = 'cheerio' | 'playwright';

export interface HybridFetchResult {
  html: string;
  statusCode: number;
  engineUsed: FetchEngineUsed;
}

export class HybridFetchEngine {
  constructor(private readonly config: SiteScraperConfig) {}

  async fetch(url: string): Promise<HybridFetchResult> {
    // Force Playwright if config specifies it
    if (this.config.engine === 'playwright') {
      const result = await fetchWithPlaywright(url, this.config);
      return { ...result, engineUsed: 'playwright' };
    }

    // Try Cheerio first (fast, lightweight)
    try {
      const result = await fetchWithCheerio(url, this.config);

      if (!isCloudflareBlocked(result.html, result.statusCode)) {
        return { ...result, engineUsed: 'cheerio' };
      }

      // Cloudflare detected — fall through to Playwright
      console.warn(`[Scraper] Cloudflare detected on ${url}, switching to Playwright`);
    } catch (err) {
      console.warn(`[Scraper] Cheerio fetch failed for ${url}:`, err);
    }

    // Playwright fallback
    const result = await fetchWithPlaywright(url, this.config);
    return { ...result, engineUsed: 'playwright' };
  }
}
```

### `packages/scraper-core/src/hasher/canonical-url.ts`
```typescript
import { createHash } from 'node:crypto';

const TRACKING_PARAMS = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'ref', 'source', 'mc_cid', 'mc_eid',
]);

/**
 * Generate a stable 16-char hex hash from a URL.
 * Strips tracking params, normalizes scheme/www/trailing slash.
 * Collision-safe for < 10 million articles (64-bit hash space).
 */
export function generateArticleHash(rawUrl: string): string {
  const url = new URL(rawUrl);

  // Remove fragment
  url.hash = '';

  // Strip tracking parameters
  for (const param of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.has(param)) {
      url.searchParams.delete(param);
    }
  }

  // Sort remaining params for consistent ordering
  url.searchParams.sort();

  // Normalize host: lowercase, remove www.
  const host = url.hostname.toLowerCase().replace(/^www\./, '');

  // Normalize path: remove trailing slash
  const path = url.pathname.replace(/\/+$/, '');

  // Normalize search
  const search = url.searchParams.size > 0 ? `?${url.searchParams.toString()}` : '';

  const normalized = `${url.protocol}//${host}${path}${search}`;
  return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}
```

## Section 8: Declarative Extractor (scraper-core)

### `packages/scraper-core/src/extractor/json-ld.ts`
```typescript
import type { CheerioAPI } from 'cheerio';

const ARTICLE_TYPES = new Set(['NewsArticle', 'Article', 'ReportageNewsArticle', 'BlogPosting']);

/**
 * Parse JSON-LD from page HTML.
 * Returns the first NewsArticle/Article object found.
 */
export function parseJsonLd($: CheerioAPI): Record<string, unknown> | null {
  const scripts = $('script[type="application/ld+json"]').toArray();

  for (const script of scripts) {
    try {
      const raw = $(script).html();
      if (!raw) continue;

      const parsed: unknown = JSON.parse(raw);

      // Handle @graph arrays
      if (parsed && typeof parsed === 'object' && '@graph' in parsed) {
        const graph = (parsed as Record<string, unknown>)['@graph'];
        if (Array.isArray(graph)) {
          const article = graph.find(
            (item): item is Record<string, unknown> =>
              typeof item === 'object' &&
              item !== null &&
              '@type' in item &&
              ARTICLE_TYPES.has((item as Record<string, unknown>)['@type'] as string)
          );
          if (article) return article;
        }
      }

      // Handle direct objects
      if (
        parsed &&
        typeof parsed === 'object' &&
        '@type' in parsed &&
        ARTICLE_TYPES.has((parsed as Record<string, unknown>)['@type'] as string)
      ) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      continue;
    }
  }

  return null;
}

/** Access nested JSON-LD field via dot-notation path */
export function getJsonLdField(
  jsonLd: Record<string, unknown>,
  path: string
): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && !Array.isArray(acc)) {
      return (acc as Record<string, unknown>)[key];
    }
    // Handle array index access (e.g. 'author.0.name')
    if (Array.isArray(acc) && /^\d+$/.test(key)) {
      return acc[parseInt(key, 10)];
    }
    return undefined;
  }, jsonLd);
}
```

### `packages/scraper-core/src/extractor/transforms.ts`
```typescript
import type { TransformRule } from '@repo/types';

export function applyTransforms(
  value: string,
  transforms: TransformRule[] = [],
  pageUrl: string
): string {
  let result = value;

  for (const transform of transforms) {
    switch (transform.type) {
      case 'trim':
        result = result.trim();
        break;

      case 'clean-whitespace':
        result = result
          .replace(/[ \t]+/g, ' ')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        break;

      case 'strip-tags':
        result = result.replace(/<[^>]*>?/gm, '');
        break;

      case 'parse-date-iso':
        try {
          result = new Date(result).toISOString();
        } catch {
          // Keep original if parsing fails
        }
        break;

      case 'resolve-url':
        try {
          result = new URL(result, pageUrl).toString();
        } catch {
          // Keep original if resolution fails
        }
        break;

      case 'regex-extract': {
        const pattern = transform.params?.pattern;
        const matchIndex = transform.params?.matchIndex ?? 1;
        if (pattern) {
          try {
            const match = result.match(new RegExp(pattern));
            if (match && match[matchIndex] !== undefined) {
              result = match[matchIndex];
            }
          } catch {
            // Keep original if regex fails
          }
        }
        break;
      }
    }
  }

  return result;
}
```

### `packages/scraper-core/src/extractor/declarative.ts`
```typescript
import * as cheerio from 'cheerio';
import type { FieldExtractor, SiteScraperConfig } from '@repo/types';
import { parseJsonLd, getJsonLdField } from './json-ld.js';
import { applyTransforms } from './transforms.js';

export class DeclarativeExtractor {
  /**
   * Extract all fields defined in config from HTML.
   * Returns a plain object with field names as keys.
   * content field → goes to fullContent
   * all other fields → go to extractedData JSONB
   */
  static extract(
    html: string,
    url: string,
    fieldConfig: Record<string, FieldExtractor | undefined>
  ): Record<string, unknown> {
    const $ = cheerio.load(html);
    const jsonLd = parseJsonLd($);
    const result: Record<string, unknown> = {};

    for (const [fieldName, extractor] of Object.entries(fieldConfig)) {
      if (!extractor) continue;

      try {
        const value = DeclarativeExtractor.resolveField($, jsonLd, extractor, url);
        if (value !== null && value !== undefined && value !== '') {
          result[fieldName] = value;
        } else if (extractor.required) {
          throw new Error(
            `Required field '${fieldName}' could not be extracted from ${url}`
          );
        }
      } catch (err) {
        if (extractor.required) throw err;
        // Optional fields silently fail
      }
    }

    return result;
  }

  private static resolveField(
    $: cheerio.CheerioAPI,
    jsonLd: Record<string, unknown> | null,
    extractor: FieldExtractor,
    url: string
  ): unknown {
    const raw = DeclarativeExtractor.extractRaw($, jsonLd, extractor, url);

    if (raw !== null && raw !== undefined && raw !== '') {
      if (typeof raw === 'string') {
        return applyTransforms(raw, extractor.transforms, url);
      }
      return raw;
    }

    // Try fallbacks in order
    if (extractor.fallbacks) {
      for (const fallback of extractor.fallbacks) {
        const fallbackVal = DeclarativeExtractor.resolveField($, jsonLd, fallback, url);
        if (fallbackVal !== null && fallbackVal !== undefined && fallbackVal !== '') {
          return fallbackVal;
        }
      }
    }

    return null;
  }

  private static extractRaw(
    $: cheerio.CheerioAPI,
    jsonLd: Record<string, unknown> | null,
    extractor: FieldExtractor,
    url: string
  ): unknown {
    switch (extractor.source) {
      case 'json-ld': {
        if (!jsonLd) return null;
        return getJsonLdField(jsonLd, extractor.path) ?? null;
      }

      case 'meta': {
        const content = $(
          `meta[property="${extractor.path}"], meta[name="${extractor.path}"]`
        ).attr('content');
        return content ?? null;
      }

      case 'css': {
        const selection = $(extractor.path);
        if (selection.length === 0) return null;

        if (extractor.attribute) {
          return selection.first().attr(extractor.attribute) ?? null;
        }

        // If multiple elements (e.g. <p> tags for article body), join them
        if (selection.length > 1) {
          const texts = selection
            .map((_, el) => $(el).text())
            .get()
            .filter((t) => t.trim().length > 0);
          return texts.join('\n\n');
        }

        return selection.first().text() ?? null;
      }

      default:
        return null;
    }
  }
}
```

## Section 9: Docker Compose

```yaml
version: '3.9'

networks:
  css-prep-net:
    driver: bridge

volumes:
  postgres_data:
  redis_data:

services:
  postgres:
    image: postgres:16-alpine
    container_name: css-prep-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-cssuser}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-csspassword}
      POSTGRES_DB: ${POSTGRES_DB:-cssdb}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - css-prep-net
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER:-cssuser} -d ${POSTGRES_DB:-cssdb}']
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    image: redis:7-alpine
    container_name: css-prep-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - css-prep-net
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: css-prep-api
    restart: unless-stopped
    ports:
      - '3001:3001'
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://${POSTGRES_USER:-cssuser}:${POSTGRES_PASSWORD:-csspassword}@postgres:5432/${POSTGRES_DB:-cssdb}
      REDIS_URL: redis://redis:6379
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GOOGLE_CALLBACK_URL: ${GOOGLE_CALLBACK_URL:-http://localhost:3001/auth/google/callback}
      SESSION_SECRET: ${SESSION_SECRET}
      GEMINI_API_KEY: ${GEMINI_API_KEY:-}
      GROQ_API_KEY: ${GROQ_API_KEY:-}
      LLM_PROVIDER: ${LLM_PROVIDER:-gemini}
      LLM_MODE: ${LLM_MODE:-api}
      FRONTEND_URL: ${FRONTEND_URL:-http://localhost:3000}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - css-prep-net

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: css-prep-web
    restart: unless-stopped
    ports:
      - '3000:80'
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:3001}
    depends_on:
      - api
    networks:
      - css-prep-net
```

## Section 10: PROGRESS.md Template

```markdown
# CSS/PMS Exam Platform — Build Progress

**Project**: CSS/PMS Web Application  
**Architecture**: Turborepo Monorepo | Fastify API | Vite React SPA | PostgreSQL | Redis/BullMQ  
**Started**: [DATE]
**Current Phase**: Not Started

---

## Current Task

> **Task**: None — Start with Task 0-1  
> **Status**: 🔴 Not Started  
> **Blocker**: None

---

## Completed Tasks

| Task ID | Task Name | Completed At | Files Created/Modified |
|---------|-----------|-------------|------------------------|
| — | — | — | — |

---

## File Registry

> List of ALL files created so far.

| File Path | Status | Created In Task |
|-----------|--------|-----------------|
| — | — | — |

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

---

## Known Issues / Blockers

> None yet.

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
```

## Section 11: Key Architecture Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Vite React SPA (not Next.js) | Zero-reload requirement for offline File System Access API |
| Pipe-delimited LLM payload | 73% output token savings vs JSON |
| Manual LLM fallback | Cost control + fail-safe for API limits |
| JSONB for extractedData | Dynamic scraper fields without schema migrations |
| Cheerio primary + Playwright stealth fallback | Speed + anti-bot for Dawn.com |
| Google OAuth only | Simplicity for MVP |
