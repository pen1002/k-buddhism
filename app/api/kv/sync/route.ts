import { NextResponse } from 'next/server';
import { syncDomainMappingsToKV } from '@/lib/kv';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// ============================================================
// POST /api/kv/sync — DB → Vercel KV 도메인 매핑 동기화
// Super Admin 전용
// ============================================================

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
  }

  try {
    const count = await syncDomainMappingsToKV();
    return NextResponse.json({ success: true, synced: count });
  } catch (error) {
    return NextResponse.json(
      { error: 'KV 동기화 실패', details: String(error) },
      { status: 500 }
    );
  }
}
