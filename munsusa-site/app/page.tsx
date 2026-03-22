import { getAllTemples } from '@/lib/temple';
import Link from 'next/link';

export const revalidate = 3600; // 1시간 캐시

export default async function HubPage() {
  const temples = await getAllTemples();

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="bg-[#8B2500] text-white py-8 text-center">
        <h1 className="text-3xl font-bold">108사찰</h1>
        <p className="text-[#C5A572] mt-2">한국 불교 사찰 통합 플랫폼</p>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-stone-800 mb-8">참여 사찰 목록</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {temples.map((temple) => {
            const href = temple.customDomain
              ? `https://${temple.customDomain}`
              : temple.subdomain
              ? `https://${temple.subdomain}.k-buddhism.com`
              : `/_sites/${temple.code}`;

            return (
              <Link
                key={temple.id}
                href={href}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-stone-200"
              >
                {temple.logoUrl && (
                  <img
                    src={temple.logoUrl}
                    alt={temple.name}
                    className="h-12 w-auto mb-4 object-contain"
                  />
                )}
                <h3 className="text-lg font-bold text-stone-900">{temple.name}</h3>
                {temple.nameEn && (
                  <p className="text-sm text-stone-500">{temple.nameEn}</p>
                )}
                {temple.denomination && (
                  <p className="text-xs text-[#8B2500] mt-1">{temple.denomination}</p>
                )}
                {temple.address && (
                  <p className="text-sm text-stone-600 mt-2 line-clamp-1">{temple.address}</p>
                )}
              </Link>
            );
          })}
        </div>

        {temples.length === 0 && (
          <p className="text-center text-stone-500 py-20">등록된 사찰이 없습니다.</p>
        )}
      </section>
    </main>
  );
}
