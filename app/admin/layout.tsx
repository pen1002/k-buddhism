import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// ============================================================
// Admin 레이아웃 — 인증 + RBAC 게이트
// ============================================================

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/admin');
  }

  const role = (session.user as any).role || 'MEMBER';

  // MEMBER는 관리자 접근 불가
  if (role === 'MEMBER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한 없음</h1>
          <p className="text-gray-600 mb-6">
            관리자 권한이 필요합니다. Super Admin에게 문의하세요.
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin 사이드바 */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-[#2C1810] text-white p-6">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-[#C5A572]">K-Buddhism</h1>
            <p className="text-xs text-gray-400 mt-1">관리자 대시보드</p>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              대시보드
            </Link>

            {/* Super Admin 전용 메뉴 */}
            {role === 'SUPER_ADMIN' && (
              <>
                <Link
                  href="/admin/temples"
                  className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  사찰 관리
                </Link>
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  사용자 관리
                </Link>
                <Link
                  href="/admin/domains"
                  className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  도메인 관리
                </Link>
              </>
            )}

            {/* 모든 관리자 공통 메뉴 */}
            <Link
              href="/admin/posts"
              className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              게시글 관리
            </Link>
            <Link
              href="/admin/gallery"
              className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              갤러리 관리
            </Link>
            <Link
              href="/admin/events"
              className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              행사 관리
            </Link>
          </nav>

          <div className="mt-auto pt-8 border-t border-white/10 mt-8">
            <p className="text-sm text-gray-400">{session.user.name}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
