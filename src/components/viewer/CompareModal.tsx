import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Link2,
  Unlink,
  Sun,
  Moon,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  ArrowRightLeft,
  Check,
  Compass,
} from 'lucide-react';
import type { Product } from '@/types/product';
import { StudioEnvironment, type LightingPreset } from '@/three/components/StudioEnvironment';
import { StudioFloor } from '@/three/components/StudioFloor';
import { ModelViewerCore } from '@/three/components/ModelViewerCore';
import { ViewerErrorBoundary } from '@/three/components/ViewerErrorBoundary';
import { useTranslation } from '@/i18n';
import { useQuoteCartStore } from '@/store/quoteCartStore';
import { buildCompareWhatsAppUrl } from '@/utils/whatsapp';
import { trackEvent } from '@/utils/analytics';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProduct1?: Product;
  initialProduct2?: Product;
  onSelectProductForCustomizer?: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProduct1,
  initialProduct2,
  onSelectProductForCustomizer,
}) => {
  const { language } = useTranslation();

  // Selected Products
  const [product1, setProduct1] = useState<Product>(
    initialProduct1 || products[0] || ({} as Product)
  );
  const [product2, setProduct2] = useState<Product>(
    initialProduct2 || products[1] || products[0] || ({} as Product)
  );

  // Swatch colors
  const [color1, setColor1] = useState<string>(product1.colorOptions?.[0]?.hex || '#D4AF37');
  const [color2, setColor2] = useState<string>(product2.colorOptions?.[0]?.hex || '#D4AF37');

  // Controls & Lighting
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('day');
  const [addedBoth, setAddedBoth] = useState<boolean>(false);

  const controls1Ref = useRef<OrbitControlsImpl>(null);
  const controls2Ref = useRef<OrbitControlsImpl>(null);
  const isSyncingRef = useRef<boolean>(false);

  // Synchronize when initial props change
  useEffect(() => {
    if (initialProduct1) {
      setProduct1(initialProduct1);
      setColor1(initialProduct1.colorOptions?.[0]?.hex || '#D4AF37');
    }
  }, [initialProduct1]);

  useEffect(() => {
    if (initialProduct2) {
      setProduct2(initialProduct2);
      setColor2(initialProduct2.colorOptions?.[0]?.hex || '#D4AF37');
    } else if (initialProduct1 && products.length > 1) {
      const other = products.find((p) => p.id !== initialProduct1.id) || products[0];
      setProduct2(other);
      setColor2(other.colorOptions?.[0]?.hex || '#D4AF37');
    }
  }, [initialProduct2, initialProduct1, products]);

  // Synchronized camera handler
  const handleControls1Change = () => {
    if (!isSynced || isSyncingRef.current) return;
    if (!controls1Ref.current || !controls2Ref.current) return;
    isSyncingRef.current = true;
    controls2Ref.current.object.position.copy(controls1Ref.current.object.position);
    controls2Ref.current.object.quaternion.copy(controls1Ref.current.object.quaternion);
    controls2Ref.current.target.copy(controls1Ref.current.target);
    controls2Ref.current.update();
    isSyncingRef.current = false;
  };

  const handleControls2Change = () => {
    if (!isSynced || isSyncingRef.current) return;
    if (!controls1Ref.current || !controls2Ref.current) return;
    isSyncingRef.current = true;
    controls1Ref.current.object.position.copy(controls2Ref.current.object.position);
    controls1Ref.current.object.quaternion.copy(controls2Ref.current.object.quaternion);
    controls1Ref.current.target.copy(controls2Ref.current.target);
    controls1Ref.current.update();
    isSyncingRef.current = false;
  };

  // Add both to cart
  const handleAddBothToCart = () => {
    const addItem = useQuoteCartStore.getState().addItem;
    addItem({
      type: 'catalog',
      productId: product1.id,
      name: product1.name,
      photoUrl: product1.photo?.srcJpg,
      colorHex: color1,
      dimensionsCm: product1.dimensionsCm,
    });
    addItem({
      type: 'catalog',
      productId: product2.id,
      name: product2.name,
      photoUrl: product2.photo?.srcJpg,
      colorHex: color2,
      dimensionsCm: product2.dimensionsCm,
    });
    setAddedBoth(true);
    setTimeout(() => setAddedBoth(false), 2500);
  };

  const waUrl = buildCompareWhatsAppUrl(product1, product2, language);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal-dark/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-marble-50 rounded-3xl border border-gold/30 shadow-2xl overflow-hidden z-10"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold/20 bg-marble-100/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-charcoal-dark shadow-gold-soft">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-charcoal flex items-center gap-2">
                    <span>
                      {language === 'ar' ? 'مقارنة القطع ثلاثية الأبعاد' : '3D Side-by-Side Comparison'}
                    </span>
                    <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark border border-gold/30 uppercase tracking-widest">
                      Live 3D Dual Sync
                    </span>
                  </h2>
                  <p className="text-xs text-charcoal-soft hidden md:block">
                    {language === 'ar'
                      ? 'قارن بين قطعتين مع زوايا دوران متزامنة ومواصفات تفصيلية'
                      : 'Compare any two pieces with synchronized 3D orbit and spec breakdowns'}
                  </p>
                </div>
              </div>

              {/* Toolbar Controls */}
              <div className="flex items-center gap-2">
                {/* Sync Toggle */}
                <motion.button
                  onClick={() => setIsSynced(!isSynced)}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isSynced
                      ? 'bg-gold-gradient text-charcoal-dark border-gold shadow-sm'
                      : 'bg-marble-200 text-charcoal-soft border-marble-300'
                  }`}
                  title={
                    language === 'ar'
                      ? isSynced
                        ? 'الكاميرا متزامنة (انقر للتحكم المنفصل)'
                        : 'تحكم منفصل (انقر لمزامنة الدوران)'
                      : isSynced
                      ? 'Camera synced (Click to unlink)'
                      : 'Independent camera (Click to sync)'
                  }
                >
                  {isSynced ? <Link2 className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">
                    {isSynced
                      ? language === 'ar'
                        ? 'دوران متزامن'
                        : 'Orbit Synced'
                      : language === 'ar'
                        ? 'تحكم منفصل'
                        : 'Unlinked'}
                  </span>
                </motion.button>

                {/* Lighting Toggle */}
                <motion.button
                  onClick={() => setLightingPreset(lightingPreset === 'day' ? 'evening' : 'day')}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-marble-200 hover:bg-marble-300 text-charcoal transition-colors border border-marble-300"
                  title={
                    lightingPreset === 'day'
                      ? language === 'ar'
                        ? 'إضاءة مسائية دافئة'
                        : 'Warm Evening Light'
                      : language === 'ar'
                        ? 'إضاءة نهارية'
                        : 'Studio Day Light'
                  }
                >
                  {lightingPreset === 'day' ? (
                    <Sun className="w-4 h-4 text-gold-dark" />
                  ) : (
                    <Moon className="w-4 h-4 text-gold" />
                  )}
                </motion.button>

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-marble-200 hover:bg-marble-300 text-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Scrollable Comparison Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* Dual 3D Viewports Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Viewport 1 */}
                <div className="flex flex-col bg-marble-100 rounded-2xl border border-gold/25 p-4 shadow-sm">
                  {/* Selector & Title */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gold/15 text-gold-dark font-mono">
                        {language === 'ar' ? 'القطعة الأولى (1)' : 'Piece A'}
                      </span>
                      {onSelectProductForCustomizer && (
                        <button
                          onClick={() => {
                            onSelectProductForCustomizer(product1);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-dark hover:underline"
                          title={language === 'ar' ? 'فتح في مصمم 3D' : 'Open in 3D Customizer'}
                        >
                          <Compass className="w-3 h-3" />
                          <span>{language === 'ar' ? 'تخصيص' : 'Customize'}</span>
                        </button>
                      )}
                    </div>
                    <select
                      value={product1.id}
                      onChange={(e) => {
                        const found = products.find((p) => p.id === e.target.value);
                        if (found) {
                          setProduct1(found);
                          setColor1(found.colorOptions?.[0]?.hex || '#D4AF37');
                        }
                      }}
                      className="text-xs bg-marble-50 border border-gold/30 rounded-lg px-2.5 py-1.5 font-medium text-charcoal focus:ring-1 focus:ring-gold outline-none max-w-[220px]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name[language] || p.name.ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3D Canvas Box */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gradient-radial from-marble-50 via-marble-200 to-marble-300 border border-gold/20 shadow-inner">
                    <ViewerErrorBoundary>
                      <Canvas
                        camera={{ position: [2.6, 1.8, 3.2], fov: 38 }}
                        dpr={[1, 1.5]}
                        gl={{ antialias: true, alpha: true }}
                      >
                        <StudioEnvironment preset={lightingPreset} />
                        <StudioFloor />
                        <ModelViewerCore product={product1} colorHex={color1} />
                        <OrbitControls
                          ref={controls1Ref}
                          enableDamping
                          dampingFactor={0.05}
                          minDistance={1.2}
                          maxDistance={8}
                          maxPolarAngle={Math.PI / 2 + 0.05}
                          target={[0, 0.45, 0]}
                          onChange={handleControls1Change}
                        />
                      </Canvas>
                    </ViewerErrorBoundary>

                    {/* Viewport Badge */}
                    <div className="absolute bottom-2 start-2 pointer-events-none">
                      <span className="px-2 py-1 rounded bg-charcoal-dark/75 text-marble-100 text-[10px] font-mono backdrop-blur-xs">
                        {product1.dimensionsCm.w} × {product1.dimensionsCm.d} × {product1.dimensionsCm.h} cm
                      </span>
                    </div>
                  </div>

                  {/* Color Swatch Options */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-marble-200">
                    <span className="text-xs text-charcoal-soft font-medium">
                      {language === 'ar' ? 'اللون:' : 'Color:'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {product1.colorOptions?.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setColor1(c.hex)}
                          className={`w-5 h-5 rounded-full border transition-all ${
                            color1 === c.hex ? 'ring-2 ring-gold scale-110' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name[language] || c.name.ar}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Viewport 2 */}
                <div className="flex flex-col bg-marble-100 rounded-2xl border border-gold/25 p-4 shadow-sm">
                  {/* Selector & Title */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gold/15 text-gold-dark font-mono">
                        {language === 'ar' ? 'القطعة الثانية (2)' : 'Piece B'}
                      </span>
                      {onSelectProductForCustomizer && (
                        <button
                          onClick={() => {
                            onSelectProductForCustomizer(product2);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-dark hover:underline"
                          title={language === 'ar' ? 'فتح في مصمم 3D' : 'Open in 3D Customizer'}
                        >
                          <Compass className="w-3 h-3" />
                          <span>{language === 'ar' ? 'تخصيص' : 'Customize'}</span>
                        </button>
                      )}
                    </div>
                    <select
                      value={product2.id}
                      onChange={(e) => {
                        const found = products.find((p) => p.id === e.target.value);
                        if (found) {
                          setProduct2(found);
                          setColor2(found.colorOptions?.[0]?.hex || '#D4AF37');
                        }
                      }}
                      className="text-xs bg-marble-50 border border-gold/30 rounded-lg px-2.5 py-1.5 font-medium text-charcoal focus:ring-1 focus:ring-gold outline-none max-w-[220px]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name[language] || p.name.ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3D Canvas Box */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gradient-radial from-marble-50 via-marble-200 to-marble-300 border border-gold/20 shadow-inner">
                    <ViewerErrorBoundary>
                      <Canvas
                        camera={{ position: [2.6, 1.8, 3.2], fov: 38 }}
                        dpr={[1, 1.5]}
                        gl={{ antialias: true, alpha: true }}
                      >
                        <StudioEnvironment preset={lightingPreset} />
                        <StudioFloor />
                        <ModelViewerCore product={product2} colorHex={color2} />
                        <OrbitControls
                          ref={controls2Ref}
                          enableDamping
                          dampingFactor={0.05}
                          minDistance={1.2}
                          maxDistance={8}
                          maxPolarAngle={Math.PI / 2 + 0.05}
                          target={[0, 0.45, 0]}
                          onChange={handleControls2Change}
                        />
                      </Canvas>
                    </ViewerErrorBoundary>

                    {/* Viewport Badge */}
                    <div className="absolute bottom-2 start-2 pointer-events-none">
                      <span className="px-2 py-1 rounded bg-charcoal-dark/75 text-marble-100 text-[10px] font-mono backdrop-blur-xs">
                        {product2.dimensionsCm.w} × {product2.dimensionsCm.d} × {product2.dimensionsCm.h} cm
                      </span>
                    </div>
                  </div>

                  {/* Color Swatch Options */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-marble-200">
                    <span className="text-xs text-charcoal-soft font-medium">
                      {language === 'ar' ? 'اللون:' : 'Color:'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {product2.colorOptions?.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setColor2(c.hex)}
                          className={`w-5 h-5 rounded-full border transition-all ${
                            color2 === c.hex ? 'ring-2 ring-gold scale-110' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name[language] || c.name.ar}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Comparative Specification Breakdown Table */}
              <div className="bg-marble-100/70 rounded-2xl border border-gold/25 p-5">
                <h4 className="font-heading text-sm font-bold text-charcoal mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-dark" />
                  <span>
                    {language === 'ar'
                      ? 'جدول المقارنة التفصيلية بين القطعتين'
                      : 'Side-by-Side Specifications'}
                  </span>
                </h4>

                <div className="grid grid-cols-3 gap-3 text-xs border-b border-marble-200 pb-3 font-semibold text-charcoal">
                  <span className="text-charcoal-soft font-normal">
                    {language === 'ar' ? 'المعيار' : 'Feature'}
                  </span>
                  <span className="text-gold-dark truncate">
                    {product1.name[language] || product1.name.ar}
                  </span>
                  <span className="text-gold-dark truncate">
                    {product2.name[language] || product2.name.ar}
                  </span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-marble-200/60 text-xs">
                  {/* Category */}
                  <div className="grid grid-cols-3 gap-3 py-2.5">
                    <span className="text-charcoal-soft">
                      {language === 'ar' ? 'التصنيف' : 'Category'}
                    </span>
                    <span className="font-medium text-charcoal capitalize">{product1.category}</span>
                    <span className="font-medium text-charcoal capitalize">{product2.category}</span>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-3 gap-3 py-2.5">
                    <span className="text-charcoal-soft">
                      {language === 'ar' ? 'الأبعاد (عرض × عمق × ارتفاع)' : 'Dimensions (W × D × H)'}
                    </span>
                    <span className="font-mono text-charcoal">
                      {product1.dimensionsCm.w} × {product1.dimensionsCm.d} × {product1.dimensionsCm.h} cm
                    </span>
                    <span className="font-mono text-charcoal">
                      {product2.dimensionsCm.w} × {product2.dimensionsCm.d} × {product2.dimensionsCm.h} cm
                    </span>
                  </div>

                  {/* Materials */}
                  <div className="grid grid-cols-3 gap-3 py-2.5">
                    <span className="text-charcoal-soft">
                      {language === 'ar' ? 'الخامات الأساسية' : 'Primary Materials'}
                    </span>
                    <span className="text-charcoal leading-relaxed">
                      {(product1.materials[language] || product1.materials.ar).join(' • ')}
                    </span>
                    <span className="text-charcoal leading-relaxed">
                      {(product2.materials[language] || product2.materials.ar).join(' • ')}
                    </span>
                  </div>

                  {/* Customization Options */}
                  <div className="grid grid-cols-3 gap-3 py-2.5">
                    <span className="text-charcoal-soft">
                      {language === 'ar' ? 'إمكانية التخصيص' : 'Bespoke Options'}
                    </span>
                    <span className="text-charcoal">
                      {language === 'ar'
                        ? 'تعديل الأبعاد، الألوان، تشطيب الأرجل والخشب'
                        : 'Custom dimensions, fabrics, wood & metal finishes'}
                    </span>
                    <span className="text-charcoal">
                      {language === 'ar'
                        ? 'تعديل الأبعاد، الألوان، تشطيب الأرجل والخشب'
                        : 'Custom dimensions, fabrics, wood & metal finishes'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions Footer */}
            <div className="px-6 py-4 bg-marble-100 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-charcoal-soft">
                {language === 'ar'
                  ? 'يمكن طلب القطعتين معاً بتنسيق ألوان موحد من الورشة'
                  : 'Both pieces can be custom tailored with matched finishes from the atelier'}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Add Both to Cart */}
                <motion.button
                  onClick={() => {
                    trackEvent('cart_add', {
                      source: 'compare_modal',
                      product1: product1.id,
                      product2: product2.id,
                    });
                    handleAddBothToCart();
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-marble-50 border border-gold text-charcoal font-semibold text-xs hover:bg-gold hover:text-charcoal-dark shadow-sm transition-all"
                >
                  {addedBoth ? <Check className="w-4 h-4 text-green-600" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>
                    {addedBoth
                      ? language === 'ar'
                        ? 'تمت الإضافة للسلة!'
                        : 'Added Both!'
                      : language === 'ar'
                        ? 'إضافة القطعتين لطلب التسعيرة'
                        : 'Add Both to Quote'}
                  </span>
                </motion.button>

                {/* WhatsApp Inquiry for Both */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent('quote_inquiry', {
                      source: 'compare_modal',
                      product1: product1.id,
                      product2: product2.id,
                      phone: '+213556929134',
                    });
                  }}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-md hover:brightness-105 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {language === 'ar' ? 'طلب تسعيرة القطعتين عبر واتساب' : 'WhatsApp Quote for Both'}
                  </span>
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
