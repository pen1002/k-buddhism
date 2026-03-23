import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setDomainMapping } from '@/lib/kv';

export async function POST(request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const maps = await db.domainMap.findMany({ include: { temple: { select: { code: true } } } });
  const results = await Promise.allSettled(maps.map((m) => setDomainMapping(m.domain, m.temple.code)));
  return NextResponse.json({
    synced: results.filter((r) => r.status === 'fulfilled').length,
    total: maps.length,
  });
}
