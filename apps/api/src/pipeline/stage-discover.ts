import { prisma } from '@repo/db';
import { NotFoundError } from '../core/errors.js';
import { HybridFetchEngine, generateArticleHash, getParser, DiscoveredLink, StaleDataError } from '@repo/scraper-core';
import type { PipelineRunStats, SiteScraperConfig } from '@repo/types';

// Import parser implementations to register them
import '@repo/scraper-core/src/parsers/dawn.parser.js';

const DISCOVERY_TIMEOUT_MS = 2_500_000; // 2500s (budget for up to 500 pages @ 5s each)

async function executeDiscoverStage(pipelineRunId: string, sourceId: string): Promise<PipelineRunStats> {
  const source = await prisma.scraperSource.findUnique({
    where: { id: sourceId },
  });

  if (!source) {
    throw new NotFoundError(`Source ${sourceId} not found`);
  }

  const pipelineRun = await prisma.pipelineRun.findUnique({ where: { id: pipelineRunId } });
  if (!pipelineRun) {
    throw new NotFoundError(`Pipeline run ${pipelineRunId} not found`);
  }
  const targetDate = pipelineRun.startedAt.toISOString().split('T')[0];

  const stats: PipelineRunStats = {
    discovered: 0,
    approved: 0,
    rejected: 0,
    extracted: 0,
    failed: 0,
  };

  const parser = getParser(source.domain);
  if (!parser) {
    console.warn(`[Discover][Run:${pipelineRunId}][Source:${sourceId}] No parser registered for domain ${source.domain}`);
    return stats;
  }

  // Construct engine with no-op config since URL arrays and selectors are now handled by parsers
  const engine = new HybridFetchEngine({ engine: 'cheerio' } as unknown as SiteScraperConfig);
  const indexUrls = parser.getIndexUrls();

  for (const url of indexUrls) {
    try {
      const result = await engine.fetch(url);

      if (result.statusCode !== 200) {
        console.warn(`[Discover][Run:${pipelineRunId}][Source:${sourceId}] Failed to fetch index page ${url}, status: ${result.statusCode}`);
        stats.failed++;
        continue;
      }

      const discoveredLinks: DiscoveredLink[] = parser.discoverLinks(result.html, url, targetDate);

      if (discoveredLinks.length > 0) {
        const linkMap = new Map<string, DiscoveredLink>();
        for (const link of discoveredLinks) {
          const hash = generateArticleHash(link.url);
          if (!linkMap.has(hash)) {
            linkMap.set(hash, link);
          }
        }

        const newLinks = Array.from(linkMap.values());

        if (newLinks.length > 0) {
          try {
            const insertResult = await prisma.article.createMany({
              data: newLinks.map((link) => ({
                hash: generateArticleHash(link.url),
                title: link.title,
                url: link.url,
                category: link.category,
                description: link.description,
                extractedData: link.publishedAt ? { publishedAt: link.publishedAt } : undefined,
                status: 'DISCOVERED',
                sourceId: source.id,
                pipelineRunId,
                discoveredAt: new Date(),
              })),
              skipDuplicates: true,
            });
            stats.discovered += insertResult.count;
          } catch (err: any) {
            console.warn(`[Discover][Run:${pipelineRunId}][Source:${sourceId}] Failed to batch save articles, skipping...`, err.message);
          }
        }
      }
    } catch (error) {
      if (error instanceof StaleDataError) {
        console.warn(`[Discover][Run:${pipelineRunId}][Source:${sourceId}] Skipping stale page ${url}: ${error.message}`);
        continue;
      }
      console.error(`[Discover][Run:${pipelineRunId}][Source:${sourceId}] Error processing index page ${url}:`, error);
      stats.failed++;
    }
  }

  // Write stats back to DB atomically
  await prisma.$transaction(async (tx) => {
    const [currentRun] = await tx.$queryRaw<[{ stats: any }]>`
      SELECT stats FROM "PipelineRun" 
      WHERE id = ${pipelineRunId} 
      FOR UPDATE
    `;

    if (currentRun) {
      const existingStats = (currentRun.stats as unknown as PipelineRunStats) || {
        discovered: 0,
        approved: 0,
        rejected: 0,
        extracted: 0,
        failed: 0,
      };

      existingStats.discovered = (existingStats.discovered || 0) + stats.discovered;
      existingStats.failed = (existingStats.failed || 0) + stats.failed;

      await tx.pipelineRun.update({
        where: { id: pipelineRunId },
        data: { stats: existingStats as any },
      });
    }
  });

  return stats;
}

export async function runDiscoverStage(pipelineRunId: string, sourceId: string): Promise<PipelineRunStats> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`[Discover] Discovery stage timed out after ${DISCOVERY_TIMEOUT_MS}ms for source ${sourceId}`));
    }, DISCOVERY_TIMEOUT_MS);
  });

  try {
    return await Promise.race([
      executeDiscoverStage(pipelineRunId, sourceId),
      timeoutPromise,
    ]);
  } finally {
    clearTimeout(timer!);
  }
}

