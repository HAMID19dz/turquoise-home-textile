import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, MessageCircle, Smartphone } from 'lucide-react';
import {
  spring,
  transition,
  useTempoTransition,
  useShouldReduceMotion,
} from '@animate-ui/react/utils/motion';
import type { Product } from '../../types/product';
import { useTranslation } from '../../i18n';
import { buildProductWhatsAppUrl } from '../../utils/whatsapp';
import { ProductViewer } from '../../three/ProductViewer';
import { trackEvent } from '../../utils/analytics';

interface QuickViewerModalProps {
  product: Product | null;
  initialColorHex?: string;
  onClose: () => void;
  onCustomize: (product: Product) => void;
}

export const QuickViewerModal: React.FC<QuickViewerModalProps> = ({
  product,
  initialColorHex,
  onClose,
  onCustomize,
}) => {
  const { t, language } = useTranslation();
  const shouldReduceMotion = useShouldReduceMotion();
  const [showArInfo, setShowArInfo] = useState(false);

  const overlayTransition = useTempoTransition(transition.overlay);
  const dialogSpring = useTempoTransition(spring.dialog);
  const dialogFade = useTempoTransition(transition.dialogFade);
  const dismissTransition = useTempoTransition(transition.dismiss);
  const pressSpring = useTempoTransition(spring.press);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const localizedName = product.name[language] || product.name.ar;
  const waUrl = buildProductWhatsAppUrl(product, language);

  const TIPPED = 'perspective(600px) rotateX(-12deg) scale(0.96)';
  const UPRIGHT = 'perspective(600px) rotateX(0deg) scale(1)';

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={localizedName}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
      >
        {/* Backdrop Overlay with Animate UI Transition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog Content with Animate UI Tipping Spring */}
        <motion.div
          initial={{
            opacity: 0,
            transform: shouldReduceMotion ? UPRIGHT : TIPPED,
          }}
          animate={{
            opacity: 1,
            transform: UPRIGHT,
            transition: { ...dialogSpring, opacity: dialogFade },
          }}
          exit={{
            opacity: 0,
            transform: shouldReduceMotion ? UPRIGHT : TIPPED,
            transition: dismissTransition,
          }}
          className="relative z-10 w-full max-w-5xl bg-marble-50 rounded-3xl overflow-hidden border border-gold/40 shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-gold/20 bg-marble-100">
            <div>
              <span className="text-[11px] font-semibold text-gold-dark uppercase tracking-wider block">
                {language === 'ar' ? 'العرض التفاعلي ثلاثي الأبعاد' : 'Interactive 3D Stage'}
              </span>
              <h3 className="font-heading font-bold text-xl text-charcoal">
                {localizedName}
              </h3>
            </div>

            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              transition={pressSpring}
              className="p-2 rounded-full hover:bg-marble-200 text-charcoal transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Modal 3D Stage Body */}
          <div className="relative w-full h-[480px] sm:h-[540px] md:h-[580px] p-2 sm:p-4 bg-marble-200/50">
            <ProductViewer
              product={product}
              activeColorHex={initialColorHex}
              className="w-full h-full"
            />
          </div>

          {/* Modal Footer Controls */}
          <div className="px-6 py-4 border-t border-gold/20 bg-marble-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-charcoal/60 font-mono">
                {product.dimensionsCm.w} × {product.dimensionsCm.d} × {product.dimensionsCm.h} cm
              </span>
              <span className="text-gold-dark font-semibold text-sm">
                {t('catalog.priceOnRequest')}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* AR View in Room Button */}
              <motion.button
                onClick={() => setShowArInfo(true)}
                whileTap={{ scale: 0.96 }}
                transition={pressSpring}
                className="p-2.5 rounded-full border border-gold/40 bg-marble-100 hover:bg-gold-light/30 text-charcoal flex items-center justify-center transition-colors"
                title={language === 'ar' ? 'معاينة في غرفتك بالواقع المعزز (AR)' : 'View in Your Room (AR)'}
                aria-label="View in AR"
              >
                <Smartphone className="w-4 h-4 text-gold-dark" />
              </motion.button>

              <motion.button
                onClick={() => {
                  trackEvent('customizer_preset', {
                    source: 'quick_viewer',
                    productId: product.id,
                  });
                  onClose();
                  onCustomize(product);
                }}
                whileTap={{ scale: 0.96 }}
                transition={pressSpring}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gold-gradient text-charcoal-dark font-bold text-sm shadow-md hover:brightness-105 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>{t('catalog.customize')}</span>
              </motion.button>

              <motion.a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent('quote_inquiry', {
                    source: 'quick_viewer',
                    productId: product.id,
                    phone: '+213556929134',
                  });
                }}
                whileTap={{ scale: 0.96 }}
                transition={pressSpring}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-sm shadow-md hover:bg-[#128C7E] transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </motion.a>
            </div>
          </div>

          {/* AR Room Preview Information Dialog */}
          {showArInfo && (
            <div className="absolute inset-0 bg-charcoal-dark/70 backdrop-blur-md z-30 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-marble-50 rounded-2xl border border-gold/40 p-6 shadow-2xl relative space-y-4"
              >
                <button
                  onClick={() => setShowArInfo(false)}
                  className="absolute top-4 end-4 p-1.5 rounded-full hover:bg-marble-200 text-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold-dark mb-2">
                  <Smartphone className="w-6 h-6" />
                </div>

                <h4 className="font-heading font-bold text-lg text-charcoal">
                  {language === 'ar'
                    ? 'معاينة الواقع المعزز (AR) في غرفتك'
                    : 'Augmented Reality (AR) Room Preview'}
                </h4>

                <p className="text-xs text-charcoal-soft leading-relaxed">
                  {language === 'ar'
                    ? 'يتطلب الواقع المعزز فتح الصفحة على هاتفك الذكي (iOS عبر QuickLook أو Android عبر SceneViewer). يمكنك أيضاً استخدام ميزة "رفع صورة غرفتك" في استوديو التخصيص لمعاينة فورية.'
                    : 'Augmented reality places this piece directly onto your floor using your smartphone camera. You can also upload a photo of your room in the 3D Atelier for immediate room matching.'}
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowArInfo(false);
                      onClose();
                      onCustomize(product);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gold-gradient text-charcoal-dark font-bold text-xs shadow-sm hover:brightness-105 transition-all text-center"
                  >
                    {language === 'ar' ? 'فتح استوديو التخصيص 3D' : 'Open 3D Atelier Customizer'}
                  </button>
                  <button
                    onClick={() => setShowArInfo(false)}
                    className="w-full py-2 rounded-xl text-xs text-charcoal/70 hover:text-charcoal"
                  >
                    {language === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
