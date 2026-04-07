import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 })

  try {
    const temple = await db.temple.findUnique({
      where: { code, isActive: true },
      include: {
        blockConfigs: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!temple) return NextResponse.json({ error: 'Temple not found' }, { status: 404 })

    return NextResponse.json(
      {
        id: temple.id,
        code: temple.code,
        name: temple.name,
        nameEn: temple.nameEn,
        description: temple.description,
        address: temple.address,
        phone: temple.phone,
        logoUrl: temple.logoUrl,
        heroImageUrl: temple.heroImageUrl,
        primaryColor: temple.primaryColor,
        secondaryColor: temple.secondaryColor,
        denomination: temple.denomination,
        tier: temple.tier,
        blocks: temple.blockConfigs.map((b) => ({
          id: b.id,
          blockType: b.blockType,
          label: b.label,
          order: b.order,
          config: b.config,
        })),
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: '데이터 조회 오류' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  })
}
