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
