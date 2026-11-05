import { chromium } from 'playwright-core';

async function traceScroll() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar#customizer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const rect = await page.evaluate(() => {
    const el = document.getElementById('customizer');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.top,
      bottom: r.bottom,
      left: r.left,
      right: r.right,
      windowScrollY: window.scrollY,
      documentHeight: document.documentElement.scrollHeight
    };
  });
  console.log('Before scroll rect:', rect);

  await page.evaluate(() => {
    const el = document.getElementById('customizer');
    el.scrollIntoView();
  });
  await page.waitForTimeout(1000);

  const rectAfter = await page.evaluate(() => {
    const el = document.getElementById('customizer');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.top,
      bottom: r.bottom,
      windowScrollY: window.scrollY,
      elementFromPoint: document.elementFromPoint(180, 400)?.tagName + '.' + document.elementFromPoint(180, 400)?.className
    };
  });
  console.log('After scroll rect:', rectAfter);

  await browser.close();
}

traceScroll().catch(console.error);
