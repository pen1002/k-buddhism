import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// ============================================================
// 게시글 관리 — RBAC 적용
// Super Admin: 전체 게시글
// Temple Admin/Editor: 소속 사찰 게시글만
// ============================================================

export default async function PostsManagement() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  let posts: any[] = [];

  try {
    if (role === 'SUPER_ADMIN') {
      posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          temple: { select: { name: true, code: true } },
          author: { select: { name: true } },
        },
      });
    } else if (userId) {
      // 소속 사찰의 게시글만 조회
      const memberships = await prisma.templeMember.findMany({
        where: { userId },
        select: { templeId: true },
      });
      const templeIds = memberships.map((m) => m.templeId);

      posts = await prisma.post.findMany({
        where: { templeId: { in: templeIds } },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          temple: { select: { name: true, code: true } },
          author: { select: { name: true } },
        },
      });
    }
  } catch {
    // DB 미연결
  }

  const categoryLabel: Record<string, string> = {
    NOTICE: '공지사항',
    DHARMA_TALK: '법문',
    NEWS: '소식',
    COLUMN: '칼럼',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">게시글 관리</h1>
        <a
          href="/admin/posts/new"
          className="bg-[#8B2500] text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm"
        >
          + 새 게시글
        </a>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
          게시글이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-6 py-3">제목</th>
                <th className="px-6 py-3">사찰</th>
                <th className="px-6 py-3">분류</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3">작성자</th>
                <th className="px-6 py-3">작성일</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    <a
                      href={`/admin/posts/${post.id}`}
                      className="hover:text-[#8B2500]"
                    >
                      {post.title}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.temple.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {categoryLabel[post.category] || post.category}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        post.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {post.isPublished ? '공개' : '임시저장'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.author?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
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
