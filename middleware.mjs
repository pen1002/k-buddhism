export default async function middleware(request) {
  const url = new URL(request.url);
  const hostname = request.headers.get('host') || '';

  // 문수사.com (Punycode: xn--z92bu3hg5a.com) 도메인이면
  // 루트(/) 접속 시 /munsusa 콘텐츠로 리라이트
  if (url.pathname === '/' && hostname.includes('xn--z92bu3hg5a')) {
    url.pathname = '/munsusa';
    return fetch(new Request(url, request));
  }
}

export const config = {
  matcher: ['/'],
};
