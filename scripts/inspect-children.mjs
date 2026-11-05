import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function inspectChildren() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  // Scroll so customizer header is at the top of the viewport
  await page.evaluate(() => {
    const el = document.getElementById('customizer');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top);
    }
  });
  await page.waitForTimeout(1000);

  const rects = await page.evaluate(() => {
    const el = document.getElementById('customizer');
    const nodes = el.querySelectorAll('*');
    const result = [];
    for (const n of nodes) {
      if (n.innerText && n.children.length === 0) {
        result.push({
          tag: n.tagName,
          text: n.innerText.slice(0, 30),
          rect: n.getBoundingClientRect()
        });
      }
    }
    return result.slice(0, 10);
  });
  console.log('Text nodes and rects:', rects);

  await browser.close();
}

inspectChildren().catch(console.error);
