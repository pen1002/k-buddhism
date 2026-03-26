// 신규 접수 사찰 반려 API
import { NextRequest, NextResponse } from 'next/server'
import { getSuperSession } from '@/lib/superAuth'
import { db } from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { code } = await params

  try {
    const temple = await db.temple.findUnique({ where: { code } })
    if (!temple) return NextResponse.json({ error: '사찰을 찾을 수 없습니다.' }, { status: 404 })
    if (temple.status !== 'pending') {
      return NextResponse.json({ error: '대기 중인 사찰이 아닙니다.' }, { status: 400 })
    }

    await db.temple.update({
      where: { code },
      data: { status: 'suspended', isActive: false },
    })

    return NextResponse.json({ ok: true, message: `${temple.name} 반려 처리되었습니다.` })
  } catch (e) {
    console.error('[reject]', e)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
