import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Check, Info } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useCustomizerStore } from '../../store/customizerStore';

interface FabricDetail {
  id: string;
  name: { ar: string; fr: string; en: string };
  category: 'leather' | 'boucle' | 'velvet' | 'wood' | 'metal';
  hex: string;
  weave: { ar: string; fr: string; en: string };
  weight: string;
  martindale: string;
  composition: { ar: string; fr: string; en: string };
  origin: { ar: string; fr: string; en: string };
  description: { ar: string; fr: string; en: string };
}

export const FABRIC_LIBRARY_DETAILS: FabricDetail[] = [
  {
    id: 'taupe-showroom',
    name: { ar: 'جلد توب إيطالي أصلي', fr: 'Cuir Taupe Italien', en: 'Italian Showroom Taupe Leather' },
    category: 'leather',
    hex: '#B8AEA3',
    weave: { ar: 'جلد طبيعي ناعم كامل الحبيبات', fr: 'Plein cuir aniline foulonné', en: 'Full-Grain Milled Leather' },
    weight: '1.2 - 1.4 mm',
    martindale: '50,000+ دورة احتكاك',
    composition: { ar: '100% جلد عجل طبيعي إيطالي', fr: '100% Cuir de veau véritable', en: '100% Genuine Italian Calfskin' },
    origin: { ar: 'فيتشنزا، إيطاليا', fr: 'Vicence, Italie', en: 'Vicenza, Italy' },
    description: {
      ar: 'جلد عجل أوروبي ممتاز خضع لدباغة نباتية مع ملمس مخملي ومرونة فائقة تزداد رونقاً مع مرور السنين.',
      fr: 'Cuir de veau européen haut de gamme tanné aux extraits végétaux, d’une souplesse exceptionnelle.',
      en: 'Premium European calfskin with vegetable-tanned finish, providing supple tactile luxury that patinas beautifully.',
    },
  },
  {
    id: 'ivory-boucle',
    name: { ar: 'بوكليه عاجي تركي دافئ', fr: 'Bouclé Ivoire Chaleureux', en: 'Warm Ivory Bouclé' },
    category: 'boucle',
    hex: '#F4F0EA',
    weave: { ar: 'نسيج حلقي معقود ثلاثي الأبعاد', fr: 'Tissage bouclé texturé 3D', en: '3D Textured Looped Bouclé' },
    weight: '620 جم/م²',
    martindale: '45,000 دورة احتكاك',
    composition: { ar: '70% صوف ناعم، 25% أكريليك، 5% قطن', fr: '70% Laine, 25% Acrylique, 5% Coton', en: '70% Wool, 25% Acrylic, 5% Cotton' },
    origin: { ar: 'بورصة، تركيا', fr: 'Bursa, Turquie', en: 'Bursa, Turkey' },
    description: {
      ar: 'قماش سحابي ناعم الملمس منسوج بحلقات صوفية تمنح الأريكة شعوراً بالدفء والراحة الملكية المطلقة.',
      fr: 'Tissu nuageux texturé composé de bouclettes de laine denses, offrant une sensation de confort feutré.',
      en: 'Plush cloud-like bouclé woven with dense wool loops, delivering an enveloping cocoon of tactile elegance.',
    },
  },
  {
    id: 'charcoal-black',
    name: { ar: 'جلد فحمي ملكي عميق', fr: 'Cuir Anthracite Royal', en: 'Royal Charcoal Leather' },
    category: 'leather',
    hex: '#2B2B2B',
    weave: { ar: 'جلد معالج حريرياً نصف لماع', fr: 'Finition satinée hydrofuge', en: 'Semi-Aniline Silk Finish' },
    weight: '1.3 mm',
    martindale: '60,000+ دورة احتكاك',
    composition: { ar: '100% جلد طبيعي معالج بمقاومة السوائل', fr: '100% Cuir fleur traitée', en: '100% Treated Top-Grain Leather' },
    origin: { ar: 'توسكانا، إيطاليا', fr: 'Toscane, Italie', en: 'Tuscany, Italy' },
    description: {
      ar: 'درجة فحمية معتمة ذات بريق مخملي خفيف، تقاوم البقع وسهلة العناية، ملائمة للصالونات الراقية وقاعات الاستقبال.',
      fr: 'Teinte anthracite profonde au lustre satiné, traitée anti-taches pour les salons prestigieux.',
      en: 'Deep matte charcoal with subtle satin gleam, stain-guarded for high-traffic luxury residential reception rooms.',
    },
  },
  {
    id: 'sage-green',
    name: { ar: 'مخمل مريمي تركي محكم', fr: 'Velours Sauge Éthéré', en: 'Serene Sage Velvet' },
    category: 'velvet',
    hex: '#8A9A86',
    weave: { ar: 'مخمل قطني كثيف وبري', fr: 'Velours ras haute densité', en: 'High-Density Dense Cotton Velvet' },
    weight: '540 جم/م²',
    martindale: '55,000 دورة احتكاك',
    composition: { ar: '85% قطن ممشط، 15% حرير صناعي', fr: '85% Coton peigné, 15% Soie synthétique', en: '85% Combed Cotton, 15% Viscose Silk' },
    origin: { ar: 'إسطنبول، تركيا', fr: 'Istanbul, Turquie', en: 'Istanbul, Turkey' },
    description: {
      ar: 'لون مهدئ ومستوحى من الطبيعة المتوسطية، ذو لمعان خافت يغير درجته برقة مع زوايا الإضاءة المحيطة.',
      fr: 'Nuance méditerranéenne apaisante aux reflets changeants selon la trajectoire de la lumière.',
      en: 'Soothing Mediterranean sage green with delicate light-directional iridescence and supreme softness.',
    },
  },
  {
    id: 'natural-walnut',
    name: { ar: 'خشب جوز طبيعي مصقول', fr: 'Noyer Massif Naturel', en: 'Natural Solid Walnut' },
    category: 'wood',
    hex: '#5C4033',
    weave: { ar: 'ألياف خشبية صلبة متعرجة', fr: 'Fil de bois ondulé et cernes naturels', en: 'Undulating Natural Grain' },
    weight: 'كثافة 680 كغ/م³',
    martindale: 'طلاء ورنيش بولي يوريثان مصلب',
    composition: { ar: '100% خشب جوز قوقازي مصمت', fr: '100% Noyer noble massif', en: '100% Solid Noble Walnut' },
    origin: { ar: 'غابات قوقازية مستدامة', fr: 'Forêts gérées durablement', en: 'Sustainably Harvested' },
    description: {
      ar: 'خشب نبيـل يتميز بأمواج أليافه البنية الداكنة ولمعانه الساتاني الشفاف، محمي بورنيش إيطالي مقاوم للحرارة والرطوبة.',
      fr: 'Bois précieux aux veines contrastées, vernis d’une couche protectrice satinée hydrofuge.',
      en: 'Exquisite hardwood with rich contrast veining, sealed with heat- and moisture-resistant satin clearcoat.',
    },
  },
  {
    id: 'brushed-gold',
    name: { ar: 'ذهب عيار 24 مطفي ومصقول', fr: 'Or 24k Brossé Satiné', en: '24k Brushed Satin Gold' },
    category: 'metal',
    hex: '#D4AF37',
    weave: { ar: 'فولاذ كربوني مطلي بطلاء PVD مذهب', fr: 'Acier revêtu PVD or 24 carats', en: 'PVD Molecular Gold Plating' },
    weight: 'سماكة طلاء 3 ميكرون',
    martindale: 'مقاوم للصدأ والخدش 100%',
    composition: { ar: 'فولاذ 316L مقاوم للصدأ مع طبقة ذهب حقيقي', fr: 'Inox 316L & Or véritable', en: '316L Stainless Steel & Pure Gold Layer' },
    origin: { ar: 'ميلانو، إيطاليا', fr: 'Milan, Italie', en: 'Milan, Italy' },
    description: {
      ar: 'لمسة نهائية ملكية مطفية غير عاكسة للضوء بحدة، لا تترك بصمات الأصابع ومقاومة للأكسدة والتآكل مدى الحياة.',
      fr: 'Finition or brossé mate anti-traces, inaltérable et résistante à l’oxydation dans le temps.',
      en: 'Imperial brushed gold with anti-fingerprint treatment, perfectly resisting oxidation and tarnish.',
    },
  },
];

interface FabricSwatchLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FabricSwatchLibraryModal: React.FC<FabricSwatchLibraryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useTranslation();
  const [selectedFabric, setSelectedFabric] = useState<FabricDetail>(FABRIC_LIBRARY_DETAILS[0]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'leather' | 'boucle' | 'velvet' | 'wood' | 'metal'>('all');
  
  // Interactive Macro Magnifier State
  const [isZooming, setIsZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const previewRef = useRef<HTMLDivElement>(null);

  const { setColorHex, setWoodHex, setMetalHex } = useCustomizerStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredFabrics = activeCategory === 'all'
    ? FABRIC_LIBRARY_DETAILS
    : FABRIC_LIBRARY_DETAILS.filter((f) => f.category === activeCategory);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleApplyToModel = (fabric: FabricDetail) => {
    if (fabric.category === 'wood') {
      setWoodHex(fabric.hex);
    } else if (fabric.category === 'metal') {
      setMetalHex(fabric.hex);
    } else {
      setColorHex(fabric.hex);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Fabric Swatch Library & Macro Zoom"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-5xl bg-marble-50 rounded-3xl overflow-hidden border border-gold/40 shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gold/25 bg-marble-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold-dark">
                <ZoomIn className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block">
                  {language === 'ar' ? 'مكتبة الخامات والأنسجة الفاخرة' : 'Haute Textile & Swatch Archive'}
                </span>
                <h3 className="font-heading font-bold text-xl text-charcoal">
                  {language === 'ar' ? 'فاحص الماكرو المجهري 4X للأقمشة' : '4X Macro Texture & Swatch Explorer'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-marble-200 text-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="px-6 py-3 border-b border-gold/15 bg-marble-50 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: language === 'ar' ? 'الكل' : 'All Materials' },
              { id: 'leather', label: language === 'ar' ? 'جلود إيطالية' : 'Italian Leathers' },
              { id: 'boucle', label: language === 'ar' ? 'أقمشة بوكليه' : 'Bouclé' },
              { id: 'velvet', label: language === 'ar' ? 'مخمل وأنسجة' : 'Velvet Weaves' },
              { id: 'wood', label: language === 'ar' ? 'أخشاب مصقولة' : 'Fine Woods' },
              { id: 'metal', label: language === 'ar' ? 'حليات مذهبة' : 'Metals & Gold' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gold-gradient text-charcoal-dark shadow-sm'
                    : 'bg-marble-100 text-charcoal/70 hover:bg-marble-200 border border-gold/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Main Modal Body: Split Interactive Explorer */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Interactive Macro Zoom Canvas Preview (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              
              {/* Zoomable Surface Container */}
              <div
                ref={previewRef}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-gold/30 shadow-lg cursor-crosshair select-none bg-charcoal"
                style={{ backgroundColor: selectedFabric.hex }}
              >
                {/* Simulated High-Res Textile Pattern Shader / Canvas Layer */}
                <div
                  className="absolute inset-0 transition-transform duration-75"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.35) 100%)`,
                    transform: isZooming ? `scale(2.5)` : 'scale(1)',
                    transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
                  }}
                >
                  {/* Procedural Texture Micro-Grid simulation */}
                  <div
                    className="w-full h-full opacity-65"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px),
                        radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)
                      `,
                      backgroundSize: '8px 8px, 12px 12px',
                    }}
                  />
                </div>

                {/* Macro Magnifier Reticle Hint */}
                <div className="absolute top-3 end-3 px-3 py-1.5 rounded-full bg-charcoal-dark/75 backdrop-blur-md border border-gold/40 text-marble-100 text-[11px] font-mono shadow-md flex items-center gap-1.5 pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5 text-gold" />
                  <span>{isZooming ? '4X MACRO ZOOM' : (language === 'ar' ? 'حرّك المؤشر للتقريب 4X' : 'Hover to Zoom 4X')}</span>
                </div>

                {/* Color Name Tag Badge */}
                <div className="absolute bottom-3 start-3 px-3.5 py-1.5 rounded-xl bg-marble-50/90 backdrop-blur-md border border-gold/40 text-charcoal text-xs font-semibold shadow-md pointer-events-none">
                  {selectedFabric.name[language] || selectedFabric.name.ar}
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="bg-marble-100 rounded-2xl border border-gold/25 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gold-dark uppercase tracking-wider mb-2">
                  <Info className="w-4 h-4" />
                  <span>{language === 'ar' ? 'المواصفات الفنية والمخبرية للخامة' : 'Technical & Lab Specifications'}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-marble-50 p-2.5 rounded-xl border border-gold/20">
                    <span className="text-charcoal-soft block text-[11px] mb-0.5">
                      {language === 'ar' ? 'هيكل النسيج (Weave):' : 'Weave Structure:'}
                    </span>
                    <span className="font-semibold text-charcoal">
                      {selectedFabric.weave[language] || selectedFabric.weave.ar}
                    </span>
                  </div>

                  <div className="bg-marble-50 p-2.5 rounded-xl border border-gold/20">
                    <span className="text-charcoal-soft block text-[11px] mb-0.5">
                      {language === 'ar' ? 'مقاومة الاحتكاك (Martindale):' : 'Martindale Rubs:'}
                    </span>
                    <span className="font-semibold text-charcoal">
                      {selectedFabric.martindale}
                    </span>
                  </div>

                  <div className="bg-marble-50 p-2.5 rounded-xl border border-gold/20">
                    <span className="text-charcoal-soft block text-[11px] mb-0.5">
                      {language === 'ar' ? 'التركيبة والوزن:' : 'Composition & Weight:'}
                    </span>
                    <span className="font-semibold text-charcoal">
                      {selectedFabric.composition[language] || selectedFabric.composition.ar} ({selectedFabric.weight})
                    </span>
                  </div>

                  <div className="bg-marble-50 p-2.5 rounded-xl border border-gold/20">
                    <span className="text-charcoal-soft block text-[11px] mb-0.5">
                      {language === 'ar' ? 'بلد المنشأ والتصنيع:' : 'Origin & Milling:'}
                    </span>
                    <span className="font-semibold text-charcoal">
                      {selectedFabric.origin[language] || selectedFabric.origin.ar}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-charcoal-soft leading-relaxed pt-1">
                  {selectedFabric.description[language] || selectedFabric.description.ar}
                </p>
              </div>
            </div>

            {/* Right Column: Swatch Gallery Grid & Apply Action (5 cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                  {language === 'ar' ? 'اختر خامة للمعاينة' : 'Select Swatch to Inspect'}
                </span>
                <span className="text-[11px] font-mono text-charcoal/60">
                  {filteredFabrics.length} {language === 'ar' ? 'عينات' : 'swatches'}
                </span>
              </div>

              {/* Swatch Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredFabrics.map((fabric) => {
                  const isCurrent = selectedFabric.id === fabric.id;
                  return (
                    <button
                      key={fabric.id}
                      onClick={() => setSelectedFabric(fabric)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-start transition-all ${
                        isCurrent
                          ? 'border-gold ring-2 ring-gold/40 bg-marble-200/90 shadow-sm'
                          : 'border-marble-300 hover:border-gold/40 bg-marble-50'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-gold/40 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: fabric.hex }}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-charcoal block truncate">
                          {fabric.name[language] || fabric.name.ar}
                        </span>
                        <span className="text-[10px] text-charcoal/60 block truncate font-mono">
                          {fabric.hex}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Button: Apply to 3D Customizer */}
              <div className="pt-3 border-t border-gold/20">
                <motion.button
                  onClick={() => handleApplyToModel(selectedFabric)}
                  whileTap={{ scale: 0.96 }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gold-gradient text-charcoal-dark font-bold text-sm shadow-md hover:brightness-105 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {language === 'ar'
                      ? `اعتماد (${selectedFabric.name[language] || selectedFabric.name.ar}) في الـ 3D`
                      : `Apply (${selectedFabric.name[language] || selectedFabric.name.en}) to 3D`}
                  </span>
                </motion.button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
