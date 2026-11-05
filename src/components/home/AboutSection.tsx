import React from 'react';
import { Palette, Compass, CheckCircle2, Truck, Award, Shield, Sparkles } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { BrandCrestCard } from '../brand/BrandCrestCard';

interface AboutSectionProps {
  onOpenCrestModal?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenCrestModal }) => {
  const { t, language } = useTranslation();

  const steps = [
    {
      num: '01',
      icon: <Palette className="w-6 h-6 text-gold" />,
      title: t('about.step1Title'),
      desc: t('about.step1Desc'),
    },
    {
      num: '02',
      icon: <Compass className="w-6 h-6 text-gold" />,
      title: t('about.step2Title'),
      desc: t('about.step2Desc'),
    },
    {
      num: '03',
      icon: <CheckCircle2 className="w-6 h-6 text-gold" />,
      title: t('about.step3Title'),
      desc: t('about.step3Desc'),
    },
    {
      num: '04',
      icon: <Truck className="w-6 h-6 text-gold" />,
      title: t('about.step4Title'),
      desc: t('about.step4Desc'),
    },
  ];

  return (
    <section id="about" className="py-24 bg-marble-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-3.5 py-1 rounded-full bg-marble-200 border border-gold/30 text-xs font-semibold text-gold-dark uppercase tracking-widest mb-3">
            {t('about.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            {t('about.title')}
          </h2>
          <p className="text-charcoal-soft text-base sm:text-lg leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Brand Crest & Atelier Heritage Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-24 bg-gradient-to-br from-marble-100 via-marble-200/60 to-marble-100 rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-luxury">
          {/* Story Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-dark text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'هوية الدار وعراقة الصنعة' : 'Maison Heritage & Philosophy'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal leading-snug">
              {language === 'ar'
                ? 'فخامة مُهندمة بحرفية ملكية مستوحاة من العمارة الإغريقية'
                : 'Neoclassical Splendor Crafted with Regal Mastery'}
            </h3>

            <p className="text-sm sm:text-base text-charcoal-soft leading-relaxed">
              {language === 'ar'
                ? 'في تركواز (Turquoise Home Textile)، لا نصنع أثاثاً عادياً، بل نصوغ تحفاً خالدة. يرمز شعارنا — الحصان المجنح (بيغاسوس) المتوّج بإكليل الغار الإغريقي — إلى التحليق بأفق الإبداع والسمو في أدق تفاصيل حياكة الستائر وتنجيد الصالونات الفاخرة للقصور والفلل في الجزائر.'
                : 'At Turquoise Home Textile, we forge timeless heirlooms. Our official emblem — the soaring winged Pegasus crowned with classical laurel wreath — embodies transcendent craftsmanship, bringing bespoke palace curtains and haute salon upholstery to discerning residences across Algeria.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0 text-gold-dark mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal">
                    {language === 'ar' ? 'تفصيل مخصص حسب المقاس' : 'Haute Sur-Mesure'}
                  </h4>
                  <p className="text-[11px] text-charcoal-soft">
                    {language === 'ar' ? 'تعديل الأبعاد ومقاسات النوافذ والغرف بدقة سنتيمترية.' : 'Precision centimeter scaling for windows and rooms.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0 text-gold-dark mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal">
                    {language === 'ar' ? 'أقمشة وخامات عالمية' : 'Noble Certified Materials'}
                  </h4>
                  <p className="text-[11px] text-charcoal-soft">
                    {language === 'ar' ? 'جلود إيطالية، مخمل ملكي، وخيوط تطريز مذهبة حصرية.' : 'Italian leather, royal bouclé, and gilded silk threads.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 3D Brand Crest Artwork */}
          <div className="lg:col-span-5 flex justify-center">
            <BrandCrestCard onOpenModal={onOpenCrestModal} className="w-full max-w-sm" />
          </div>
        </div>

        {/* 4-Step "Made-to-Order" Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-marble-200/80 p-8 rounded-2xl border border-gold/25 relative group hover:shadow-gold-soft transition-all duration-300"
            >
              <span className="font-heading text-4xl font-bold text-gold/30 absolute top-4 end-4">
                {step.num}
              </span>
              <div className="w-12 h-12 rounded-xl bg-marble-50 shadow-sm border border-gold/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="font-heading font-bold text-lg text-charcoal mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-charcoal-soft leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
