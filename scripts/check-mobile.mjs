import { chromium } from 'playwright-core';
import path from 'path';

async function checkMobile() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const el = await page.$('#customizer');
  if (el) {
    const box = await el.boundingBox();
    console.log('Customizer bounding box on mobile:', box);
    if (box) {
      await page.evaluate((y) => window.scrollTo(0, y), box.y);
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: 'C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\ar_customizer_mobile_375.png'
      });
      console.log('Mobile screenshot saved with window.scrollTo');
    }
  } else {
    console.log('Could not find #customizer');
  }
  await browser.close();
}

checkMobile().catch(console.error);
