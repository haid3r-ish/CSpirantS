import * as cheerio from 'cheerio';
import type { FieldExtractor, SiteScraperConfig } from '@repo/types';
import { parseJsonLd, getJsonLdField } from './json-ld.js';
import { applyTransforms } from './transforms.js';

export class DeclarativeExtractor {
  /**
   * Extract all fields defined in config from HTML.
   * Returns a plain object with field names as keys.
   * content field → goes to fullContent
   * all other fields → go to extractedData JSONB
   */
  static extract(
    html: string,
    url: string,
    fieldConfig: Record<string, FieldExtractor | undefined>
  ): Record<string, unknown> {
    const $ = cheerio.load(html);
    const jsonLd = parseJsonLd($);
    const result: Record<string, unknown> = {};

    for (const [fieldName, extractor] of Object.entries(fieldConfig)) {
      if (!extractor) continue;

      try {
        const value = DeclarativeExtractor.resolveField($, jsonLd, extractor, url);
        if (value !== null && value !== undefined && value !== '') {
          result[fieldName] = value;
        } else if (extractor.required) {
          throw new Error(
            `Required field '${fieldName}' could not be extracted from ${url}`
          );
        }
      } catch (err: unknown) {
        if (extractor.required) throw err;
        // Optional fields silently fail
      }
    }

    return result;
  }

  private static resolveField(
    $: cheerio.CheerioAPI,
    jsonLd: Record<string, unknown> | null,
    extractor: FieldExtractor,
    url: string
  ): unknown {
    const raw = DeclarativeExtractor.extractRaw($, jsonLd, extractor, url);

    if (raw !== null && raw !== undefined && raw !== '') {
      if (typeof raw === 'string') {
        return applyTransforms(raw, extractor.transforms, url);
      }
      return raw;
    }

    // Try fallbacks in order
    if (extractor.fallbacks) {
      for (const fallback of extractor.fallbacks) {
        const fallbackVal = DeclarativeExtractor.resolveField($, jsonLd, fallback, url);
        if (fallbackVal !== null && fallbackVal !== undefined && fallbackVal !== '') {
          return fallbackVal;
        }
      }
    }

    return null;
  }

  private static extractRaw(
    $: cheerio.CheerioAPI,
    jsonLd: Record<string, unknown> | null,
    extractor: FieldExtractor,
    url: string
  ): unknown {
    switch (extractor.source) {
      case 'json-ld': {
        if (!jsonLd) return null;
        return getJsonLdField(jsonLd, extractor.path) ?? null;
      }

      case 'meta': {
        const content = $(
          `meta[property="${extractor.path}"], meta[name="${extractor.path}"]`
        ).attr('content');
        return content ?? null;
      }

      case 'css': {
        const selection = $(extractor.path);
        if (selection.length === 0) return null;

        if (extractor.attribute) {
          return selection.first().attr(extractor.attribute) ?? null;
        }

        // If multiple elements (e.g. <p> tags for article body), join them
        if (selection.length > 1) {
          const texts = selection
            .map((_, el) => $(el).text())
            .get()
            .filter((t) => t.trim().length > 0);
          return texts.join('\n\n');
        }

        return selection.first().text() ?? null;
      }

      default:
        return null;
    }
  }
}
