import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2';
const M5_DIR = path.join(ARTIFACT_DIR, 'screenshots', 'm5');
fs.mkdirSync(M5_DIR, { recursive: true });

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function captureM5() {
  console.log('Launching Chrome for M5 verification...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. Add 2 items to the Quote Cart
  console.log('Adding items to Quote Cart...');
  const addButtons = await page.$$('button[aria-label="Add to quote cart"]');
  if (addButtons.length >= 2) {
    await addButtons[0].click();
    await page.waitForTimeout(600);
    // Click close on drawer
    const closeDrawer = await page.$('button[aria-label="Close cart"]');
    if (closeDrawer) await closeDrawer.click();
    await page.waitForTimeout(600);

    // Add second item
    await addButtons[1].click();
    await page.waitForTimeout(1000);
  }

  // 2. Capture Quote Cart Drawer
  console.log('Capturing Quote Cart Drawer...');
  await page.screenshot({
    path: path.join(M5_DIR, 'ar_cart_drawer_desktop.png')
  });

  // Close drawer
  const closeCartBtn = await page.$('button[aria-label="Close cart"]');
  if (closeCartBtn) await closeCartBtn.click();
  await page.waitForTimeout(600);

  // 3. Open 3D Viewer Modal & AR Dialog
  console.log('Opening 3D Viewer Modal and AR dialog...');
  const view3dBtn = await page.$('button:has-text("3D")');
  if (view3dBtn) {
    await view3dBtn.click();
    await page.waitForTimeout(1200);

    const arBtn = await page.$('button[aria-label="View in AR"]');
    if (arBtn) {
      await arBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(M5_DIR, 'ar_modal_info_desktop.png')
      });
    }
  }

  console.log('All M5 screenshots captured successfully!');
  await browser.close();
}

captureM5().catch(err => {
  console.error('M5 capture failed:', err);
  process.exit(1);
});
