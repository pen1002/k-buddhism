// app/api/apply/route.ts
// 사찰 입주 신청 API — status: "pending" (자동 활성화 절대 금지)
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface ApplyBody {
  name: string
  code: string
  denomination?: string
  address?: string
  phone?: string
  email?: string
  foundedYear?: string
  description?: string
  logoUrl?: string
  heroImageUrl?: string
  abbotName?: string
  themeType?: string
  primaryColor?: string
  secondaryColor?: string
  tier?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ApplyBody

    const { name, code } = body
    if (!name?.trim()) return NextResponse.json({ error: '사찰명은 필수입니다.' }, { status: 400 })
    if (!code?.trim()) return NextResponse.json({ error: '사찰 코드는 필수입니다.' }, { status: 400 })
    if (!/^[a-z0-9-]+$/.test(code)) return NextResponse.json({ error: '사찰 코드는 영문 소문자·숫자·하이픈만 허용됩니다.' }, { status: 400 })

    // 중복 코드 확인
    const existing = await db.temple.findUnique({ where: { code: code.trim() } })
    if (existing) return NextResponse.json({ error: '이미 사용 중인 사찰 코드입니다.' }, { status: 409 })

    // pending 상태로 생성 — isActive: false로 공개 차단
    const temple = await db.temple.create({
      data: {
        name: name.trim(),
        code: code.trim(),
        denomination: body.denomination?.trim() || '대한불교조계종',
        address: body.address?.trim() || null,
        phone: body.phone?.trim() || null,
        email: body.email?.trim() || null,
        foundedYear: body.foundedYear ? parseInt(body.foundedYear) : null,
        description: body.description?.trim() || null,
        logoUrl: body.logoUrl?.trim() || null,
        heroImageUrl: body.heroImageUrl?.trim() || null,
        abbotName: body.abbotName?.trim() || null,
        themeType: body.themeType || 'theme-1',
        primaryColor: body.primaryColor || '#8B2500',
        secondaryColor: body.secondaryColor || '#C5A572',
        tier: parseInt(body.tier || '1'),
        status: 'pending',   // ← 반드시 pending
        isActive: false,     // ← 승인 전까지 비공개
        pin: '0000',
      },
    })

    return NextResponse.json({ ok: true, id: temple.id, code: temple.code }, { status: 201 })
  } catch (e) {
    console.error('[apply]', e)
    return NextResponse.json({ error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }, { status: 500 })
  }
}
