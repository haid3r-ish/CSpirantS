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
    } catch (err: unknown) {
      console.warn(`[Scraper] Cheerio fetch failed for ${url}:`, err);
    }

    // Playwright fallback
    const result = await fetchWithPlaywright(url, this.config);
    return { ...result, engineUsed: 'playwright' };
  }
}
