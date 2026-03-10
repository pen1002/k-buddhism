// ============================================================
// STEP 1: src/content/config.ts 에 아래 한 줄 추가
// 기존 ui_type 줄 바로 아래에 붙여넣기
// ============================================================

// 기존 코드 (변경 없음):
//   ui_type: z.number().optional().default(1),

// ✅ 추가할 코드:
//   layout: z.enum(['template', 'custom']).optional().default('template'),

// 전체 예시:
import { defineCollection, z } from 'astro:content'

const temples = defineCollection({
  type: 'content',
  schema: z.object({
    title:   z.string(),
    name:    z.string().optional(),
    sect:    z.string().optional(),
    slogan:  z.string().optional(),
    ui_type: z.number().optional().default(1),
    layout:  z.enum(['template', 'custom']).optional().default('template'), // ✅ 새로 추가
    active:  z.boolean().optional().default(true),
    hero_image: z.string().optional(),
    contact: z.object({
      mobile:  z.string().optional(),
      phone:   z.string().optional(),
      email:   z.string().optional(),
      kakao:   z.string().optional(),
      website: z.string().optional(),
    }).optional(),
    address: z.object({
      full:    z.string().optional(),
      road:    z.string().optional(),
      postal:  z.string().optional(),
      map_url: z.string().optional(),
    }).optional(),
    gallery: z.array(z.object({
      id:  z.string(),
      cap: z.string().optional(),
      sub: z.string().optional(),
      tag: z.string().optional(),
    })).optional(),
    history: z.array(z.object({
      year:  z.union([z.string(), z.number()]),
      event: z.string(),
    })).optional(),
    events: z.array(z.object({
      name:     z.string(),
      schedule: z.string().optional(),
      time:     z.string().optional(),
      location: z.string().optional(),
      note:     z.string().optional(),
      category: z.string().optional(),
      emoji:    z.string().optional(),
    })).optional(),
    indung: z.object({
      title:    z.string().optional(),
      subtitle: z.string().optional(),
      types:    z.array(z.object({
        label:  z.string(),
        amount: z.string(),
        period: z.string().optional(),
      })).optional(),
      bank:      z.string().optional(),
      account:   z.string().optional(),
      holder:    z.string().optional(),
      note:      z.string().optional(),
      kakao_url: z.string().optional(),
      naver_url: z.string().optional(),
      toss_url:  z.string().optional(),
    }).optional(),
  }),
})

export const collections = { temples }
