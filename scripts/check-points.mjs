import { chromium } from 'playwright-core';

async function checkPoints() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    const el = document.getElementById('customizer');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top);
    }
  });
  await page.waitForTimeout(1000);

  const points = await page.evaluate(() => {
    return [
      document.elementFromPoint(100, 100)?.outerHTML.slice(0, 100),
      document.elementFromPoint(100, 300)?.outerHTML.slice(0, 100),
      document.elementFromPoint(100, 500)?.outerHTML.slice(0, 100),
    ];
  });
  console.log('Points at top:', points);

  // Take screenshot here
  await page.screenshot({
    path: 'C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\ar_customizer_mobile_375.png'
  });

  await browser.close();
}

checkPoints().catch(console.error);
