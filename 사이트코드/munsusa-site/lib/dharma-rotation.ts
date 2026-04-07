/**
 * lib/dharma-rotation.ts
 * 일일 법문 자동 순환 시스템 (법륜 로직)
 *
 * 1. 불교 기념일이면 → 기념일 전용 법문
 * 2. 아니면 → Day of Year + 사찰 오프셋으로 순환
 *
 * 사찰별 오프셋: 같은 날에도 사찰마다 다른 법문 표시
 * 문수사=0, 보림사=52, 천관사=104, 해인사=156, 통도사=208
 * (365/7 ≈ 52 간격으로 균등 분배)
 */

import { db } from '@/lib/db'

export interface DharmaData {
  text: string
  source: string
  category: string
  isSpecial: boolean
}

// 사찰별 오프셋
function getTempleOffset(slug: string): number {
  const KNOWN_OFFSETS: Record<string, number> = {
    munsusa:   0,
    borimsa:   52,
    chunkwansa: 104,
    haeinsa:   156,
    tongdosa:  208,
  }
  if (KNOWN_OFFSETS[slug] !== undefined) return KNOWN_OFFSETS[slug]

  // 미등록 사찰: slug 해시로 0~364 오프셋 자동 생성
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 365
}

// Day of Year 계산 (1~365)
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// MM-DD 형식
function getMMDD(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}-${dd}`
}

const FALLBACK: DharmaData = {
  text: '마음이 곧 부처요, 부처가 곧 마음이니라.',
  source: '육조단경',
  category: 'wisdom',
  isSpecial: false,
}

/**
 * 오늘의 법문 가져오기
 * @param templeSlug 사찰 코드 (예: "munsusa")
 */
export async function getTodayDharma(templeSlug: string): Promise<DharmaData> {
  const today = new Date()

  // 1. 불교 기념일 체크 (우선)
  const special = await db.dharmaQuote.findFirst({
    where: { isSpecial: true, specialDate: getMMDD(today) },
  })
  if (special) {
    return {
      text: special.text,
      source: special.source ?? '',
      category: special.category ?? '',
      isSpecial: true,
    }
  }

  // 2. Day of Year + 사찰 오프셋으로 순환 선택 (현재 30개 기준)
  const dayOfYear = getDayOfYear(today)
  const offset = getTempleOffset(templeSlug)
  const targetDay = ((dayOfYear + offset - 1) % 30) + 1

  const quote = await db.dharmaQuote.findFirst({
    where: { dayIndex: targetDay },
  })
  if (quote) {
    return {
      text: quote.text,
      source: quote.source ?? '',
      category: quote.category ?? '',
      isSpecial: false,
    }
  }

  return FALLBACK
}
