import sharp from 'sharp';

async function main() {
  const { data, info } = await sharp('public/assets/source/logo-source.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log(`Channels: ${info.channels}, Width: ${info.width}, Height: ${info.height}`);
  // Check top-left corner (0,0)
  console.log(`Pixel (0,0): R=${data[0]}, G=${data[1]}, B=${data[2]}, A=${data[3]}`);
  // Check center (320, 240)
  const centerIdx = (240 * info.width + 320) * info.channels;
  console.log(`Pixel (320,240): R=${data[centerIdx]}, G=${data[centerIdx+1]}, B=${data[centerIdx+2]}, A=${data[centerIdx+3]}`);
}

main().catch(console.error);
