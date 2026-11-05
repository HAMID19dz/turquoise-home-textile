export interface SiteConfig {
  name: {
    ar: string;
    fr: string;
    en: string;
  };
  tagline: {
    ar: string;
    fr: string;
    en: string;
  };
  phone: {
    raw: string;
    display: string;
    tel: string;
  };
  whatsapp: {
    number: string;
    directUrl: string;
    buildUrl: (message: string) => string;
  };
  address: {
    ar: string;
    fr: string;
    en: string;
  };
  hours: {
    ar: string;
    fr: string;
    en: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  mapEmbedUrl: string;
  showIndicativePrice: boolean;
  enableAnalytics: boolean;
}

export const siteConfig: SiteConfig = {
  name: {
    ar: 'تركواز للأثاث والمنسوجات المنزلية',
    fr: 'Turquoise Home Textile & Meubles de Luxe',
    en: 'Turquoise Home Textile & Luxury Furniture',
  },
  tagline: {
    ar: 'فخامة الرخام والذهب — أثاث ومنسوجات مصممة خصيصاً لذوقك الرفيع',
    fr: 'Le marbre blanc & l’or — Mobilier et textiles d’exception sur mesure',
    en: 'White marble & gold — Bespoke luxury furniture and handcrafted drapery',
  },
  phone: {
    raw: '+213556929134',
    display: '+213 556 92 91 34',
    tel: 'tel:+213556929134',
  },
  whatsapp: {
    number: '213556929134',
    directUrl: 'https://wa.me/213556929134',
    buildUrl: (message: string) => `https://wa.me/213556929134?text=${encodeURIComponent(message)}`,
  },
  address: {
    ar: 'PLACEHOLDER: الجزائر العاصمة، الجزائر (المعرض الرئيسي)',
    fr: 'PLACEHOLDER: Alger, Algérie (Showroom Principal)',
    en: 'PLACEHOLDER: Algiers, Algeria (Main Showroom)',
  },
  hours: {
    ar: 'PLACEHOLDER: السبت – الخميس: 09:30 – 19:30 | الجمعة: مغلق',
    fr: 'PLACEHOLDER: Samedi – Jeudi : 09h30 – 19h30 | Vendredi : Fermé',
    en: 'PLACEHOLDER: Saturday – Thursday: 09:30 – 19:30 | Friday: Closed',
  },
  socials: {
    instagram: 'PLACEHOLDER: https://instagram.com/turquoise.hometextile',
    facebook: 'PLACEHOLDER: https://facebook.com/turquoise.hometextile',
    tiktok: 'PLACEHOLDER: https://tiktok.com/@turquoise.hometextile',
  },
  mapEmbedUrl: 'PLACEHOLDER: https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102383.0!2d3.0!3d36.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ1JzAwLjAiTiAzwrAwMCcwMC4wIkU!5e0!3m2!1sen!2sdz!4v1',
  showIndicativePrice: false,
  enableAnalytics: true,
};
