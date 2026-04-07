import { notFound } from 'next/navigation';
import { getTempleByCode } from '@/lib/temple';
import type { Metadata } from 'next';

interface Props { children: React.ReactNode; params: Promise<{ site: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site } = await params;
  const temple = await getTempleByCode(site);
  if (!temple) return {};
  return { title: { default: temple.name, template: `%s | ${temple.name}` } };
}

export default async function SiteLayout({ children, params }: Props) {
  const { site } = await params;
  const temple = await getTempleByCode(site);
  if (!temple) notFound();

  return (
    <div style={{ '--temple-primary': temple.primaryColor, '--temple-secondary': temple.secondaryColor } as React.CSSProperties}>
      <header style={{ backgroundColor: temple.primaryColor }} className="text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold">{temple.name}</span>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="/">홈</a>
            <a href="/posts">법문/공지</a>
            <a href="/gallery">갤러리</a>
            <a href="/events">행사/법회</a>
          </nav>
        </div>
      </header>
      <main className="min-h-screen">{children}</main>
      <footer className="bg-stone-900 text-stone-400 py-8 text-center text-sm">
        <p className="font-semibold text-white">{temple.name}</p>
        {temple.address && <p className="mt-1">{temple.address}</p>}
        {temple.phone && <p>{temple.phone}</p>}
      </footer>
    </div>
  );
}
