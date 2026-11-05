import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { siteConfig } from '@/config/site';

export const ContactSection: React.FC = () => {
  const { t, language } = useTranslation();

  const localizedAddress = siteConfig.address[language];
  const localizedHours = siteConfig.hours[language];

  return (
    <section id="contact" className="py-20 bg-marble-100 border-t border-gold/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3.5 py-1 rounded-full bg-marble-50 border border-gold/30 text-xs font-semibold text-gold-dark uppercase tracking-widest mb-3">
            {t('contact.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-charcoal-soft text-base sm:text-lg">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Direct Phone */}
          <div className="bg-marble-50 p-6 rounded-2xl border border-gold/20 shadow-sm hover:shadow-gold-soft transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gold-light/40 flex items-center justify-center text-gold-dark mb-4">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-charcoal mb-2">
              {t('contact.phone')}
            </h3>
            <a
              href={siteConfig.phone.tel}
              className="text-gold-dark font-bold text-lg hover:underline"
              dir="ltr"
            >
              {siteConfig.phone.display}
            </a>
            <p className="text-xs text-charcoal/60 mt-2">
              {language === 'ar' ? 'متاح طيلة ساعات العمل' : 'Available during showroom hours'}
            </p>
          </div>

          {/* WhatsApp Direct */}
          <div className="bg-marble-50 p-6 rounded-2xl border border-gold/20 shadow-sm hover:shadow-gold-soft transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#128C7E] mb-4">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-charcoal mb-2">
              {t('contact.whatsapp')}
            </h3>
            <a
              href={siteConfig.whatsapp.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#128C7E] font-bold text-base hover:underline inline-flex items-center gap-1.5"
            >
              <span dir="ltr">{siteConfig.phone.display}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-xs text-charcoal/60 mt-2">
              {language === 'ar' ? 'رد سريع واستشارات فورية' : 'Instant replies & bespoke advice'}
            </p>
          </div>

          {/* Address */}
          <div className="bg-marble-50 p-6 rounded-2xl border border-gold/20 shadow-sm hover:shadow-gold-soft transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gold-light/40 flex items-center justify-center text-gold-dark mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-charcoal mb-2">
              {t('contact.address')}
            </h3>
            <p className="text-sm text-charcoal-soft leading-relaxed">
              {localizedAddress}
            </p>
          </div>

          {/* Opening Hours */}
          <div className="bg-marble-50 p-6 rounded-2xl border border-gold/20 shadow-sm hover:shadow-gold-soft transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gold-light/40 flex items-center justify-center text-gold-dark mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-lg text-charcoal mb-2">
              {t('contact.hours')}
            </h3>
            <p className="text-sm text-charcoal-soft leading-relaxed">
              {localizedHours}
            </p>
          </div>
        </div>

        {/* Map Placeholder Frame */}
        <div className="rounded-2xl overflow-hidden border border-gold/25 shadow-luxury bg-marble-50 relative p-8 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <MapPin className="w-8 h-8 text-gold mx-auto" />
            <h4 className="font-heading text-lg font-bold text-charcoal">
              {language === 'ar' ? 'موقع صالة العرض' : 'Showroom Location Map'}
            </h4>
            <p className="text-xs text-charcoal/60">
              {localizedAddress}
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs font-mono bg-gold-light/40 text-gold-dark px-3 py-1 rounded">
                PLACEHOLDER: Map embed coordinates pending physical address confirmation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
