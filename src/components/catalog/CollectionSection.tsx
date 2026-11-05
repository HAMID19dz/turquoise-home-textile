import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft } from 'lucide-react';
import {
  ReducedMotionConfig,
  spring,
  transition,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import type { Product, ProductCategory } from '../../types/product';
import { getAllProducts } from '../../types/product';
import { ProductCard } from './ProductCard';
import { useTranslation } from '../../i18n';

interface CollectionSectionProps {
  onOpenLightbox: (product: Product) => void;
  onOpenViewer: (product: Product, colorHex?: string) => void;
  onCustomize: (product: Product) => void;
  onCompare?: (product: Product) => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  onOpenLightbox,
  onOpenViewer,
  onCustomize,
  onCompare,
}) => {
  const { t, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');

  const allProducts = useMemo(() => getAllProducts(), []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return allProducts;
    return allProducts.filter((p) => p.category === activeCategory);
  }, [allProducts, activeCategory]);

  const categories: { id: ProductCategory; labelKey: string }[] = [
    { id: 'all', labelKey: 'catalog.filterAll' },
    { id: 'seating', labelKey: 'catalog.filterSeating' },
    { id: 'tables', labelKey: 'catalog.filterTables' },
    { id: 'curtains', labelKey: 'catalog.filterCurtains' },
  ];

  const moveTransition = useTempoTransition(spring.reflow);
  const fadeTransition = useTempoTransition(transition.fade);
  const selectionSpring = useTempoTransition(spring.selection);

  return (
    <section id="catalog" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-block px-4 py-1.5 rounded-full bg-marble-50 border border-gold/40 text-xs font-semibold text-gold-dark uppercase tracking-widest mb-4">
          {t('catalog.sectionBadge')}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
          {t('catalog.title')}
        </h2>
        <p className="text-charcoal-soft text-base sm:text-lg">
          {t('catalog.subtitle')}
        </p>
      </div>

      {/* Filter Navigation Tabs with Animate UI Gliding Indicator */}
      <div className="flex items-center justify-center mb-12">
        <div className="relative inline-flex p-1.5 rounded-full bg-marble-50/90 border border-gold/30 shadow-sm gap-1 sm:gap-2">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count =
              cat.id === 'all'
                ? allProducts.length
                : allProducts.filter((p) => p.category === cat.id).length;

            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileTap={{ scale: 0.97 }}
                transition={spring.press}
                className="relative flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors focus:outline-none"
              >
                {/* Gliding Active Pill Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="activeFilterPill"
                    transition={selectionSpring}
                    className="absolute inset-0 rounded-full bg-gold-gradient shadow-sm"
                  />
                )}

                <span
                  className={`relative z-10 ${
                    isSelected ? 'text-charcoal-dark font-bold' : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  {t(cat.labelKey)}
                </span>

                <span
                  className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-mono transition-colors ${
                    isSelected
                      ? 'bg-charcoal-dark/20 text-charcoal-dark'
                      : 'bg-marble-200 text-charcoal/60'
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Global Compare 3D Trigger */}
        {onCompare && (
          <motion.button
            onClick={() => onCompare(filteredProducts[0] || allProducts[0])}
            whileTap={{ scale: 0.95 }}
            transition={spring.press}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-marble-50/90 border border-gold/40 text-xs font-semibold text-charcoal hover:text-gold-dark hover:border-gold hover:shadow-gold-soft transition-all"
            title={language === 'ar' ? 'مقارنة قطعتين في 3D' : 'Compare two pieces in 3D'}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-gold-dark" />
            <span>{language === 'ar' ? 'مقارنة 3D' : '3D Compare'}</span>
          </motion.button>
        )}
      </div>

      {/* Products Filter Grid with Animate UI Reflow & PopLayout */}
      <ReducedMotionConfig>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: fadeTransition }}
                transition={{ ...moveTransition, opacity: fadeTransition }}
                className="h-full"
              >
                <ProductCard
                  product={product}
                  onOpenLightbox={onOpenLightbox}
                  onOpenViewer={onOpenViewer}
                  onCustomize={onCustomize}
                  onCompare={onCompare}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ReducedMotionConfig>
    </section>
  );
};
