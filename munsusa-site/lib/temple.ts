import { db } from './db';
import type { Post } from '@prisma/client';

export async function getTempleByCode(code: string) {
  return db.temple.findUnique({ where: { code, isActive: true } });
}

export async function getTemplePosts(templeId: string, category?: Post['category'], limit = 10) {
  return db.post.findMany({
    where: { templeId, isPublished: true, ...(category ? { category } : {}) },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: { author: { select: { name: true, image: true } } },
  });
}

export async function getTempleGalleries(templeId: string, limit = 6) {
  return db.gallery.findMany({
    where: { templeId, isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  });
}

export async function getTempleUpcomingEvents(templeId: string, limit = 5) {
  return db.event.findMany({
    where: { templeId, isPublished: true, startDate: { gte: new Date() } },
    orderBy: { startDate: 'asc' },
    take: limit,
  });
}

export async function getAllTemples() {
  return db.temple.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: {
      id: true, code: true, name: true, nameEn: true,
      description: true, logoUrl: true, heroImageUrl: true,
      customDomain: true, subdomain: true, denomination: true, address: true,
    },
  });
}
