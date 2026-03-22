import { notFound } from 'next/navigation';
import {
  getTempleByCode,
  getTemplePosts,
  getTempleGalleries,
  getTempleUpcomingEvents,
} from '@/lib/temple';

interface Props {
  params: Promise<{ site: string }>;
}

export const revalidate = 300; // 5분 캐시

export default async function SitePage({ params }: Props) {
  const { site } = await params;
  const temple = await getTempleByCode(site);
  if (!temple) notFound();

  const [posts, galleries, events] = await Promise.all([
    getTemplePosts(temple.id, undefined, 5),
    getTempleGalleries(temple.id, 4),
    getTempleUpcomingEvents(temple.id, 3),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">

      {/* 히어로 */}
      {temple.heroImageUrl && (
        <section className="relative h-64 rounded-xl overflow-hidden">
          <img
            src={temple.heroImageUrl}
            alt={temple.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white drop-shadow">{temple.name}</h1>
          </div>
        </section>
      )}

      {/* 소개 */}
      {temple.description && (
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">사찰 소개</h2>
          <p className="text-stone-600 leading-relaxed whitespace-pre-line">{temple.description}</p>
        </section>
      )}

      {/* 최신 법문/공지 */}
      {posts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">법문 / 공지</h2>
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.id} className="bg-white rounded-lg border border-stone-200 p-4 hover:shadow transition-shadow">
                <a href={`/posts/${post.slug}`}>
                  <span className="text-xs text-[var(--temple-primary)] font-semibold uppercase mr-2">
                    {post.category}
                  </span>
                  <span className="font-semibold text-stone-800">{post.title}</span>
                  <p className="text-sm text-stone-500 mt-1">
                    {post.publishedAt?.toLocaleDateString('ko-KR')}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 갤러리 */}
      {galleries.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">갤러리</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleries.map((gallery) => {
              const thumb = gallery.images[0];
              return (
                <a key={gallery.id} href={`/gallery/${gallery.id}`}>
                  <div className="aspect-square bg-stone-200 rounded-lg overflow-hidden">
                    {thumb && (
                      <img
                        src={thumb.url}
                        alt={thumb.alt ?? gallery.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <p className="text-sm text-stone-700 mt-1 text-center">{gallery.title}</p>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* 다가오는 행사 */}
      {events.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">행사 / 법회</h2>
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold text-stone-900">{event.title}</p>
                <p className="text-sm text-stone-600 mt-1">
                  {event.startDate.toLocaleDateString('ko-KR', {
                    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
                  })}
                  {event.location && ` · ${event.location}`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
