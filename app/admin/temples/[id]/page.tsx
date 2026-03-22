import { getServerSession } from 'next-auth';
import { authOptions, getUserTempleRole, canManageTemple } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

// ============================================================
// 개별 사찰 관리 페이지
// Super Admin: 모든 사찰 수정 가능
// Temple Admin: 본인 소속 사찰만 수정 가능
// ============================================================

export default async function TempleDetailAdmin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) redirect('/api/auth/signin');

  // 권한 확인
  const role = await getUserTempleRole(userId, id);
  if (!canManageTemple(role)) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">접근 권한 없음</h2>
        <p className="text-gray-500">이 사찰의 관리 권한이 없습니다.</p>
      </div>
    );
  }

  let temple: any = null;

  try {
    temple = await prisma.temple.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        domainMaps: true,
        _count: {
          select: { posts: true, galleries: true, events: true },
        },
      },
    });
  } catch {
    // DB 오류
  }

  if (!temple) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{temple.name} 관리</h1>
        <span className="text-sm text-gray-500">코드: {temple.code}</span>
      </div>

      {/* 기본 정보 */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <InfoRow label="사찰명" value={temple.name} />
          <InfoRow label="영문명" value={temple.nameEn || '-'} />
          <InfoRow label="종단" value={temple.denomination || '-'} />
          <InfoRow label="주지스님" value={temple.abbotName || '-'} />
          <InfoRow label="주소" value={temple.address || '-'} />
          <InfoRow label="전화" value={temple.phone || '-'} />
          <InfoRow label="이메일" value={temple.email || '-'} />
          <InfoRow label="커스텀 도메인" value={temple.customDomain || '-'} />
        </div>
      </section>

      {/* 테마 설정 */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">테마 설정</h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: temple.primaryColor }}
            />
            <span className="text-sm">메인: {temple.primaryColor}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full border"
              style={{ backgroundColor: temple.secondaryColor }}
            />
            <span className="text-sm">보조: {temple.secondaryColor}</span>
          </div>
          <div className="text-sm text-gray-500">
            폰트: {temple.fontFamily}
          </div>
        </div>
      </section>

      {/* 통계 */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-3xl font-bold text-[#8B2500]">{temple._count.posts}</p>
          <p className="text-sm text-gray-500">게시글</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-3xl font-bold text-[#C5A572]">{temple._count.galleries}</p>
          <p className="text-sm text-gray-500">갤러리</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-3xl font-bold text-[#5C4033]">{temple._count.events}</p>
          <p className="text-sm text-gray-500">행사</p>
        </div>
      </section>

      {/* 도메인 매핑 */}
      <section className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">도메인 매핑</h2>
        {temple.domainMaps.length === 0 ? (
          <p className="text-gray-500 text-sm">연결된 도메인이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {temple.domainMaps.map((dm: any) => (
              <li key={dm.id} className="text-sm bg-gray-50 px-4 py-2 rounded">
                {dm.domain}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 관리자 목록 (Super Admin만) */}
      {role === 'SUPER_ADMIN' && (
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">사찰 관리자</h2>
          {temple.members.length === 0 ? (
            <p className="text-gray-500 text-sm">배정된 관리자가 없습니다.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500">
                <tr>
                  <th className="pb-2">이름</th>
                  <th className="pb-2">이메일</th>
                  <th className="pb-2">권한</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {temple.members.map((m: any) => (
                  <tr key={m.id}>
                    <td className="py-2">{m.user.name || '-'}</td>
                    <td className="py-2 text-gray-500">{m.user.email || '-'}</td>
                    <td className="py-2">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100">
                        {m.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}: </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
