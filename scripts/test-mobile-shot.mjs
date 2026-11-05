import { chromium } from 'playwright-core';
import path from 'path';

async function testMobileViewport() {
  const browser = await chromium.launch({
    channel: 'chrome',
    args: ['--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll directly into customizer stage
  await page.evaluate(() => {
    const el = document.getElementById('customizer');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + 120);
    }
  });
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: 'C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\ar_customizer_mobile_375.png'
  });
  console.log('Mobile screenshot captured');
  await browser.close();
}

testMobileViewport().catch(console.error);
