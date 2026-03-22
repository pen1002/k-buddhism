import { getTempleByCode } from '@/lib/temple';
import { notFound } from 'next/navigation';

// ============================================================
// 사찰 개별 레이아웃 — 사찰별 테마 색상, 로고 적용
// /_sites/[site]/... 경로에서 동작
// ============================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const temple = await getTempleByCode(site);

  if (!temple) {
    return { title: '사찰을 찾을 수 없습니다' };
  }

  return {
    title: `${temple.name} — 공식 홈페이지`,
    description: temple.description || `${temple.name} 공식 홈페이지입니다.`,
  };
}

export default async function TempleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const temple = await getTempleByCode(site);

  if (!temple) {
    notFound();
  }

  return (
    <div
      style={{
        ['--temple-primary' as string]: temple.primaryColor,
        ['--temple-secondary' as string]: temple.secondaryColor,
      }}
    >
      {/* 사찰 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            {temple.logoUrl ? (
              <img
                src={temple.logoUrl}
                alt={temple.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: temple.primaryColor }}
              >
                {temple.name.charAt(0)}
              </div>
            )}
            <span className="text-lg font-bold" style={{ color: temple.primaryColor }}>
              {temple.name}
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/" className="hover:opacity-70">홈</a>
            <a href="/about" className="hover:opacity-70">소개</a>
            <a href="/dharma" className="hover:opacity-70">법문</a>
            <a href="/gallery" className="hover:opacity-70">갤러리</a>
            <a href="/events" className="hover:opacity-70">법회/행사</a>
            <a href="/notices" className="hover:opacity-70">공지사항</a>
          </nav>
        </div>
      </header>

      {/* 페이지 본문 */}
      <main>{children}</main>

      {/* 사찰 푸터 */}
      <footer
        className="text-white py-12 px-6"
        style={{ backgroundColor: temple.primaryColor }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">{temple.name}</h3>
            {temple.denomination && (
              <p className="text-sm opacity-80">{temple.denomination}</p>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-2">연락처</h4>
            {temple.address && <p className="text-sm opacity-80">{temple.address}</p>}
            {temple.phone && <p className="text-sm opacity-80">TEL: {temple.phone}</p>}
            {temple.email && <p className="text-sm opacity-80">Email: {temple.email}</p>}
          </div>
          <div>
            {temple.abbotName && (
              <p className="text-sm opacity-80">주지: {temple.abbotName} 스님</p>
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-white/20 text-center text-xs opacity-60">
          © {new Date().getFullYear()} {temple.name}. Powered by K-Buddhism
        </div>
      </footer>
    </div>
  );
}
