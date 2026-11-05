import { describe, it, expect, beforeEach } from 'vitest';
import {
  useCustomizerStore,
  PRODUCT_DIMENSION_LIMITS,
  LUXURY_PALETTES,
  WOOD_FINISHES,
  METAL_FINISHES,
} from '../src/store/customizerStore';
import {
  encodeDesignParams,
  decodeDesignParams,
  buildShareableDesignUrl,
  applyDecodedParamsToStore,
} from '../src/utils/designUrl';
import { buildCustomizerWhatsAppUrl } from '../src/utils/whatsapp';
import products from '../src/data/products.json';

describe('Milestone M4: 3D Bespoke Customizer & Order Flow', () => {
  beforeEach(() => {
    // Reset customizer store state before each test
    useCustomizerStore.getState().resetToDefaults();
  });

  describe('Dimension Limits & Catalog Coverage', () => {
    it('defines bounded physical limits for all 9 products', () => {
      expect(products.length).toBe(9);
      for (const prod of products) {
        const limits = PRODUCT_DIMENSION_LIMITS[prod.id];
        expect(limits, `Expected limits for ${prod.id}`).toBeDefined();
        expect(limits.minW).toBeLessThan(limits.maxW);
        expect(limits.minD).toBeLessThan(limits.maxD);
        expect(limits.minH).toBeLessThan(limits.maxH);
      }
    });

    it('has curated luxury swatches for fabrics, woods, and metals', () => {
      expect(LUXURY_PALETTES.length).toBeGreaterThanOrEqual(6);
      expect(WOOD_FINISHES.length).toBeGreaterThanOrEqual(4);
      expect(METAL_FINISHES.length).toBeGreaterThanOrEqual(3);

      for (const swatch of LUXURY_PALETTES) {
        expect(swatch.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(swatch.name.ar).toBeTruthy();
        expect(swatch.name.fr).toBeTruthy();
        expect(swatch.name.en).toBeTruthy();
      }
    });
  });

  describe('URL Encoding & Decoding (Shareable Design Links)', () => {
    it('encodes and decodes design parameters with high fidelity', () => {
      const state = {
        selectedProductId: 'boucle-sofa',
        selectedColorHex: '#F4F0EA',
        selectedWoodHex: '#5C4033',
        selectedMetalHex: '#D4AF37',
        dimensionsCm: { w: 240, d: 95, h: 78 },
      };

      const queryString = encodeDesignParams(state);
      expect(queryString).toContain('piece=boucle-sofa');
      expect(queryString).toContain('color=F4F0EA');
      expect(queryString).toContain('w=240');

      const decoded = decodeDesignParams(`?${queryString}`);
      expect(decoded).not.toBeNull();
      expect(decoded?.piece).toBe('boucle-sofa');
      expect(decoded?.color?.toUpperCase()).toBe('#F4F0EA');
      expect(decoded?.wood?.toUpperCase()).toBe('#5C4033');
      expect(decoded?.metal?.toUpperCase()).toBe('#D4AF37');
      expect(decoded?.w).toBe(240);
      expect(decoded?.d).toBe(95);
      expect(decoded?.h).toBe(78);
    });

    it('builds full absolute shareable URLs', () => {
      const state = {
        selectedProductId: 'leather-armchair',
        selectedColorHex: '#B8AEA3',
        selectedWoodHex: '#3A2312',
        selectedMetalHex: '#D4AF37',
        dimensionsCm: { w: 90, d: 85, h: 82 },
      };

      const url = buildShareableDesignUrl('ar', state, 'https://turquoise-textile.dz');
      expect(url).toContain('https://turquoise-textile.dz/ar/design?');
      expect(url).toContain('piece=leather-armchair');
    });

    it('applies decoded parameters safely into the store', () => {
      const decoded = {
        piece: 'velvet-accent-chair',
        color: '#8A9A86',
        wood: '#3A2312',
        metal: '#252528',
        w: 88,
        d: 82,
        h: 76,
      };

      applyDecodedParamsToStore(decoded, {
        selectProduct: useCustomizerStore.getState().selectProduct,
        setColorHex: useCustomizerStore.getState().setColorHex,
        setWoodHex: useCustomizerStore.getState().setWoodHex,
        setMetalHex: useCustomizerStore.getState().setMetalHex,
        setDimensions: useCustomizerStore.getState().setDimensions,
      });

      const storeState = useCustomizerStore.getState();
      expect(storeState.selectedProductId).toBe('velvet-accent-chair');
      expect(storeState.selectedColorHex).toBe('#8A9A86');
      expect(storeState.selectedWoodHex).toBe('#3A2312');
      expect(storeState.selectedMetalHex).toBe('#252528');
      expect(storeState.dimensionsCm.w).toBe(88);
    });
  });

  describe('WhatsApp Custom Quotation Compiler', () => {
    it('compiles detailed WhatsApp quotation URL in Arabic with phone number and parameters', () => {
      const storeState = useCustomizerStore.getState();
      const url = buildCustomizerWhatsAppUrl(storeState, 'ar');

      expect(url).toContain('wa.me/213556929134');
      const decodedUrl = decodeURIComponent(url);
      expect(decodedUrl).toContain('تصميم مخصص');
      expect(decodedUrl).toContain('المقاسات المطلوبة');
      expect(decodedUrl).toContain('رابط استعراض التصميم');
    });

    it('compiles detailed WhatsApp quotation URL in French and English', () => {
      const storeState = useCustomizerStore.getState();
      const urlFr = decodeURIComponent(buildCustomizerWhatsAppUrl(storeState, 'fr'));
      expect(urlFr).toContain('sur-mesure');
      expect(urlFr).toContain('Dimensions sur-mesure');

      const urlEn = decodeURIComponent(buildCustomizerWhatsAppUrl(storeState, 'en'));
      expect(urlEn).toContain('bespoke');
      expect(urlEn).toContain('Custom Dimensions');
    });
  });

  describe('Zustand Customizer Store Operations', () => {
    it('switches product and clamps dimensions to valid ranges', () => {
      const store = useCustomizerStore.getState();
      store.selectProduct('side-table');

      expect(useCustomizerStore.getState().selectedProductId).toBe('side-table');
      expect(useCustomizerStore.getState().currentProduct.id).toBe('side-table');

      // Clamping test: side-table maxW is 75
      store.setDimensions({ w: 999 });
      expect(useCustomizerStore.getState().dimensionsCm.w).toBe(75);

      // side-table minW is 45
      store.setDimensions({ w: 10 });
      expect(useCustomizerStore.getState().dimensionsCm.w).toBe(45);
    });

    it('saves custom designs to local state and keeps maximum 5 designs FIFO', () => {
      const store = useCustomizerStore.getState();

      // Clear any prior saved designs
      useCustomizerStore.setState({ savedDesigns: [] });

      for (let i = 1; i <= 7; i++) {
        store.setColorHex(LUXURY_PALETTES[i % LUXURY_PALETTES.length].hex);
        store.saveCurrentDesign();
      }

      const saved = useCustomizerStore.getState().savedDesigns;
      expect(saved.length).toBe(5);
    });
  });
});
