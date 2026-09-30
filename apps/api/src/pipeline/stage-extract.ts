import { prisma } from '@repo/db';
import { HybridFetchEngine, getParser, ExtractedArticle } from '@repo/scraper-core';
import type { PipelineRunStats, SiteScraperConfig } from '@repo/types';
import { z } from 'zod';
import { NotFoundError, InternalServerError, ValidationError } from '../core/errors.js';

// Import parser implementations to register them
import '@repo/scraper-core/src/parsers/dawn.parser.js';

const STAGE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export async function runExtractStage(pipelineRunId: string): Promise<PipelineRunStats> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new InternalServerError('Extract stage timed out')), STAGE_TIMEOUT_MS);
  });
  
  return Promise.race([
    executeExtractStage(pipelineRunId),
    timeoutPromise
  ]);
}

async function executeExtractStage(pipelineRunId: string): Promise<PipelineRunStats> {
  const articles = await prisma.article.findMany({
    where: { pipelineRunId, status: 'APPROVED' },
    include: { source: true },
  });

  if (articles.length === 0) {
    const pipelineRun = await prisma.pipelineRun.findUnique({
      where: { id: pipelineRunId },
    });
    if (!pipelineRun) {
      throw new NotFoundError(`Pipeline run ${pipelineRunId} not found`);
    }

    await prisma.pipelineRun.update({
      where: { id: pipelineRunId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    const stats = pipelineRun.stats as unknown as PipelineRunStats || { discovered: 0, approved: 0, rejected: 0, extracted: 0, failed: 0 };
    return stats;
  }

  // Set all selected articles to EXTRACTING upfront
  await prisma.article.updateMany({
    where: { id: { in: articles.map(a => a.id) } },
    data: { status: 'EXTRACTING' }
  });

  const engine = new HybridFetchEngine({ engine: 'cheerio' } as unknown as SiteScraperConfig);
  let extractedCount = 0;
  let failedCount = 0;
  const updates: any[] = [];

  for (const article of articles) {
    try {
      const parser = getParser(article.source.domain);
      if (!parser) {
        throw new InternalServerError(`No parser registered for domain ${article.source.domain}`);
      }

      const fetchResult = await engine.fetch(article.url);

      if (fetchResult.statusCode !== 200) {
        throw new InternalServerError(`Failed to fetch article, status code: ${fetchResult.statusCode}`);
      }

      const extracted: ExtractedArticle = parser.extractArticle(fetchResult.html, article.url);

      if (!extracted.content) {
        throw new ValidationError('Required field "content" not found in extraction');
      }

      const fullContent = [extracted.title, extracted.content].join('\n\n');
      const wordCount = fullContent.split(/\s+/).filter((w) => w.length > 0).length;

      const existingData = (typeof article.extractedData === 'object' && article.extractedData !== null) ? article.extractedData : {};
      const extractedData: Record<string, unknown> = {
        ...existingData,
        ...extracted,
        wordCount,
      };

      // Remove the giant content body from JSON payload to save space
      delete extractedData.content;

      const now = new Date();
      const contentExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      const metadataExpiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days

      updates.push(
        prisma.article.update({
          where: { id: article.id },
          data: {
            status: 'EXTRACTED',
            fullContent,
            extractedData: extractedData as unknown as object,
            contentExpiresAt,
            metadataExpiresAt,
            extractedAt: now,
          },
        })
      );

      extractedCount++;
    } catch (error: any) {
      console.error(`[Extract] Failed to extract article`, { 
        pipelineRunId, 
        articleId: article.id, 
        domain: article.source.domain, 
        error: error.message 
      });
      failedCount++;
      updates.push(
        prisma.article.update({
          where: { id: article.id },
          data: { status: 'FAILED' },
        })
      );
    }
  }

  // Execute all accumulated updates in a single transaction
  if (updates.length > 0) {
    // Chunk array if extremely large to prevent payload too large errors
    const chunkSize = 500;
    for (let i = 0; i < updates.length; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize);
      await prisma.$transaction(chunk);
    }
  }

  // Atomic stats update
  const statsSchema = z.object({
    discovered: z.number().optional(),
    approved: z.number().optional(),
    rejected: z.number().optional(),
    extracted: z.number().optional(),
    failed: z.number().optional(),
    deduplicated: z.number().optional(),
  }).passthrough();

  let finalStats: PipelineRunStats;
  await prisma.$transaction(async (tx) => {
    const run = await tx.pipelineRun.findUnique({
      where: { id: pipelineRunId },
      select: { stats: true }
    });
    
    if (!run) {
      throw new NotFoundError(`Pipeline run ${pipelineRunId} not found during stats update`);
    }

    const parsedStats = statsSchema.safeParse(run.stats);
    const currentStats = parsedStats.success ? parsedStats.data : {};

    finalStats = {
      discovered: currentStats.discovered || 0,
      approved: currentStats.approved || 0,
      rejected: currentStats.rejected || 0,
      deduplicated: currentStats.deduplicated || 0,
      extracted: (currentStats.extracted || 0) + extractedCount,
      failed: (currentStats.failed || 0) + failedCount,
    };

    await tx.pipelineRun.update({
      where: { id: pipelineRunId },
      data: {
        stats: finalStats as unknown as object,
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });
  });

  return finalStats!;
}
