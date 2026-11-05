/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        marble: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#F8F6F2',
          300: '#EFECE6',
          400: '#E2DED6',
        },
        gold: {
          light: '#F3E2A9',
          DEFAULT: '#D4AF37',
          deep: '#C5A059',
          dark: '#9A7B2F',
        },
        charcoal: {
          DEFAULT: '#2B2B2B',
          soft: '#4A4A4A',
          dark: '#1A1A1A',
        },
        muted: '#8A8A8A',
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        cairo: ['Cairo', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C5A059 0%, #D4AF37 50%, #F3E2A9 75%, #C5A059 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #C5A059 0%, #F3E2A9 50%, #D4AF37 100%)',
      },
      boxShadow: {
        'gold-soft': '0 4px 20px -2px rgba(212, 175, 55, 0.15)',
        'gold-glow': '0 0 25px 3px rgba(212, 175, 55, 0.25)',
        'luxury': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(212, 175, 55, 0.15)',
      },
      animation: {
        'gold-pulse': 'goldPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        goldPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { opacity: '0.95', transform: 'scale(1.03)', boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
        },
      },
    },
  },
  plugins: [],
};
