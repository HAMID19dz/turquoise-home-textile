import sharp from 'sharp';

async function logFullStats() {
  const statsHero = await sharp('C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\test_hero_mobile.png').stats();
  console.log('Full statsHero:', JSON.stringify(statsHero, null, 2));
}

logFullStats().catch(console.error);
