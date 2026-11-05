import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2';
const M4_DIR = path.join(ARTIFACT_DIR, 'screenshots', 'm4');
fs.mkdirSync(M4_DIR, { recursive: true });

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function run() {
  console.log('Launching Chrome for M4 verification...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-webgl',
    ]
  });

  // 1. Desktop Arabic Customizer (Materials Tab)
  {
    console.log('Capturing ar_customizer_desktop_1440...');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/ar#customizer', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const customizerEl = await page.$('#customizer');
    if (customizerEl) {
      await customizerEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      await customizerEl.screenshot({
        path: path.join(M4_DIR, 'ar_customizer_desktop_1440.png')
      });
    }

    // 2. Switch to Dimensions Tab
    console.log('Switching to Dimensions tab...');
    const dimTab = await page.$('button[data-tab="dimensions"]');
    if (dimTab) {
      await dimTab.click();
      await page.waitForTimeout(1200);
      if (customizerEl) {
        await customizerEl.screenshot({
          path: path.join(M4_DIR, 'ar_customizer_dimensions_1440.png')
        });
      }
    }

    // 3. Toggle Room Scale
    console.log('Toggling Room Scale...');
    const roomScaleBtn = await page.$('button[data-action="room-scale"]');
    if (roomScaleBtn) {
      await roomScaleBtn.click();
      await page.waitForTimeout(1500);
      if (customizerEl) {
        await customizerEl.screenshot({
          path: path.join(M4_DIR, 'ar_customizer_roomscale_1440.png')
        });
      }
    }

    // 4. Switch to Summary Tab
    console.log('Switching to Summary tab...');
    const summaryTab = await page.$('button[data-tab="summary"]');
    if (summaryTab) {
      await summaryTab.click();
      await page.waitForTimeout(1200);
      if (customizerEl) {
        await customizerEl.screenshot({
          path: path.join(M4_DIR, 'ar_customizer_summary_whatsapp_1440.png')
        });
      }
    }

    await page.close();
  }

  // 5. French View (1440px)
  {
    console.log('Capturing French customizer...');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/fr#customizer', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const frEl = await page.$('#customizer');
    if (frEl) {
      await frEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await frEl.screenshot({
        path: path.join(M4_DIR, 'fr_customizer_desktop_1440.png')
      });
    }
    await page.close();
  }

  // 6. English View (1440px)
  {
    console.log('Capturing English customizer...');
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/en#customizer', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const enEl = await page.$('#customizer');
    if (enEl) {
      await enEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await enEl.screenshot({
        path: path.join(M4_DIR, 'en_customizer_desktop_1440.png')
      });
    }
    await page.close();
  }

  // 7. Mobile View (375px) in Arabic
  {
    console.log('Capturing Mobile Arabic customizer...');
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto('http://localhost:4173/ar#customizer', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    const mobEl = await page.$('#customizer');
    if (mobEl) {
      await mobEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      await mobEl.screenshot({
        path: path.join(M4_DIR, 'ar_customizer_mobile_375.png')
      });
    }
    await page.close();
  }

  console.log('All M4 screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
