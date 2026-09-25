export { generateArticleHash } from './hasher/canonical-url.js';
export { DeclarativeExtractor } from './extractor/declarative.js';
export { HybridFetchEngine } from './engine/hybrid-fetch.js';
export { closePlaywrightBrowser } from './engine/playwright-adapter.js';

export { BaseSiteParser, getParser, registerParser } from './parsers/index.js';
export type { DiscoveredLink, ExtractedArticle } from './parsers/base.parser.js';
