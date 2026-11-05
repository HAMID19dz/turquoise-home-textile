import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function listButtons() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const title = await page.title();
  console.log('Page Title:', title);
  const content = await page.content();
  console.log('Root HTML length:', content.length);
  const buttons = await page.$$eval('button', els => els.map(e => e.innerText.trim()));
  console.log('Buttons:', buttons);
  await browser.close();
}

listButtons().catch(console.error);
