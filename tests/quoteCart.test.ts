import { describe, it, expect, beforeEach } from 'vitest';
import { useQuoteCartStore } from '../src/store/quoteCartStore';

describe('Milestone M5: Multi-Product Quote Cart Store & WhatsApp Compiler', () => {
  beforeEach(() => {
    useQuoteCartStore.getState().clearCart();
    useQuoteCartStore.setState({ isOpen: false });
  });

  it('starts with an empty cart and closed drawer', () => {
    const state = useQuoteCartStore.getState();
    expect(state.items.length).toBe(0);
    expect(state.isOpen).toBe(false);
  });

  it('adds catalog items and opens cart drawer', () => {
    const store = useQuoteCartStore.getState();
    store.addItem({
      type: 'catalog',
      productId: 'leather-armchair',
      name: { ar: 'كرسي بذراعين جلد', fr: 'Fauteuil Cuir', en: 'Leather Armchair' },
      colorHex: '#B8AEA3',
      dimensionsCm: { w: 90, d: 88, h: 86 },
    });

    const updated = useQuoteCartStore.getState();
    expect(updated.items.length).toBe(1);
    expect(updated.isOpen).toBe(true);
    expect(updated.items[0].quantity).toBe(1);
    expect(updated.items[0].productId).toBe('leather-armchair');
  });

  it('increments quantity when identical item is added again', () => {
    const store = useQuoteCartStore.getState();
    const itemData = {
      type: 'catalog' as const,
      productId: 'side-table',
      name: { ar: 'طاولة جانبية', fr: 'Table d’appoint', en: 'Side Table' },
      colorHex: '#5C4033',
      dimensionsCm: { w: 60, d: 60, h: 62 },
    };

    store.addItem(itemData);
    store.addItem(itemData);

    const updated = useQuoteCartStore.getState();
    expect(updated.items.length).toBe(1);
    expect(updated.items[0].quantity).toBe(2);
  });

  it('updates quantity and removes item when quantity reaches zero', () => {
    const store = useQuoteCartStore.getState();
    store.addItem({
      type: 'bespoke',
      productId: 'boucle-sofa',
      name: { ar: 'أريكة بوكليه', fr: 'Canapé Bouclé', en: 'Bouclé Sofa' },
      colorHex: '#F4F0EA',
      dimensionsCm: { w: 260, d: 100, h: 80 },
    });

    const itemId = useQuoteCartStore.getState().items[0].id;
    store.updateQuantity(itemId, 3);
    expect(useQuoteCartStore.getState().items[0].quantity).toBe(3);

    store.updateQuantity(itemId, 0);
    expect(useQuoteCartStore.getState().items.length).toBe(0);
  });

  it('compiles consolidated WhatsApp quotation message in Arabic with phone +213 556 92 91 34', () => {
    const store = useQuoteCartStore.getState();
    store.addItem({
      type: 'catalog',
      productId: 'leather-sofa',
      name: { ar: 'أريكة جلدية كلاسيكية', fr: 'Canapé Cuir', en: 'Leather Sofa' },
      colorHex: '#B8AEA3',
      woodHex: '#5C4033',
      metalHex: '#D4AF37',
      dimensionsCm: { w: 230, d: 95, h: 84 },
      quantity: 2,
    });
    store.addItem({
      type: 'bespoke',
      productId: 'curtain-cream',
      name: { ar: 'ستائر حريرية مطرزة', fr: 'Rideaux Soie', en: 'Embroidered Silk Curtains' },
      colorHex: '#EADBCA',
      dimensionsCm: { w: 280, d: 25, h: 290 },
      quantity: 1,
      designUrl: 'https://turquoise-textile.dz/ar/design?piece=curtain-cream',
    });

    const url = store.compileWhatsAppUrl('ar');
    expect(url).toContain('wa.me/213556929134');

    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('أريكة جلدية كلاسيكية');
    expect(decoded).toContain('الكمية: 2');
    expect(decoded).toContain('ستائر حريرية مطرزة');
    expect(decoded).toContain('تصميم مخصص');
  });

  it('compiles consolidated WhatsApp quotation message in French and English', () => {
    const store = useQuoteCartStore.getState();
    store.addItem({
      type: 'catalog',
      productId: 'coffee-table',
      name: { ar: 'طاولة قهوة', fr: 'Table Basse Élégance', en: 'Elegance Coffee Table' },
      colorHex: '#5C4033',
      dimensionsCm: { w: 120, d: 70, h: 42 },
    });

    const urlFr = decodeURIComponent(store.compileWhatsAppUrl('fr'));
    expect(urlFr).toContain('Table Basse Élégance');
    expect(urlFr).toContain('Collection Showroom');

    const urlEn = decodeURIComponent(store.compileWhatsAppUrl('en'));
    expect(urlEn).toContain('Elegance Coffee Table');
    expect(urlEn).toContain('Catalog Piece');
  });
});
