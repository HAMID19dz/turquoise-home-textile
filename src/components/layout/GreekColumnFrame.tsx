import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const GreekColumnFrame: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    const handleMouseMove = (e: MouseEvent) => {
      if (mediaQuery.matches) return;
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth) * 2 - 1; // -1 to 1
      const yNorm = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(xNorm);
      mouseY.set(yNorm);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      mediaQuery.removeEventListener('change', handler);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Gentle 3D perspective tilt reacting to cursor
  const rotateYLeft = useTransform(smoothX, [-1, 1], [-4, 2]);
  const rotateYRight = useTransform(smoothX, [-1, 1], [-2, 4]);
  const translateY = useTransform(smoothY, [-1, 1], [-3, 3]);

  const renderColumn = (isRight: boolean) => {
    const idPrefix = isRight ? 'col-r' : 'col-l';

    return (
      <svg
        viewBox="0 0 100 950"
        preserveAspectRatio="none"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(160,130,70,0.16)] filter"
      >
        <defs>
          {/* Neoclassical Carrara White Marble Cylindrical Gradient */}
          <linearGradient id={`${idPrefix}-marble`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D8D2C6" />
            <stop offset="10%" stopColor="#EEEAE2" />
            <stop offset="35%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#FAF7F2" />
            <stop offset="90%" stopColor="#E2DCD2" />
            <stop offset="100%" stopColor="#C8C0B2" />
          </linearGradient>

          {/* Carrara Pedestal Marble Gradient */}
          <linearGradient id={`${idPrefix}-pedestal-marble`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F2EA" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EAE4D8" />
          </linearGradient>

          {/* Flute Concave Shadow Gradient */}
          <linearGradient id={`${idPrefix}-flute-shadow`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(110,95,70,0.32)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.65)" />
            <stop offset="100%" stopColor="rgba(110,95,70,0.32)" />
          </linearGradient>

          {/* Opulent 24k Royal Gold Leaf Metallic Gradient */}
          <linearGradient id={`${idPrefix}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8943D" />
            <stop offset="25%" stopColor="#E5C368" />
            <stop offset="50%" stopColor="#FFF2B8" />
            <stop offset="75%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9C782B" />
          </linearGradient>

          {/* Soft architectural drop shadow filter */}
          <filter id={`${idPrefix}-shadow`} x="-20%" y="-10%" width="140%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="rgba(140,110,60,0.22)" />
          </filter>

          {/* Gold highlight glow */}
          <filter id={`${idPrefix}-gold-glow`}>
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="rgba(212,175,55,0.4)" />
          </filter>
        </defs>

        {/* ========================================================
            1. CAPITAL — REFINED IONIC / CORINTHIAN WITH 24K GOLD LEAF
           ======================================================== */}
        <g id="capital" filter={`url(#${idPrefix}-shadow)`}>
          {/* Top Classical Entablature Abacus Tier */}
          <rect x="3" y="4" width="94" height="7" rx="1.5" fill={`url(#${idPrefix}-gold)`} />
          <rect x="6" y="11" width="88" height="4" fill="#F8F6F2" stroke={`url(#${idPrefix}-gold)`} strokeWidth="0.8" />

          {/* Neoclassical Dentil Molding Row */}
          {[12, 20, 28, 36, 44, 52, 60, 68, 76, 84].map((dx) => (
            <rect
              key={dx}
              x={dx - 2.5}
              y="15"
              width="5"
              height="3.5"
              rx="0.5"
              fill={`url(#${idPrefix}-gold)`}
            />
          ))}

          {/* Curved Abacus Bed Moulding */}
          <path
            d="M 8 19 Q 50 24 92 19 L 88 27 Q 50 31 12 27 Z"
            fill="#F6F3EB"
            stroke={`url(#${idPrefix}-gold)`}
            strokeWidth="0.9"
          />

          {/* Classical Ionic Spiral Volutes */}
          {/* Left Volute */}
          <g filter={`url(#${idPrefix}-gold-glow)`}>
            <circle cx="22" cy="45" r="14" fill={`url(#${idPrefix}-gold)`} />
            <circle cx="22" cy="45" r="10" fill="#FAF7F2" stroke={`url(#${idPrefix}-gold)`} strokeWidth="0.8" />
            <circle cx="22" cy="45" r="7.5" fill={`url(#${idPrefix}-gold)`} />
            <path
              d="M 22 37 A 8 8 0 0 1 30 45 A 5 5 0 0 1 25 50 A 3 3 0 0 1 22 47"
              fill="none"
              stroke="#FFF7D8"
              strokeWidth="1.6"
            />
            {/* Center Golden Pearl Stud */}
            <circle cx="22" cy="45" r="2.8" fill="#FFF2B8" />
          </g>

          {/* Right Volute */}
          <g filter={`url(#${idPrefix}-gold-glow)`}>
            <circle cx="78" cy="45" r="14" fill={`url(#${idPrefix}-gold)`} />
            <circle cx="78" cy="45" r="10" fill="#FAF7F2" stroke={`url(#${idPrefix}-gold)`} strokeWidth="0.8" />
            <circle cx="78" cy="45" r="7.5" fill={`url(#${idPrefix}-gold)`} />
            <path
              d="M 78 37 A 8 8 0 0 0 70 45 A 5 5 0 0 0 75 50 A 3 3 0 0 0 78 47"
              fill="none"
              stroke="#FFF7D8"
              strokeWidth="1.6"
            />
            {/* Center Golden Pearl Stud */}
            <circle cx="78" cy="45" r="2.8" fill="#FFF2B8" />
          </g>

          {/* Center Echinus with Egg-and-Dart Motifs */}
          <path
            d="M 20 37 Q 50 45 80 37 L 76 53 Q 50 61 24 53 Z"
            fill="#FFFFFF"
            stroke={`url(#${idPrefix}-gold)`}
            strokeWidth="1.1"
          />

          {/* Sculpted Gold Acanthus Leaf Flares */}
          <path
            d="M 50 30 C 43 37 40 48 50 57 C 60 48 57 37 50 30 Z"
            fill={`url(#${idPrefix}-gold)`}
          />
          <path
            d="M 37 34 C 32 41 34 48 43 53 C 41 46 39 39 37 34 Z"
            fill={`url(#${idPrefix}-gold)`}
            opacity="0.88"
          />
          <path
            d="M 63 34 C 68 41 66 48 57 53 C 59 46 61 39 63 34 Z"
            fill={`url(#${idPrefix}-gold)`}
            opacity="0.88"
          />

          {/* Astragal Ring with Bead-and-Reel Pearls */}
          <rect x="20" y="61" width="60" height="5.5" rx="2.75" fill={`url(#${idPrefix}-gold)`} />
          {[26, 34, 42, 50, 58, 66, 74].map((bx) => (
            <circle key={bx} cx={bx} cy="63.75" r="1.8" fill="#FFFFFF" opacity="0.9" />
          ))}

          {/* Gorgerin Necking with Fine Gold Fret Hairline */}
          <rect x="22" y="67" width="56" height="11" fill="#F8F6F2" stroke={`url(#${idPrefix}-gold)`} strokeWidth="0.7" />
          <path
            d="M 24 72.5 Q 50 76 76 72.5"
            fill="none"
            stroke={`url(#${idPrefix}-gold)`}
            strokeWidth="1.2"
            strokeDasharray="2,3"
          />

          {/* Lower Necking Torus Collar */}
          <rect x="21" y="78" width="58" height="5" rx="2.5" fill={`url(#${idPrefix}-gold)`} />
        </g>

        {/* ========================================================
            2. FLUTED MARBLE SHAFT WITH CLASSICAL ENTASIS & GOLD LINES
           ======================================================== */}
        <g id="shaft">
          {/* Main Cylindrical Carrara Marble Body */}
          <rect
            x="22"
            y="83"
            width="56"
            height="745"
            fill={`url(#${idPrefix}-marble)`}
          />

          {/* 7 Neoclassical Deep Flutes */}
          {[28, 35, 43, 50, 57, 65, 72].map((fx, idx) => {
            const isCenter = idx === 3;
            return (
              <g key={fx}>
                {/* Concave Flute Channel */}
                <rect
                  x={fx - 2.2}
                  y="86"
                  width="4.4"
                  height="738"
                  rx="2.2"
                  fill={`url(#${idPrefix}-flute-shadow)`}
                  opacity={isCenter ? '0.85' : '0.7'}
                />
                {/* 24k Gold Hairline Inlay */}
                <line
                  x1={fx}
                  y1="94"
                  x2={fx}
                  y2="816"
                  stroke={`url(#${idPrefix}-gold)`}
                  strokeWidth="0.7"
                  strokeOpacity="0.45"
                  strokeDasharray="10,16"
                />
                {/* Specular White Marble Highlight */}
                <line
                  x1={fx - 0.8}
                  y1="90"
                  x2={fx - 0.8}
                  y2="820"
                  stroke="#FFFFFF"
                  strokeWidth="0.7"
                  strokeOpacity="0.6"
                />
              </g>
            );
          })}

          {/* Left Edge Cylindrical Ambient Shadow */}
          <rect x="22" y="83" width="5" height="745" fill="rgba(80,65,45,0.14)" />
          {/* Right Edge Cylindrical Ambient Shadow */}
          <rect x="73" y="83" width="5" height="745" fill="rgba(80,65,45,0.14)" />
        </g>

        {/* ========================================================
            3. ATTIC BASE & CARRARA MARBLE PEDESTAL (NO DARK SQUARES)
           ======================================================== */}
        <g id="base" filter={`url(#${idPrefix}-shadow)`}>
          {/* Apophyge Transition Collar */}
          <rect x="20" y="828" width="60" height="5.5" rx="2.75" fill={`url(#${idPrefix}-gold)`} />

          {/* Upper Convex Torus Ring with Carved Laurel Leaf Curve */}
          <rect x="17" y="834" width="66" height="11" rx="5.5" fill={`url(#${idPrefix}-marble)`} stroke={`url(#${idPrefix}-gold)`} strokeWidth="0.9" />
          <path
            d="M 20 839.5 C 30 836 40 843 50 839.5 C 60 836 70 843 80 839.5"
            fill="none"
            stroke={`url(#${idPrefix}-gold)`}
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Scotia Concave Hollow (Soft warm marble tone, not black) */}
          <rect x="15" y="845" width="70" height="9" fill="#E6DFC8" stroke={`url(#${idPrefix}-gold)`} strokeWidth="0.6" />
          <rect x="17" y="846" width="66" height="7" fill="#F4EFE6" />

          {/* Lower Broad Convex Torus */}
          <rect x="12" y="854" width="76" height="13" rx="6.5" fill={`url(#${idPrefix}-gold)`} />
          <rect x="15" y="856" width="70" height="9" rx="4.5" fill="#FAF8F5" />
          <path
            d="M 17 860.5 Q 50 865 83 860.5"
            fill="none"
            stroke={`url(#${idPrefix}-gold)`}
            strokeWidth="1.2"
          />

          {/* Stepped Plinth Block (Pure Carrara Marble with 24k Gold Beveled Trim) */}
          <rect
            x="7"
            y="867"
            width="86"
            height="44"
            rx="3"
            fill={`url(#${idPrefix}-pedestal-marble)`}
            stroke={`url(#${idPrefix}-gold)`}
            strokeWidth="1.5"
          />
          <rect
            x="10"
            y="870"
            width="80"
            height="38"
            rx="2"
            fill="#FFFFFF"
            stroke={`url(#${idPrefix}-gold)`}
            strokeWidth="0.6"
            strokeDasharray="4,2"
          />

          {/* Classical Greek Fret / Meander Medallion in Center of Pedestal */}
          <g transform="translate(35, 876)">
            <rect x="0" y="0" width="30" height="26" rx="2" fill="#FAF6EE" stroke={`url(#${idPrefix}-gold)`} strokeWidth="1" />
            {/* Diamond emblem matching brand Pegasus crest */}
            <polygon points="15,4 23,13 15,22 7,13" fill={`url(#${idPrefix}-gold)`} />
            <circle cx="15" cy="13" r="3" fill="#FFFFFF" stroke={`url(#${idPrefix}-gold)`} strokeWidth="0.6" />
          </g>

          {/* Grand Foundation Base Step */}
          <rect x="3" y="911" width="94" height="15" rx="2" fill={`url(#${idPrefix}-gold)`} />
          <rect x="5" y="913" width="90" height="11" rx="1.5" fill="#FAF8F4" stroke={`url(#${idPrefix}-gold)`} strokeWidth="0.6" />

          {/* Final Floor Shadow Fillet */}
          <rect x="1" y="926" width="98" height="12" rx="1" fill={`url(#${idPrefix}-gold)`} opacity="0.85" />
          <rect x="3" y="928" width="94" height="8" fill="#E8E2D4" />
        </g>
      </svg>
    );
  };

  return (
    <>
      {/* Left Column (Desktop >= xl only: 1280px+) */}
      <motion.aside
        aria-hidden="true"
        style={
          reducedMotion
            ? { transform: 'none' }
            : {
                rotateY: rotateYLeft,
                y: translateY,
                perspective: 1000,
              }
        }
        className="pointer-events-none fixed top-0 start-0 z-20 hidden xl:block h-screen w-12 xl:w-14 2xl:w-16 transition-all duration-300"
      >
        <div className="relative h-full w-full opacity-90 hover:opacity-100 transition-opacity">
          {renderColumn(false)}
        </div>
      </motion.aside>

      {/* Right Column (Desktop >= xl only: 1280px+) */}
      <motion.aside
        aria-hidden="true"
        style={
          reducedMotion
            ? { transform: 'none' }
            : {
                rotateY: rotateYRight,
                y: translateY,
                perspective: 1000,
              }
        }
        className="pointer-events-none fixed top-0 end-0 z-20 hidden xl:block h-screen w-12 xl:w-14 2xl:w-16 transition-all duration-300"
      >
        <div className="relative h-full w-full opacity-90 hover:opacity-100 transition-opacity">
          {renderColumn(true)}
        </div>
      </motion.aside>
    </>
  );
};
