import { chromium } from 'playwright-core';

async function checkTopElement() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const topEl = await page.evaluate(() => {
    const el = document.elementFromPoint(180, 200);
    return {
      tagName: el?.tagName,
      className: el?.className,
      id: el?.id,
      outerHTML: el?.outerHTML.slice(0, 300)
    };
  });
  console.log('Top element at 180, 200:', topEl);
  await browser.close();
}

checkTopElement().catch(console.error);
