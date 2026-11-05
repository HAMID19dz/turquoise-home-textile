import { chromium } from 'playwright-core';

async function checkScroll() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => window.scrollTo(0, 5000));
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => window.scrollY);
  console.log('Scroll before:', before, 'after:', after);
  await browser.close();
}

checkScroll().catch(console.error);
