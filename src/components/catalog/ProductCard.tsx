import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Compass, MessageCircle, Maximize2, Box, ShoppingBag, ArrowRightLeft } from 'lucide-react';
import { spring } from '@animate-ui/react/utils/motion';
import type { Product } from '../../types/product';
import { useTranslation } from '../../i18n';
import { buildProductWhatsAppUrl } from '../../utils/whatsapp';
import { useQuoteCartStore } from '../../store/quoteCartStore';
import { trackEvent } from '../../utils/analytics';

interface ProductCardProps {
  product: Product;
  onOpenLightbox: (product: Product) => void;
  onOpenViewer: (product: Product, colorHex?: string) => void;
  onCustomize: (product: Product) => void;
  onCompare?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenLightbox,
  onOpenViewer,
  onCustomize,
  onCompare,
}) => {
  const { t, language } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedColorHex, setSelectedColorHex] = useState(
    product.colorOptions[0]?.hex || '#D4AF37'
  );

  const localizedName = product.name[language] || product.name.ar;
  const localizedTagline = product.tagline[language] || product.tagline.ar;
  const localizedMaterials = product.materials[language] || product.materials.ar;
  const dimsText = `${product.dimensionsCm.w} × ${product.dimensionsCm.d} × ${product.dimensionsCm.h} ${language === 'ar' ? 'سم' : 'cm'}`;

  const waUrl = buildProductWhatsAppUrl(product, language);

  return (
    <div className="group relative flex flex-col bg-marble-50 rounded-2xl overflow-hidden border border-gold/25 shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1">
      {/* Visual Image Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-marble-300">
        {/* LQIP Blur Placeholder */}
        {product.photo && (
          <img
            src={product.photo.lqip}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover filter blur-md transition-opacity duration-500 ${
              imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        )}

        {/* High-Resolution Showroom Photo */}
        {product.photo ? (
          <picture>
            <source type="image/avif" srcSet={product.photo.srcset.avif} />
            <source type="image/webp" srcSet={product.photo.srcset.webp} />
            <img
              src={product.photo.srcJpg}
              alt={product.photo.alt[language] || localizedName}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                objectPosition: `${product.photo.focal.x * 100}% ${product.photo.focal.y * 100}%`,
              }}
            />
          </picture>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-marble-300 text-charcoal/60">
            <Box className="w-10 h-10 mb-2 text-gold-dark opacity-60" />
            <span className="text-xs font-medium">{t('catalog.photoComingSoon')}</span>
          </div>
        )}

        {/* Top Badges & Lightbox Zoom Trigger */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="pointer-events-auto px-2.5 py-1 rounded-full bg-marble-50/90 backdrop-blur-sm border border-gold/40 text-[11px] font-semibold text-gold-dark shadow-sm uppercase tracking-wider">
            {language === 'ar' ? product.category : product.category.toUpperCase()}
          </span>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Lightbox High-Res Zoom Button */}
            {product.photo && (
              <motion.button
                onClick={() => onOpenLightbox(product)}
                whileTap={{ scale: 0.92 }}
                transition={spring.press}
                className="p-2 rounded-full bg-marble-50/90 backdrop-blur-sm border border-gold/30 text-charcoal hover:text-gold-dark hover:bg-marble-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
                title={language === 'ar' ? 'تكبير صورة المعرض' : 'Zoom High-Res Photo'}
                aria-label="Zoom Photo"
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
            )}

            {/* Add to Quote Cart Button */}
            <motion.button
              onClick={() => {
                useQuoteCartStore.getState().addItem({
                  type: 'catalog',
                  productId: product.id,
                  name: product.name,
                  photoUrl: product.photo?.srcJpg,
                  colorHex: selectedColorHex,
                  dimensionsCm: product.dimensionsCm,
                });
                trackEvent('cart_add', {
                  source: 'product_card',
                  productId: product.id,
                  color: selectedColorHex,
                });
              }}
              whileTap={{ scale: 0.92 }}
              transition={spring.press}
              className="p-2 rounded-full bg-marble-50/90 backdrop-blur-sm border border-gold/30 text-charcoal hover:text-gold-dark hover:bg-marble-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
              title={language === 'ar' ? 'إضافة إلى قائمة طلب الأسعار' : 'Add to Quote Request'}
              aria-label="Add to quote cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </motion.button>

            {/* Compare 3D Button */}
            {onCompare && (
              <motion.button
                onClick={() => {
                  trackEvent('compare_add', { source: 'product_card', productId: product.id });
                  onCompare(product);
                }}
                whileTap={{ scale: 0.92 }}
                transition={spring.press}
                className="p-2 rounded-full bg-marble-50/90 backdrop-blur-sm border border-gold/30 text-charcoal hover:text-gold-dark hover:bg-marble-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gold"
                title={language === 'ar' ? 'مقارنة 3D مع قطعة أخرى' : 'Compare in 3D'}
                aria-label="Compare in 3D"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </motion.button>
            )}

            {/* Quick 3D Viewer Pill */}
            <motion.button
              onClick={() => onOpenViewer(product, selectedColorHex)}
              whileTap={{ scale: 0.92 }}
              transition={spring.press}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-gradient text-charcoal-dark font-bold text-xs shadow-sm hover:brightness-105 transition-all focus:outline-none focus:ring-2 focus:ring-gold"
              title={t('catalog.view3d')}
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D</span>
            </motion.button>
          </div>
        </div>

        {/* Bottom Bar: Dimensions Overlay */}
        <div className="absolute bottom-2 start-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md bg-charcoal-dark/80 backdrop-blur-sm text-marble-100 text-[11px] font-mono shadow-sm">
            {dimsText}
          </span>
        </div>
      </div>

      {/* Card Body & Information */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Name */}
          <h3 className="font-heading font-bold text-xl text-charcoal mb-1.5 group-hover:text-gold-dark transition-colors line-clamp-1">
            {localizedName}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-charcoal-soft line-clamp-2 leading-relaxed mb-4">
            {localizedTagline}
          </p>

          {/* Material Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {localizedMaterials.map((mat) => (
              <span
                key={mat}
                className="px-2 py-0.5 rounded-full bg-marble-200 border border-gold/20 text-[10px] font-medium text-charcoal-soft"
              >
                {mat}
              </span>
            ))}
          </div>

          {/* Color Swatch Options Preview */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[11px] text-charcoal/60 font-medium">
              {language === 'ar' ? 'الألوان:' : 'Colors:'}
            </span>
            <div className="flex items-center gap-1.5">
              {product.colorOptions.map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => {
                    setSelectedColorHex(c.hex);
                    trackEvent('color_change', {
                      source: 'product_card',
                      productId: product.id,
                      color: c.hex,
                    });
                  }}
                  whileTap={{ scale: 0.85 }}
                  transition={spring.pop}
                  className={`w-5 h-5 rounded-full border transition-all ${
                    selectedColorHex === c.hex
                      ? 'border-gold ring-2 ring-gold/40 scale-110'
                      : 'border-marble-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name[language] || c.id}
                  aria-label={c.name[language] || c.id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls & Footer */}
        <div className="pt-4 border-t border-marble-300/60 space-y-3">
          {/* Price & Customize Row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gold-dark tracking-wide">
              {t('catalog.priceOnRequest')}
            </span>

            <motion.button
              onClick={() => {
                trackEvent('customizer_preset', {
                  source: 'product_card',
                  productId: product.id,
                });
                onCustomize(product);
              }}
              whileTap={{ scale: 0.95 }}
              transition={spring.press}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal hover:text-gold-dark transition-colors focus:outline-none"
            >
              <Compass className="w-3.5 h-3.5 text-gold-dark" />
              <span>{t('catalog.customize')}</span>
            </motion.button>
          </div>

          {/* Direct Actions: 3D View & WhatsApp Quote */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <motion.button
              onClick={() => {
                trackEvent('viewer_open', {
                  source: 'product_card',
                  productId: product.id,
                  color: selectedColorHex,
                });
                onOpenViewer(product, selectedColorHex);
              }}
              whileTap={{ scale: 0.96 }}
              transition={spring.press}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-marble-200 border border-gold/40 text-charcoal font-semibold text-xs hover:bg-gold-light/40 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <Eye className="w-3.5 h-3.5 text-gold-dark" />
              <span>{t('catalog.view3d')}</span>
            </motion.button>

            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent('quote_inquiry', {
                  source: 'product_card',
                  productId: product.id,
                  color: selectedColorHex,
                  phone: '+213556929134',
                });
              }}
              whileTap={{ scale: 0.96 }}
              transition={spring.press}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#25D366]/10 border border-[#25D366]/40 text-[#128C7E] font-semibold text-xs hover:bg-[#25D366]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="truncate">{t('catalog.askWhatsapp')}</span>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};
