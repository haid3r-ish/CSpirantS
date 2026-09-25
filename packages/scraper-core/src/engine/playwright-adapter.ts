import { chromium, type Browser, type BrowserContext } from 'playwright';
import type { SiteScraperConfig } from '@repo/types';

// Use playwright-extra with stealth plugin for anti-bot evasion
// NOTE: At runtime, import playwright-extra dynamically to avoid ESM issues
let browser: Browser | null = null;

async function getBrowser(proxy?: string): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    // Dynamically import playwright-extra and stealth plugin
    const { chromium: chromiumExtra } = await import('playwright-extra');
    const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
    chromiumExtra.use(StealthPlugin());

    const launchOptions: Parameters<typeof chromiumExtra.launch>[0] = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    };

    if (proxy) {
      launchOptions.proxy = { server: proxy };
    }

    browser = await chromiumExtra.launch(launchOptions);
  }
  return browser;
}

export async function fetchWithPlaywright(
  url: string,
  config: SiteScraperConfig
): Promise<{ html: string; statusCode: number }> {
  // Apply random delay
  if (config.randomDelayMs) {
    const { min, max } = config.randomDelayMs;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Resolve proxy — if array, pick randomly
  let proxy: string | undefined;
  if (config.proxy) {
    proxy = Array.isArray(config.proxy)
      ? config.proxy[Math.floor(Math.random() * config.proxy.length)]
      : config.proxy;
  }

  const browserInstance = await getBrowser(proxy);
  const context: BrowserContext = await browserInstance.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  try {
    // Block unnecessary resources to maximize speed
    await page.route('**/*.{png,jpg,jpeg,gif,webp,svg,css,woff,woff2,ttf,eot,mp4,mp3}', (route) =>
      route.abort()
    );
    await page.route('**/{analytics,tracking,ads,doubleclick}**', (route) => route.abort());

    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 25000,
    });

    const html = await page.content();
    return { html, statusCode: response?.status() ?? 200 };
  } finally {
    await page.close();
    await context.close();
  }
}

export async function closePlaywrightBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
