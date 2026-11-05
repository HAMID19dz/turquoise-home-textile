import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { CustomizerStage } from './CustomizerStage';
import { CustomizerControls } from './CustomizerControls';
import { useCustomizerStore } from '../../store/customizerStore';
import { decodeDesignParams, applyDecodedParamsToStore } from '../../utils/designUrl';
import { useTranslation } from '../../i18n';

export const CustomizerSection: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [canvas3dElement, setCanvas3dElement] = useState<HTMLCanvasElement | null>(null);

  const {
    selectProduct,
    setColorHex,
    setWoodHex,
    setMetalHex,
    setDimensions,
  } = useCustomizerStore();

  // Restore design if URL search params are provided (e.g. ?piece=boucle-sofa&color=f4f0ea&w=230)
  useEffect(() => {
    if (location.search) {
      const decoded = decodeDesignParams(location.search);
      if (decoded) {
        applyDecodedParamsToStore(decoded, {
          selectProduct,
          setColorHex,
          setWoodHex,
          setMetalHex,
          setDimensions,
        });
      }
    }

    if (location.pathname.includes('/design')) {
      setTimeout(() => {
        const el = document.getElementById('customizer');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location.pathname, location.search, selectProduct, setColorHex, setWoodHex, setMetalHex, setDimensions]);

  return (
    <section id="customizer" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-radial from-gold/10 via-gold-light/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-marble-50 border border-gold/40 text-xs font-semibold text-gold-dark uppercase tracking-widest mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-gold-dark animate-pulse" />
          <span>{t('customizer.badge')}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
          {t('customizer.title')}
        </h2>
        <p className="text-charcoal-soft text-base sm:text-lg">
          {t('customizer.subtitle')}
        </p>
      </div>

      {/* Split Customizer Layout (Mirrors natively in RTL / LTR via Tailwind grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* 3D Viewport Stage Column */}
        <div className="lg:col-span-7 w-full sticky top-24">
          <CustomizerStage onCaptureCanvas={setCanvas3dElement} />
        </div>

        {/* Tabbed Controls Panel Column */}
        <div className="lg:col-span-5 w-full h-[600px] lg:h-[680px]">
          <CustomizerControls canvas3dElement={canvas3dElement} />
        </div>
      </div>
    </section>
  );
};
