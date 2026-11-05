import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const OUT_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m2';
fs.mkdirSync(OUT_DIR, { recursive: true });

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

const LANGUAGES = ['ar', 'fr', 'en'];

async function capture() {
  console.log('Launching Chrome via Playwright-core for M2 verification...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Capture catalog section across 3 viewports and 3 languages
  for (const lang of LANGUAGES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height }
      });

      const url = `http://localhost:4173/${lang}`;
      console.log(`Loading ${lang} at ${vp.name}...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      // Scroll to #catalog section
      const catalogEl = await page.$('#catalog');
      if (catalogEl) {
        await catalogEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
      }

      const filename = `${lang}_catalog_${vp.name}_${vp.width}.png`;
      const outPath = path.join(OUT_DIR, filename);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved catalog screenshot to ${outPath}`);

      // Scroll to #curtains section
      const curtainsEl = await page.$('#curtains');
      if (curtainsEl) {
        await curtainsEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        const curtainFilename = `${lang}_curtains_${vp.name}_${vp.width}.png`;
        const curtainPath = path.join(OUT_DIR, curtainFilename);
        await page.screenshot({ path: curtainPath, fullPage: false });
        console.log(`Saved curtains screenshot to ${curtainPath}`);
      }

      await page.close();
    }
  }

  // 2. Capture Quick Viewer Modal interaction (in AR at desktop 1440)
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Click on quick view button of the first card
    const quickViewBtn = await page.$('button[aria-label*="عرض سريع"], button:has-text("معاينة")');
    if (quickViewBtn) {
      await quickViewBtn.click();
      await page.waitForTimeout(800);
      const outPath = path.join(OUT_DIR, 'ar_quickview_modal_desktop.png');
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved quickview modal screenshot to ${outPath}`);
    }
    await page.close();
  }

  // 3. Capture Photo Lightbox interaction (in AR at desktop 1440)
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Click on product image / lightbox trigger button
    const zoomBtn = await page.$('button[aria-label*="تكبير الصورة"], button[aria-label*="zoom"]');
    if (zoomBtn) {
      await zoomBtn.click();
      await page.waitForTimeout(800);
      const outPath = path.join(OUT_DIR, 'ar_lightbox_desktop.png');
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved lightbox screenshot to ${outPath}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('Milestone M2 screenshots complete!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
