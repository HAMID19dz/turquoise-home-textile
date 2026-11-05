import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const outDir = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m5';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function capture() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4173/ar...');
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Capture About section showing the Brand Crest Card with authentic Pegasus artwork
  console.log('Scrolling to About section...');
  const aboutSec = page.locator('#about');
  await aboutSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outDir, 'ar_brand_crest_showcase_1440.png'),
  });
  console.log('Saved ar_brand_crest_showcase_1440.png');

  // 2. Open Brand Crest Modal by clicking the card
  console.log('Opening Brand Crest Modal...');
  const crestCard = page.locator('#about img[alt*="Pegasus"]').first();
  if (await crestCard.count() > 0) {
    await crestCard.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(outDir, 'ar_brand_crest_modal_1440.png'),
    });
    console.log('Saved ar_brand_crest_modal_1440.png');
    
    // Close modal by clicking close button
    const closeBtn = page.locator('button[aria-label="Close"]').first();
    await closeBtn.click();
    await page.waitForTimeout(800);
  }

  // 3. Open Compare Mode Modal by clicking the Header 3D Compare button
  console.log('Opening Compare Mode Modal...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);

  const compareBtn = page.locator('header button[title*="مقارنة"]').first();
  if (await compareBtn.count() > 0) {
    await compareBtn.click();
    await page.waitForTimeout(3000); // Allow dual 3D Canvases to render
    await page.screenshot({
      path: path.join(outDir, 'ar_compare_modal_desktop_1440.png'),
    });
    console.log('Saved ar_compare_modal_desktop_1440.png');
  }

  await browser.close();
  console.log('Visual verification complete!');
}

capture().catch(console.error);
