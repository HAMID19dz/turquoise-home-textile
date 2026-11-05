import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function findCoveringElement() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const coverings = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const covers = [];
    for (const el of all) {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (
        (style.position === 'fixed' || style.position === 'absolute') &&
        rect.width >= 350 &&
        rect.height >= 750
      ) {
        covers.push({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          zIndex: style.zIndex,
          bg: style.backgroundColor,
          opacity: style.opacity,
          display: style.display,
          visibility: style.visibility
        });
      }
    }
    return covers;
  });

  console.log('Covering elements on 375:', coverings);
  await browser.close();
}

findCoveringElement().catch(console.error);
