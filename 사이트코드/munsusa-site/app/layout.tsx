import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '108사찰 — 한국 불교 사찰 통합 플랫폼',
  description: '대한민국 108개 사찰 공식 웹사이트 허브',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700;900&family=Noto+Sans+KR:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
