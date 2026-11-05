import React from 'react';
import { Sparkles, Maximize2, Compass, MessageCircle, Eye } from 'lucide-react';
import { ProductItem } from '@/types/product';
import { useTranslation } from '@/i18n';
import { buildProductWhatsAppUrl } from '@/utils/whatsapp';

interface CurtainsSectionProps {
  curtainProducts: ProductItem[];
  onOpenLightbox: (product: ProductItem) => void;
  onOpenViewer: (product: ProductItem, colorHex?: string) => void;
  onCustomize: (product: ProductItem) => void;
}

export const CurtainsSection: React.FC<CurtainsSectionProps> = ({
  curtainProducts,
  onOpenLightbox,
  onOpenViewer,
  onCustomize,
}) => {
  const { t, language } = useTranslation();

  return (
    <section id="curtains" className="py-24 bg-marble-100 border-t border-b border-gold/20 relative overflow-hidden">
      
      {/* Background subtle gold glow */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-marble-50 border border-gold/40 text-xs font-semibold text-gold-dark uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('curtainsSection.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            {t('curtainsSection.title')}
          </h2>

          <p className="text-charcoal-soft text-base sm:text-lg leading-relaxed">
            {t('curtainsSection.subtitle')}
          </p>
        </div>

        {/* 2-Column Curtains Royal Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {curtainProducts.map((curtain) => {
            const localizedName = curtain.name[language] || curtain.name.ar;
            const localizedDesc = curtain.description[language] || curtain.description.ar;
            const waUrl = buildProductWhatsAppUrl(curtain, language);

            return (
              <div
                key={curtain.id}
                className="bg-marble-50 rounded-3xl overflow-hidden border border-gold/30 shadow-luxury flex flex-col group hover:shadow-gold-soft transition-all duration-300"
              >
                {/* Media Container with 16:9 / Tall Portrait Ratio */}
                <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden bg-marble-300">
                  {curtain.photo && (
                    <picture>
                      <source srcSet={curtain.photo.srcset.avif} type="image/avif" />
                      <source srcSet={curtain.photo.srcset.webp} type="image/webp" />
                      <img
                        src={curtain.photo.srcJpg}
                        alt={curtain.photo.alt[language] || localizedName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        style={{
                          objectPosition: `${curtain.photo.focal.x * 100}% ${curtain.photo.focal.y * 100}%`,
                        }}
                      />
                    </picture>
                  )}

                  {/* High-res zoom button */}
                  {curtain.photo && (
                    <button
                      onClick={() => onOpenLightbox(curtain)}
                      className="absolute top-4 end-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-gold hover:text-black transition-colors"
                      title="Zoom Photo"
                      aria-label="Zoom Photo"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  )}

                  {/* Features Overlay Chips */}
                  <div className="absolute bottom-4 start-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-gold-light text-xs font-semibold">
                      {t('curtainsSection.pearlTieback')}
                    </span>
                    {curtain.id === 'curtain-cream' && (
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-gold-light text-xs font-semibold">
                        {t('curtainsSection.goldEmbroidery')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content & Craftsmanship Details */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-charcoal mb-3">
                      {localizedName}
                    </h3>

                    <p className="text-sm text-charcoal-soft leading-relaxed mb-6">
                      {localizedDesc}
                    </p>

                    {/* Specifications List */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-marble-300/60 mb-6">
                      <div>
                        <span className="text-xs text-charcoal/60 block mb-1">
                          {t('catalog.dimensionsLabel')}
                        </span>
                        <span className="text-sm font-bold text-charcoal font-mono" dir="ltr">
                          {curtain.dimensionsCm.w} × {curtain.dimensionsCm.h} cm
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-charcoal/60 block mb-1">
                          {language === 'ar' ? 'التخصيص:' : 'Customization:'}
                        </span>
                        <span className="text-xs font-semibold text-gold-dark">
                          {t('curtainsSection.customDimensions')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => onOpenViewer(curtain)}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-marble-200 border border-gold/40 text-charcoal font-semibold text-sm hover:bg-gold-light/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4 text-gold-dark" />
                      <span>{t('catalog.view3d')}</span>
                    </button>

                    <button
                      onClick={() => onCustomize(curtain)}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-marble-50 border border-gold text-gold-dark font-semibold text-sm hover:bg-gold hover:text-charcoal-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Compass className="w-4 h-4" />
                      <span>{t('catalog.customize')}</span>
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
