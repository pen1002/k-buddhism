// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const indungType = z.object({
  label:  z.string(),
  amount: z.string(),
  period: z.string().optional(),
});

const historyItem = z.object({
  year:  z.string(),
  event: z.string(),
});

const eventItem = z.object({
  name:     z.string(),
  schedule: z.string().optional(),
  time:     z.string().optional(),
  location: z.string().optional(),
  note:     z.string().optional(),
  category: z.enum(['monthly','seasonal','special']).optional(),
  emoji:    z.string().optional(),
});

const contactSchema = z.union([
  z.string(),
  z.object({
    mobile:  z.string().optional(),
    phone:   z.string().optional(),
    email:   z.string().optional(),
    kakao:   z.string().optional(),
    website: z.string().optional(),
  }),
]);

const addressSchema = z.union([
  z.string(),
  z.object({
    full:    z.string().optional(),
    road:    z.string().optional(),
    postal:  z.string().optional(),
    map_url: z.string().optional(),
  }),
]);

const temples = defineCollection({
  type: 'content',
  schema: z.object({
    /* ── 필수 ── */
    title:  z.string(),
    name:   z.string(),
    sect:   z.string(),
    slogan: z.string(),

    /* ── 기본 ── */
    name_hanja:  z.string().optional(),
    description: z.string().optional(),
    greeting:    z.string().optional(),
    greeting_sig:z.string().optional(),
    monk:        z.string().optional(),
    monk_title:  z.string().optional(),
    founded:     z.string().optional(),
    main_buddha: z.string().optional(),
    buildings:   z.string().optional(),

    /* ── 미디어 ── */
    hero_image:  z.string().optional(),
    gallery_imgs:z.array(z.string()).optional(),
    gallery: z.array(z.object({
      id:  z.string(),
      cap: z.string().optional(),
      sub: z.string().optional(),
      tag: z.string().optional(),
    })).optional(),

    /* ── 연락처/주소 ── */
    contact: contactSchema.optional(),
    address: addressSchema.optional(),

    /* ── 컨텐츠 ── */
    history: z.array(historyItem).optional(),
    events:  z.array(eventItem).optional(),

    /* ── 인등불사 ── */
    indung: z.object({
      title:    z.string().optional(),
      subtitle: z.string().optional(),
      types:    z.array(indungType).optional(),
      bank:     z.string().optional(),
      account:  z.string().optional(),
      holder:   z.string().optional(),
      note:     z.string().optional(),
      kakao_url:z.string().optional(),
      naver_url:z.string().optional(),
      toss_url: z.string().optional(),
    }).optional(),

    /* ── 외부 링크 ── */
    blog_url:    z.string().optional(),
    youtube_url: z.string().optional(),

    /* ── 분류 ── */
    region:    z.string().optional(),
    district:  z.string().optional(),
    order_num: z.number().optional(),
    tags:      z.array(z.string()).optional(),
    active:    z.boolean().optional().default(true),
    updated:   z.string().optional(),
    ui_type:   z.number().optional().default(1),
  }),
});

export const collections = { temples };
export type TempleData = z.infer<typeof temples.schema> & { body?: string };
