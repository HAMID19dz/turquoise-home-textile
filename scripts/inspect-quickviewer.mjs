import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const btn = page.locator('button[title*="3D"]').first();
  await btn.click();
  await page.waitForTimeout(2000);

  const dialogHtml = await page.locator('div[role="dialog"]').innerHTML();
  console.log('Includes Colors text?:', dialogHtml.includes('الألوان'));

  const buttons = await page.locator('div[role="dialog"] button').all();
  for (const b of buttons) {
    const text = await b.innerText();
    const label = await b.getAttribute('aria-label');
    const title = await b.getAttribute('title');
    const style = await b.getAttribute('style');
    console.log(`Button: text="${text}", aria-label="${label}", title="${title}", style="${style}"`);
  }

  await browser.close();
}

main().catch(console.error);
