import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { spring } from '@animate-ui/react/utils/motion';
import { useTranslation } from '@/i18n';

interface BrandCrestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandCrestModal: React.FC<BrandCrestModalProps> = ({ isOpen, onClose }) => {
  const { language } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal-dark/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative w-full max-w-xl bg-gradient-to-br from-charcoal-dark via-charcoal to-black border-2 border-gold/40 rounded-3xl shadow-2xl p-6 sm:p-10 text-center overflow-hidden z-10"
          >
            {/* Ambient Radial Gold Glow */}
            <div className="absolute top-0 start-1/2 -translate-x-1/2 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              transition={spring.press}
              className="absolute top-4 end-4 p-2.5 rounded-full bg-marble-100/10 hover:bg-gold/20 text-marble-200 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Emblem Artwork */}
            <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 mb-6">
              <img
                src="/logo-full.png"
                alt="TURQUOISE home textile Pegasus Crest"
                className="w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(212,175,55,0.45)]"
              />
            </div>

            {/* Brand Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>TURQUOISE HOME TEXTILE</span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-marble-50">
                {language === 'ar' ? 'تركواز للأثاث والمنسوجات الفاخرة' : 'Maison Turquoise Home Textile'}
              </h3>

              <p className="text-sm text-marble-300 leading-relaxed max-w-md mx-auto">
                {language === 'ar'
                  ? 'الشعار الرسمي المعتمد: بيغاسوس المجنح مع إكليل الغار الروماني والإغريقي، رمزاً للارتقاء بالفخامة وجودة الصنعة الاستثنائية في الجزائر.'
                  : 'Official Brand Crest: The soaring winged Pegasus enveloped in classical laurel wreath, symbolizing elevated craftsmanship and neoclassical luxury.'}
              </p>

              {/* Badges */}
              <div className="pt-6 flex items-center justify-center gap-6 text-xs text-gold border-t border-gold/20">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  {language === 'ar' ? 'أثاث حسب المقاس' : 'Bespoke Haute Craft'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {language === 'ar' ? 'خامات إيطالية وتركية' : 'Curated Luxury Materials'}
                </span>
              </div>

              {/* Actions */}
              <div className="pt-6 flex items-center justify-center gap-3">
                <a
                  href="/logo-full.png"
                  download="turquoise-home-textile-crest.png"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold-gradient text-charcoal-dark font-bold text-xs shadow-gold-soft hover:brightness-105 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تحميل الشعار عالي الدقة' : 'Download High-Res Crest'}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
