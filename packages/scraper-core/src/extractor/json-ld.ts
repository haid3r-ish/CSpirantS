import type { CheerioAPI } from 'cheerio';

const ARTICLE_TYPES = new Set(['NewsArticle', 'Article', 'ReportageNewsArticle', 'BlogPosting']);

/**
 * Parse JSON-LD from page HTML.
 * Returns the first NewsArticle/Article object found.
 */
export function parseJsonLd($: CheerioAPI): Record<string, unknown> | null {
  const scripts = $('script[type="application/ld+json"]').toArray();

  for (const script of scripts) {
    try {
      const raw = $(script).html();
      if (!raw) continue;

      const parsed: unknown = JSON.parse(raw);

      // Handle @graph arrays
      if (parsed && typeof parsed === 'object' && '@graph' in parsed) {
        const graph = (parsed as Record<string, unknown>)['@graph'];
        if (Array.isArray(graph)) {
          const article = graph.find(
            (item): item is Record<string, unknown> =>
              typeof item === 'object' &&
              item !== null &&
              '@type' in item &&
              ARTICLE_TYPES.has((item as Record<string, unknown>)['@type'] as string)
          );
          if (article) return article;
        }
      }

      // Handle direct objects
      if (
        parsed &&
        typeof parsed === 'object' &&
        '@type' in parsed &&
        ARTICLE_TYPES.has((parsed as Record<string, unknown>)['@type'] as string)
      ) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      continue;
    }
  }

  return null;
}

/** Access nested JSON-LD field via dot-notation path */
export function getJsonLdField(
  jsonLd: Record<string, unknown>,
  path: string
): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && !Array.isArray(acc)) {
      return (acc as Record<string, unknown>)[key];
    }
    // Handle array index access (e.g. 'author.0.name')
    if (Array.isArray(acc) && /^\d+$/.test(key)) {
      return acc[parseInt(key, 10)];
    }
    return undefined;
  }, jsonLd);
}
