import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// 108사찰 Multi-tenant Middleware
// - hostname 기반 사찰 코드 추출
// - /_sites/[site]/... 경로로 rewrite
// - www 제거, localhost 예외처리, Punycode(한글도메인) 지원
// ============================================================

// ---- 도메인 → 사찰코드 정적 매핑 테이블 ----
// Vercel KV 또는 DB 연동 전까지 fallback으로 사용
const DOMAIN_MAP: Record<string, string> = {
  // 한글 도메인 (Punycode 변환된 형태)
  'xn--z92bu3hg5a.com': 'munsusa',         // 문수사.com
  'xn--z92bu3hg5a.kr': 'munsusa',          // 문수사.kr
  // 영문 도메인
  'munsusa.com': 'munsusa',
  'borimsa.com': 'borimsa',
  'chunkwansa.com': 'chunkwansa',
  // ---- 아래에 사찰 추가 ----
  // 'haeinsa.com': 'haeinsa',
  // 'bulguksa.com': 'bulguksa',
  // 'tongdosa.com': 'tongdosa',
};

// ---- 플랫폼(허브) 도메인 목록 ----
// 이 도메인으로 접속하면 rewrite 하지 않고 메인 허브 페이지를 보여줌
const PLATFORM_DOMAINS = [
  'k-buddhism.vercel.app',
  'k-buddhism.com',
  'k-buddhism.kr',
  'saju-temple.vercel.app',
];

// ---- 미들웨어에서 제외할 경로 패턴 ----
const EXCLUDED_PATHS = [
  '/api/',         // API 라우트
  '/_next/',       // Next.js 내부 에셋
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/_vercel/',     // Vercel 내부
  '/admin/',       // 관리자 대시보드 (별도 라우팅)
];

// ---- 정적 파일 확장자 ----
const STATIC_FILE_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
  '.css', '.js', '.woff', '.woff2', '.ttf', '.eot',
  '.mp4', '.webm', '.mp3', '.pdf',
];

/**
 * hostname에서 사찰 코드를 추출하는 핵심 함수
 *
 * 우선순위:
 * 1. DOMAIN_MAP 정적 매핑 (즉시 반환)
 * 2. 서브도메인 기반 추출 (munsusa.k-buddhism.com → munsusa)
 * 3. null 반환 (매핑 실패)
 */
function extractTempleCode(hostname: string): string | null {
  // 포트 번호 제거 (localhost:3000 → localhost)
  const host = hostname.split(':')[0].toLowerCase();

  // 1) www 제거
  const cleanHost = host.startsWith('www.') ? host.slice(4) : host;

  // 2) 플랫폼(허브) 도메인이면 null (메인 페이지 표시)
  if (PLATFORM_DOMAINS.includes(cleanHost)) {
    return null;
  }

  // 3) 정적 매핑 테이블에서 조회
  if (DOMAIN_MAP[cleanHost]) {
    return DOMAIN_MAP[cleanHost];
  }

  // 4) 서브도메인 기반 추출
  //    예: munsusa.k-buddhism.com → munsusa
  //    예: munsusa.k-buddhism.vercel.app → munsusa
  const parts = cleanHost.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // 'www'가 아닌 서브도메인이면 사찰 코드로 간주
    if (subdomain !== 'www') {
      return subdomain;
    }
  }

  // 5) 매핑 실패
  return null;
}

/**
 * 개발 환경(localhost) 처리
 * - localhost 접속 시 쿼리 파라미터 ?site=munsusa 로 사찰 지정 가능
 * - 기본값: null (허브 메인 표시)
 */
function getDevTempleCode(request: NextRequest): string | null {
  const siteParam = request.nextUrl.searchParams.get('site');
  return siteParam || null;
}

/**
 * 경로가 미들웨어 처리 대상인지 확인
 */
function shouldProcess(pathname: string): boolean {
  // 제외 경로 체크
  for (const excluded of EXCLUDED_PATHS) {
    if (pathname.startsWith(excluded)) {
      return false;
    }
  }

  // 정적 파일 체크
  for (const ext of STATIC_FILE_EXTENSIONS) {
    if (pathname.endsWith(ext)) {
      return false;
    }
  }

  return true;
}

// ============================================================
// Middleware 본체
// ============================================================
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) 처리 대상이 아닌 경로는 패스
  if (!shouldProcess(pathname)) {
    return NextResponse.next();
  }

  // 2) 이미 /_sites/ 경로면 패스 (무한 루프 방지)
  if (pathname.startsWith('/_sites/')) {
    return NextResponse.next();
  }

  const hostname = request.headers.get('host') || '';
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // 3) 사찰 코드 추출
  let templeCode: string | null;

  if (isLocalhost) {
    templeCode = getDevTempleCode(request);
  } else {
    templeCode = extractTempleCode(hostname);
  }

  // 4) 사찰 코드가 없으면 허브 메인 페이지로 (rewrite 없이 통과)
  if (!templeCode) {
    return NextResponse.next();
  }

  // 5) 사찰별 경로로 rewrite
  //    / → /_sites/munsusa
  //    /about → /_sites/munsusa/about
  //    /gallery/1 → /_sites/munsusa/gallery/1
  const rewritePath = `/_sites/${templeCode}${pathname === '/' ? '' : pathname}`;

  const url = request.nextUrl.clone();
  url.pathname = rewritePath;

  // 6) 사찰 코드를 헤더에 추가 (서버 컴포넌트에서 활용 가능)
  const response = NextResponse.rewrite(url);
  response.headers.set('x-temple-code', templeCode);
  response.headers.set('x-temple-hostname', hostname);

  return response;
}

// ============================================================
// Matcher 설정
// - 정적 에셋과 내부 경로를 제외하여 성능 최적화
// ============================================================
export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 요청에 미들웨어 적용:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     * - public 폴더 정적 에셋
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot|mp4|webm|mp3|pdf)$).*)',
  ],
};
