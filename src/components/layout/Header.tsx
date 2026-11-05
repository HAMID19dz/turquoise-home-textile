import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, ShoppingBag, Menu, X, ArrowRightLeft } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '@/i18n';
import { siteConfig } from '@/config/site';
import { useQuoteCartStore } from '@/store/quoteCartStore';

interface HeaderProps {
  onOpenCart?: () => void;
  cartCount?: number;
  onOpenCrestModal?: () => void;
  onOpenCompare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  cartCount,
  onOpenCrestModal,
  onOpenCompare,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = useQuoteCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const openCart = useQuoteCartStore((state) => state.openCart);

  const effectiveCartCount = cartCount !== undefined ? cartCount : cartItemsCount;
  const handleCartClick = onOpenCart || openCart;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.home'), href: `/${language}#hero` },
    { label: t('nav.collection'), href: `/${language}#collection` },
    { label: t('nav.curtains'), href: `/${language}#curtains` },
    { label: t('nav.customizer'), href: `/${language}#customizer` },
    { label: t('nav.about'), href: `/${language}#about` },
    { label: t('nav.contact'), href: `/${language}#contact` },
  ];

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'ar', label: 'ع' },
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-marble-50/95 backdrop-blur-md shadow-luxury py-2.5 border-b border-gold/20'
          : 'bg-marble-50/80 backdrop-blur-sm py-4 border-b border-gold/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link
            to={`/${language}`}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {/* Circular badge with thin gold ring */}
            <div
              onClick={(e) => {
                if (onOpenCrestModal) {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenCrestModal();
                }
              }}
              title={language === 'ar' ? 'عرض الشعار الملكي الرسمي' : 'View Official Haute Crest'}
              className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full p-[2px] bg-gradient-to-tr from-gold-deep via-gold-light to-gold shadow-gold-soft transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Turquoise Home Textile Pegasus Emblem"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-heading text-lg sm:text-xl font-bold tracking-wider text-charcoal leading-tight">
                TURQUOISE
              </span>
              <span className="text-[10px] sm:text-xs tracking-widest text-gold-dark font-medium uppercase">
                {language === 'ar' ? 'للأثاث والمنسوجات' : 'Home Textile'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-charcoal hover:text-gold-dark transition-colors duration-200 relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 start-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action CTAs: Language Switcher, Call, Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Language Switcher (Text only: ع / FR / EN) */}
            <div className="flex items-center bg-marble-200/90 rounded-full p-1 border border-gold/25 text-xs font-semibold shadow-inner">
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`px-2.5 py-1 rounded-full transition-all duration-200 focus:outline-none ${
                    language === item.code
                      ? 'bg-gold-gradient text-charcoal-dark shadow-sm'
                      : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                  aria-label={`Switch to ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Direct Call Button */}
            <a
              href={siteConfig.phone.tel}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold text-gold-dark hover:bg-gold hover:text-charcoal-dark transition-all duration-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
              title={siteConfig.phone.display}
            >
              <Phone className="w-3.5 h-3.5" />
              <span dir="ltr">{siteConfig.phone.display}</span>
            </a>

            {/* 3D Compare Button */}
            {onOpenCompare && (
              <button
                onClick={onOpenCompare}
                className="p-2 rounded-full text-charcoal hover:text-gold-dark hover:bg-marble-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold"
                title={language === 'ar' ? 'مقارنة القطع في 3D' : '3D Compare'}
                aria-label="3D Compare"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            )}

            {/* Quote Cart Icon */}
            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-full text-charcoal hover:text-gold-dark hover:bg-marble-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label={t('cart.title')}
            >
              <ShoppingBag className="w-5 h-5" />
              {effectiveCartCount > 0 && (
                <span className="absolute -top-1 -end-1 bg-gold text-charcoal-dark text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {effectiveCartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal lg:hidden hover:text-gold focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-marble-50/98 border-t border-gold/20 shadow-xl px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-charcoal hover:text-gold transition-colors py-1.5 border-b border-marble-300/40"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="pt-2 flex flex-col gap-3">
            <a
              href={siteConfig.phone.tel}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gold text-gold-dark font-medium text-sm"
            >
              <Phone className="w-4 h-4" />
              <span dir="ltr">{siteConfig.phone.display}</span>
            </a>
            
            <a
              href={siteConfig.whatsapp.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gold-gradient text-charcoal-dark font-semibold text-sm shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('nav.whatsapp')}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
