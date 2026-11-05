import { chromium } from 'playwright-core';
import sharp from 'sharp';

async function testFullPageMobile() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:4173/ar', { waitUntil: 'networkidle' });

  // Take screenshot at top of page (hero)
  await page.screenshot({ path: 'C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\test_hero_mobile.png' });
  
  const statsHero = await sharp('C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\test_hero_mobile.png').stats();
  console.log('Hero stdev:', statsHero.channels[0].stdev);

  // Now let's see what customizer.screenshot() produces (not page.screenshot)
  const customizer = await page.$('#customizer');
  if (customizer) {
    await customizer.screenshot({ path: 'C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\test_customizer_element.png' });
    const statsEl = await sharp('C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\test_customizer_element.png').stats();
    console.log('Customizer element screenshot stdev:', statsEl.channels[0].stdev);
  }

  await browser.close();
}

testFullPageMobile().catch(console.error);
