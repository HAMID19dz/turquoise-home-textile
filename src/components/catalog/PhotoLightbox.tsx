import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  spring,
  transition,
  useTempoTransition,
} from '@animate-ui/react/utils/motion';
import type { Product, ProductAssetMeta } from '../../types/product';
import { useTranslation } from '../../i18n';

interface PhotoLightboxProps {
  product: Product | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ product, onClose }) => {
  const { language } = useTranslation();
  const [scale, setScale] = useState(1);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const overlayTransition = useTempoTransition(transition.overlay);
  const pressSpring = useTempoTransition(spring.press);
  const imageSpring = useTempoTransition(spring.dialog);

  // Collect all photos for this product
  const photos: ProductAssetMeta[] = [];
  if (product?.photo) photos.push(product.photo);
  if (product?.secondaryPhotos) photos.push(...product.secondaryPhotos);

  const activePhoto = photos[activePhotoIndex] || null;

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.5, 3.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.5, 1));
  const handleResetZoom = () => setScale(1);

  const handleNext = useCallback(() => {
    setScale(1);
    setActivePhotoIndex((idx) => (idx + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setScale(1);
    setActivePhotoIndex((idx) => (idx - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  if (!product || !activePhoto) return null;

  const localizedName = product.name[language] || product.name.ar;
  const localizedAlt = activePhoto.alt[language] || activePhoto.alt.ar;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={localizedName}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      >
        {/* Animated Dark Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
          onClick={onClose}
          className="fixed inset-0 bg-black/92 backdrop-blur-xl"
        />

        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between px-6 py-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex flex-col text-white">
            <span className="font-heading font-bold text-lg tracking-wide text-gold-light">
              {localizedName}
            </span>
            <span className="text-xs text-white/70">
              {photos.length > 1 ? `${activePhotoIndex + 1} / ${photos.length}` : localizedAlt}
            </span>
          </div>

          {/* Zoom & Action Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleZoomIn}
              whileTap={{ scale: 0.9 }}
              transition={pressSpring}
              className="p-2 rounded-full bg-white/10 hover:bg-gold/30 text-white transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={handleZoomOut}
              whileTap={{ scale: 0.9 }}
              transition={pressSpring}
              className="p-2 rounded-full bg-white/10 hover:bg-gold/30 text-white transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={handleResetZoom}
              whileTap={{ scale: 0.9 }}
              transition={pressSpring}
              className="p-2 rounded-full bg-white/10 hover:bg-gold/30 text-white transition-colors"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              transition={pressSpring}
              className="p-2 rounded-full bg-white/10 hover:bg-red-500/40 text-white transition-colors ms-2"
              title="Close"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Main Stage with High-Res Image */}
        <div className="relative flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale }}
            transition={imageSpring}
            className="relative flex items-center justify-center max-w-full max-h-full cursor-zoom-in"
            onClick={() => setScale((s) => (s > 1 ? 1 : 2))}
          >
            <picture>
              <source type="image/avif" srcSet={activePhoto.srcset.avif} />
              <source type="image/webp" srcSet={activePhoto.srcset.webp} />
              <img
                src={activePhoto.srcJpg}
                alt={localizedAlt}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-gold/20 select-none transition-transform duration-200"
              />
            </picture>
          </motion.div>

          {/* Previous/Next Gallery Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <motion.button
                onClick={handlePrev}
                whileTap={{ scale: 0.9 }}
                transition={pressSpring}
                className="absolute start-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-gold text-white hover:text-charcoal-dark transition-all border border-gold/30 z-20"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
              </motion.button>

              <motion.button
                onClick={handleNext}
                whileTap={{ scale: 0.9 }}
                transition={pressSpring}
                className="absolute end-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-gold text-white hover:text-charcoal-dark transition-all border border-gold/30 z-20"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6 rtl:rotate-180" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
