import { prisma } from '@repo/db';
import { HybridFetchEngine, getParser, ExtractedArticle } from '@repo/scraper-core';
import type { PipelineRunStats, SiteScraperConfig } from '@repo/types';

// Import parser implementations to register them
import '@repo/scraper-core/src/parsers/dawn.parser.js';

export async function runExtractStage(pipelineRunId: string): Promise<PipelineRunStats> {
  const articles = await prisma.article.findMany({
    where: { pipelineRunId, status: 'APPROVED' },
    include: { source: true },
  });

  const pipelineRun = await prisma.pipelineRun.findUnique({
    where: { id: pipelineRunId },
  });

  if (!pipelineRun) {
    throw new Error(`Pipeline run ${pipelineRunId} not found`);
  }

  const stats = (pipelineRun.stats as unknown as PipelineRunStats) || {
    discovered: 0,
    approved: 0,
    rejected: 0,
    extracted: 0,
    failed: 0,
  };

  if (articles.length === 0) {
    return stats;
  }

  const engine = new HybridFetchEngine({ engine: 'cheerio' } as unknown as SiteScraperConfig);

  for (const article of articles) {
    try {
      await prisma.article.update({
        where: { id: article.id },
        data: { status: 'EXTRACTING' },
      });

      const parser = getParser(article.source.domain);
      if (!parser) {
        throw new Error(`No parser registered for domain ${article.source.domain}`);
      }

      const fetchResult = await engine.fetch(article.url);

      if (fetchResult.statusCode !== 200) {
        throw new Error(`Failed to fetch article, status code: ${fetchResult.statusCode}`);
      }

      const extracted: ExtractedArticle = parser.extractArticle(fetchResult.html, article.url);

      if (!extracted.content) {
        throw new Error('Required field "content" not found in extraction');
      }

      const fullContent = [extracted.title, extracted.content].join('\n\n');
      const wordCount = fullContent.split(/\s+/).filter((w) => w.length > 0).length;

      const existingData = (article.extractedData as Record<string, unknown>) || {};
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

      await prisma.article.update({
        where: { id: article.id },
        data: {
          status: 'EXTRACTED',
          fullContent,
          extractedData: extractedData as unknown as object,
          contentExpiresAt,
          metadataExpiresAt,
          extractedAt: now,
        },
      });

      stats.extracted = (stats.extracted || 0) + 1;
    } catch (error: unknown) {
      console.error(`[Extract] Failed to extract article ${article.id}:`, error);
      stats.failed = (stats.failed || 0) + 1;
      await prisma.article.update({
        where: { id: article.id },
        data: { status: 'FAILED' },
      });
    }
  }

  await prisma.pipelineRun.update({
    where: { id: pipelineRunId },
    data: { 
      stats: stats as unknown as object,
      status: 'COMPLETED',
      completedAt: new Date()
    },
  });

  return stats;
}
