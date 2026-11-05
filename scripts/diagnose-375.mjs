import { chromium } from 'playwright-core';

async function diagnose375() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  const diag = await page.evaluate(() => {
    const root = document.getElementById('root');
    const main = document.querySelector('main');
    const hero = document.querySelector('section');
    return {
      rootDisplay: root ? window.getComputedStyle(root).display : null,
      rootOpacity: root ? window.getComputedStyle(root).opacity : null,
      rootVisibility: root ? window.getComputedStyle(root).visibility : null,
      rootWidth: root ? root.offsetWidth : null,
      rootHeight: root ? root.offsetHeight : null,
      mainWidth: main ? main.offsetWidth : null,
      mainHeight: main ? main.offsetHeight : null,
      heroWidth: hero ? hero.offsetWidth : null,
      heroHeight: hero ? hero.offsetHeight : null,
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      bodyColor: window.getComputedStyle(document.body).color,
      h1Text: document.querySelector('h1')?.innerText,
      h1Visible: document.querySelector('h1') ? window.getComputedStyle(document.querySelector('h1')).visibility : null,
      h1Opacity: document.querySelector('h1') ? window.getComputedStyle(document.querySelector('h1')).opacity : null,
    };
  });
  console.log('Diagnosis 375:', diag);
  await browser.close();
}

diagnose375().catch(console.error);
