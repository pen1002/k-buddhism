import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'K-Buddhism — 한국 불교 사찰 허브',
  description: '108사찰 통합 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
