// ============================================================
// 108사찰 Multi-tenant Vercel Edge Middleware
// (Astro/프레임워크 독립 — Vercel Edge Functions 표준 API 사용)
//
// 역할: hostname → 사찰코드 → /_sites/[site]/... rewrite
// ============================================================

// ---- 도메인 → 사찰코드 정적 매핑 ----
const DOMAIN_MAP = {
  // 한글 도메인 (Punycode)
  'xn--z92bu3hg5a.com': 'munsusa',         // 문수사.com
  'xn--z92bu3hg5a.kr': 'munsusa',          // 문수사.kr
  // 영문 도메인
  'munsusa.com': 'munsusa',
  'borimsa.com': 'borimsa',
  'chunkwansa.com': 'chunkwansa',
  // ---- 사찰 추가 시 여기에 ----
};

// ---- 플랫폼(허브) 도메인 — rewrite 하지 않음 ----
const PLATFORM_DOMAINS = [
  'k-buddhism.vercel.app',
  'k-buddhism.com',
  'k-buddhism.kr',
  'saju-temple.vercel.app',
];

// ---- 미들웨어 제외 경로 ----
const EXCLUDED_PREFIXES = [
  '/api/', '/_next/', '/_vercel/', '/admin/',
  '/favicon.ico', '/robots.txt', '/sitemap.xml',
];

const STATIC_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf|eot|mp[34]|webm|pdf)$/i;

/**
 * hostname → 사찰 코드
 */
function extractTempleCode(hostname, url) {
  const host = hostname.split(':')[0].toLowerCase();
  const cleanHost = host.startsWith('www.') ? host.slice(4) : host;

  // localhost — ?site= 쿼리 파라미터로 사찰 지정
  if (host === 'localhost' || host === '127.0.0.1') {
    return url.searchParams.get('site') || null;
  }

  // 플랫폼 도메인이면 null
  if (PLATFORM_DOMAINS.includes(cleanHost)) {
    return null;
  }

  // 정적 매핑
  if (DOMAIN_MAP[cleanHost]) {
    return DOMAIN_MAP[cleanHost];
  }

  // 서브도메인 추출: munsusa.k-buddhism.com → munsusa
  const parts = cleanHost.split('.');
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0];
  }

  return null;
}

/**
 * 경로가 처리 대상인지 확인
 */
function shouldProcess(pathname) {
  for (const prefix of EXCLUDED_PREFIXES) {
    if (pathname.startsWith(prefix)) return false;
  }
  if (STATIC_EXTENSIONS.test(pathname)) return false;
  return true;
}

// ============================================================
// Middleware 본체 (Vercel Edge Function 표준)
// ============================================================
export default async function middleware(request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // 1) 제외 대상이면 패스
  if (!shouldProcess(pathname)) return;

  // 2) 이미 /_sites/ 경로면 패스 (무한루프 방지)
  if (pathname.startsWith('/_sites/')) return;

  const hostname = request.headers.get('host') || '';

  // 3) 사찰 코드 추출
  const templeCode = extractTempleCode(hostname, url);

  // 4) 사찰 코드 없으면 허브 메인 → 기존 Astro 라우팅 사용
  if (!templeCode) return;

  // 5) /_sites/[사찰코드]/... 로 rewrite
  //    현재 Astro 구조 호환: /munsusa, /borimsa 등 기존 경로로도 매핑
  //    Phase 2 (Next.js 전환 후)에는 /_sites/[site]/... 구조 사용
  const rewritePath = `/${templeCode}${pathname === '/' ? '' : pathname}`;
  url.pathname = rewritePath;

  // 사찰 코드를 헤더에 실어서 전달
  const newRequest = new Request(url.toString(), request);
  const response = await fetch(newRequest);

  // 응답에 사찰 메타 헤더 추가
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('x-temple-code', templeCode);
  newResponse.headers.set('x-temple-hostname', hostname);

  return newResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot|mp4|webm|mp3|pdf)$).*)',
  ],
};
