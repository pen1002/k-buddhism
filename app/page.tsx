import { getAllActiveTemples } from '@/lib/temple';

// ============================================================
// 허브 메인 페이지 — 전체 사찰 목록
// k-buddhism.com 또는 k-buddhism.vercel.app 접속 시 표시
// ============================================================

export default async function HubPage() {
  let temples: Awaited<ReturnType<typeof getAllActiveTemples>> = [];

  try {
    temples = await getAllActiveTemples();
  } catch {
    // DB 미연결 시 빈 배열
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8]">
      {/* 히어로 섹션 */}
      <section className="bg-[#2C1810] text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          한국 불교 사찰 허브
        </h1>
        <p className="text-lg md:text-xl text-[#C5A572] max-w-2xl mx-auto">
          108사찰의 소식과 법문을 한곳에서 만나보세요
        </p>
      </section>

      {/* 사찰 목록 */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-[#2C1810] mb-8">참여 사찰</h2>

        {temples.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">사찰 데이터를 불러오는 중...</p>
            <p className="text-sm mt-2">
              DATABASE_URL 환경변수를 설정하고 prisma db push를 실행하세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.map((temple) => (
              <a
                key={temple.id}
                href={
                  temple.customDomain
                    ? `https://${temple.customDomain}`
                    : `https://${temple.subdomain || temple.code}.k-buddhism.com`
                }
                className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-center gap-4 mb-3">
                  {temple.logoUrl ? (
                    <img
                      src={temple.logoUrl}
                      alt={temple.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#8B2500] flex items-center justify-center text-white font-bold text-lg">
                      {temple.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-[#2C1810]">{temple.name}</h3>
                    {temple.denomination && (
                      <p className="text-sm text-gray-500">{temple.denomination}</p>
                    )}
                  </div>
                </div>
                {temple.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {temple.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
