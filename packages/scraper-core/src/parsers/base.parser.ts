import * as cheerio from 'cheerio';
import { StaleDataError } from './errors.js';

export interface DiscoveredLink {
  url: string;
  title: string;
  category: string;
  description?: string;
}

export interface ExtractedArticle {
  title: string;
  author?: string;
  publishedAt?: string;
  content: string;
  imageUrl?: string;
}

export abstract class BaseSiteParser {
  abstract readonly domain: string;
  dateSelector?: string;

  normalizeDateString(raw: string): string {
    return raw;
  }

  verifyPageDate(html: string, targetDate: string): void {
    if (!this.dateSelector) return;
    const $ = cheerio.load(html);
    const raw = $(this.dateSelector).first().text().trim();
    if (!raw) return;
    const normalized = this.normalizeDateString(raw);
    if (normalized !== targetDate) {
      throw new StaleDataError(targetDate, normalized);
    }
  }

  // Returns ordered list of URLs to discover (with date tokens pre-resolved)
  abstract getIndexUrls(): string[];

  // Stage 1 — returns list of article {url, title, category}
  abstract discoverLinks(html: string, baseUrl: string, targetDate?: string): DiscoveredLink[];

  // Stage 3 — returns structured article data from article page HTML
  abstract extractArticle(html: string, url: string): ExtractedArticle;
}
