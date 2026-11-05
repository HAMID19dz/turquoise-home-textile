import sharp from 'sharp';
import fs from 'fs';

async function main() {
  const inputBuffer = fs.readFileSync('public/assets/source/logo-source.png');
  const meta = await sharp(inputBuffer).metadata();
  console.log('Processing full brand logo badge...');

  // 1. High-res original full crest with subtle rounded corners and luxury gold border
  const roundedCardSvg = Buffer.from(`
    <svg width="${meta.width}" height="${meta.height}">
      <rect x="0" y="0" width="${meta.width}" height="${meta.height}" rx="32" ry="32" fill="#121212" />
      <rect x="3" y="3" width="${meta.width - 6}" height="${meta.height - 6}" rx="30" ry="30" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.6" />
    </svg>
  `);

  // Crop slightly to remove outer margins if needed, or save full badge
  await sharp(inputBuffer)
    .resize(640, 640)
    .png()
    .toFile('public/logo-full.png');
  console.log('Saved public/logo-full.png');

  // 2. Also create transparent cutout of the gold lettering + pegasus for light backgrounds
  const { data, info } = await sharp(inputBuffer).raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0; i < info.width * info.height; i++) {
    const srcIdx = i * info.channels;
    const destIdx = i * 4;
    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];
    
    // Perceived luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Background threshold: below 30 is dark background
    // Between 30 and 80 is soft shadow/blend
    let alpha = 0;
    if (lum > 75) {
      alpha = 255;
    } else if (lum > 25) {
      alpha = Math.round(((lum - 25) / 50) * 255);
    }

    rgba[destIdx] = r;
    rgba[destIdx + 1] = g;
    rgba[destIdx + 2] = b;
    rgba[destIdx + 3] = alpha;
  }

  await sharp(rgba, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    }
  })
    .png()
    .toFile('public/logo-transparent.png');
  console.log('Saved public/logo-transparent.png');
}

main().catch(console.error);
