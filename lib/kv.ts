import { kv } from '@vercel/kv';
import { prisma } from './db';

// ============================================================
// Vercel KV — 도메인 → 사찰코드 매핑 캐시
// DB에서 도메인 매핑을 읽어 KV에 캐싱
// 미들웨어(Edge)에서 빠르게 조회
// ============================================================

const KV_PREFIX = 'domain:';
const KV_TTL = 60 * 60; // 1시간

/**
 * KV에서 도메인 → 사찰 코드 조회
 * KV 미설정 시 null 반환 (fallback 매핑 사용)
 */
export async function getTempleCodeFromKV(domain: string): Promise<string | null> {
  try {
    const code = await kv.get<string>(`${KV_PREFIX}${domain}`);
    return code;
  } catch {
    // KV 미설정 또는 오류 시 null
    return null;
  }
}

/**
 * KV에 도메인 → 사찰 코드 매핑 저장
 */
export async function setTempleCodeInKV(domain: string, templeCode: string): Promise<void> {
  try {
    await kv.set(`${KV_PREFIX}${domain}`, templeCode, { ex: KV_TTL });
  } catch {
    // KV 미설정 시 무시
  }
}

/**
 * DB의 모든 도메인 매핑을 KV에 동기화
 * API 엔드포인트나 cron job에서 호출
 */
export async function syncDomainMappingsToKV(): Promise<number> {
  const mappings = await prisma.domainMap.findMany({
    include: { temple: { select: { code: true } } },
  });

  let count = 0;
  for (const mapping of mappings) {
    await setTempleCodeInKV(mapping.domain, mapping.temple.code);
    count++;
  }

  // subdomain 매핑도 추가
  const temples = await prisma.temple.findMany({
    where: { isActive: true },
    select: { code: true, customDomain: true, subdomain: true },
  });

  for (const temple of temples) {
    if (temple.customDomain) {
      await setTempleCodeInKV(temple.customDomain, temple.code);
      count++;
    }
    if (temple.subdomain) {
      // munsusa → munsusa.k-buddhism.com
      await setTempleCodeInKV(`${temple.subdomain}.k-buddhism.com`, temple.code);
      count++;
    }
  }

  return count;
}

/**
 * 특정 도메인의 KV 캐시 삭제
 */
export async function invalidateDomainKV(domain: string): Promise<void> {
  try {
    await kv.del(`${KV_PREFIX}${domain}`);
  } catch {
    // 무시
  }
}
