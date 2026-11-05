import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIR = 'public/assets/source';
const PRODUCTS_OUT_DIR = 'public/assets/products';
const DATA_OUT_FILE = 'src/data/assets.generated.json';

fs.mkdirSync(PRODUCTS_OUT_DIR, { recursive: true });
fs.mkdirSync('src/data', { recursive: true });
fs.mkdirSync('public', { recursive: true });

const PRODUCTS = [
  {
    id: 'leather-armchair',
    sourceFile: 'WhatsApp Image 2026-11-03 at 22.43.00.jpeg',
    focal: { x: 0.5, y: 0.6 },
    crop: null,
    alt: {
      ar: 'كرسي بذراعين من الجلد الرمادي الفاخر مع تنجيد غائر وأرجل معدنية',
      fr: 'Fauteuil en cuir gris clair avec capitonnage central et pieds en métal foncé',
      en: 'Luxury light grey leather armchair with tufted backrest and dark metal legs'
    }
  },
  {
    id: 'leather-sofa',
    sourceFile: 'WhatsApp Image 2026-11-03 at 22.43.01.jpeg',
    focal: { x: 0.5, y: 0.55 },
    crop: null,
    alt: {
      ar: 'أريكة جلدية رمادية تتسع لشخصين أو ثلاثة مع وسائد هندسية',
      fr: 'Canapé 2-3 places en cuir gris clair assorti avec deux coussins géométriques',
      en: 'Matching light grey leather 2-3 seat sofa with geometric cushions'
    }
  },
  {
    id: 'boucle-sofa',
    sourceFile: 'WhatsApp Image 2026-12221-03 at 22.43.02.jpeg',
    focal: { x: 0.5, y: 0.55 },
    crop: null,
    alt: {
      ar: 'أريكة بوكليه عاجية منحنية مع قاعدة خشبية طبيعية وثلاث وسائد',
      fr: 'Canapé courbé en tissu bouclé ivoire avec base en bois chaleureux et 3 coussins',
      en: 'Curved ivory bouclé sofa with natural warm wood base and three cushions'
    }
  },
  {
    id: 'velvet-accent-chair',
    sourceFile: 'WhatsApp Image 2026-1j1-03 at 22.43.02.jpeg',
    focal: { x: 0.5, y: 0.5 },
    crop: null,
    alt: {
      ar: 'كرسي مفرد فاخر بقماش بيج محكم مع خط أسود رأسي على الذراعين وأرجل فضية',
      fr: 'Fauteuil d’appoint en tissu texturé beige-gris avec bande noire verticale et pieds argentés',
      en: 'Luxury single armchair in textured beige-grey fabric with black vertical arm stripe and silver legs'
    }
  },
  {
    id: 'oval-dining-set',
    sourceFile: '555.jpeg',
    focal: { x: 0.5, y: 0.5 },
    crop: null,
    alt: {
      ar: 'طاولة طعام بيضاوية من الخشب المصقول مع 6 كراسي وحامل شموع ذهبي',
      fr: 'Ensemble table à manger ovale en bois verni, 6 chaises et bougeoir doré',
      en: 'Oval polished warm wood dining table with 6 curved-back chairs and gold candle holder'
    }
  },
  {
    id: 'coffee-table',
    sourceFile: 'WhatsApp Image 2026-11-03 at 22.43.04442.jpeg',
    focal: { x: 0.5, y: 0.6 },
    crop: null,
    alt: {
      ar: 'طاولة قهوة مستطيلة من الخشب الطبيعي مع رف سفلي مفتوح',
      fr: 'Table basse rectangulaire en bois naturel avec étagère inférieure ouverte',
      en: 'Rectangular natural wood coffee table with lower open shelf'
    }
  },
  {
    id: 'side-table',
    sourceFile: 'WhatsApp Image 2026-11-03 at 22.43.44803.jpeg',
    focal: { x: 0.5, y: 0.5 },
    crop: null,
    alt: {
      ar: 'طاولة جانبية كلاسيكية مستديرة من الخشب مع قاعدة ثلاثية وزخارف ذهبية',
      fr: 'Guéridon classique rond en bois verni avec piétement tripode et accents dorés',
      en: 'Classic round wood pedestal side table with tripod curved legs and gold accents'
    }
  },
  {
    id: 'curtain-cream',
    sourceFile: 'WhatsApp Image 2026-11-03 at 2م2.43.01.jpeg',
    focal: { x: 0.5, y: 0.5 },
    crop: null,
    alt: {
      ar: 'ستائر بليسيه عاجية فاخرة مع شريط تطريز ذهبي عريض وأربطة لؤلؤية',
      fr: 'Rideaux plissés ivoire avec large bande de broderie dorée et embrasses de perles',
      en: 'Pleated cream luxury curtains with wide gold embroidery band and pearl tiebacks'
    }
  },
  {
    id: 'curtain-taupe',
    sourceFile: 'WhatsApp Image 2026-11ب-03 at 22.43.01.jpeg',
    focal: { x: 0.5, y: 0.5 },
    crop: null,
    alt: {
      ar: 'ستائر ثقيلة بنقش هندسي باللون الرمادي التوب مع شيفون داخلي أبيض وأربطة لؤلؤية',
      fr: 'Rideaux épais à motifs géométriques gris-taupe avec voilage blanc et embrasses perles',
      en: 'Heavy geometric pattern grey-taupe curtains with inner white sheer and pearl tiebacks'
    }
  },
  // Secondary / context views
  {
    id: 'oval-dining-set-showroom',
    sourceFile: 'WhatsApp Image 2026-11-03 at 22.4443.03.jpeg',
    focal: { x: 0.5, y: 0.5 },
    isSecondary: true,
    alt: {
      ar: 'منظر عام لطقم السفرة البيضاوي داخل صالة عرض تركواز',
      fr: 'Vue d’ensemble de la table ovale dans la salle d’exposition Turquoise',
      en: 'Showroom perspective of the oval dining set'
    }
  },
  {
    id: 'side-table-detail',
    sourceFile: 'WhatsApp Image 2026-11-03 at 22.47743.04.jpeg',
    focal: { x: 0.5, y: 0.5 },
    isSecondary: true,
    alt: {
      ar: 'لقطة مقربة لسطح الطاولة الجانبية المستديرة وتفاصيل الخشب المصقول',
      fr: 'Détail du plateau supérieur de la table d’appoint ronde en bois',
      en: 'Close-up detail of the round side table polished wood surface'
    }
  },
  {
    id: 'velvet-accent-chair-rear',
    sourceFile: 'WhatsApp Image 2026-121-03 at 22.43.02.jpeg',
    focal: { x: 0.5, y: 0.5 },
    isSecondary: true,
    alt: {
      ar: 'المنظر الخلفي للكرسي المفرد الفاخر مع الأرجل الفضية',
      fr: 'Vue arrière du fauteuil texturé avec pieds argentés',
      en: 'Rear angle of the textured armchair with silver legs'
    }
  }
];

const WIDTHS = [480, 960, 1600];

// Color extraction helper
async function extractPalette(imageBuffer) {
  const { data, info } = await sharp(imageBuffer)
    .resize(64, 64, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Simple k-means or color quantization
  const colorBuckets = {};
  for (let i = 0; i < data.length; i += 3) {
    // Quantize to 32 steps per channel
    const r = Math.round(data[i] / 16) * 16;
    const g = Math.round(data[i + 1] / 16) * 16;
    const b = Math.round(data[i + 2] / 16) * 16;
    const key = `${r},${g},${b}`;
    colorBuckets[key] = (colorBuckets[key] || 0) + 1;
  }

  const sorted = Object.entries(colorBuckets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    });

  return sorted;
}

// Generate base64 LQIP
async function generateLqip(imageBuffer) {
  const lqipBuffer = await sharp(imageBuffer)
    .resize(20, 20, { fit: 'inside' })
    .blur(3)
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${lqipBuffer.toString('base64')}`;
}

async function processProducts() {
  console.log('--- Processing Product Images ---');
  const manifest = {};

  for (const item of PRODUCTS) {
    const srcPath = path.join(SOURCE_DIR, item.sourceFile);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[WARNING] Missing source file: ${srcPath}`);
      continue;
    }

    console.log(`Processing ${item.id} from ${item.sourceFile}...`);
    const inputBuffer = fs.readFileSync(srcPath);
    const metadata = await sharp(inputBuffer).metadata();

    const palette = await extractPalette(inputBuffer);
    const lqip = await generateLqip(inputBuffer);

    const responsiveFormats = {
      avif: {},
      webp: {},
      jpg: {}
    };

    for (const w of WIDTHS) {
      // Don't upscale past original width * 1.2
      const targetWidth = Math.min(w, Math.round(metadata.width * 1.2));
      
      const avifFileName = `${item.id}-${w}w.avif`;
      const webpFileName = `${item.id}-${w}w.webp`;
      const jpgFileName = `${item.id}-${w}w.jpg`;

      await sharp(inputBuffer)
        .resize(targetWidth, null, { withoutEnlargement: false })
        .avif({ quality: 80, effort: 4 })
        .toFile(path.join(PRODUCTS_OUT_DIR, avifFileName));

      await sharp(inputBuffer)
        .resize(targetWidth, null, { withoutEnlargement: false })
        .webp({ quality: 85 })
        .toFile(path.join(PRODUCTS_OUT_DIR, webpFileName));

      await sharp(inputBuffer)
        .resize(targetWidth, null, { withoutEnlargement: false })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(path.join(PRODUCTS_OUT_DIR, jpgFileName));

      responsiveFormats.avif[w] = `/assets/products/${avifFileName}`;
      responsiveFormats.webp[w] = `/assets/products/${webpFileName}`;
      responsiveFormats.jpg[w] = `/assets/products/${jpgFileName}`;
    }

    // Default primary image
    const defaultJpg = `/assets/products/${item.id}-960w.jpg`;
    const defaultWebp = `/assets/products/${item.id}-960w.webp`;

    manifest[item.id] = {
      id: item.id,
      originalName: item.sourceFile,
      isSecondary: !!item.isSecondary,
      width: metadata.width,
      height: metadata.height,
      aspectRatio: +(metadata.width / metadata.height).toFixed(3),
      focal: item.focal,
      lqip,
      palette,
      defaultColor: palette[0] || '#D4AF37',
      accentColor: palette[1] || '#C5A059',
      alt: item.alt,
      src: defaultWebp,
      srcJpg: defaultJpg,
      srcset: {
        avif: `${responsiveFormats.avif[480]} 480w, ${responsiveFormats.avif[960]} 960w, ${responsiveFormats.avif[1600]} 1600w`,
        webp: `${responsiveFormats.webp[480]} 480w, ${responsiveFormats.webp[960]} 960w, ${responsiveFormats.webp[1600]} 1600w`,
        jpg: `${responsiveFormats.jpg[480]} 480w, ${responsiveFormats.jpg[960]} 960w, ${responsiveFormats.jpg[1600]} 1600w`
      }
    };
  }

  return manifest;
}

async function processLogo() {
  console.log('--- Processing Brand Logo Assets ---');
  const logoSourcePath = path.join(SOURCE_DIR, 'logo-source.png');
  if (!fs.existsSync(logoSourcePath)) {
    console.error(`[ERROR] Logo source file not found at ${logoSourcePath}`);
    return;
  }

  const logoInput = fs.readFileSync(logoSourcePath);
  
  // Crop the circular emblem:
  // Center is (321, 244), radius ~218
  const cropSize = 440;
  const cropLeft = Math.round(321 - cropSize / 2);
  const cropTop = Math.round(244 - cropSize / 2);

  // Circular mask with subtle gold outer ring
  const maskSvg = Buffer.from(`
    <svg width="${cropSize}" height="${cropSize}">
      <circle cx="${cropSize/2}" cy="${cropSize/2}" r="${cropSize/2 - 2}" fill="white" />
    </svg>
  `);

  const croppedEmblem = await sharp(logoInput)
    .extract({ left: cropLeft, top: cropTop, width: cropSize, height: cropSize })
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Add thin gold border ring (SVG overlay)
  const ringSvg = Buffer.from(`
    <svg width="512" height="512">
      <defs>
        <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C5A059" />
          <stop offset="50%" stop-color="#D4AF37" />
          <stop offset="75%" stop-color="#F3E2A9" />
          <stop offset="100%" stop-color="#C5A059" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="253" fill="none" stroke="url(#goldRing)" stroke-width="3" />
    </svg>
  `);

  const finalLogo512 = await sharp(croppedEmblem)
    .resize(506, 506, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 3,
      bottom: 3,
      left: 3,
      right: 3,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .composite([{ input: ringSvg, blend: 'over' }])
    .png()
    .toBuffer();

  // Export logo.png and logo-512.png
  await sharp(finalLogo512).toFile('public/logo.png');
  await sharp(finalLogo512).toFile('public/logo-512.png');
  console.log('Saved public/logo.png & public/logo-512.png');

  // Apple touch icon (180x180, solid black circle background with gold ring)
  const appleIconSvg = Buffer.from(`
    <svg width="180" height="180">
      <defs>
        <linearGradient id="goldRing180" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#C5A059" />
          <stop offset="50%" stop-color="#D4AF37" />
          <stop offset="75%" stop-color="#F3E2A9" />
          <stop offset="100%" stop-color="#C5A059" />
        </linearGradient>
      </defs>
      <rect width="180" height="180" rx="36" fill="#121212" />
      <circle cx="90" cy="90" r="82" fill="none" stroke="url(#goldRing180)" stroke-width="2" />
    </svg>
  `);

  const innerLogo150 = await sharp(croppedEmblem).resize(150, 150).png().toBuffer();
  await sharp(appleIconSvg)
    .composite([{ input: innerLogo150, left: 15, top: 15, blend: 'over' }])
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Saved public/apple-touch-icon.png');

  // Favicon (48x48 png / ico)
  await sharp(finalLogo512)
    .resize(48, 48)
    .png()
    .toFile('public/favicon.png');
  // Also copy as favicon.ico
  await sharp(finalLogo512)
    .resize(32, 32)
    .toFile('public/favicon.ico');
  console.log('Saved public/favicon.ico & public/favicon.png');

  // OpenGraph Image (1200x630) luxury banner
  const ogSvg = Buffer.from(`
    <svg width="1200" height="630">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F1412" />
          <stop offset="50%" stop-color="#141E1A" />
          <stop offset="100%" stop-color="#0B0E0C" />
        </linearGradient>
        <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#C5A059" />
          <stop offset="50%" stop-color="#F3E2A9" />
          <stop offset="100%" stop-color="#D4AF37" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgGrad)" />
      <!-- Gold frame hairline -->
      <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-opacity="0.4" />
      <rect x="30" y="30" width="1140" height="570" fill="none" stroke="#D4AF37" stroke-width="0.5" stroke-opacity="0.2" />
      
      <!-- Typography -->
      <text x="600" y="440" font-family="'Times New Roman', serif" font-size="44" font-weight="bold" fill="url(#goldText)" text-anchor="middle" letter-spacing="8">TURQUOISE</text>
      <text x="600" y="485" font-family="sans-serif" font-size="18" fill="#C5A059" text-anchor="middle" letter-spacing="12">HOME TEXTILE &amp; LUXURY FURNITURE</text>
      <text x="600" y="535" font-family="sans-serif" font-size="22" fill="#EAEAEA" text-anchor="middle" letter-spacing="2">تركواز للأثاث والمنسوجات المنزلية الفاخرة</text>
    </svg>
  `);

  const centerLogo300 = await sharp(croppedEmblem).resize(300, 300).png().toBuffer();
  await sharp(ogSvg)
    .composite([
      { input: centerLogo300, left: 450, top: 90, blend: 'over' }
    ])
    .jpeg({ quality: 90 })
    .toFile('public/og-image.jpg');
  console.log('Saved public/og-image.jpg');
}

async function main() {
  const productManifest = await processProducts();
  await processLogo();

  fs.writeFileSync(DATA_OUT_FILE, JSON.stringify(productManifest, null, 2), 'utf8');
  console.log(`Saved manifest to ${DATA_OUT_FILE}`);
  console.log('Asset intake & processing complete!');
}

main().catch(err => {
  console.error('Asset processing failed:', err);
  process.exit(1);
});
