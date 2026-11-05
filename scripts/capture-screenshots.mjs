import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const OUT_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m1';
fs.mkdirSync(OUT_DIR, { recursive: true });

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

const LANGUAGES = ['ar', 'fr', 'en'];

async function capture() {
  console.log('Launching Chrome via Playwright-core...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const lang of LANGUAGES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height }
      });

      const url = `http://localhost:4173/${lang}`;
      console.log(`Capturing ${lang} at ${vp.name} (${vp.width}x${vp.height}) -> ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // Allow fonts & animations to settle

      const filename = `${lang}_${vp.name}_${vp.width}.png`;
      const outPath = path.join(OUT_DIR, filename);

      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved screenshot to ${outPath}`);

      await page.close();
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
