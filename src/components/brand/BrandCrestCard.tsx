import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { trackEvent } from '@/utils/analytics';

interface BrandCrestCardProps {
  className?: string;
  onOpenModal?: () => void;
}

export const BrandCrestCard: React.FC<BrandCrestCardProps> = ({ className = '', onOpenModal }) => {
  const { language } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        trackEvent('brand_crest_view');
        if (onOpenModal) onOpenModal();
      }}
      style={{ perspective: 1000 }}
      className={`relative cursor-pointer group select-none ${className}`}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-charcoal-dark via-charcoal to-black border-2 border-gold/40 shadow-2xl overflow-hidden text-center"
      >
        {/* Dynamic Light Sheen Glare */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(243, 226, 169, 0.4) 0%, transparent 60%)`,
          }}
        />

        {/* Decorative Neoclassical Corner Ornaments */}
        <div className="absolute top-3 start-3 w-4 h-4 border-t-2 border-s-2 border-gold/60 pointer-events-none" />
        <div className="absolute top-3 end-3 w-4 h-4 border-t-2 border-e-2 border-gold/60 pointer-events-none" />
        <div className="absolute bottom-3 start-3 w-4 h-4 border-b-2 border-s-2 border-gold/60 pointer-events-none" />
        <div className="absolute bottom-3 end-3 w-4 h-4 border-b-2 border-e-2 border-gold/60 pointer-events-none" />

        {/* Outer Laurel Garland Subtle Glow */}
        <div className="absolute inset-0 bg-gradient-radial from-gold/10 via-transparent to-transparent pointer-events-none" />

        {/* Pegasus Emblem Main Artwork */}
        <div className="relative mx-auto w-48 h-48 sm:w-60 sm:h-60 mb-4 transition-transform duration-500 group-hover:scale-105">
          <img
            src="/logo-full.png"
            alt="TURQUOISE home textile Pegasus Emblem"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(212,175,55,0.35)]"
          />
        </div>

        {/* Brand Caption */}
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-light text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>{language === 'ar' ? 'العلامة الملكية المعتمدة' : 'Official Haute Emblem'}</span>
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold text-marble-50 tracking-wide">
            {language === 'ar' ? 'تُركواز للأثاث والمنسوجات' : 'TURQUOISE HOME TEXTILE'}
          </h3>

          <p className="text-xs text-marble-300/80 max-w-sm mx-auto leading-relaxed">
            {language === 'ar'
              ? 'رمز الحصان المجنح (بيغاسوس) وإكليل الغار — تجسيد الأناقة الخالدة والحرفية الراقية للقصور والفيلات الفاخرة.'
              : 'The Pegasus in laurel wreath — timeless elegance and haute upholstery for luxury villas and residences.'}
          </p>

          {/* Quality Seals */}
          <div className="pt-4 flex items-center justify-center gap-4 text-[11px] text-gold/80 border-t border-gold/20">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-gold" />
              {language === 'ar' ? 'صناعة متقنة' : 'Master Craft'}
            </span>
            <span className="text-gold/40">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              {language === 'ar' ? 'خامات راقية' : 'Noble Materials'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
