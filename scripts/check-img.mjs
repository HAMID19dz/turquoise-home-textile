import sharp from 'sharp';
import path from 'path';

async function checkImg() {
  const meta = await sharp('C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\ar_customizer_mobile_375.png').metadata();
  console.log('Image metadata:', meta);
  const stats = await sharp('C:\\Users\\ARES\\.gemini\\antigravity\\brain\\6ec95a54-7d4a-444c-9476-3d57a646c1e2\\screenshots\\m4\\ar_customizer_mobile_375.png').stats();
  console.log('Dominant channels:', stats.channels);
}

checkImg().catch(console.error);
