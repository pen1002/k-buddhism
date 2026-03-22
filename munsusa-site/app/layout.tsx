import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '108사찰 — 한국 불교 사찰 통합 플랫폼',
  description: '대한민국 108개 사찰 공식 웹사이트 허브',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
