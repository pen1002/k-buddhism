import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 108사찰 Multi-tenant: 모든 사찰 도메인을 허용
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Astro 기존 파일과 충돌 방지
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
