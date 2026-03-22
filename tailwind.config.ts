import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 불교 테마 기본 색상
        temple: {
          gold: '#C5A572',
          red: '#8B2500',
          brown: '#5C4033',
          cream: '#F5F0E8',
          dark: '#2C1810',
        },
      },
    },
  },
  plugins: [],
};

export default config;
