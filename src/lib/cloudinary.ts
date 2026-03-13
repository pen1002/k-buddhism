// src/lib/cloudinary.ts
const CLOUD = 'db3izttcy';
const BASE  = `https://res.cloudinary.com/${CLOUD}/image/upload`;

export const cl = (id: string, t = '') =>
  id ? `${BASE}/${t}/${id}` : '';

export const hero    = (id: string) => cl(id, 'q_auto,f_auto,w_1920');
export const blur    = (id: string) => cl(id, 'e_blur:800,q_auto,f_auto,w_40');
export const gallery = (id: string, w = 800, h = 600) =>
  cl(id, `q_auto,f_auto,w_${w},h_${h},c_fill`);
export const thumb   = (id: string, s = 200) =>
  cl(id, `q_auto,f_auto,w_${s},h_${s},c_fill`);

export const parseGallery = (
  ids: string[],
  caps?: string[],
): Array<{ id: string; src: string; cap: string; sub: string }> =>
  ids.map((id, i) => ({
    id,
    src: gallery(id),
    cap: caps?.[i] ?? '',
    sub: '',
  }));

/* contact 문자열 / 객체 → 정규화 */
export const parseContact = (
  raw: string | Record<string, string | undefined> | undefined,
): { mobile?: string; phone?: string; email?: string; kakao?: string; website?: string } => {
  if (!raw) return {};
  if (typeof raw === 'object') return raw as any;
  const mobM = raw.match(/01[016789]-?\d{3,4}-?\d{4}/);
  const phnM = raw.match(/0[2-9][0-9]-?\d{3,4}-?\d{4}/);
  const emlM = raw.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  return {
    mobile: mobM?.[0],
    phone:  phnM?.[0],
    email:  emlM?.[0],
  };
};

/* address 문자열 / 객체 → 정규화 */
export const parseAddress = (
  raw: string | Record<string, string | undefined> | undefined,
): { full?: string; postal?: string; map_url?: string } => {
  if (!raw) return {};
  if (typeof raw === 'object') return raw as any;
  const postalM = raw.match(/\d{5}/);
  const mapM    = raw.match(/https?:\/\/\S+/);
  const full    = raw
    .replace(/\s*\(.*?\)/g, '')
    .replace(/우\)\s*\d{5}/g, '')
    .trim();
  return { full, postal: postalM?.[0], map_url: mapM?.[0] };
};
