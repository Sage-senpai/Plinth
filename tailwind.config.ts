import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Bricolage Grotesque', 'sans-serif'],
        sans: ['var(--font-body)', 'Instrument Sans', 'sans-serif'],
        mono: ['var(--font-mono)', 'Martian Mono', 'monospace'],
      },
      colors: {
        pl: {
          bg: '#F2F0EB',
          surface: '#FFFFFF',
          surface2: '#EAE6DC',
          border: '#DBD5C7',
          'border-h': '#0D1411',
          dark: '#0D1411',
          'dark-surface': '#161C18',
          'dark-border': '#2B332C',
          cream: '#F2F0EB',
          'dark-muted': '#9A958A',
          copper: '#B45309',
          'copper-lgt': '#D97706',
          'copper-dim': 'rgba(180,83,9,0.10)',
          blue: '#1E40AF',
          'blue-lgt': '#2563EB',
          'blue-dim': 'rgba(30,64,175,0.10)',
          verified: '#15803D',
          flagged: '#C2410C',
          invalid: '#B91C1C',
          pending: '#52525B',
          text: '#0D1411',
          muted: '#5B5650',
        },
      },
      boxShadow: {
        'glow-copper': '0 0 22px rgba(180, 83, 9, 0.22)',
        'glow-blue': '0 0 18px rgba(30, 64, 175, 0.18)',
      },
      keyframes: {
        stamp: {
          '0%': { transform: 'scale(1.2) rotate(-8deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(-2deg)', opacity: '1' },
        },
        fill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--fill-to)' },
        },
        rise: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        stamp: 'stamp 0.2s ease-out forwards',
        fill: 'fill 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        rise: 'rise 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
