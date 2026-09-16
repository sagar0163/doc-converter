/**
 * HTML to PDF converter
 * Uses puppeteer-core with a system-installed Chrome/Chromium binary.
 */

import puppeteer from 'puppeteer-core';
import { accessSync } from 'node:fs';

const DEFAULT_CHROME_PATHS = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
  '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];

export function resolveChromeExecutable() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv) return fromEnv;
  return DEFAULT_CHROME_PATHS.find((p) => {
    try {
      accessSync(p);
      return true;
    } catch {
      return false;
    }
  });
}

function normalizeMargin(margin) {
  if (margin && typeof margin === 'object') {
    return {
      top: margin.top ?? 0,
      right: margin.right ?? 0,
      bottom: margin.bottom ?? 0,
      left: margin.left ?? 0,
    };
  }
  const all = margin ?? 0;
  return { top: all, right: all, bottom: all, left: all };
}

export async function convertHtmlToPdf(html, options = {}) {
  const executablePath = resolveChromeExecutable();
  if (!executablePath) {
    throw new Error(
      'PDF conversion requires a Chrome/Chromium binary. Install one or set CHROME_PATH.',
    );
  }

  const needsNoSandbox = typeof process.getuid === 'function' && process.getuid() === 0;
  const launchOptions = {
    executablePath,
    headless: true,
    args: [
      '--disable-dev-shm-usage',
      ...(needsNoSandbox ? ['--no-sandbox', '--disable-setuid-sandbox'] : []),
    ],
  };

  let browser;
  try {
    try {
      browser = await puppeteer.launch(launchOptions);
    } catch (err) {
      if (String(err.message).toLowerCase().includes('sandbox')) {
        browser = await puppeteer.launch({
          ...launchOptions,
          args: [...(launchOptions.args ?? []), '--no-sandbox', '--disable-setuid-sandbox'],
        });
      } else {
        throw err;
      }
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });

    const pdfOptions = {
      printBackground: true,
      format: options.format ?? 'A4',
      landscape: Boolean(options.landscape),
      margin: normalizeMargin(options.margin),
    };

    return Buffer.from(await page.pdf(pdfOptions));
  } finally {
    if (browser) await browser.close();
  }
}