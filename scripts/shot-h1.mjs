import { chromium } from 'playwright-core';
import sharp from 'sharp';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function shotH1() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const h1 = await page.$('h1');
  const path = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m4/h1_shot.png';
  await h1.screenshot({ path });

  const meta = await sharp(path).metadata();
  console.log('H1 screenshot meta:', meta);
  const stats = await sharp(path).stats();
  console.log('H1 screenshot stats:', stats.channels[0]);

  await browser.close();
}

shotH1().catch(console.error);
