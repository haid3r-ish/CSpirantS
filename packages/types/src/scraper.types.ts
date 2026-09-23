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
