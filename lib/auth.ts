import { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import KakaoProvider from 'next-auth/providers/kakao';
import { prisma } from './db';

// ============================================================
// NextAuth.js 설정 — 카카오 로그인 + RBAC
// ============================================================

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'MEMBER';
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

/**
 * 사용자가 특정 사찰에 대해 가진 권한 확인
 */
export async function getUserTempleRole(userId: string, templeId: string) {
  // Super Admin은 모든 사찰 접근 가능
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role === 'SUPER_ADMIN') {
    return 'SUPER_ADMIN' as const;
  }

  // 사찰별 멤버 권한 확인
  const membership = await prisma.templeMember.findUnique({
    where: {
      userId_templeId: { userId, templeId },
    },
    select: { role: true },
  });

  return membership?.role || null;
}

/**
 * 관리자 권한 확인 (수정 가능 여부)
 */
export function canEdit(role: string | null): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'EDITOR';
}

/**
 * 사찰 관리 권한 확인 (설정 변경 가능 여부)
 */
export function canManageTemple(role: string | null): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}
