import { createHash } from 'node:crypto';

const TRACKING_PARAMS = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'ref', 'source', 'mc_cid', 'mc_eid',
]);

/**
 * Generate a stable 16-char hex hash from a URL.
 * Strips tracking params, normalizes scheme/www/trailing slash.
 * Collision-safe for < 10 million articles (64-bit hash space).
 */
export function generateArticleHash(rawUrl: string): string {
  const url = new URL(rawUrl);

  // Remove fragment
  url.hash = '';

  // Strip tracking parameters
  for (const param of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.has(param)) {
      url.searchParams.delete(param);
    }
  }

  // Sort remaining params for consistent ordering
  url.searchParams.sort();

  // Normalize host: lowercase, remove www.
  const host = url.hostname.toLowerCase().replace(/^www\./, '');

  // Normalize path: remove trailing slash
  const path = url.pathname.replace(/\/+$/, '');

  // Normalize search
  const search = url.searchParams.size > 0 ? `?${url.searchParams.toString()}` : '';

  const normalized = `${url.protocol}//${host}${path}${search}`;
  return createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}
