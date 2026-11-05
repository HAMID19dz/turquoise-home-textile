import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Palette,
  Sliders,
  Camera,
  CheckCircle2,
  Share2,
  Copy,
  Download,
  Bookmark,
  Trash2,
  UploadCloud,
  X,
  MessageCircle,
  ShoppingBag,
  ZoomIn,
} from 'lucide-react';
import { useQuoteCartStore } from '../../store/quoteCartStore';
import { FabricSwatchLibraryModal } from './FabricSwatchLibraryModal';
import { spring } from '@animate-ui/react/utils/motion';
import {
  useCustomizerStore,
  LUXURY_PALETTES,
  WOOD_FINISHES,
  METAL_FINISHES,
  PRODUCT_DIMENSION_LIMITS,
} from '../../store/customizerStore';
import { getAllProducts } from '../../types/product';
import { useTranslation } from '../../i18n';
import { buildCustomizerWhatsAppUrl } from '../../utils/whatsapp';
import { downloadDesignSummaryCard } from '../../utils/exportSummaryCard';
import { buildShareableDesignUrl } from '../../utils/designUrl';
import { trackEvent } from '../../utils/analytics';

export type CustomizerTab = 'piece' | 'materials' | 'dimensions' | 'room' | 'summary';

interface CustomizerControlsProps {
  canvas3dElement?: HTMLCanvasElement | null;
}

export const CustomizerControls: React.FC<CustomizerControlsProps> = ({ canvas3dElement }) => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<CustomizerTab>('piece');
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [swatchModalOpen, setSwatchModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const state = useCustomizerStore();
  const allProducts = getAllProducts();
  const isCurtains = state.currentProduct.category === 'curtains';
  const limits = PRODUCT_DIMENSION_LIMITS[state.selectedProductId] || {
    minW: 50, maxW: 300, minD: 40, maxD: 150, minH: 30, maxH: 300,
  };

  const tabs: { id: CustomizerTab; icon: React.FC<{ className?: string }>; labelKey: string }[] = [
    { id: 'piece', icon: Layers, labelKey: 'customizer.step1Piece' },
    { id: 'materials', icon: Palette, labelKey: 'customizer.step2Materials' },
    { id: 'dimensions', icon: Sliders, labelKey: 'customizer.step3Dimensions' },
    { id: 'room', icon: Camera, labelKey: 'customizer.step4Photo' },
    { id: 'summary', icon: CheckCircle2, labelKey: 'customizer.step5Summary' },
  ];

  // Handle local room photo upload (client-side only, <= 8MB)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert(language === 'ar' ? 'حجم الصورة يجب أن لا يتجاوز 8 ميغابايت' : 'Photo size must be ≤ 8 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      state.setRoomPhoto({
        name: file.name,
        size: file.size,
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCopyLink = () => {
    const shareUrl = buildShareableDesignUrl(language, state);
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleSaveDesign = () => {
    const ok = state.saveCurrentDesign();
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } else {
      alert(language === 'ar' ? 'الحد الأقصى للتصاميم المحفوظة هو 5' : 'Maximum 5 saved designs reached');
    }
  };

  const handleWebShare = async () => {
    const shareUrl = buildShareableDesignUrl(language, state);
    const prodName = state.currentProduct.name[language] || state.currentProduct.name.ar;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Turquoise Home — ${prodName}`,
          text: language === 'ar' ? `تصميم ثلاثي الأبعاد مخصص لـ ${prodName}` : `Bespoke 3D design for ${prodName}`,
          url: shareUrl,
        });
      } catch {
        // Fallback to copy link
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const waUrl = buildCustomizerWhatsAppUrl(state, language);

  return (
    <div className="flex flex-col bg-marble-50 rounded-3xl border border-gold/30 shadow-xl overflow-hidden h-full">
      {/* Top Tabs Navigation */}
      <div className="flex items-center border-b border-gold/20 bg-marble-100 overflow-x-auto scrollbar-none p-1.5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                trackEvent('customizer_step', { step: tab.id, productId: state.selectedProductId });
              }}
              whileTap={{ scale: 0.95 }}
              transition={spring.press}
              className={`flex-1 min-w-0 py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gold-gradient text-charcoal-dark shadow-sm'
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-marble-200'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-[10px] sm:text-[11px] truncate max-w-full text-center px-0.5">
                {t(tab.labelKey)}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        
        {/* ================= TAB 1: PIECE SELECTOR ================= */}
        {activeTab === 'piece' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-heading font-bold text-lg text-charcoal">
                {language === 'ar' ? 'اختر قطعة الأثاث أو الستائر' : 'Select Furniture or Drapery'}
              </h4>
              <p className="text-xs text-charcoal-soft">
                {language === 'ar'
                  ? 'اختر الموديل الأساسي لبدء تخصيص المقاسات والخامات والألوان حياً في 3D.'
                  : 'Choose a master showroom piece to customize live in 3D.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allProducts.map((p) => {
                const isSelected = state.selectedProductId === p.id;
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => {
                      state.selectProduct(p.id);
                      trackEvent('customizer_preset', { productId: p.id });
                    }}
                    whileTap={{ scale: 0.96 }}
                    transition={spring.press}
                    className={`group relative flex flex-col text-start rounded-2xl overflow-hidden border p-2.5 transition-all ${
                      isSelected
                        ? 'border-gold ring-2 ring-gold/40 bg-marble-200/60 shadow-md'
                        : 'border-gold/20 hover:border-gold/50 bg-marble-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-marble-300 mb-2 relative">
                      {p.photo && (
                        <img
                          src={p.photo.srcJpg}
                          alt={p.name[language] || p.name.ar}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <span className="absolute bottom-1 start-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-charcoal-dark/80 text-gold uppercase">
                        {p.category}
                      </span>
                    </div>

                    <span className="font-heading font-bold text-xs text-charcoal line-clamp-1 group-hover:text-gold-dark">
                      {p.name[language] || p.name.ar}
                    </span>
                    <span className="text-[10px] text-charcoal/60 font-mono">
                      {p.dimensionsCm.w}×{p.dimensionsCm.d}×{p.dimensionsCm.h} cm
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: MATERIALS & COLORS ================= */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            {/* 1. Fabric / Leather Swatches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                  {language === 'ar' ? 'أقمشة وجلود فاخرة' : 'Haute Fabrics & Leathers'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      trackEvent('fabric_macro_view', { productId: state.selectedProductId });
                      setSwatchModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/15 hover:bg-gold/25 border border-gold/40 text-[11px] font-semibold text-gold-dark transition-colors shadow-xs"
                    title={language === 'ar' ? 'فاحص الماكرو المجهري 4X' : '4X Macro Swatch Explorer'}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'فاحص الماكرو 4X' : 'Macro Zoom'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-charcoal/60">
                    {state.selectedColorHex}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LUXURY_PALETTES.map((swatch) => {
                  const isSelected = state.selectedColorHex.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <motion.button
                      key={swatch.id}
                      onClick={() => state.setColorHex(swatch.hex)}
                      whileTap={{ scale: 0.94 }}
                      transition={spring.pop}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-start transition-all ${
                        isSelected
                          ? 'border-gold ring-2 ring-gold/40 bg-marble-200/80 shadow-sm'
                          : 'border-marble-300 hover:border-gold/40 bg-marble-50'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-gold/40 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="text-[11px] font-medium text-charcoal truncate">
                        {swatch.name[language] || swatch.name.ar}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2. Wood Finishes (For tables, plinths, and legs) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                  {language === 'ar' ? 'تشطيبات الخشب الطبيعي' : 'Natural Wood Finishes'}
                </span>
                <span className="text-[11px] font-mono text-charcoal/60">
                  {state.selectedWoodHex}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WOOD_FINISHES.map((wood) => {
                  const isSelected = state.selectedWoodHex.toLowerCase() === wood.hex.toLowerCase();
                  return (
                    <motion.button
                      key={wood.id}
                      onClick={() => state.setWoodHex(wood.hex)}
                      whileTap={{ scale: 0.94 }}
                      transition={spring.pop}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-start transition-all ${
                        isSelected
                          ? 'border-gold ring-2 ring-gold/40 bg-marble-200/80 shadow-sm'
                          : 'border-marble-300 hover:border-gold/40 bg-marble-50'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-gold/40 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: wood.hex }}
                      />
                      <span className="text-[11px] font-medium text-charcoal truncate">
                        {wood.name[language] || wood.name.ar}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 3. Metal Finishes (For legs, candelabras, and rods) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                  {language === 'ar' ? 'تشطيبات المعادن والأرجل' : 'Metal Accents & Legs'}
                </span>
                <span className="text-[11px] font-mono text-charcoal/60">
                  {state.selectedMetalHex}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {METAL_FINISHES.map((metal) => {
                  const isSelected = state.selectedMetalHex.toLowerCase() === metal.hex.toLowerCase();
                  return (
                    <motion.button
                      key={metal.id}
                      onClick={() => state.setMetalHex(metal.hex)}
                      whileTap={{ scale: 0.94 }}
                      transition={spring.pop}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-start transition-all ${
                        isSelected
                          ? 'border-gold ring-2 ring-gold/40 bg-marble-200/80 shadow-sm'
                          : 'border-marble-300 hover:border-gold/40 bg-marble-50'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-gold/40 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: metal.hex }}
                      />
                      <span className="text-[11px] font-medium text-charcoal truncate">
                        {metal.name[language] || metal.name.ar}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 4. Curtains Specific Customization Options */}
            {isCurtains && (
              <div className="p-4 rounded-2xl bg-marble-200/60 border border-gold/30 space-y-4">
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
                  {language === 'ar' ? 'خيارات حياكة وتطريز الستائر' : 'Drapery Tailoring & Embroidery'}
                </span>

                {/* Fullness factor */}
                <div>
                  <label className="text-xs text-charcoal/80 block mb-1.5 font-medium">
                    {language === 'ar' ? 'معامل التموج والانسدال (Fullness):' : 'Fabric Fullness Ratio:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[2.0, 2.5, 3.0].map((f) => (
                      <button
                        key={f}
                        onClick={() => state.setCurtainOption('fullness', f as 2.0 | 2.5 | 3.0)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          state.curtainOptions.fullness === f
                            ? 'bg-gold text-charcoal-dark border-gold shadow-sm'
                            : 'bg-marble-50 text-charcoal/70 border-gold/20'
                        }`}
                      >
                        ×{f.toFixed(1)} {language === 'ar' ? 'كثافة' : 'Rich'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Embroidery */}
                <div>
                  <label className="text-xs text-charcoal/80 block mb-1.5 font-medium">
                    {language === 'ar' ? 'شريط التطريز الملكي:' : 'Embroidery Band:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['gold', 'silver', 'none'] as const).map((emb) => (
                      <button
                        key={emb}
                        onClick={() => state.setCurtainOption('embroidery', emb)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                          state.curtainOptions.embroidery === emb
                            ? 'bg-gold text-charcoal-dark border-gold shadow-sm'
                            : 'bg-marble-50 text-charcoal/70 border-gold/20'
                        }`}
                      >
                        {emb === 'gold' ? (language === 'ar' ? 'ذهب 24k' : 'Gold Leaf') : emb === 'silver' ? (language === 'ar' ? 'فضي' : 'Silver') : (language === 'ar' ? 'بدون' : 'None')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tieback */}
                <div>
                  <label className="text-xs text-charcoal/80 block mb-1.5 font-medium">
                    {language === 'ar' ? 'نوع الأربطة الجانبية:' : 'Tiebacks Style:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['pearl', 'gold-cord', 'none'] as const).map((tb) => (
                      <button
                        key={tb}
                        onClick={() => state.setCurtainOption('tieback', tb)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                          state.curtainOptions.tieback === tb
                            ? 'bg-gold text-charcoal-dark border-gold shadow-sm'
                            : 'bg-marble-50 text-charcoal/70 border-gold/20'
                        }`}
                      >
                        {tb === 'pearl' ? (language === 'ar' ? 'لؤلؤ عاجي' : 'Pearl') : tb === 'gold-cord' ? (language === 'ar' ? 'حبل مذهب' : 'Gold Cord') : (language === 'ar' ? 'بدون' : 'None')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: DIMENSIONS & ROOM SCALE ================= */}
        {activeTab === 'dimensions' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-bold text-lg text-charcoal mb-1">
                {language === 'ar' ? 'المقاسات المخصصة بالسنتيمتر' : 'Parametric Dimensions (cm)'}
              </h4>
              <p className="text-xs text-charcoal-soft mb-4">
                {language === 'ar'
                  ? 'حرك أشرطة التمرير لتعديل أبعاد القطعة مباشرة والتأكد من مطابقتها لغرفتك.'
                  : 'Slide to adjust dimensions and watch the 3D model reshape instantly.'}
              </p>
            </div>

            {/* Width Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal">
                  {language === 'ar' ? 'العرض / الطول (W)' : 'Width / Length (W)'}
                </span>
                <span className="text-xs font-mono font-bold text-gold-dark bg-marble-200 px-2.5 py-0.5 rounded-full">
                  {state.dimensionsCm.w} cm
                </span>
              </div>
              <input
                type="range"
                min={limits.minW}
                max={limits.maxW}
                value={state.dimensionsCm.w}
                onChange={(e) => state.setDimension('w', Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-charcoal/60 font-mono">
                <span>Min: {limits.minW} cm</span>
                <span>Max: {limits.maxW} cm</span>
              </div>
            </div>

            {/* Depth Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal">
                  {language === 'ar' ? 'العمق (D)' : 'Depth (D)'}
                </span>
                <span className="text-xs font-mono font-bold text-gold-dark bg-marble-200 px-2.5 py-0.5 rounded-full">
                  {state.dimensionsCm.d} cm
                </span>
              </div>
              <input
                type="range"
                min={limits.minD}
                max={limits.maxD}
                value={state.dimensionsCm.d}
                onChange={(e) => state.setDimension('d', Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-charcoal/60 font-mono">
                <span>Min: {limits.minD} cm</span>
                <span>Max: {limits.maxD} cm</span>
              </div>
            </div>

            {/* Height Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal">
                  {language === 'ar' ? 'الارتفاع (H)' : 'Height (H)'}
                </span>
                <span className="text-xs font-mono font-bold text-gold-dark bg-marble-200 px-2.5 py-0.5 rounded-full">
                  {state.dimensionsCm.h} cm
                </span>
              </div>
              <input
                type="range"
                min={limits.minH}
                max={limits.maxH}
                value={state.dimensionsCm.h}
                onChange={(e) => state.setDimension('h', Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-charcoal/60 font-mono">
                <span>Min: {limits.minH} cm</span>
                <span>Max: {limits.maxH} cm</span>
              </div>
            </div>

            {/* Room Dimensions Inputs */}
            <div className="pt-4 border-t border-gold/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                  {language === 'ar' ? 'أبعاد الغرفة المرجعية' : 'Reference Room Envelope'}
                </span>
                <button
                  onClick={state.toggleRoomScale}
                  className="text-xs font-bold text-gold-dark underline hover:text-charcoal"
                >
                  {state.showRoomScale
                    ? language === 'ar' ? 'إخفاء المجسم' : 'Hide Silhouette'
                    : language === 'ar' ? 'إظهار المجسم البشري' : 'Show Silhouette'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-charcoal/60 block mb-1">
                    {language === 'ar' ? 'طول الغرفة' : 'Room L (cm)'}
                  </label>
                  <input
                    type="number"
                    value={state.roomDimensionsCm.length}
                    onChange={(e) =>
                      state.setRoomDimensions({
                        ...state.roomDimensionsCm,
                        length: Number(e.target.value) || 500,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gold/30 bg-marble-50 text-xs font-mono text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-charcoal/60 block mb-1">
                    {language === 'ar' ? 'عرض الغرفة' : 'Room W (cm)'}
                  </label>
                  <input
                    type="number"
                    value={state.roomDimensionsCm.width}
                    onChange={(e) =>
                      state.setRoomDimensions({
                        ...state.roomDimensionsCm,
                        width: Number(e.target.value) || 400,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gold/30 bg-marble-50 text-xs font-mono text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-charcoal/60 block mb-1">
                    {language === 'ar' ? 'ارتفاع السقف' : 'Ceiling H (cm)'}
                  </label>
                  <input
                    type="number"
                    value={state.roomDimensionsCm.height}
                    onChange={(e) =>
                      state.setRoomDimensions({
                        ...state.roomDimensionsCm,
                        height: Number(e.target.value) || 300,
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gold/30 bg-marble-50 text-xs font-mono text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: ROOM PHOTO & NOTES ================= */}
        {activeTab === 'room' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-bold text-lg text-charcoal mb-1">
                {language === 'ar' ? 'إرفاق صورة الغرفة والملاحظات' : 'Room Photo & Client Notes'}
              </h4>
              <p className="text-xs text-charcoal-soft">
                {language === 'ar'
                  ? 'ارفع صورة لغرفتك أو مجلسك لمعاينتها محلياً ومشاركتها مع فريق التصميم.'
                  : 'Upload your room or salon photo strictly within the browser (≤ 8 MB).'}
              </p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {state.roomPhoto ? (
              <div className="relative rounded-2xl overflow-hidden border border-gold/40 shadow-md bg-marble-200">
                <img
                  src={state.roomPhoto.dataUrl}
                  alt="Client room upload"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute top-2 inset-x-2 flex items-center justify-between">
                  <span className="px-2 py-1 rounded-md bg-charcoal-dark/80 text-gold text-[10px] font-mono backdrop-blur-sm">
                    {state.roomPhoto.name} ({(state.roomPhoto.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                  <button
                    onClick={() => state.setRoomPhoto(null)}
                    className="p-1.5 rounded-full bg-charcoal-dark/80 text-white hover:text-red-400 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gold/40 rounded-2xl p-6 text-center hover:border-gold hover:bg-gold-light/10 transition-colors cursor-pointer"
              >
                <UploadCloud className="w-10 h-10 mx-auto text-gold-dark mb-2 opacity-80" />
                <span className="text-xs font-semibold text-charcoal block mb-1">
                  {language === 'ar' ? 'انقر أو اسحب صورة الغرفة هنا' : 'Click or drop room photo here'}
                </span>
                <span className="text-[10px] text-charcoal/60 block">
                  PNG, JPG, WebP ≤ 8 MB • {language === 'ar' ? 'المعالجة سرية داخل المتصفح' : 'Processed strictly client-side'}
                </span>
              </div>
            )}

            {/* Client Information Form */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-charcoal/80 block mb-1 font-medium">
                    {language === 'ar' ? 'الاسم الكريم (اختياري):' : 'Your Name (optional):'}
                  </label>
                  <input
                    type="text"
                    value={state.clientName}
                    onChange={(e) => state.setClientInfo({ name: e.target.value })}
                    placeholder={language === 'ar' ? 'مثال: أحمد' : 'e.g. John Doe'}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 bg-marble-50 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="text-xs text-charcoal/80 block mb-1 font-medium">
                    {language === 'ar' ? 'المدينة / الولاية:' : 'City / State:'}
                  </label>
                  <input
                    type="text"
                    value={state.clientCity}
                    onChange={(e) => state.setClientInfo({ city: e.target.value })}
                    placeholder={language === 'ar' ? 'الجزائر العاصمة، وهران...' : 'Algiers, Oran...'}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 bg-marble-50 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-charcoal/80 block mb-1 font-medium">
                  {language === 'ar' ? 'ملاحظات خاصة للورشة الحرفية:' : 'Bespoke Atelier Notes:'}
                </label>
                <textarea
                  rows={3}
                  value={state.clientNotes}
                  onChange={(e) => state.setClientInfo({ notes: e.target.value })}
                  placeholder={
                    language === 'ar'
                      ? 'حدد أي طلبات تفصيلية مثل نوع بطانة الكنب، لون الخيوط، أو موعد التسليم المرغوب...'
                      : 'Specify any custom details, lining preferences, or desired timeframe...'
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 bg-marble-50 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: SUMMARY & WHATSAPP ================= */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-heading font-bold text-lg text-charcoal mb-1">
                {language === 'ar' ? 'مراجعة التصميم وإرسال الطلب' : 'Design Review & Quotation'}
              </h4>
              <p className="text-xs text-charcoal-soft">
                {language === 'ar'
                  ? 'تم تجهيز ملف المواصفات بالكامل. يمكنك إرسال الطلب مباشرة إلى مستشاري المعرض عبر واتساب.'
                  : 'Complete specifications compiled. Dispatch directly to our showroom consultants on WhatsApp.'}
              </p>
            </div>

            {/* Specs Checklist Box */}
            <div className="p-4 rounded-2xl bg-marble-200/70 border border-gold/30 space-y-2 text-xs">
              <div className="flex justify-between border-b border-gold/20 pb-1.5">
                <span className="text-charcoal/70">{language === 'ar' ? 'القطعة:' : 'Piece:'}</span>
                <span className="font-bold text-charcoal font-heading">
                  {state.currentProduct.name[language] || state.currentProduct.name.ar}
                </span>
              </div>
              <div className="flex justify-between border-b border-gold/20 pb-1.5">
                <span className="text-charcoal/70">{language === 'ar' ? 'المقاسات:' : 'Dimensions:'}</span>
                <span className="font-mono font-bold text-gold-dark">
                  {state.dimensionsCm.w} × {state.dimensionsCm.d} × {state.dimensionsCm.h} cm
                </span>
              </div>
              <div className="flex justify-between border-b border-gold/20 pb-1.5">
                <span className="text-charcoal/70">{language === 'ar' ? 'لون الخامة:' : 'Color Swatch:'}</span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-gold"
                    style={{ backgroundColor: state.selectedColorHex }}
                  />
                  <span className="font-mono">{state.selectedColorHex}</span>
                </div>
              </div>
              <div className="flex justify-between border-b border-gold/20 pb-1.5">
                <span className="text-charcoal/70">{language === 'ar' ? 'الخشب والمعدن:' : 'Wood & Metal:'}</span>
                <span className="font-mono">{state.selectedWoodHex} / {state.selectedMetalHex}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-charcoal/70">{language === 'ar' ? 'السعر التقديري:' : 'Indicative Price:'}</span>
                <span className="font-bold text-gold-dark">{t('catalog.priceOnRequest')}</span>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent('quote_inquiry', {
                  source: 'customizer',
                  productId: state.selectedProductId,
                  color: state.selectedColorHex,
                  phone: '+213556929134',
                });
              }}
              whileTap={{ scale: 0.98 }}
              transition={spring.press}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all text-center"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{t('customizer.sendWhatsApp')} (+213 556 92 91 34)</span>
            </motion.a>

            {/* Add Custom Design to Quote Cart */}
            <motion.button
              onClick={() => {
                const designUrl = buildShareableDesignUrl(language, state);
                useQuoteCartStore.getState().addItem({
                  type: 'bespoke',
                  productId: state.selectedProductId,
                  name: state.currentProduct.name,
                  photoUrl: state.currentProduct.photo?.srcJpg,
                  colorHex: state.selectedColorHex,
                  woodHex: state.selectedWoodHex,
                  metalHex: state.selectedMetalHex,
                  dimensionsCm: state.dimensionsCm,
                  notes: state.clientNotes,
                  designUrl,
                });
                trackEvent('cart_add', {
                  source: 'customizer',
                  productId: state.selectedProductId,
                  color: state.selectedColorHex,
                });
              }}
              whileTap={{ scale: 0.98 }}
              transition={spring.press}
              className="w-full py-3 px-4 rounded-2xl bg-marble-200 border border-gold hover:bg-gold-light/40 text-charcoal font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all text-center"
            >
              <ShoppingBag className="w-4 h-4 text-gold-dark" />
              <span>
                {language === 'ar'
                  ? 'إضافة هذا التصميم إلى قائمة عروض الأسعار'
                  : language === 'fr'
                  ? 'Ajouter ce design sur-mesure au panier devis'
                  : 'Add this bespoke design to quote basket'}
              </span>
            </motion.button>

            {/* Additional Actions Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {/* Web Share */}
              <motion.button
                onClick={() => {
                  trackEvent('share_click', { method: 'web_share', productId: state.selectedProductId });
                  handleWebShare();
                }}
                whileTap={{ scale: 0.94 }}
                transition={spring.press}
                className="p-2.5 rounded-xl border border-gold/30 bg-marble-50 text-charcoal hover:text-gold-dark hover:border-gold flex flex-col items-center justify-center gap-1 text-[11px] font-semibold"
                title="Share Design Link"
              >
                <Share2 className="w-4 h-4 text-gold-dark" />
                <span>{language === 'ar' ? 'مشاركة' : 'Share'}</span>
              </motion.button>

              {/* Copy Link */}
              <motion.button
                onClick={() => {
                  trackEvent('share_click', { method: 'copy_link', productId: state.selectedProductId });
                  handleCopyLink();
                }}
                whileTap={{ scale: 0.94 }}
                transition={spring.press}
                className="p-2.5 rounded-xl border border-gold/30 bg-marble-50 text-charcoal hover:text-gold-dark hover:border-gold flex flex-col items-center justify-center gap-1 text-[11px] font-semibold"
                title="Copy shareable link"
              >
                <Copy className="w-4 h-4 text-gold-dark" />
                <span>{copiedLink ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ الرابط' : 'Copy Link')}</span>
              </motion.button>

              {/* Download PNG Summary Card */}
              <motion.button
                onClick={() => {
                  trackEvent('share_click', { method: 'download_card', productId: state.selectedProductId });
                  downloadDesignSummaryCard(state, language, canvas3dElement);
                }}
                whileTap={{ scale: 0.94 }}
                transition={spring.press}
                className="p-2.5 rounded-xl border border-gold/30 bg-marble-50 text-charcoal hover:text-gold-dark hover:border-gold flex flex-col items-center justify-center gap-1 text-[11px] font-semibold"
                title="Download 3D summary card as PNG"
              >
                <Download className="w-4 h-4 text-gold-dark" />
                <span>{language === 'ar' ? 'بطاقة PNG' : 'PNG Card'}</span>
              </motion.button>

              {/* Save Design */}
              <motion.button
                onClick={() => {
                  trackEvent('share_click', { method: 'save_design', productId: state.selectedProductId });
                  handleSaveDesign();
                }}
                whileTap={{ scale: 0.94 }}
                transition={spring.press}
                className="p-2.5 rounded-xl border border-gold/30 bg-marble-50 text-charcoal hover:text-gold-dark hover:border-gold flex flex-col items-center justify-center gap-1 text-[11px] font-semibold"
                title="Save up to 5 designs in browser"
              >
                <Bookmark className="w-4 h-4 text-gold-dark" />
                <span>{saveSuccess ? (language === 'ar' ? 'تم الحفظ!' : 'Saved!') : (language === 'ar' ? 'حفظ التصميم' : 'Save')}</span>
              </motion.button>
            </div>

            {/* Saved Designs Drawer / List */}
            {state.savedDesigns.length > 0 && (
              <div className="pt-4 border-t border-gold/20">
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block mb-2">
                  {language === 'ar' ? 'التصاميم المحفوظة لديك:' : 'Your Saved Designs:'}
                </span>
                <div className="space-y-2">
                  {state.savedDesigns.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-marble-200/80 border border-gold/20 text-xs"
                    >
                      <button
                        onClick={() => state.loadSavedDesign(d)}
                        className="flex-1 text-start hover:text-gold-dark font-medium"
                      >
                        <span className="font-heading font-bold">{d.productName}</span> •{' '}
                        <span className="font-mono text-[10px] text-charcoal/70">
                          {d.dimensionsCm.w}×{d.dimensionsCm.d}×{d.dimensionsCm.h} cm
                        </span>
                      </button>
                      <button
                        onClick={() => state.deleteSavedDesign(d.id)}
                        className="p-1 hover:text-red-500 text-charcoal/60"
                        title="Delete saved design"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Fabric Swatch Library & 4X Macro Zoom Modal (M5) */}
      <FabricSwatchLibraryModal
        isOpen={swatchModalOpen}
        onClose={() => setSwatchModalOpen(false)}
      />
    </div>
  );
};
