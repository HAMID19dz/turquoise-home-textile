import { siteConfig } from '../config/site';
import type { Product } from '../types/product';
import type { SupportedLanguage } from '../i18n';
import type { CustomizerState } from '../store/customizerStore';
import { buildShareableDesignUrl } from './designUrl';

export function buildProductWhatsAppUrl(
  product: Product,
  language: SupportedLanguage
): string {
  const prodName = product.name[language] || product.name.ar;
  const dims = `${product.dimensionsCm.w} × ${product.dimensionsCm.d} × ${product.dimensionsCm.h} cm`;
  const materials = (product.materials[language] || product.materials.ar).slice(0, 2).join(' / ');

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://turquoise-home.com';
  const productUrl = `${currentHost}/${language}#catalog`;

  let msg = '';
  if (language === 'ar') {
    msg = `السلام عليكم ورحمة الله،
أود الاستفسار وطلب عرض سعر للقطعة التالية من معرض تركواز:
✨ *المنتج:* ${prodName}
📐 *المقاسات الأساسية:* ${dims}
🪵 *الخامات:* ${materials}
🔗 *رابط القطعة في الكتالوج:* ${productUrl}

يرجى إفادتي بالتفاصيل ومدة التصنيع المتاحة. شكراً لكم!`;
  } else if (language === 'fr') {
    msg = `Bonjour Atelier Turquoise,
Je souhaite obtenir un devis pour cette création :
✨ *Modèle :* ${prodName}
📐 *Dimensions :* ${dims}
🪵 *Matières :* ${materials}
🔗 *Fiche produit :* ${productUrl}

Pourriez-vous me préciser les modalités de commande et délais ? Merci !`;
  } else {
    msg = `Hello Turquoise Atelier,
I would like to request a quote and details for the following masterpiece:
✨ *Product:* ${prodName}
📐 *Dimensions:* ${dims}
🪵 *Materials:* ${materials}
🔗 *Catalog link:* ${productUrl}

Please let me know about availability and production timeframe. Thank you!`;
  }

  return siteConfig.whatsapp.buildUrl(msg);
}

export function buildCustomizerWhatsAppUrl(
  state: CustomizerState,
  language: SupportedLanguage
): string {
  const prodName = state.currentProduct.name[language] || state.currentProduct.name.ar;
  const dims = `${state.dimensionsCm.w} × ${state.dimensionsCm.d} × ${state.dimensionsCm.h} cm`;
  const shareableUrl = buildShareableDesignUrl(language, state);

  const isCurtain = state.currentProduct.category === 'curtains';

  let msg = '';

  if (language === 'ar') {
    msg = `السلام عليكم ورحمة الله،
أرغب بطلب عرض سعر لتصميم مخصص حسب المقاس من معرض تركواز:

✨ *القطعة الأساسية:* ${prodName}
📐 *المقاسات المطلوبة:* ${dims}
🎨 *رمز لون القماش/الجلد:* ${state.selectedColorHex}
🪵 *تشطيب الخشب:* ${state.selectedWoodHex}
🪙 *تشطيب المعدن:* ${state.selectedMetalHex}`;

    if (isCurtain) {
      msg += `\n🪟 *مواصفات الستائر:*
- معامل التموج والانسدال: ×${state.curtainOptions.fullness}
- التطريز: ${state.curtainOptions.embroidery === 'gold' ? 'خيوط ذهبية' : state.curtainOptions.embroidery === 'silver' ? 'خيوط فضية' : 'بدون'}
- الأربطة: ${state.curtainOptions.tieback === 'pearl' ? 'أربطة لؤلؤية فاخرة' : 'حبل مذهب'}`;
    }

    if (state.clientName) msg += `\n👤 *اسم العميل:* ${state.clientName}`;
    if (state.clientCity) msg += `\n📍 *المدينة / الولاية:* ${state.clientCity}`;
    if (state.roomPhoto) msg += `\n📷 *ملاحظة:* سأقوم بإرفاق صورة الغرفة في المحادثة مباشرة.`;
    if (state.clientNotes) msg += `\n📝 *ملاحظات إضافية:* ${state.clientNotes}`;

    msg += `\n\n🔗 *رابط استعراض التصميم ثلاثي الأبعاد مباشرة:*\n${shareableUrl}

يرجى إفادتي بالتكلفة والوقت التقديري للإنجاز. شكراً جزيلاً!`;
  } else if (language === 'fr') {
    msg = `Bonjour Atelier Turquoise,
Je souhaite commander une pièce sur-mesure personnalisée :

✨ *Modèle :* ${prodName}
📐 *Dimensions sur-mesure :* ${dims}
🎨 *Couleur textile/cuir :* ${state.selectedColorHex}
🪵 *Finition bois :* ${state.selectedWoodHex}
🪙 *Finition métal :* ${state.selectedMetalHex}`;

    if (isCurtain) {
      msg += `\n🪟 *Détails rideaux :*
- Ampleur : ×${state.curtainOptions.fullness}
- Broderie : ${state.curtainOptions.embroidery}
- Embrasses : ${state.curtainOptions.tieback}`;
    }

    if (state.clientName) msg += `\n👤 *Client :* ${state.clientName}`;
    if (state.clientCity) msg += `\n📍 *Ville :* ${state.clientCity}`;
    if (state.roomPhoto) msg += `\n📷 *Photo de la pièce :* Je joins la photo directement dans ce chat.`;
    if (state.clientNotes) msg += `\n📝 *Remarques :* ${state.clientNotes}`;

    msg += `\n\n🔗 *Lien 3D interactif du design :*\n${shareableUrl}`;
  } else {
    msg = `Hello Turquoise Atelier,
I would like to request a bespoke quote for my custom design:

✨ *Selected Model:* ${prodName}
📐 *Custom Dimensions:* ${dims}
🎨 *Upholstery Color:* ${state.selectedColorHex}
🪵 *Wood Finish:* ${state.selectedWoodHex}
🪙 *Metal Accents:* ${state.selectedMetalHex}`;

    if (isCurtain) {
      msg += `\n🪟 *Curtains Specification:*
- Fullness: ×${state.curtainOptions.fullness}
- Embroidery: ${state.curtainOptions.embroidery}
- Tiebacks: ${state.curtainOptions.tieback}`;
    }

    if (state.clientName) msg += `\n👤 *Client Name:* ${state.clientName}`;
    if (state.clientCity) msg += `\n📍 *City:* ${state.clientCity}`;
    if (state.roomPhoto) msg += `\n📷 *Room Photo:* I will attach my room photo directly in this chat.`;
    if (state.clientNotes) msg += `\n📝 *Notes:* ${state.clientNotes}`;

    msg += `\n\n🔗 *Interactive 3D Link:*\n${shareableUrl}`;
  }

  return siteConfig.whatsapp.buildUrl(msg);
}

export function buildCompareWhatsAppUrl(
  product1: Product,
  product2: Product,
  language: SupportedLanguage
): string {
  const name1 = product1.name[language] || product1.name.ar;
  const name2 = product2.name[language] || product2.name.ar;
  const dims1 = `${product1.dimensionsCm.w} × ${product1.dimensionsCm.d} × ${product1.dimensionsCm.h} cm`;
  const dims2 = `${product2.dimensionsCm.w} × ${product2.dimensionsCm.d} × ${product2.dimensionsCm.h} cm`;

  let msg = '';
  if (language === 'ar') {
    msg = `السلام عليكم ورحمة الله،
أود الاستفسار وطلب مقارنة أسعار للقطعتين التاليتين من معرض تركواز:

1️⃣ *القطعة الأولى:* ${name1}
📐 *المقاسات:* ${dims1}

2️⃣ *القطعة الثانية:* ${name2}
📐 *المقاسات:* ${dims2}

يرجى تزويدي بالأسعار التقريبية وإمكانية تنسيقهما معاً في نفس الصالون / الغرفة. شكراً لكم!`;
  } else if (language === 'fr') {
    msg = `Bonjour Atelier Turquoise,
Je souhaite comparer et obtenir un devis pour ces deux créations :

1️⃣ *Modèle 1 :* ${name1} (${dims1})
2️⃣ *Modèle 2 :* ${name2} (${dims2})

Pourriez-vous me conseiller sur leur harmonie et me communiquer leurs devis respectifs ? Merci !`;
  } else {
    msg = `Hello Turquoise Atelier,
I would like to compare and request a quote for these two pieces:

1️⃣ *Piece 1:* ${name1} (${dims1})
2️⃣ *Piece 2:* ${name2} (${dims2})

Could you advise on their pairing and provide pricing/lead times? Thank you!`;
  }

  return siteConfig.whatsapp.buildUrl(msg);
}

