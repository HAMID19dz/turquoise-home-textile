import { describe, it, expect } from 'vitest';
import products from '../src/data/products.json';
import { getAllProducts } from '../src/types/product';
import { buildProductWhatsAppUrl } from '../src/utils/whatsapp';

describe('Catalog Integrity & Structure', () => {
  it('contains exactly 9 products (including approved side-table)', () => {
    expect(products.length).toBe(9);
  });

  it('all products have valid categories, dimensions, and localized texts', () => {
    for (const p of products) {
      expect(['seating', 'tables', 'curtains']).toContain(p.category);
      expect(p.dimensionsCm.w).toBeGreaterThan(0);
      expect(p.dimensionsCm.d).toBeGreaterThan(0);
      expect(p.dimensionsCm.h).toBeGreaterThan(0);

      // Localized names
      expect(p.name.ar.length).toBeGreaterThan(0);
      expect(p.name.fr.length).toBeGreaterThan(0);
      expect(p.name.en.length).toBeGreaterThan(0);

      // Localized materials
      expect(p.materials.ar.length).toBeGreaterThan(0);
      expect(p.materials.fr.length).toBeGreaterThan(0);
      expect(p.materials.en.length).toBeGreaterThan(0);

      // Color options
      expect(p.colorOptions.length).toBeGreaterThan(0);
      for (const col of p.colorOptions) {
        expect(col.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  it('every product has an associated generated photo asset', () => {
    const all = getAllProducts();
    for (const p of all) {
      expect(p.photo, `Product ${p.id} should have a photo`).not.toBeNull();
      if (p.photo) {
        expect(p.photo.src).toContain('.webp');
        expect(p.photo.lqip).toContain('data:image/webp;base64');
      }
    }
  });

  it('builds valid WhatsApp URLs in all three languages', () => {
    const all = getAllProducts();
    const sample = all[0];

    const arUrl = buildProductWhatsAppUrl(sample, 'ar');
    const frUrl = buildProductWhatsAppUrl(sample, 'fr');
    const enUrl = buildProductWhatsAppUrl(sample, 'en');

    expect(arUrl).toContain('https://wa.me/213556929134?text=');
    expect(frUrl).toContain('https://wa.me/213556929134?text=');
    expect(enUrl).toContain('https://wa.me/213556929134?text=');

    // Check decoding produces readable text
    const arDecoded = decodeURIComponent(arUrl.split('text=')[1]);
    expect(arDecoded).toContain('تركواز');
  });
});
