import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function checkRTLMobile() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    return {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
      dir: document.documentElement.dir,
      h1Rect: document.querySelector('h1')?.getBoundingClientRect()
    };
  });
  console.log('RTL 375 info:', info);
  await browser.close();
}

checkRTLMobile().catch(console.error);
