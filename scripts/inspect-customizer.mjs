import { chromium } from 'playwright-core';

async function inspectCustomizer() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const el = document.getElementById('customizer');
    if (!el) return null;
    return {
      innerHTML: el.innerHTML.slice(0, 500),
      offsetHeight: el.offsetHeight,
      offsetWidth: el.offsetWidth,
      display: window.getComputedStyle(el).display,
      visibility: window.getComputedStyle(el).visibility,
      childrenCount: el.children.length
    };
  });

  console.log('Customizer element info on mobile:', info);
  await browser.close();
}

inspectCustomizer().catch(console.error);
