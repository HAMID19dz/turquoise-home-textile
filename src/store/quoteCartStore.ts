import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SupportedLanguage } from '../i18n';
import { siteConfig } from '../config/site';

export interface QuoteCartItem {
  id: string; // unique item id
  type: 'catalog' | 'bespoke';
  productId: string;
  name: {
    ar: string;
    fr: string;
    en: string;
  };
  photoUrl?: string;
  colorHex: string;
  woodHex?: string;
  metalHex?: string;
  dimensionsCm: {
    w: number;
    d: number;
    h: number;
  };
  quantity: number;
  notes?: string;
  designUrl?: string;
}

interface QuoteCartState {
  items: QuoteCartItem[];
  isOpen: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<QuoteCartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // WhatsApp Compiler
  compileWhatsAppUrl: (language: SupportedLanguage) => string;
}

export const useQuoteCartStore = create<QuoteCartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (itemData) => {
        const { items } = get();
        // Check if identical item already exists (same productId, color, dimensions)
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === itemData.productId &&
            i.colorHex === itemData.colorHex &&
            i.dimensionsCm.w === itemData.dimensionsCm.w &&
            i.dimensionsCm.d === itemData.dimensionsCm.d &&
            i.dimensionsCm.h === itemData.dimensionsCm.h
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += itemData.quantity || 1;
          set({ items: updated, isOpen: true });
        } else {
          const newItem: QuoteCartItem = {
            ...itemData,
            id: `quote_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            quantity: itemData.quantity || 1,
          };
          set({ items: [...items, newItem], isOpen: true });
        }
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),

      compileWhatsAppUrl: (language: SupportedLanguage) => {
        const { items } = get();
        if (items.length === 0) return siteConfig.whatsapp.directUrl;

        let msg = '';

        if (language === 'ar') {
          msg = `السلام عليكم ورحمة الله،
أرغب بطلب عرض سعر رسمي مجمّع للقطع المختارة من كتالوج ومعرض تركواز:

`;
          items.forEach((item, index) => {
            const name = item.name.ar || item.name.fr;
            const dims = `${item.dimensionsCm.w} × ${item.dimensionsCm.d} × ${item.dimensionsCm.h} سم`;
            const typeLabel = item.type === 'bespoke' ? '🌟 تصميم مخصص' : '🛋️ موديل كتالوج';

            msg += `*${index + 1}. ${name}* (${typeLabel})
   • الكمية: ${item.quantity}
   • المقاسات: ${dims}
   • رمز اللون: ${item.colorHex}
`;
            if (item.woodHex) msg += `   • تشطيب الخشب: ${item.woodHex}\n`;
            if (item.metalHex) msg += `   • تشطيب المعدن: ${item.metalHex}\n`;
            if (item.designUrl) msg += `   • رابط 3D: ${item.designUrl}\n`;
            msg += '\n';
          });

          msg += `يرجى تزويدي بالأسعار الرسمية، مدة التصنيع وإمكانية الشحن أو المعاينة بالمعرض. شكراً لكم!`;
        } else if (language === 'fr') {
          msg = `Bonjour Atelier Turquoise,
Je souhaite obtenir un devis global pour cette sélection de pièces :

`;
          items.forEach((item, index) => {
            const name = item.name.fr || item.name.ar;
            const dims = `${item.dimensionsCm.w} × ${item.dimensionsCm.d} × ${item.dimensionsCm.h} cm`;
            const typeLabel = item.type === 'bespoke' ? '🌟 Sur-mesure 3D' : '🛋️ Collection Showroom';

            msg += `*${index + 1}. ${name}* (${typeLabel})
   • Quantité : ${item.quantity}
   • Dimensions : ${dims}
   • Couleur : ${item.colorHex}
`;
            if (item.woodHex) msg += `   • Finition bois : ${item.woodHex}\n`;
            if (item.metalHex) msg += `   • Finition métal : ${item.metalHex}\n`;
            if (item.designUrl) msg += `   • Lien 3D : ${item.designUrl}\n`;
            msg += '\n';
          });

          msg += `Merci de bien vouloir me communiquer les tarifs et délais de réalisation. Cordialement !`;
        } else {
          msg = `Hello Turquoise Atelier,
I would like to request a consolidated quotation for the following pieces:

`;
          items.forEach((item, index) => {
            const name = item.name.en || item.name.ar;
            const dims = `${item.dimensionsCm.w} × ${item.dimensionsCm.d} × ${item.dimensionsCm.h} cm`;
            const typeLabel = item.type === 'bespoke' ? '🌟 Bespoke 3D' : '🛋️ Catalog Piece';

            msg += `*${index + 1}. ${name}* (${typeLabel})
   • Quantity: ${item.quantity}
   • Dimensions: ${dims}
   • Color code: ${item.colorHex}
`;
            if (item.woodHex) msg += `   • Wood finish: ${item.woodHex}\n`;
            if (item.metalHex) msg += `   • Metal finish: ${item.metalHex}\n`;
            if (item.designUrl) msg += `   • 3D link: ${item.designUrl}\n`;
            msg += '\n';
          });

          msg += `Please provide quotation details, lead times, and delivery options. Thank you!`;
        }

        return siteConfig.whatsapp.buildUrl(msg);
      },
    }),
    {
      name: 'turquoise_quote_cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
