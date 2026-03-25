import { NextRequest, NextResponse } from 'next/server';

const DOMAIN_MAP: Record<string, string> = {
  'xn--z92bu3hg5a.com': 'munsusa',
  'xn--z92bu3hg5a.kr': 'munsusa',
  'munsusa.com': 'munsusa',
  'borimsa.com': 'borimsa',
  'chunkwansa.com': 'chunkwansa',
};

const PLATFORM_DOMAINS = ['k-buddhism.vercel.app', 'k-buddhism.com'];
// k-buddhism.kr 루트: PLATFORM_DOMAINS에서 제외 → Next.js 기본 라우팅(사찰 목록/랜딩)으로 처리
const EXCLUDED_PATHS = ['/api/', '/_next/', '/_vercel/', '/favicon.ico', '/robots.txt'];
const STATIC_EXT = /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf|eot|mp[34]|webm|pdf)$/i;
// Vercel 배포 도메인은 플랫폼 도메인으로 처리 (서브도메인 오탐 방지)
const PLATFORM_SUFFIXES = ['.vercel.app', '.now.sh'];

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
  } catch { return null; }
}

async function extractTempleCode(hostname: string, url: URL): Promise<string | null> {
  const host = hostname.split(':')[0].toLowerCase();
  const cleanHost = host.startsWith('www.') ? host.slice(4) : host;
  if (host === 'localhost' || host === '127.0.0.1') return url.searchParams.get('site');
  if (PLATFORM_DOMAINS.includes(cleanHost)) return null;
  if (PLATFORM_SUFFIXES.some(s => cleanHost.endsWith(s))) return null;

  // ── k-buddhism.kr 서브도메인 라우팅 ──────────────────────────────────────
  // borimsa.k-buddhism.kr → slug = 'borimsa'  (DB에 없으면 [slug]/page.tsx에서 404)
  // 향후 새 사찰은 DB 등록만으로 자동 라우팅, middleware 수정 불필요
  if (cleanHost.endsWith('.k-buddhism.kr')) {
    const sub = cleanHost.split('.')[0];
    if (sub && sub !== 'www') return sub;
  }
  // ─────────────────────────────────────────────────────────────────────────

  const kvResult = await lookupKV(cleanHost);
  if (kvResult) return kvResult;
  if (DOMAIN_MAP[cleanHost]) return DOMAIN_MAP[cleanHost];
  const parts = cleanHost.split('.');
  if (parts.length >= 3 && parts[0] !== 'www') return parts[0];
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  for (const p of EXCLUDED_PATHS) if (pathname.startsWith(p)) return NextResponse.next();
  if (STATIC_EXT.test(pathname)) return NextResponse.next();
  if (pathname.startsWith('/_sites/') || pathname.startsWith('/admin')) return NextResponse.next();

  const hostname = request.headers.get('host') || '';
  const templeCode = await extractTempleCode(hostname, request.nextUrl);
  if (!templeCode) return NextResponse.next();

  const url = request.nextUrl.clone();
  // /_sites/ 대신 /[slug] 라우트로 직접 rewrite
  url.pathname = `/${templeCode}${pathname === '/' ? '' : pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set('x-temple-code', templeCode);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot|mp4|webm|mp3|pdf)$).*)'],
};
