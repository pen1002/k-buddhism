import { db } from './db';
import type { Temple, Post, Gallery, Event } from '@prisma/client';

export type { Temple, Post, Gallery, Event };

// 사찰 기본 정보 조회
export async function getTempleByCode(code: string): Promise<Temple | null> {
  return db.temple.findUnique({
    where: { code, isActive: true },
  });
}

// 사찰 게시글 목록
export async function getTemplePosts(
  templeId: string,
  category?: Post['category'],
  limit = 10
) {
  return db.post.findMany({
    where: {
      templeId,
      isPublished: true,
      ...(category ? { category } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: { author: { select: { name: true, image: true } } },
  });
}

// 사찰 갤러리 목록
export async function getTempleGalleries(templeId: string, limit = 6) {
  return db.gallery.findMany({
    where: { templeId, isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  });
}

// 사찰 행사/법회 목록 (오늘 이후)
export async function getTempleUpcomingEvents(templeId: string, limit = 5) {
  return db.event.findMany({
    where: {
      templeId,
      isPublished: true,
      startDate: { gte: new Date() },
    },
    orderBy: { startDate: 'asc' },
    take: limit,
  });
}

// 전체 사찰 목록 (허브 메인용)
export async function getAllTemples() {
  return db.temple.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      nameEn: true,
      description: true,
      logoUrl: true,
      heroImageUrl: true,
      customDomain: true,
      subdomain: true,
      denomination: true,
      address: true,
    },
  });
}
