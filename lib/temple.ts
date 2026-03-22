import { prisma } from './db';
import { cache } from 'react';

// ============================================================
// 사찰 데이터 Fetching 유틸리티
// React cache()로 동일 요청 내 중복 쿼리 방지
// ============================================================

export type TempleInfo = {
  id: string;
  code: string;
  name: string;
  nameEn: string | null;
  description: string | null;
  logoUrl: string | null;
  heroImageUrl: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  denomination: string | null;
  abbotName: string | null;
};

/**
 * 사찰 코드로 기본 정보 조회
 * 서버 컴포넌트에서 사용 — React cache()로 요청 단위 캐싱
 */
export const getTempleByCode = cache(async (code: string): Promise<TempleInfo | null> => {
  const temple = await prisma.temple.findUnique({
    where: { code, isActive: true },
    select: {
      id: true,
      code: true,
      name: true,
      nameEn: true,
      description: true,
      logoUrl: true,
      heroImageUrl: true,
      address: true,
      phone: true,
      email: true,
      primaryColor: true,
      secondaryColor: true,
      fontFamily: true,
      denomination: true,
      abbotName: true,
    },
  });

  return temple;
});

/**
 * 사찰의 최근 법문(Dharma Talk) 목록 조회
 */
export const getTempleDharmaTalks = cache(async (templeId: string, limit = 5) => {
  return prisma.post.findMany({
    where: {
      templeId,
      category: 'DHARMA_TALK',
      isPublished: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });
});

/**
 * 사찰의 공지사항 목록 조회
 */
export const getTempleNotices = cache(async (templeId: string, limit = 10) => {
  return prisma.post.findMany({
    where: {
      templeId,
      category: 'NOTICE',
      isPublished: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      publishedAt: true,
    },
  });
});

/**
 * 사찰의 갤러리 목록 조회
 */
export const getTempleGalleries = cache(async (templeId: string, limit = 6) => {
  return prisma.gallery.findMany({
    where: {
      templeId,
      isPublished: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      images: {
        orderBy: { order: 'asc' },
        take: 1,
      },
    },
  });
});

/**
 * 사찰의 예정 행사 목록 조회
 */
export const getTempleEvents = cache(async (templeId: string, limit = 5) => {
  return prisma.event.findMany({
    where: {
      templeId,
      isPublished: true,
      startDate: { gte: new Date() },
    },
    orderBy: { startDate: 'asc' },
    take: limit,
  });
});

/**
 * 전체 활성 사찰 목록 (허브 페이지용)
 */
export const getAllActiveTemples = cache(async () => {
  return prisma.temple.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      nameEn: true,
      logoUrl: true,
      description: true,
      denomination: true,
      customDomain: true,
      subdomain: true,
    },
  });
});
