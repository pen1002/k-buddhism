import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        temple: {
          primary: 'var(--temple-primary)',
          secondary: 'var(--temple-secondary)',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
