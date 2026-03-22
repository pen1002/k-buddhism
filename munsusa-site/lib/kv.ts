// Vercel KV 도메인 캐시
// domain:munsusa.com → "munsusa" 형태로 저장

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function kvFetch(path: string, options?: RequestInit) {
  if (!KV_URL || !KV_TOKEN) throw new Error('KV 환경변수 미설정');
  return fetch(`${KV_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

export async function getKV(key: string): Promise<string | null> {
  try {
    const res = await kvFetch(`/get/${key}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.result || null;
  } catch {
    return null;
  }
}

export async function setKV(key: string, value: string, ttlSeconds?: number): Promise<void> {
  const path = ttlSeconds ? `/set/${key}?EX=${ttlSeconds}` : `/set/${key}`;
  await kvFetch(path, {
    method: 'POST',
    body: JSON.stringify(value),
  });
}

export async function deleteKV(key: string): Promise<void> {
  await kvFetch(`/del/${key}`, { method: 'POST' });
}

// 도메인 → 사찰코드 매핑 헬퍼
export const domainKey = (domain: string) => `domain:${domain}`;

export async function setDomainMapping(domain: string, templeCode: string): Promise<void> {
  await setKV(domainKey(domain), templeCode);
}

export async function getDomainMapping(domain: string): Promise<string | null> {
  return getKV(domainKey(domain));
}

export async function deleteDomainMapping(domain: string): Promise<void> {
  await deleteKV(domainKey(domain));
}
