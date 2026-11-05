import { chromium } from 'playwright-core';

async function debugMobile() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const el = await page.$('#customizer');
  if (el) {
    // scroll element into view using native element method
    await el.evaluate(e => e.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(1500);

    const scrollY = await page.evaluate(() => window.scrollY);
    console.log('ScrollY after scrollIntoView:', scrollY);

    // Let's take screenshot of the element directly
    await el.screenshot({
      path: 'C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\ar_customizer_mobile_375.png'
    });
    console.log('Done capturing element screenshot');
  }
  await browser.close();
}

debugMobile().catch(console.error);
