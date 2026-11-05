import { chromium } from 'playwright-core';
import path from 'path';
import sharp from 'sharp';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const M4_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m4';

async function testArMobileFixed() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:4173/ar#customizer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const customizer = await page.$('#customizer');
  if (customizer) {
    await customizer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }

  const outPath = path.join(M4_DIR, 'ar_customizer_mobile_375.png');
  await page.screenshot({ path: outPath });

  const stats = await sharp(outPath).stats();
  console.log('Arabic Mobile stats channel 0 stdev:', stats.channels[0].stdev);
  const meta = await sharp(outPath).metadata();
  console.log('Image dimensions:', meta.width, meta.height);

  await browser.close();
}

testArMobileFixed().catch(console.error);
