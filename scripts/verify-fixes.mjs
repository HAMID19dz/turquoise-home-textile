import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const OUT_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/fixes';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:4173/ar ...');
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Capture Header & Hero showing Greek Columns with safe margins
  console.log('Capturing hero & Greek columns clearance...');
  await page.screenshot({ path: path.join(OUT_DIR, '01_columns_clearance_1440.png') });

  // 2. Open 3D Quick Viewer on the first product card
  console.log('Opening 3D Quick Viewer from product card...');
  const view3dBtn = page.locator('button[title="عرض ثلاثي الأبعاد"]').first();
  await view3dBtn.scrollIntoViewIfNeeded();
  await view3dBtn.click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT_DIR, '02_quickviewer_model_swatches.png') });

  // Click a swatch in quick viewer
  const swatches = page.locator('div[role="dialog"] button[style*="background-color"]');
  const swatchCount = await swatches.count();
  console.log(`Found ${swatchCount} swatches in quick viewer`);
  if (swatchCount > 1) {
    await swatches.nth(swatchCount - 1).click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, '03_quickviewer_after_swatch_click.png') });
  }

  // Close modal
  const closeBtn = page.locator('div[role="dialog"] button[aria-label="Close modal"]');
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // 3. Scroll to Customizer
  console.log('Navigating to Customizer...');
  await page.evaluate(() => {
    document.getElementById('customizer')?.scrollIntoView();
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT_DIR, '04_customizer_stage.png') });

  // Click a material swatch in customizer
  const materialsTab = page.locator('button:has-text("الخامات والألوان")');
  if (await materialsTab.count() > 0) {
    await materialsTab.click();
    await page.waitForTimeout(500);
    // Click royal cognac or another swatch
    const swatchButtons = page.locator('#customizer button span[style*="background-color"]');
    if (await swatchButtons.count() > 2) {
      await swatchButtons.nth(2).click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT_DIR, '05_customizer_swatch_applied.png') });
    }
  }

  // 4. Test on tablet/laptop 1024px to confirm columns are hidden and zero overlap occurs
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '06_tablet_1024_no_overlap.png') });

  // 5. Test on mobile 375px
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '07_mobile_375_clean_edges.png') });

  await browser.close();
  console.log('All verification captures saved successfully in:', OUT_DIR);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
