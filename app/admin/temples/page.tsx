import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

// ============================================================
// Super Admin 전용 — 전체 사찰 관리 목록
// ============================================================

export default async function TemplesManagement() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  let temples: any[] = [];

  try {
    temples = await prisma.temple.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true, galleries: true, members: true },
        },
      },
    });
  } catch {
    // DB 미연결
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">사찰 관리</h1>
        <a
          href="/admin/temples/new"
          className="bg-[#8B2500] text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm"
        >
          + 사찰 추가
        </a>
      </div>

      {temples.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
          <p>등록된 사찰이 없습니다.</p>
          <p className="text-sm mt-2">DATABASE_URL 설정 → prisma db push → 사찰 추가</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-6 py-3">사찰명</th>
                <th className="px-6 py-3">코드</th>
                <th className="px-6 py-3">커스텀 도메인</th>
                <th className="px-6 py-3">게시글</th>
                <th className="px-6 py-3">갤러리</th>
                <th className="px-6 py-3">관리자</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {temples.map((temple) => (
                <tr key={temple.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{temple.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{temple.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {temple.customDomain || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">{temple._count.posts}</td>
                  <td className="px-6 py-4 text-sm">{temple._count.galleries}</td>
                  <td className="px-6 py-4 text-sm">{temple._count.members}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        temple.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {temple.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/admin/temples/${temple.id}`}
                      className="text-sm text-[#8B2500] hover:underline"
                    >
                      수정
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
