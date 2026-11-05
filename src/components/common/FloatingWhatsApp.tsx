import React from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useTranslation } from '@/i18n';
import { trackEvent } from '@/utils/analytics';

export const FloatingWhatsApp: React.FC = () => {
  const { language, t } = useTranslation();

  const greetingMessage =
    language === 'ar'
      ? 'مرحباً، أود الاستفسار عن تفاصيل الأثاث والستائر في معرض تركواز'
      : language === 'fr'
      ? 'Bonjour, je souhaite me renseigner sur le mobilier et les rideaux Turquoise'
      : 'Hello, I would like to inquire about Turquoise luxury furniture and drapery';

  const waUrl = siteConfig.whatsapp.buildUrl(greetingMessage);

  return (
    <aside
      aria-label="WhatsApp quick contact"
      className="fixed bottom-6 end-6 z-40 flex items-center gap-3"
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent('quote_inquiry', {
            source: 'floating_cta',
            phone: '+213556929134',
          });
        }}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gold/50"
        title={t('nav.whatsapp')}
      >
        {/* Subtle gold pulse ring animation */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-gold animate-gold-pulse"
          aria-hidden="true"
        />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-white/10 group-hover:rotate-6 transition-transform duration-300" />
      </a>
    </aside>
  );
};
