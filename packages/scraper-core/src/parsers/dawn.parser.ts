import * as cheerio from 'cheerio';
import { BaseSiteParser, DiscoveredLink, ExtractedArticle } from './base.parser.js';
import { registerParser } from './index.js';
import { parseJsonLd, getJsonLdField } from '../extractor/json-ld.js';

class DawnParser extends BaseSiteParser {
  domain = 'dawn.com';

  getIndexUrls(): string[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      `https://www.dawn.com/pakistan/${today}`,
      `https://www.dawn.com/world/${today}`,
      `https://www.dawn.com/newspaper/editorial/${today}`,
      `https://www.dawn.com/newspaper/opinion/${today}`,
      `https://www.dawn.com/newspaper/analysis-comment/${today}`,
    ];
  }

  discoverLinks(html: string, baseUrl: string): DiscoveredLink[] {
    const $ = cheerio.load(html);
    const skipDescription = baseUrl.includes('/pakistan') || baseUrl.includes('/world');
    const seen = new Set<string>();
    const results: DiscoveredLink[] = [];

    $('div.container article[data-layout="story"]:not(aside article)').each((_, cardEl) => {
      const $card = $(cardEl);

      let href: string | null = null;
      $card.find('a[href]').each((_, aEl) => {
        const h = $(aEl).attr('href') || '';
        if (h.includes('/news/') || /^https:\/\/www\.dawn\.com\/[^/]+\/\d{5,}/.test(h)) {
          href = h;
          return false; // break cheerio each loop
        }
      });

      if (!href) return; // continue cheerio each loop

      // Resolve relative URL if needed
      try {
        href = new URL(href, baseUrl).href;
      } catch {
        // invalid URL
      }

      if (seen.has(href)) return;

      // Filter out sponsored content
      if (href.includes('sponsor') || href.includes('branded') || href.includes('advertisement')) {
        return;
      }

      seen.add(href);

      let title = $card.find('.story__title, h2, h3').first().text().replace(/\s+/g, ' ').trim();
      if (!title) {
        title = $card.find('img[alt]').first().attr('alt')?.trim() || '';
      }
      if (!title) return;

      let description = '';
      if (!skipDescription) {
        description = $card.find('.story__excerpt').text().replace(/\s+/g, ' ').trim();
      }

      const section = $card.find('span[id]').first().attr('id') || this._inferCategory(baseUrl);

      results.push({
        url: href,
        title,
        description: description || undefined,
        category: section || 'general',
      });
    });

    return results;
  }

  extractArticle(html: string, url: string): ExtractedArticle {
    const $ = cheerio.load(html);
    const jsonLd = parseJsonLd($);

    let title = '';
    let author = '';
    let publishedAt = '';
    let imageUrl = '';

    if (jsonLd) {
      title = (getJsonLdField(jsonLd, 'headline') as string) || '';
      if (!title) {
        const type = jsonLd['@type'];
        if (type === 'NewsArticle' || type === 'Article') {
          // Try falling back to 'name' if headline doesn't exist.
          title = (getJsonLdField(jsonLd, 'name') as string) || '';
        }
      }
      author = (getJsonLdField(jsonLd, 'author.name') as string) || '';
      // Support author as an array of objects
      if (!author) {
        const authorArr = getJsonLdField(jsonLd, 'author');
        if (Array.isArray(authorArr) && authorArr.length > 0) {
          author = authorArr[0]?.name || '';
        }
      }
      publishedAt = (getJsonLdField(jsonLd, 'datePublished') as string) || '';
      const img = getJsonLdField(jsonLd, 'image');
      if (typeof img === 'string') {
        imageUrl = img;
      } else if (img && typeof img === 'object' && 'url' in img) {
        imageUrl = (img as { url: string }).url;
      } else if (Array.isArray(img) && img.length > 0) {
        imageUrl = typeof img[0] === 'string' ? img[0] : img[0]?.url || '';
      }
    }

    if (!title) {
      title = $('h1.story__title, h1.story-header__title, h2.story__title, h1').first().text().replace(/\s+/g, ' ').trim();
    }

    if (!author) {
      author = $('.story__byline a, .byline a, [rel="author"]').first().text().trim() || 'Dawn News Desk';
    }

    if (!publishedAt) {
      publishedAt = $('time[itemprop="datePublished"], time.story__time').first().attr('datetime') || '';
    }

    if (!imageUrl) {
      imageUrl = $('.story__media img, article img').first().attr('src') || '';
    }

    const paragraphs: string[] = [];
    $('.story__content p, .template-story p, article .story p').each((_, p) => {
      const text = $(p).text().trim();
      if (text.length > 20) {
        paragraphs.push(text);
      }
    });
    const content = paragraphs.join('\n\n');

    return {
      title,
      author,
      publishedAt,
      content,
      imageUrl: imageUrl || undefined,
    };
  }

  private _inferCategory(url: string): string {
    if (url.includes('/opinion')) return 'opinion';
    if (url.includes('/business')) return 'business';
    if (url.includes('/technology')) return 'technology';
    if (url.includes('/health')) return 'health';
    if (url.includes('/newspaper/editorial')) return 'editorial';
    if (url.includes('/newspaper/column')) return 'column';
    if (url.includes('/newspaper/analysis')) return 'analysis';
    if (url.includes('/world')) return 'world';
    if (url.includes('/pakistan')) return 'pakistan';
    return 'general';
  }
}

registerParser(new DawnParser());
