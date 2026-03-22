import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import KakaoProvider from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
import { db } from './db';
import type { UserRole, TempleMemberRole } from '@prisma/client';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        session.user.role = dbUser?.role ?? 'MEMBER';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

// RBAC 헬퍼: 사찰별 권한 확인
export async function getTempleRole(
  userId: string,
  templeId: string
): Promise<TempleMemberRole | null> {
  const member = await db.templeMember.findUnique({
    where: { userId_templeId: { userId, templeId } },
    select: { role: true },
  });
  return member?.role ?? null;
}

export async function canEditTemple(userId: string, templeId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role === 'SUPER_ADMIN') return true;

  const role = await getTempleRole(userId, templeId);
  return role === 'ADMIN' || role === 'EDITOR';
}

export async function isTempleAdmin(userId: string, templeId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role === 'SUPER_ADMIN') return true;

  const role = await getTempleRole(userId, templeId);
  return role === 'ADMIN';
}

// TypeScript 타입 확장
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
