import { notFound } from 'next/navigation';
import { getTempleByCode, getTemplePosts, getTempleGalleries, getTempleUpcomingEvents } from '@/lib/temple';

export const revalidate = 300;

export default async function SitePage({ params }: { params: Promise<{ site: string }> }) {
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
      {temple.description && (
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">사찰 소개</h2>
          <p className="text-stone-600 leading-relaxed">{temple.description}</p>
        </section>
      )}
      {posts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">법문 / 공지</h2>
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.id} className="bg-white rounded-lg border border-stone-200 p-4">
                <a href={`/posts/${post.slug}`} className="font-semibold text-stone-800">{post.title}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {events.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-stone-800 mb-4">행사 / 법회</h2>
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-stone-600">{event.startDate.toLocaleDateString('ko-KR')}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
