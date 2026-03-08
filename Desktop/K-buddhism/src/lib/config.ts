// src/content/config.ts
// ══════════════════════════════════════════════════════════════════════
//  Temple Hub · Content Collection 스키마 정의
//  ✅ cheongwansa.md 실제 포맷과 100% 호환
//  ✅ 모든 선택 필드는 .optional() — 스키마 오류 없이 바로 배포 가능
//  ✅ contact/address 를 문자열 OR 객체 모두 허용 (z.union)
// ══════════════════════════════════════════════════════════════════════
import { defineCollection, z } from 'astro:content';

// ── 이벤트/법회 아이템 ─────────────────────────────────────────────────
const eventSchema = z.object({
  name:     z.string(),
  schedule: z.string().optional(),  // "매월 첫째일요일"
  time:     z.string().optional(),  // "오전 10시 30분"
  location: z.string().optional(),
  note:     z.string().optional(),
});

// ── 연혁 아이템 ────────────────────────────────────────────────────────
const historySchema = z.object({
  year:  z.string(),
  event: z.string(),
});

// ── 인등 종류 아이템 ───────────────────────────────────────────────────
const indungTypeSchema = z.object({
  label:  z.string(),   // "연간등", "칠일등"
  amount: z.string(),   // "100,000원"
  period: z.string().optional(),
});

// ── 인등불사 블록 ──────────────────────────────────────────────────────
const indungSchema = z.object({
  title:    z.string().optional(),
  subtitle: z.string().optional(),
  types:    z.array(indungTypeSchema).optional(),
  bank:     z.string().optional(),    // "농협"
  account:  z.string().optional(),    // "351-0001-2345-03"
  holder:   z.string().optional(),    // "천관사"
  note:     z.string().optional(),
}).optional();

// ── 주소 (문자열 OR 객체) ──────────────────────────────────────────────
// cheongwansa.md: address: "전남 장흥군 관산읍..." (단순 문자열)
// 상세 버전:       address: { full: "...", postal: "59351", map_url: "..." }
const addressSchema = z.union([
  z.string(),
  z.object({
    full:    z.string(),
    postal:  z.string().optional(),
    map_url: z.string().url().optional(),
    road:    z.string().optional(),
    jibun:   z.string().optional(),
  }),
]).optional();

// ── 연락처 (문자열 OR 객체) ────────────────────────────────────────────
// cheongwansa.md: contact: "010-8230-7070, 061-867-2954"
// 상세 버전:       contact: { mobile: "010-...", phone: "061-..." }
const contactSchema = z.union([
  z.string(),
  z.object({
    mobile:  z.string().optional(),
    phone:   z.string().optional(),
    email:   z.string().email().optional(),
    fax:     z.string().optional(),
    kakao:   z.string().optional(),
    website: z.string().url().optional(),
  }),
]).optional();

// ── 메인 사찰 스키마 ──────────────────────────────────────────────────
const templeSchema = z.object({
  // ── 필수 ──
  title:       z.string(),                    // SEO 타이틀
  name:        z.string(),                    // 사찰명 "천관사"
  sect:        z.string(),                    // 종단 "조계종 제21교구"
  slogan:      z.string(),                    // 슬로건

  // ── 거의 필수 ──
  description: z.string().optional(),         // 소개 본문
  monk:        z.string().optional(),         // "주지 연등스님"
  monk_title:  z.string().optional(),         // "주지" (기본값)
  hero_image:  z.string().optional(),         // Cloudinary public ID

  // ── 선택: 이름/식별 ──
  name_hanja:  z.string().optional(),         // "天冠寺"
  name_en:     z.string().optional(),         // "Cheongwansa"
  founded:     z.string().optional(),         // "759년 창건"
  main_buddha: z.string().optional(),         // "석가모니불"

  // ── 선택: 갤러리 ──
  // cheongwansa.md: gallery_imgs: ["id1", "id2", ...]  (Cloudinary IDs)
  gallery_imgs: z.array(z.string()).optional(),

  // 상세 갤러리 (캡션 포함)
  gallery: z.array(z.object({
    id:  z.string(),
    cap: z.string().optional(),
    sub: z.string().optional(),
  })).optional(),

  // ── 선택: 연혁 ──
  history:     z.array(historySchema).optional(),

  // ── 선택: 행사/법회 ──
  events:      z.array(eventSchema).optional(),

  // ── 선택: 인등불사 ──
  indung:      indungSchema,

  // ── 선택: 인사말 ──
  greeting:    z.string().optional(),
  greeting_sig: z.string().optional(),

  // ── 선택: 전각 ──
  buildings:   z.string().optional(),         // "대웅전 · 지장전 · 삼성각"

  // ── 선택: 주소/연락처 ──
  address:     addressSchema,
  contact:     contactSchema,

  // ── 선택: 외부 링크 ──
  blog_url:    z.string().optional(),
  youtube_url: z.string().optional(),

  // ── 선택: SEO ──
  og_image:    z.string().optional(),

  // ── 선택: 템플허브 내부 ──
  region:      z.string().optional(),         // "전남" (지역 필터링용)
  district:    z.string().optional(),         // "장흥군"
  order_num:   z.number().optional(),         // 교구 번호 21
  tags:        z.array(z.string()).optional(), // ["문화재","템플스테이"]
  active:      z.boolean().optional().default(true), // 공개 여부
  updated:     z.string().optional(),         // "2026-03-07"
});

// ── Collection 등록 ────────────────────────────────────────────────────
export const collections = {
  temples: defineCollection({
    type:   'content',
    schema: templeSchema,
  }),
};

// ── 타입 익스포트 ──────────────────────────────────────────────────────
export type TempleData    = z.infer<typeof templeSchema>;
export type EventItem     = z.infer<typeof eventSchema>;
export type HistoryItem   = z.infer<typeof historySchema>;
export type IndungType    = z.infer<typeof indungTypeSchema>;
