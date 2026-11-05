import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function findOverflow() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const offenders = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const results = [];
    for (const el of all) {
      if (el.scrollWidth > 400 || el.offsetWidth > 400) {
        results.push({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          scrollWidth: el.scrollWidth,
          offsetWidth: el.offsetWidth,
        });
      }
    }
    return results;
  });

  console.log('Offenders with width > 400:', offenders);
  await browser.close();
}

findOverflow().catch(console.error);
