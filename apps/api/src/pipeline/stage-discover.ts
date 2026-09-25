import { prisma } from '@repo/db';
import { HybridFetchEngine, generateArticleHash, getParser, DiscoveredLink, StaleDataError } from '@repo/scraper-core';
import type { PipelineRunStats, SiteScraperConfig } from '@repo/types';

// Import parser implementations to register them
import '@repo/scraper-core/src/parsers/dawn.parser.js';

export async function runDiscoverStage(pipelineRunId: string, sourceId: string): Promise<PipelineRunStats> {
  const source = await prisma.scraperSource.findUnique({
    where: { id: sourceId },
  });

  if (!source) {
    throw new Error(`Source ${sourceId} not found`);
  }

  const pipelineRun = await prisma.pipelineRun.findUnique({ where: { id: pipelineRunId } });
  const targetDate = pipelineRun!.startedAt.toISOString().split('T')[0];

  const stats: PipelineRunStats = {
    discovered: 0,
    approved: 0,
    rejected: 0,
    extracted: 0,
    failed: 0,
  };

  const parser = getParser(source.domain);
  if (!parser) {
    console.warn(`[Discover] No parser registered for domain ${source.domain}`);
    return stats;
  }

  // Construct engine with no-op config since URL arrays and selectors are now handled by parsers
  const engine = new HybridFetchEngine({ engine: 'cheerio' } as unknown as SiteScraperConfig);
  const indexUrls = parser.getIndexUrls();

  for (const url of indexUrls) {
    try {
      const result = await engine.fetch(url);

      if (result.statusCode !== 200) {
        console.warn(`[Discover] Failed to fetch index page ${url}, status: ${result.statusCode}`);
        stats.failed++;
        continue;
      }

      const discoveredLinks: DiscoveredLink[] = parser.discoverLinks(result.html, url, targetDate);

      for (const link of discoveredLinks) {
        const hash = generateArticleHash(link.url);

        const existing = await prisma.article.findUnique({
          where: { hash },
          select: { id: true }
        });

        if (existing) {
          continue;
        }

        try {
          await prisma.article.create({
            data: {
              hash,
              title: link.title,
              url: link.url,
              category: link.category,
              status: 'DISCOVERED',
              sourceId: source.id,
              pipelineRunId,
            }
          });

          stats.discovered++;
        } catch (err: any) {
          console.warn(`[Discover] Failed to save article ${link.url}, skipping...`, err.message);
        }
      }
    } catch (error) {
      if (error instanceof StaleDataError) {
        console.warn(`[Discover] Skipping stale page ${url}: ${error.message}`);
        continue;
      }
      console.error(`[Discover] Error processing index page ${url}:`, error);
      stats.failed++;
    }
  }

  return stats;
}
