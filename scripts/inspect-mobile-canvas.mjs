import { chromium } from 'playwright-core';

async function inspectMobileCanvas() {
  const browser = await chromium.launch({
    channel: 'chrome',
    args: ['--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar#customizer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('#customizer canvas');
    if (!canvas) return 'No canvas found in #customizer';
    return {
      width: canvas.width,
      height: canvas.height,
      offsetWidth: canvas.offsetWidth,
      offsetHeight: canvas.offsetHeight,
      dataUrlLength: canvas.toDataURL('image/png').length
    };
  });

  console.log('Canvas info in customizer:', canvasInfo);
  await browser.close();
}

inspectMobileCanvas().catch(console.error);
