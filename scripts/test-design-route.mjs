import { chromium } from 'playwright-core';
import sharp from 'sharp';

async function testDesignRoute() {
  const browser = await chromium.launch({
    channel: 'chrome',
    args: ['--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  console.log('Loading /ar/design...');
  await page.goto('http://localhost:4173/ar/design', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const shotPath = 'C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\ar_customizer_mobile_375.png';
  
  // Find customizer and scroll into view
  const customizer = await page.$('#customizer');
  if (customizer) {
    console.log('Found customizer, taking screenshot...');
    await customizer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: shotPath });
  }

  const meta = await sharp(shotPath).metadata();
  console.log('Metadata:', meta.size, meta.width, meta.height);
  const stats = await sharp(shotPath).stats();
  console.log('Channel 0 stdev:', stats.channels[0].stdev);

  await browser.close();
}

testDesignRoute().catch(console.error);
