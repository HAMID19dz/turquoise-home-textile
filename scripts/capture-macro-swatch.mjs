import { chromium } from 'playwright-core';
import path from 'path';

const OUT_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/fixes';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Navigate to customizer
  await page.evaluate(() => {
    document.getElementById('customizer')?.scrollIntoView();
  });
  await page.waitForTimeout(1500);

  // Click Materials Tab
  const materialsTab = page.locator('button[data-tab="materials"]');
  await materialsTab.click();
  await page.waitForTimeout(800);

  // Click Macro Zoom button
  const macroBtn = page.locator('button:has-text("فاحص الماكرو 4X")');
  await macroBtn.click();
  await page.waitForTimeout(1200);

  await page.screenshot({ path: path.join(OUT_DIR, '08_fabric_macro_library_modal.png') });
  console.log('Captured 08_fabric_macro_library_modal.png');

  await browser.close();
}

main().catch(console.error);
