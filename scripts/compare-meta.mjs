import sharp from 'sharp';

async function compare() {
  const meta375 = await sharp('C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m4/test_w_375.png').metadata();
  const meta768 = await sharp('C:/Users/ARES/.gemini/antigravity/brain/6ec95a54-7d4a-444c-9476-3d57a646c1e2/screenshots/m4/test_w_768.png').metadata();
  console.log('375 meta:', meta375);
  console.log('768 meta:', meta768);
}

compare().catch(console.error);
