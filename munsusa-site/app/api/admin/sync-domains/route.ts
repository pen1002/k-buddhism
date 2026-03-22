import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { setDomainMapping } from '@/lib/kv';

// DB의 DomainMap 테이블을 Vercel KV에 동기화
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const domainMaps = await db.domainMap.findMany({
    include: { temple: { select: { code: true } } },
  });

  const results = await Promise.allSettled(
    domainMaps.map((dm) => setDomainMapping(dm.domain, dm.temple.code))
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return NextResponse.json({ synced: succeeded, failed, total: domainMaps.length });
}
