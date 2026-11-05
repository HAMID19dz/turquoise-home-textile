import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function checkH1() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const h1Info = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return null;
    const r = h1.getBoundingClientRect();
    const s = window.getComputedStyle(h1);
    return {
      rect: r,
      color: s.color,
      visibility: s.visibility,
      display: s.display,
      opacity: s.opacity,
      parentDisplay: h1.parentElement ? window.getComputedStyle(h1.parentElement).display : null,
      parentRect: h1.parentElement ? h1.parentElement.getBoundingClientRect() : null,
    };
  });
  console.log('H1 info:', h1Info);
  await browser.close();
}

checkH1().catch(console.error);
