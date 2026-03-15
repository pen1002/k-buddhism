import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  // site: 'https://saju-temple.vercel.app',  // ← 배포 후 주석 해제
});
