import React from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '@/i18n';
import { siteConfig } from '@/config/site';

export const Footer: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'ar', label: 'عربية (AR)' },
    { code: 'fr', label: 'Français (FR)' },
    { code: 'en', label: 'English (EN)' },
  ];

  return (
    <footer className="bg-charcoal-dark text-marble-200 border-t-2 border-gold pt-16 pb-12 relative overflow-hidden">
      
      {/* Background ambient gold gradient */}
      <div className="absolute bottom-0 start-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl p-[2px] bg-gradient-to-tr from-gold-deep via-gold-light to-gold shadow-gold-soft">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center p-1">
                  <img src="/logo-full.png" alt="TURQUOISE home textile Pegasus Crest" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <span className="font-heading text-lg font-bold tracking-wider text-marble-50 block leading-tight">
                  TURQUOISE
                </span>
                <span className="text-xs text-gold tracking-widest uppercase">
                  Home Textile
                </span>
              </div>
            </div>

            <p className="text-xs text-marble-300/80 leading-relaxed">
              {t('footer.tagline')}
            </p>

            <div className="pt-2 text-xs text-gold/80 font-mono">
              <span>{siteConfig.phone.display}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-heading text-sm font-bold text-gold tracking-wider uppercase mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs text-marble-300">
              <li><a href={`/${language}#hero`} className="hover:text-gold transition-colors">{t('nav.home')}</a></li>
              <li><a href={`/${language}#collection`} className="hover:text-gold transition-colors">{t('nav.collection')}</a></li>
              <li><a href={`/${language}#curtains`} className="hover:text-gold transition-colors">{t('nav.curtains')}</a></li>
              <li><a href={`/${language}#customizer`} className="hover:text-gold transition-colors">{t('nav.customizer')}</a></li>
              <li><a href={`/${language}#about`} className="hover:text-gold transition-colors">{t('nav.about')}</a></li>
              <li><a href={`/${language}#contact`} className="hover:text-gold transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>

          {/* Contact Touchpoints */}
          <div>
            <h4 className="font-heading text-sm font-bold text-gold tracking-wider uppercase mb-4">
              {t('footer.contactInfo')}
            </h4>
            <div className="space-y-3">
              <a
                href={siteConfig.phone.tel}
                className="flex items-center gap-2.5 text-xs text-marble-200 hover:text-gold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span dir="ltr">{siteConfig.phone.display}</span>
              </a>

              <a
                href={siteConfig.whatsapp.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-marble-200 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp: <strong dir="ltr">{siteConfig.phone.display}</strong></span>
              </a>

              <p className="text-[11px] text-marble-400/80 leading-normal pt-1">
                {siteConfig.address[language]}
              </p>
            </div>
          </div>

          {/* Language Selection & Back to Top */}
          <div className="space-y-4">
            <h4 className="font-heading text-sm font-bold text-gold tracking-wider uppercase mb-4">
              {language === 'ar' ? 'اللغة' : 'Language'}
            </h4>
            
            <div className="flex flex-col gap-1.5">
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`text-start text-xs py-1 px-2.5 rounded transition-colors ${
                    language === item.code
                      ? 'bg-gold/20 text-gold font-semibold border-s-2 border-gold'
                      : 'text-marble-300 hover:text-marble-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 text-xs text-gold hover:text-gold-light transition-colors py-1.5"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>{t('footer.topButton')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Divider with thin gold hairline */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent my-8" />

        {/* Bottom Credits & Demo Notice */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-marble-400 gap-4">
          <p>{t('footer.copyright')}</p>
          <p className="text-gold/90 font-mono text-[11px] bg-charcoal px-3 py-1 rounded border border-gold/20 text-center">
            {t('footer.demoNotice')}
          </p>
        </div>
      </div>
    </footer>
  );
};
