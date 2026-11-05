import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, Send, ExternalLink } from 'lucide-react';
import { useQuoteCartStore } from '../../store/quoteCartStore';
import { useTranslation } from '../../i18n';
import { spring, transition } from '@animate-ui/react/utils/motion';
import { trackEvent } from '../../utils/analytics';

export const QuoteCartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem, clearCart, compileWhatsAppUrl } =
    useQuoteCartStore();
  const { language } = useTranslation();

  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);
  const waUrl = compileWhatsAppUrl(language);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fade}
            onClick={closeCart}
            className="absolute inset-0 bg-charcoal-dark/60 backdrop-blur-sm"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 end-0 max-w-full flex">
            <motion.div
              initial={{ x: language === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: language === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="w-screen max-w-md bg-marble-100 shadow-2xl flex flex-col border-s border-gold/30 relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-gold/20 flex items-center justify-between bg-marble-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold-dark shadow-sm">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-charcoal">
                      {language === 'ar'
                        ? 'قائمة طلبات الأسعار'
                        : language === 'fr'
                        ? 'Sélection pour Devis'
                        : 'Quote Selection'}
                    </h3>
                    <span className="text-xs text-charcoal-soft font-sans">
                      {totalPieces}{' '}
                      {language === 'ar'
                        ? totalPieces === 1
                          ? 'قطعة مختارة'
                          : 'قطع مختارة'
                        : totalPieces === 1
                        ? 'item selected'
                        : 'items selected'}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  transition={spring.press}
                  onClick={closeCart}
                  className="p-2 rounded-full hover:bg-marble-200 text-charcoal-soft hover:text-charcoal transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Items List Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-marble-200 border border-gold/30 flex items-center justify-center text-gold mb-4">
                      <ShoppingBag className="w-8 h-8 opacity-60" />
                    </div>
                    <h4 className="font-heading font-bold text-base text-charcoal mb-1">
                      {language === 'ar'
                        ? 'قائمة عروض الأسعار فارغة'
                        : language === 'fr'
                        ? 'Votre panier de devis est vide'
                        : 'Your quote basket is empty'}
                    </h4>
                    <p className="text-xs text-charcoal-soft max-w-xs mb-6">
                      {language === 'ar'
                        ? 'تصفح الكتالوج أو استخدم استوديو 3D لإضافة قطع وتصاميم إلى قائمتك.'
                        : language === 'fr'
                        ? 'Explorez notre collection ou personnalisez une pièce en 3D pour l’ajouter à votre devis.'
                        : 'Explore our catalog or customize a bespoke piece in 3D to request a price.'}
                    </p>
                    <button
                      onClick={closeCart}
                      className="px-6 py-2.5 rounded-full bg-gold-gradient text-charcoal-dark font-semibold text-xs shadow-gold-soft hover:brightness-105 transition-all"
                    >
                      {language === 'ar' ? 'استعراض الكتالوج' : 'Browse Catalog'}
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 rounded-2xl bg-marble-50 border border-gold/25 shadow-sm space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        {item.photoUrl && (
                          <img
                            src={item.photoUrl}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover border border-gold/20 flex-shrink-0"
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                item.type === 'bespoke'
                                  ? 'bg-gold/20 text-gold-dark border border-gold/40'
                                  : 'bg-marble-200 text-charcoal-soft'
                              }`}
                            >
                              {item.type === 'bespoke'
                                ? language === 'ar'
                                  ? 'تصميم 3D مخصص'
                                  : 'Bespoke 3D'
                                : language === 'ar'
                                ? 'موديل المعرض'
                                : 'Catalog Piece'}
                            </span>
                          </div>

                          <h4 className="font-heading font-bold text-sm text-charcoal truncate">
                            {item.name[language] || item.name.ar}
                          </h4>

                          <p className="text-[11px] text-charcoal-soft font-mono mt-0.5">
                            {item.dimensionsCm.w} × {item.dimensionsCm.d} × {item.dimensionsCm.h} cm
                          </p>

                          {/* Swatch & Finishes */}
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-charcoal/70">
                            <span className="flex items-center gap-1">
                              <span
                                className="w-3 h-3 rounded-full border border-charcoal/20 inline-block shadow-xs"
                                style={{ backgroundColor: item.colorHex }}
                              />
                              <span className="font-mono text-[10px]">{item.colorHex}</span>
                            </span>
                            {item.woodHex && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="w-3 h-3 rounded-full border border-charcoal/20 inline-block shadow-xs"
                                  style={{ backgroundColor: item.woodHex }}
                                />
                              </span>
                            )}
                            {item.metalHex && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="w-3 h-3 rounded-full border border-charcoal/20 inline-block shadow-xs"
                                  style={{ backgroundColor: item.metalHex }}
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Actions Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-gold/15">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg border border-gold/30 bg-marble-100 flex items-center justify-center text-charcoal hover:bg-gold/10 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </motion.button>
                          <span className="font-mono font-bold text-sm w-6 text-center text-charcoal">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg border border-gold/30 bg-marble-100 flex items-center justify-center text-charcoal hover:bg-gold/10 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.designUrl && (
                            <a
                              href={item.designUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-gold-dark hover:bg-gold/10 transition-colors"
                              title="Open 3D view"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              trackEvent('cart_remove', { itemId: item.id, productId: item.productId });
                              removeItem(item.id);
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Remove piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gold/20 bg-marble-50 space-y-4">
                  {/* Price note */}
                  <div className="flex items-center justify-between text-xs text-charcoal-soft pb-2 border-b border-marble-300/60">
                    <span>
                      {language === 'ar'
                        ? 'الأسعار الرسمية'
                        : language === 'fr'
                        ? 'Tarification'
                        : 'Pricing'}
                    </span>
                    <span className="font-bold text-gold-dark">
                      {language === 'ar'
                        ? 'عند الطلب حسب المقاسات والخامات'
                        : language === 'fr'
                        ? 'Sur devis personnalisé'
                        : 'Price on request'}
                    </span>
                  </div>

                  {/* Primary WhatsApp quote button */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent('quote_inquiry', {
                        source: 'quote_cart',
                        itemCount: totalPieces,
                        phone: '+213556929134',
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gold-gradient text-charcoal-dark font-bold text-sm shadow-gold-soft hover:shadow-gold-glow hover:brightness-105 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {language === 'ar'
                        ? 'إرسال طلب عرض السعر المجمّع عبر واتساب'
                        : language === 'fr'
                        ? 'Demander le devis global sur WhatsApp'
                        : 'Request Consolidated WhatsApp Quote'}
                    </span>
                  </a>

                  {/* Clear cart action */}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        trackEvent('cart_clear', { previousCount: totalPieces });
                        clearCart();
                      }}
                      className="text-xs text-charcoal/60 hover:text-rose-500 transition-colors"
                    >
                      {language === 'ar'
                        ? 'تفريغ القائمة بالكامل'
                        : language === 'fr'
                        ? 'Vider la sélection'
                        : 'Clear basket'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
