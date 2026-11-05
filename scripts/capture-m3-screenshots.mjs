import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const OUT_DIR = 'C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m3';
fs.mkdirSync(OUT_DIR, { recursive: true });

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

const LANGUAGES = ['ar', 'fr', 'en'];

async function capture() {
  console.log('Launching Chrome via Playwright-core for M3 verification...');
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

  // 1. Capture Hero 3D section across viewports and languages
  for (const lang of LANGUAGES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height }
      });

      const url = `http://localhost:4173/${lang}`;
      console.log(`Capturing Hero 3D in ${lang} at ${vp.name}...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500); // Allow 3D canvas and textures to render

      const filename = `${lang}_hero3d_${vp.name}_${vp.width}.png`;
      const outPath = path.join(OUT_DIR, filename);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved screenshot to ${outPath}`);

      await page.close();
    }
  }

  // 2. Open 3D Viewer Modal for Leather Armchair (Day preset)
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const btn3d = await page.$('button:has-text("3D")');
    if (btn3d) {
      await btn3d.click();
      await page.waitForTimeout(1500);
      const outPath = path.join(OUT_DIR, 'ar_modal_3d_armchair_day_1440.png');
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved Armchair 3D Day modal to ${outPath}`);

      // Toggle to Warm Evening
      const eveningBtn = await page.$('button[aria-label="Toggle Lighting"]');
      if (eveningBtn) {
        await eveningBtn.click();
        await page.waitForTimeout(800);
        const outEveningPath = path.join(OUT_DIR, 'ar_modal_3d_armchair_evening_1440.png');
        await page.screenshot({ path: outEveningPath, fullPage: false });
        console.log(`Saved Armchair 3D Evening modal to ${outEveningPath}`);
      }
    }
    await page.close();
  }

  // 3. Open 3D Viewer Modal on mobile (375px)
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const btn3d = await page.$('button:has-text("3D")');
    if (btn3d) {
      await btn3d.click();
      await page.waitForTimeout(1500);
      const outPath = path.join(OUT_DIR, 'ar_modal_3d_mobile_375.png');
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved Mobile 3D modal to ${outPath}`);
    }
    await page.close();
  }

  // 4. Measure FPS in browser
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const fpsResult = await page.evaluate(async () => {
      return new Promise((resolve) => {
        let frames = 0;
        const start = performance.now();
        function count() {
          frames++;
          if (performance.now() - start < 1000) {
            requestAnimationFrame(count);
          } else {
            const durationSec = (performance.now() - start) / 1000;
            resolve(Math.round(frames / durationSec));
          }
        }
        requestAnimationFrame(count);
      });
    });

    console.log(`Measured 3D Scene FPS: ${fpsResult} FPS`);
    fs.writeFileSync(path.join(OUT_DIR, 'fps.json'), JSON.stringify({ fps: fpsResult, timestamp: new Date().toISOString() }, null, 2));
    await page.close();
  }

  await browser.close();
  console.log('Milestone M3 screenshots and FPS check completed successfully!');
}

capture().catch(err => {
  console.error('M3 capture failed:', err);
  process.exit(1);
});
