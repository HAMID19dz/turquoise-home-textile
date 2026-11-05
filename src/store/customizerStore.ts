import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/product';
import { getAllProducts, getProductById } from '../types/product';

export interface SwatchOption {
  id: string;
  hex: string;
  name: {
    ar: string;
    fr: string;
    en: string;
  };
}

// Curated luxury fabric & leather color palette
export const LUXURY_PALETTES: SwatchOption[] = [
  { id: 'taupe-showroom', hex: '#B8AEA3', name: { ar: 'توب المعرض الملكي', fr: 'Taupe Showroom', en: 'Showroom Taupe' } },
  { id: 'ivory-boucle', hex: '#F4F0EA', name: { ar: 'عاجي بوكليه دافئ', fr: 'Ivoire Bouclé', en: 'Warm Ivory Bouclé' } },
  { id: 'light-grey', hex: '#D2CCC4', name: { ar: 'رمادي لؤلؤي ناعم', fr: 'Gris Perle', en: 'Soft Pearl Grey' } },
  { id: 'charcoal-black', hex: '#2B2B2B', name: { ar: 'فحم ملكي داكن', fr: 'Anthracite Royal', en: 'Royal Charcoal' } },
  { id: 'sage-green', hex: '#8A9A86', name: { ar: 'أخضر ميرمية هادئ', fr: 'Vert Sauge', en: 'Calm Sage Green' } },
  { id: 'navy-blue', hex: '#1D2A3A', name: { ar: 'أزرق كحلي ليلي', fr: 'Bleu Nuit', en: 'Midnight Navy' } },
  { id: 'terracotta', hex: '#A85A44', name: { ar: 'تيراكوتا إيطالية', fr: 'Terre Cuite', en: 'Italian Terracotta' } },
  { id: 'golden-cream', hex: '#EADBCA', name: { ar: 'كريم مذهب فاخر', fr: 'Crème Dorée', en: 'Golden Cream' } },
];

// Wood finishes
export const WOOD_FINISHES: SwatchOption[] = [
  { id: 'natural-walnut', hex: '#5C4033', name: { ar: 'جوز طبيعي فاخر', fr: 'Noyer Naturel', en: 'Natural Walnut' } },
  { id: 'dark-walnut', hex: '#3A2312', name: { ar: 'جوز داكن إيطالي', fr: 'Noyer Foncé', en: 'Dark Italian Walnut' } },
  { id: 'honey-oak', hex: '#C89D66', name: { ar: 'بلوط عسلي دافئ', fr: 'Chêne Miel', en: 'Warm Honey Oak' } },
  { id: 'bleached-oak', hex: '#D9CCBA', name: { ar: 'بلوط سويدي فاتح', fr: 'Chêne Blanchi', en: 'Bleached Oak' } },
];

// Metal accents & legs
export const METAL_FINISHES: SwatchOption[] = [
  { id: 'brushed-gold', hex: '#D4AF37', name: { ar: 'ذهب 24k مطفي', fr: 'Or Brossé 24k', en: '24k Brushed Gold' } },
  { id: 'polished-silver', hex: '#DCDCDC', name: { ar: 'فضة مصقولة لامعة', fr: 'Argent Poli', en: 'Polished Silver' } },
  { id: 'gunmetal-black', hex: '#252528', name: { ar: 'معدن تيتانيوم داكن', fr: 'Titane Noir', en: 'Gunmetal Titanium' } },
];

export interface CurtainCustomOptions {
  fabricType: 'heavy-geometric' | 'plain-linen' | 'embroidered-silk';
  sheerColor: 'pure-white' | 'warm-cream';
  embroidery: 'gold' | 'silver' | 'none';
  tieback: 'pearl' | 'gold-cord' | 'none';
  fullness: 2.0 | 2.5 | 3.0; // Drapery fullness factor
}

export interface RoomPhotoUpload {
  name: string;
  size: number;
  dataUrl: string;
}

export interface SavedCustomDesign {
  id: string;
  date: string;
  productId: string;
  productName: string;
  colorHex: string;
  woodHex: string;
  metalHex: string;
  dimensionsCm: { w: number; d: number; h: number };
  curtainOptions?: CurtainCustomOptions;
}

export interface DimensionLimits {
  minW: number;
  maxW: number;
  minD: number;
  maxD: number;
  minH: number;
  maxH: number;
}

export const PRODUCT_DIMENSION_LIMITS: Record<string, DimensionLimits> = {
  'leather-armchair': { minW: 75, maxW: 120, minD: 75, maxD: 105, minH: 70, maxH: 95 },
  'leather-sofa': { minW: 160, maxW: 280, minD: 80, maxD: 110, minH: 75, maxH: 95 },
  'boucle-sofa': { minW: 180, maxW: 290, minD: 85, maxD: 120, minH: 70, maxH: 90 },
  'velvet-accent-chair': { minW: 70, maxW: 110, minD: 70, maxD: 100, minH: 70, maxH: 95 },
  'oval-dining-set': { minW: 180, maxW: 300, minD: 90, maxD: 130, minH: 72, maxH: 80 },
  'coffee-table': { minW: 90, maxW: 160, minD: 50, maxD: 90, minH: 35, maxH: 55 },
  'side-table': { minW: 45, maxW: 75, minD: 45, maxD: 75, minH: 50, maxH: 75 },
  'curtain-cream': { minW: 150, maxW: 400, minD: 15, maxD: 40, minH: 220, maxH: 360 },
  'curtain-taupe': { minW: 150, maxW: 400, minD: 15, maxD: 40, minH: 220, maxH: 360 },
};

export interface CustomizerState {
  // Active product selection
  selectedProductId: string;
  currentProduct: Product;

  // Custom materials
  selectedColorHex: string;
  selectedWoodHex: string;
  selectedMetalHex: string;
  curtainOptions: CurtainCustomOptions;

  // Dimensions
  dimensionsCm: { w: number; d: number; h: number };

  // Room Scale Reference
  showRoomScale: boolean;
  roomDimensionsCm: { length: number; width: number; height: number };

  // Room Photo (client-side only)
  roomPhoto: RoomPhotoUpload | null;

  // Client Details & Notes
  clientName: string;
  clientCity: string;
  clientNotes: string;

  // Saved Designs (max 5)
  savedDesigns: SavedCustomDesign[];

  // Actions
  selectProduct: (id: string) => void;
  setColorHex: (hex: string) => void;
  setWoodHex: (hex: string) => void;
  setMetalHex: (hex: string) => void;
  setCurtainOption: <K extends keyof CurtainCustomOptions>(key: K, value: CurtainCustomOptions[K]) => void;
  setDimension: (dim: 'w' | 'd' | 'h', value: number) => void;
  setDimensions: (dims: { w: number; d: number; h: number }) => void;
  toggleRoomScale: () => void;
  setRoomDimensions: (dims: { length: number; width: number; height: number }) => void;
  setRoomPhoto: (photo: RoomPhotoUpload | null) => void;
  setClientInfo: (info: { name?: string; city?: string; notes?: string }) => void;
  saveCurrentDesign: () => boolean;
  deleteSavedDesign: (id: string) => void;
  loadSavedDesign: (design: SavedCustomDesign) => void;
  resetToDefaults: () => void;
}

const DEFAULT_PRODUCT_ID = 'boucle-sofa';

export const useCustomizerStore = create<CustomizerState>()(
  persist(
    (set, get) => {
      const initialProduct = getProductById(DEFAULT_PRODUCT_ID) || getAllProducts()[0];

      return {
        selectedProductId: initialProduct.id,
        currentProduct: initialProduct,

        selectedColorHex: initialProduct.colorOptions[0]?.hex || '#F4F0EA',
        selectedWoodHex: '#5C4033',
        selectedMetalHex: '#D4AF37',
        curtainOptions: {
          fabricType: 'embroidered-silk',
          sheerColor: 'pure-white',
          embroidery: 'gold',
          tieback: 'pearl',
          fullness: 2.5,
        },

        dimensionsCm: { ...initialProduct.dimensionsCm },

        showRoomScale: false,
        roomDimensionsCm: { length: 500, width: 400, height: 300 },

        roomPhoto: null,

        clientName: '',
        clientCity: '',
        clientNotes: '',

        savedDesigns: [],

        selectProduct: (id: string) => {
          const product = getProductById(id);
          if (!product) return;

          set({
            selectedProductId: id,
            currentProduct: product,
            selectedColorHex: product.colorOptions[0]?.hex || get().selectedColorHex,
            dimensionsCm: { ...product.dimensionsCm },
          });
        },

        setColorHex: (hex: string) => set({ selectedColorHex: hex }),
        setWoodHex: (hex: string) => set({ selectedWoodHex: hex }),
        setMetalHex: (hex: string) => set({ selectedMetalHex: hex }),

        setCurtainOption: (key, value) =>
          set((state) => ({
            curtainOptions: { ...state.curtainOptions, [key]: value },
          })),

        setDimension: (dim, value) => {
          const state = get();
          const limits = PRODUCT_DIMENSION_LIMITS[state.selectedProductId] || {
            minW: 40, maxW: 400, minD: 40, maxD: 200, minH: 30, maxH: 400,
          };

          const minKey = `min${dim.toUpperCase()}` as keyof DimensionLimits;
          const maxKey = `max${dim.toUpperCase()}` as keyof DimensionLimits;
          const clamped = Math.max(limits[minKey], Math.min(limits[maxKey], value));

          set({
            dimensionsCm: {
              ...state.dimensionsCm,
              [dim]: clamped,
            },
          });
        },

        setDimensions: (dims) => {
          const state = get();
          const limits = PRODUCT_DIMENSION_LIMITS[state.selectedProductId] || {
            minW: 40, maxW: 400, minD: 40, maxD: 200, minH: 30, maxH: 400,
          };
          const clamped = {
            w: dims.w !== undefined ? Math.max(limits.minW, Math.min(limits.maxW, dims.w)) : state.dimensionsCm.w,
            d: dims.d !== undefined ? Math.max(limits.minD, Math.min(limits.maxD, dims.d)) : state.dimensionsCm.d,
            h: dims.h !== undefined ? Math.max(limits.minH, Math.min(limits.maxH, dims.h)) : state.dimensionsCm.h,
          };
          set({ dimensionsCm: clamped });
        },

        toggleRoomScale: () => set((state) => ({ showRoomScale: !state.showRoomScale })),

        setRoomDimensions: (dims) => set({ roomDimensionsCm: dims }),

        setRoomPhoto: (photo) => set({ roomPhoto: photo }),

        setClientInfo: (info) =>
          set((state) => ({
            clientName: info.name !== undefined ? info.name : state.clientName,
            clientCity: info.city !== undefined ? info.city : state.clientCity,
            clientNotes: info.notes !== undefined ? info.notes : state.clientNotes,
          })),

        saveCurrentDesign: () => {
          const state = get();
          let currentSaved = [...state.savedDesigns];
          if (currentSaved.length >= 5) {
            currentSaved = currentSaved.slice(0, 4); // Keep top 4, append new as 5th
          }

          const newDesign: SavedCustomDesign = {
            id: `design_${Date.now()}`,
            date: new Date().toLocaleDateString('ar-DZ'),
            productId: state.selectedProductId,
            productName: state.currentProduct.name.ar,
            colorHex: state.selectedColorHex,
            woodHex: state.selectedWoodHex,
            metalHex: state.selectedMetalHex,
            dimensionsCm: { ...state.dimensionsCm },
            curtainOptions:
              state.currentProduct.category === 'curtains'
                ? { ...state.curtainOptions }
                : undefined,
          };

          set({ savedDesigns: [newDesign, ...currentSaved] });
          return true;
        },

        deleteSavedDesign: (id) =>
          set((state) => ({
            savedDesigns: state.savedDesigns.filter((d) => d.id !== id),
          })),

        loadSavedDesign: (design) => {
          const product = getProductById(design.productId);
          if (!product) return;

          set({
            selectedProductId: design.productId,
            currentProduct: product,
            selectedColorHex: design.colorHex,
            selectedWoodHex: design.woodHex,
            selectedMetalHex: design.metalHex,
            dimensionsCm: { ...design.dimensionsCm },
            curtainOptions: design.curtainOptions || get().curtainOptions,
          });
        },

        resetToDefaults: () => {
          const state = get();
          const prod = state.currentProduct;
          set({
            selectedColorHex: prod.colorOptions[0]?.hex || '#F4F0EA',
            dimensionsCm: { ...prod.dimensionsCm },
            selectedWoodHex: '#5C4033',
            selectedMetalHex: '#D4AF37',
            roomPhoto: null,
          });
        },
      };
    },
    {
      name: 'turquoise_customizer_store',
      partialize: (state) => ({
        savedDesigns: state.savedDesigns,
        clientName: state.clientName,
        clientCity: state.clientCity,
      }),
    }
  )
);
