import { getServerSession } from 'next-auth';
import { authOptions, getUserTempleRole } from '@/lib/auth';
import { prisma } from '@/lib/db';

// ============================================================
// Admin 대시보드 메인 — 역할별 분기
// Super Admin: 전체 사찰 통계
// Temple Admin: 소속 사찰 통계
// ============================================================

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  let stats = {
    templeCount: 0,
    postCount: 0,
    galleryCount: 0,
    eventCount: 0,
  };

  let myTemples: { id: string; code: string; name: string }[] = [];

  try {
    if (role === 'SUPER_ADMIN') {
      // Super Admin: 전체 통계
      const [templeCount, postCount, galleryCount, eventCount] = await Promise.all([
        prisma.temple.count({ where: { isActive: true } }),
        prisma.post.count({ where: { isPublished: true } }),
        prisma.gallery.count({ where: { isPublished: true } }),
        prisma.event.count({ where: { isPublished: true } }),
      ]);
      stats = { templeCount, postCount, galleryCount, eventCount };

      myTemples = await prisma.temple.findMany({
        where: { isActive: true },
        select: { id: true, code: true, name: true },
        orderBy: { name: 'asc' },
      });
    } else if (userId) {
      // Temple Admin/Editor: 소속 사찰만
      const memberships = await prisma.templeMember.findMany({
        where: { userId },
        include: {
          temple: {
            select: { id: true, code: true, name: true },
          },
        },
      });

      myTemples = memberships.map((m) => m.temple);
      const templeIds = myTemples.map((t) => t.id);

      const [postCount, galleryCount, eventCount] = await Promise.all([
        prisma.post.count({ where: { templeId: { in: templeIds }, isPublished: true } }),
        prisma.gallery.count({ where: { templeId: { in: templeIds }, isPublished: true } }),
        prisma.event.count({ where: { templeId: { in: templeIds }, isPublished: true } }),
      ]);

      stats = {
        templeCount: myTemples.length,
        postCount,
        galleryCount,
        eventCount,
      };
    }
  } catch {
    // DB 미연결 시 기본값 유지
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        {role === 'SUPER_ADMIN' ? '전체 관리' : '내 사찰 관리'}
      </h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="사찰" value={stats.templeCount} color="#8B2500" />
        <StatCard label="게시글" value={stats.postCount} color="#C5A572" />
        <StatCard label="갤러리" value={stats.galleryCount} color="#5C4033" />
        <StatCard label="행사" value={stats.eventCount} color="#2C1810" />
      </div>

      {/* 사찰 목록 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {role === 'SUPER_ADMIN' ? '전체 사찰' : '관리 사찰'}
        </h2>

        {myTemples.length === 0 ? (
          <p className="text-gray-500">
            {role === 'SUPER_ADMIN'
              ? 'DB를 연결하고 사찰 데이터를 추가하세요.'
              : '소속된 사찰이 없습니다.'}
          </p>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-3">사찰명</th>
                  <th className="px-6 py-3">코드</th>
                  <th className="px-6 py-3">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myTemples.map((temple) => (
                  <tr key={temple.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{temple.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{temple.code}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`/admin/temples/${temple.id}`}
                        className="text-sm text-[#8B2500] hover:underline"
                      >
                        관리 →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
