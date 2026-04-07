import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTempleName } from '@/lib/kv'

export async function POST(request: NextRequest) {
  const { slug, pin } = await request.json()

  if (!slug || !pin) {
    return NextResponse.json({ error: '사찰 코드와 PIN을 입력해주세요.' }, { status: 400 })
  }

  const code = slug.trim().toLowerCase()

  // 1차: 환경변수 PIN 조회 (레거시 호환)
  const envKey = `${code.toUpperCase()}_PIN`
  const envPin = process.env[envKey]

  // 2차: DB에서 사찰 + PIN 조회
  const temple = await db.temple.findUnique({
    where: { code },
    select: { pin: true, name: true, status: true, isActive: true },
  }).catch(() => null)

  // 사찰 존재 여부
  if (!envPin && !temple) {
    return NextResponse.json({ error: '등록되지 않은 사찰 코드입니다. 실장님께 문의하세요.' }, { status: 401 })
  }

  // 활성화 여부 확인 (DB 사찰인 경우)
  if (temple && (!temple.isActive || temple.status !== 'active')) {
    return NextResponse.json({ error: '현재 이용할 수 없는 사찰입니다. 실장님께 문의하세요.' }, { status: 401 })
  }

  // PIN 비교: 환경변수 우선, 없으면 DB
  const correctPin = (envPin || temple?.pin || '').trim()

  if (!correctPin) {
    return NextResponse.json({ error: '등록되지 않은 사찰 코드입니다. 실장님께 문의하세요.' }, { status: 401 })
  }

  if (pin.trim() !== correctPin) {
    return NextResponse.json({ error: '비밀번호가 틀렸습니다. 실장님께 문의하세요.' }, { status: 401 })
  }

  // 세션 발급
  const templeName = await getTempleName(code).catch(() => temple?.name || code)
  const token = await createSession({ slug: code, templeName })

  const response = NextResponse.json({ ok: true, slug: code })
  response.cookies.set('temple_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24시간
    path: '/',
    sameSite: 'lax',
  })
  return response
}
