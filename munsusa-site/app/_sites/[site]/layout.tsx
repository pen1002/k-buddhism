import { notFound } from 'next/navigation';
import { getTempleByCode } from '@/lib/temple';
import type { Metadata } from 'next';

interface Props {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params;
  const temple = await getTempleByCode(site);
  if (!temple) return {};
  return {
    title: { default: temple.name, template: `%s | ${temple.name}` },
    description: temple.description ?? undefined,
  };
}

export default async function SiteLayout({ children, params }: Props) {
  const { site } = await params;
  const temple = await getTempleByCode(site);
  if (!temple) notFound();

  return (
    <div
      style={
        {
          '--temple-primary': temple.primaryColor,
          '--temple-secondary': temple.secondaryColor,
        } as React.CSSProperties
      }
    >
      {/* 헤더 */}
      <header
        style={{ backgroundColor: temple.primaryColor }}
        className="text-white sticky top-0 z-50 shadow-md"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {temple.logoUrl && (
              <img src={temple.logoUrl} alt={temple.name} className="h-10 w-auto" />
            )}
            <span className="text-xl font-bold">{temple.name}</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="/" className="hover:opacity-80">홈</a>
            <a href="/posts" className="hover:opacity-80">법문/공지</a>
            <a href="/gallery" className="hover:opacity-80">갤러리</a>
            <a href="/events" className="hover:opacity-80">행사/법회</a>
          </nav>
        </div>
      </header>

      {/* 본문 */}
      <main className="min-h-screen">{children}</main>

      {/* 푸터 */}
      <footer className="bg-stone-900 text-stone-400 py-8 text-center text-sm">
        <p className="font-semibold text-white">{temple.name}</p>
        {temple.address && <p className="mt-1">{temple.address}</p>}
        {temple.phone && <p>{temple.phone}</p>}
        {temple.email && <p>{temple.email}</p>}
        <p className="mt-4 text-xs">© {new Date().getFullYear()} {temple.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
