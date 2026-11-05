import { chromium } from 'playwright-core';
import path from 'path';

const OUT_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m2';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function captureModals() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Lightbox capture
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const zoomBtn = await page.$('button[aria-label="Zoom Photo"]');
    if (zoomBtn) {
      await zoomBtn.click();
      await page.waitForTimeout(800);
      const outPath = path.join(OUT_DIR, 'ar_lightbox_desktop.png');
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved lightbox screenshot to ${outPath}`);
    } else {
      console.error('Zoom button not found!');
    }
    await page.close();
  }

  // 2. Quick Viewer Modal capture
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Click the 3D view button on the first card
    const view3dBtn = await page.$('button:has-text("3D")');
    if (view3dBtn) {
      await view3dBtn.click();
      await page.waitForTimeout(800);
      const outPath = path.join(OUT_DIR, 'ar_quickview_modal_desktop.png');
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved quickview modal screenshot to ${outPath}`);
    } else {
      console.error('3D button not found!');
    }
    await page.close();
  }

  await browser.close();
  console.log('Modals capture complete!');
}

captureModals().catch(console.error);
