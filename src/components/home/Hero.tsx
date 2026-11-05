import React from 'react';
import { Compass, ShieldCheck, Award } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { Hero3DViewer } from './Hero3DViewer';

interface HeroProps {
  onExploreClick?: () => void;
  onCustomizeClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onCustomizeClick }) => {
  const { t, language } = useTranslation();

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-marble-texture"
    >
      {/* Background radial gold ambient illumination */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-gold/15 via-gold-light/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text & CTAs Column */}
          <div className="lg:col-span-6 text-center lg:text-start">
            
            {/* Showroom Distinction Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-marble-50/95 border border-gold/40 shadow-gold-soft mb-6 transition-transform hover:scale-105">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-black flex items-center justify-center p-[2px] border border-gold/60">
                <img src="/logo.png" alt="Pegasus" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-gold-dark uppercase">
                {t('hero.badge')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-charcoal tracking-tight leading-[1.18] mb-6">
              <span>{t('hero.titleLine1')}</span>{' '}
              <span className="block mt-1 text-gold-gradient drop-shadow-sm">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            {/* Subline */}
            <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-charcoal-soft font-normal leading-relaxed mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <a
                href={`/${language}#catalog`}
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold-gradient text-charcoal-dark font-bold text-sm shadow-gold-soft hover:shadow-gold-glow hover:brightness-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold text-center"
              >
                {t('hero.ctaExplore')}
              </a>

              <a
                href={`/${language}#customizer`}
                onClick={onCustomizeClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-marble-50/90 border border-gold text-gold-dark font-bold text-sm hover:bg-gold hover:text-charcoal-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>{t('hero.ctaCustomize')}</span>
              </a>
            </div>

            {/* Quality Seals */}
            <div className="pt-6 border-t border-marble-300/60 flex items-center justify-center lg:justify-start gap-6 text-xs text-charcoal/70">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-dark" />
                <span>
                  {language === 'ar' ? 'صناعة راقية حسب الطلب' : 'Bespoke Haute Craftsmanship'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-dark" />
                <span>
                  {language === 'ar' ? 'خامات إيطالية فاخرة' : 'Premium Luxury Materials'}
                </span>
              </div>
            </div>
          </div>

          {/* 3D Showcase Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl bg-gradient-to-b from-marble-50/80 to-marble-200/60 border border-gold/40 shadow-2xl p-2 sm:p-4 backdrop-blur-sm">
              <Hero3DViewer />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
