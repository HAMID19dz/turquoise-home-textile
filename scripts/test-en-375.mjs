import { chromium } from 'playwright-core';
import sharp from 'sharp';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function testEn375() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:4173/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const path = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m4/en_shot_375.png';
  await page.screenshot({ path });

  const stats = await sharp(path).stats();
  console.log('EN 375 stats channel 0 stdev:', stats.channels[0].stdev);
  const meta = await sharp(path).metadata();
  console.log('EN 375 size:', meta.size);

  await browser.close();
}

testEn375().catch(console.error);
