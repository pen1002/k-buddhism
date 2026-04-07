// 사찰 삭제 API (Super Admin 전용)
import { NextRequest, NextResponse } from 'next/server'
import { getSuperSession } from '@/lib/superAuth'
import { db } from '@/lib/db'

const PROTECTED = ['munsusa'] // 삭제 불가 사찰

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { code } = await params

  if (PROTECTED.includes(code)) {
    return NextResponse.json({ error: '보호된 사찰은 삭제할 수 없습니다.' }, { status: 403 })
  }

  try {
    const temple = await db.temple.findUnique({ where: { code } })
    if (!temple) return NextResponse.json({ error: '사찰을 찾을 수 없습니다.' }, { status: 404 })

    await db.temple.delete({ where: { code } })

    return NextResponse.json({ ok: true, message: `${temple.name} 삭제 완료.` })
  } catch (e) {
    console.error('[delete]', e)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
