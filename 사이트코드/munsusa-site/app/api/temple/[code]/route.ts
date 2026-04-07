// app/api/temple/[code]/route.ts
// 3대 어드민 혈맥 통합 API — 공지사항 · 오늘의 법문 · 갤러리
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTodayDharma } from '@/lib/dharma-rotation'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
}

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
        galleries: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            images: { orderBy: { order: 'asc' }, take: 10 }
          }
        },
        blockConfigs: {
          where: { isVisible: true, blockType: { in: ['I-01', 'G-01'] } },
          orderBy: { order: 'asc' },
        }
      }
    })

    if (!temple) return NextResponse.json({ error: 'Temple not found' }, { status: 404 })

    // 1. 공지사항 — I-01 블록 config에서 추출
    const noticeConfig = temple.blockConfigs.find(b => b.blockType === 'I-01')?.config as Record<string, unknown> | null
    const notices = Array.isArray((noticeConfig as Record<string, unknown> | null)?.notices)
      ? (noticeConfig as Record<string, unknown[]>).notices
      : []

    // 2. 오늘의 법문 — 법륜 로직
    const dharma = await getTodayDharma(code)

    // 3. 갤러리 — Gallery 모델 우선, 없으면 G-01 블록 config
    let gallery: { url: string; alt: string }[] = []
    if (temple.galleries.length > 0 && temple.galleries[0].images.length > 0) {
      gallery = temple.galleries[0].images.map(img => ({
        url: img.url,
        alt: img.alt || temple.name,
      }))
    } else {
      const galleryConfig = temple.blockConfigs.find(b => b.blockType === 'G-01')?.config as Record<string, unknown> | null
      const staticGallery = (galleryConfig as Record<string, unknown> | null)?.gallery
      if (Array.isArray(staticGallery)) {
        gallery = (staticGallery as Array<{ url?: string; caption?: string }>)
          .filter(item => item.url)
          .map(item => ({ url: item.url!, alt: item.caption || temple.name }))
      }
    }

    return NextResponse.json({ notices, dharma, gallery }, { headers: CORS })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '데이터 조회 오류' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS })
}
