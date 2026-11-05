import { describe, it, expect } from 'vitest';
import { getAllProducts } from '../src/types/product';
import { buildCompareWhatsAppUrl } from '../src/utils/whatsapp';
import { siteConfig } from '../src/config/site';

describe('3D Side-by-Side Comparison & WhatsApp Compiler', () => {
  const products = getAllProducts();
  const piece1 = products[0]; // leather-armchair
  const piece2 = products[1]; // leather-sofa

  it('compiles a dual-product comparison WhatsApp URL in Arabic with phone +213 556 92 91 34', () => {
    const url = buildCompareWhatsAppUrl(piece1, piece2, 'ar');
    expect(url).toContain(`https://wa.me/${siteConfig.whatsapp.number}?text=`);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('السلام عليكم ورحمة الله');
    expect(decoded).toContain('مقارنة أسعار للقطعتين');
    expect(decoded).toContain(piece1.name.ar);
    expect(decoded).toContain(piece2.name.ar);
  });

  it('compiles a dual-product comparison WhatsApp URL in French and English', () => {
    const urlFr = buildCompareWhatsAppUrl(piece1, piece2, 'fr');
    const decodedFr = decodeURIComponent(urlFr);
    expect(decodedFr).toContain('Bonjour Atelier Turquoise');
    expect(decodedFr).toContain('comparer et obtenir un devis');
    expect(decodedFr).toContain(piece1.name.fr);
    expect(decodedFr).toContain(piece2.name.fr);

    const urlEn = buildCompareWhatsAppUrl(piece1, piece2, 'en');
    const decodedEn = decodeURIComponent(urlEn);
    expect(decodedEn).toContain('Hello Turquoise Atelier');
    expect(decodedEn).toContain('compare and request a quote');
    expect(decodedEn).toContain(piece1.name.en);
    expect(decodedEn).toContain(piece2.name.en);
  });
});
