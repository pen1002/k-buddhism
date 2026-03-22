import {
  getTempleByCode,
  getTempleDharmaTalks,
  getTempleNotices,
  getTempleGalleries,
  getTempleEvents,
} from '@/lib/temple';
import { notFound } from 'next/navigation';

// ============================================================
// 사찰 메인 페이지 — 도메인별 동적 렌더링
// 문수사.com → /_sites/munsusa → 이 페이지
// ============================================================

export default async function TemplePage({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site } = await params;
  const temple = await getTempleByCode(site);

  if (!temple) {
    notFound();
  }

  // 병렬 데이터 fetching
  const [dharmaTalks, notices, galleries, events] = await Promise.all([
    getTempleDharmaTalks(temple.id, 3),
    getTempleNotices(temple.id, 5),
    getTempleGalleries(temple.id, 4),
    getTempleEvents(temple.id, 3),
  ]);

  return (
    <div>
      {/* 히어로 */}
      <section
        className="relative h-[60vh] flex items-center justify-center text-white text-center"
        style={{
          background: temple.heroImageUrl
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${temple.heroImageUrl}) center/cover`
            : temple.primaryColor,
        }}
      >
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{temple.name}</h1>
          {temple.description && (
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              {temple.description}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {/* 법문 섹션 */}
        {dharmaTalks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: temple.primaryColor }}>
                법문
              </h2>
              <a href="/dharma" className="text-sm hover:underline" style={{ color: temple.primaryColor }}>
                더 보기 →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dharmaTalks.map((talk) => (
                <a
                  key={talk.id}
                  href={`/dharma/${talk.slug}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {talk.coverImage && (
                    <img
                      src={talk.coverImage}
                      alt={talk.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{talk.title}</h3>
                    {talk.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2">{talk.excerpt}</p>
                    )}
                    {talk.publishedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(talk.publishedAt).toLocaleDateString('ko-KR')}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 공지사항 섹션 */}
        {notices.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: temple.primaryColor }}>
                공지사항
              </h2>
              <a href="/notices" className="text-sm hover:underline" style={{ color: temple.primaryColor }}>
                더 보기 →
              </a>
            </div>
            <div className="bg-white rounded-lg shadow-md divide-y">
              {notices.map((notice) => (
                <a
                  key={notice.id}
                  href={`/notices/${notice.slug}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{notice.title}</span>
                  {notice.publishedAt && (
                    <span className="text-sm text-gray-400">
                      {new Date(notice.publishedAt).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 갤러리 섹션 */}
        {galleries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: temple.primaryColor }}>
                갤러리
              </h2>
              <a href="/gallery" className="text-sm hover:underline" style={{ color: temple.primaryColor }}>
                더 보기 →
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleries.map((gallery) => (
                <a
                  key={gallery.id}
                  href={`/gallery/${gallery.id}`}
                  className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {gallery.images[0] && (
                    <img
                      src={gallery.images[0].url}
                      alt={gallery.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold line-clamp-1">{gallery.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 행사 섹션 */}
        {events.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ color: temple.primaryColor }}>
              예정 법회/행사
            </h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-6 items-start"
                >
                  <div
                    className="text-center px-4 py-2 rounded-lg text-white min-w-[80px]"
                    style={{ backgroundColor: temple.primaryColor }}
                  >
                    <div className="text-2xl font-bold">
                      {new Date(event.startDate).getDate()}
                    </div>
                    <div className="text-xs">
                      {new Date(event.startDate).toLocaleDateString('ko-KR', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    {event.location && (
                      <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
