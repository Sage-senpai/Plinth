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
        serif: ['var(--font-display)', 'DM Serif Display', 'serif'],
        jost: ['var(--font-body)', 'Jost', 'sans-serif'],
        mono: ['var(--font-mono)', 'Martian Mono', 'monospace'],
      },
      colors: {
        pl: {
          bg: '#080705',
          surface: '#100F0C',
          surface2: '#18160F',
          border: '#28241C',
          'border-h': '#3D3828',
          copper: '#B45309',
          'copper-lgt': '#D97706',
          'copper-dim': 'rgba(180,83,9,0.12)',
          blue: '#1E40AF',
          'blue-lgt': '#2563EB',
          'blue-dim': 'rgba(30,64,175,0.12)',
          verified: '#22C55E',
          flagged: '#F59E0B',
          invalid: '#DC2626',
          pending: '#94A3B8',
          text: '#EDE8E3',
          muted: '#78716C',
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
