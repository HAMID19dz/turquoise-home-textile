import { chromium } from 'playwright-core';

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function checkWhereScrolled() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const customizer = await page.$('#customizer');
  console.log('Customizer found?', !!customizer);

  const beforeY = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => {
    document.getElementById('customizer')?.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(1000);
  const afterY = await page.evaluate(() => window.scrollY);
  console.log('Before Y:', beforeY, 'After Y:', afterY);

  const rect = await page.evaluate(() => {
    return document.getElementById('customizer')?.getBoundingClientRect();
  });
  console.log('Customizer rect after scroll:', rect);

  const headerRect = await page.evaluate(() => {
    return document.querySelector('#customizer h2')?.getBoundingClientRect();
  });
  console.log('H2 rect after scroll:', headerRect);

  await browser.close();
}

checkWhereScrolled().catch(console.error);
