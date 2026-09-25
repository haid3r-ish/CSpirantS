import { BaseSiteParser } from './base.parser.js';

export const PARSER_REGISTRY: Record<string, BaseSiteParser> = {};

export function getParser(domain: string): BaseSiteParser | null {
  const cleanDomain = domain.replace(/^www\./, '');
  return PARSER_REGISTRY[cleanDomain] || null;
}

export function registerParser(parser: BaseSiteParser): void {
  const cleanDomain = parser.domain.replace(/^www\./, '');
  PARSER_REGISTRY[cleanDomain] = parser;
}

export { BaseSiteParser };
