import { chromium } from 'playwright-core';
import sharp from 'sharp';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function testWidths() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const widths = [375, 420, 600, 768, 1024, 1440];

  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const shotPath = `C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m4/test_w_${w}.png`;
    await page.screenshot({ path: shotPath });
    const stats = await sharp(shotPath).stats();
    console.log(`Width ${w} - channel 0 stdev:`, stats.channels[0].stdev);
    await page.close();
  }

  await browser.close();
}

testWidths().catch(console.error);
