// app/borimsa/route.ts
// 보림사 Astro HTML 원본을 그대로 서빙 (정적 라우트 — [slug] 동적 라우트보다 우선)
import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  const html = readFileSync(join(process.cwd(), 'public/borimsa.html'), 'utf-8')
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
