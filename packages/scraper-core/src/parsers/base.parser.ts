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

  // Returns ordered list of URLs to discover (with date tokens pre-resolved)
  abstract getIndexUrls(): string[];

  // Stage 1 — returns list of article {url, title, category}
  abstract discoverLinks(html: string, baseUrl: string): DiscoveredLink[];

  // Stage 3 — returns structured article data from article page HTML
  abstract extractArticle(html: string, url: string): ExtractedArticle;
}
