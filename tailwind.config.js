/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'serif'],
      },
      colors: {
        forest: {
          50: '#E8F0EA',
          100: '#C7D8CB',
          200: '#9FB8A6',
          300: '#6F8C79',
          400: '#4A6B54',
          500: '#2E5238',
          600: '#1E5E3A',
          700: '#0F3823',
          800: '#0A2617',
          900: '#061A0F',
        },
        jungle: {
          400: '#2C7A4F',
          500: '#1E5E3A',
          600: '#164A2D',
        },
        terra: {
          50: '#FEF6E7',
          100: '#FDE9C3',
          200: '#FAD08A',
          300: '#F6B452',
          400: '#EF9A2A',
          500: '#D97706',
          600: '#B45E04',
          700: '#8F4A03',
          800: '#6B3702',
        },
        sand: {
          50: '#FBFBFA',
          100: '#F4F3EF',
          200: '#EAE8E1',
          300: '#D9D6CB',
          400: '#BDB9AB',
        },
      },
      boxShadow: {
        tactile: '0 10px 40px -10px rgba(15, 56, 35, 0.25)',
        glow: '0 0 0 4px rgba(217, 119, 6, 0.25), 0 0 24px rgba(217, 119, 6, 0.35)',
        deep: '0 30px 80px -20px rgba(10, 38, 23, 0.55)',
        ticket: '0 40px 120px -30px rgba(15, 56, 35, 0.5)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217, 119, 6, 0.5)' },
          '50%': { boxShadow: '0 0 0 14px rgba(217, 119, 6, 0)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(2000%)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.4' },
          '50%': { transform: 'translateY(220px)', opacity: '1' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-24px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        badgePop: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        livePing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.35)', opacity: '0.5' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        scanline: 'scanline 2.2s linear infinite',
        scan: 'scan 2.8s ease-in-out infinite',
        pulseRing: 'pulseRing 2s ease-out infinite',
        slideIn: 'slideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        badgePop: 'badgePop 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        livePing: 'livePing 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
