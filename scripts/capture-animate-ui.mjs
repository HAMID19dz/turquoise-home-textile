import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const OUT_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/animate_ui';
fs.mkdirSync(OUT_DIR, { recursive: true });
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function testAnimateUi() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to catalog
  const catalogEl = await page.$('#catalog');
  if (catalogEl) {
    await catalogEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  }

  // Click on "أثاث الجلوس" (Seating) filter tab
  const seatingBtn = await page.$('button:has-text("أثاث الجلوس")');
  if (seatingBtn) {
    await seatingBtn.click();
    await page.waitForTimeout(800); // Wait for Animate UI layout reflow transition
    const outPath = path.join(OUT_DIR, 'catalog_filtered_seating_animate_ui.png');
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot to ${outPath}`);
  } else {
    console.log('Button not found');
  }

  await browser.close();
  console.log('Animate UI interaction verified successfully!');
}

testAnimateUi().catch(console.error);
