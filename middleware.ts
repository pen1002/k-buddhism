import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// 108사찰 Multi-tenant Middleware + Vercel KV 통합
// ============================================================

// ---- 정적 매핑 (KV 장애 시 fallback / KV 미설정 환경) ----
const DOMAIN_MAP: Record<string, string> = {
  'xn--z92bu3hg5a.com': 'munsusa',
  'xn--z92bu3hg5a.kr': 'munsusa',
  'munsusa.com': 'munsusa',
  'borimsa.com': 'borimsa',
  'chunkwansa.com': 'chunkwansa',
};

const PLATFORM_DOMAINS = [
  'k-buddhism.vercel.app',
  'k-buddhism.com',
  'k-buddhism.kr',
  'saju-temple.vercel.app',
];

const EXCLUDED_PATHS = [
  '/api/', '/_next/', '/_vercel/',
  '/favicon.ico', '/robots.txt', '/sitemap.xml',
];

const STATIC_EXT = /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf|eot|mp[34]|webm|pdf)$/i;

/**
 * Vercel KV에서 도메인 → 사찰 코드 조회 (Edge Runtime 호환)
 * KV_REST_API_URL / KV_REST_API_TOKEN 환경변수 필요
 */
async function lookupKV(domain: string): Promise<string | null> {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) return null;

  try {
    const res = await fetch(`${kvUrl}/get/domain:${domain}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result || null;
  } catch {
    return null;
  }
}

/**
 * hostname → 사찰 코드 추출
 * 우선순위: KV → 정적 매핑 → 서브도메인
 */
async function extractTempleCode(hostname: string, url: URL): Promise<string | null> {
  const host = hostname.split(':')[0].toLowerCase();
  const cleanHost = host.startsWith('www.') ? host.slice(4) : host;

  // localhost 개발 환경
  if (host === 'localhost' || host === '127.0.0.1') {
    return url.searchParams.get('site') || null;
  }

  // 플랫폼 도메인
  if (PLATFORM_DOMAINS.includes(cleanHost)) {
    return null;
  }

  // 1) Vercel KV 조회 (배포 없이 도메인 매핑 변경 가능)
  const kvResult = await lookupKV(cleanHost);
  if (kvResult) return kvResult;

  // 2) 정적 매핑 fallback
  if (DOMAIN_MAP[cleanHost]) {
    return DOMAIN_MAP[cleanHost];
  }

  // 3) 서브도메인 추출: munsusa.k-buddhism.com → munsusa
  const parts = cleanHost.split('.');
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0];
  }

  return null;
}

function shouldProcess(pathname: string): boolean {
  for (const prefix of EXCLUDED_PATHS) {
    if (pathname.startsWith(prefix)) return false;
  }
  if (STATIC_EXT.test(pathname)) return false;
  return true;
}

// ============================================================
// Middleware
// ============================================================
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!shouldProcess(pathname)) return NextResponse.next();
  if (pathname.startsWith('/_sites/')) return NextResponse.next();

  // /admin 경로는 별도 처리 (RBAC는 admin 레이아웃에서)
  if (pathname.startsWith('/admin')) return NextResponse.next();

  const hostname = request.headers.get('host') || '';
  const templeCode = await extractTempleCode(hostname, request.nextUrl);

  if (!templeCode) return NextResponse.next();

  // /_sites/[site]/... 로 rewrite
  const url = request.nextUrl.clone();
  url.pathname = `/_sites/${templeCode}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.rewrite(url);
  response.headers.set('x-temple-code', templeCode);
  response.headers.set('x-temple-hostname', hostname);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot|mp4|webm|mp3|pdf)$).*)',
  ],
};
