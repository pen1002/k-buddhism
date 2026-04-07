/**
 * lib/temple-seed.ts
 * 1080사찰 표준 설계도 — AI 자동 장엄 (Content Filling)
 *
 * 원칙: "비어 있는 전각은 없다"
 * 새 사찰 등록 시 AI가 자동 생성한 콘텐츠로 12대 전각을 채운다.
 * 관리자가 직접 입력 시 즉시 Override.
 */

import { db } from '@/lib/db'

export interface TempleSeedInput {
  code: string
  name: string
  denomination?: string
  address?: string
  founded?: string
  phone?: string
  primaryColor?: string
  secondaryColor?: string
}

// ── 표준 법회 일정 (조계종 기준) ────────────────────────────────────────────
function buildDefaultEvents(name: string) {
  return [
    {
      icon: '🌕', tag: '정기법회', title: '초하루·보름 법회',
      desc: '매월 음력 1일·15일 오전 10:00\n관음보살 기도 및 스님 법문',
      meta: '정기법회 · 무료', schedule: 'monthly', isRecurring: true,
    },
    {
      icon: '🪔', tag: '기념법회', title: '부처님 오신 날',
      desc: `${name}의 연등 행렬과 대법회`,
      meta: '음력 4월 8일 · 연 1회',
      schedule: 'lunar-range', lunarMonth: '4', lunarStart: '8', lunarEnd: '8',
    },
    {
      icon: '📿', tag: '기도', title: '관음재일 기도',
      desc: '매월 음력 24일 관음보살 기도',
      meta: '정기기도 · 무료', schedule: 'monthly', isRecurring: true,
    },
  ]
}

// ── 표준 기도불사 4탭 ────────────────────────────────────────────────────────
function buildDefaultOfferings(name: string) {
  return {
    plans: [
      { icon: '🕯️', name: '연등 불사', price: '₩150,000', desc: `${name} 대웅전 연등\n매일 법회 시 스님이 직접 독송` },
      { icon: '📿', name: '백일기도', price: '₩100,000', desc: '백일 간 매일 기도\n분기별 회향 증명서 발송' },
      { icon: '🙏', name: '일년기도', price: '₩300,000', desc: '일 년 기도 등록\n정기 법회 우선 참석권' },
      { icon: '🌱', name: '땅 한 평 사기', price: '₩200,000', desc: '도량 수호 불사 동참\n영구 법인 명부 등재' },
    ],
  }
}

// ── 공통 FAQ 7문항 ────────────────────────────────────────────────────────────
function buildDefaultFaq(name: string, denomination: string) {
  return [
    { q: `${name}은(는) 어떤 사찰인가요?`, a: `${name}은(는) ${denomination} 소속 사찰로, 부처님의 가르침을 전하고 지역사회와 함께하는 열린 도량입니다.` },
    { q: '법회는 언제 하나요?', a: '매월 음력 초하루(1일)와 보름(15일) 오전 10시에 정기법회를 봉행합니다.' },
    { q: '기도 신청은 어떻게 하나요?', a: '종무소 전화 또는 홈페이지 기도불사 동참 항목에서 신청하실 수 있습니다.' },
    { q: '주차는 가능한가요?', a: '사찰 입구 주차장을 이용하실 수 있습니다. 명절·대법회 기간에는 혼잡할 수 있습니다.' },
    { q: '템플스테이 프로그램이 있나요?', a: '계절별 프로그램이 운영됩니다. 자세한 일정은 종무소로 문의 바랍니다.' },
    { q: '후원은 어떻게 하나요?', a: '홈페이지의 나눔동참 메뉴 또는 종무소로 문의 주시면 안내해 드립니다.' },
    { q: '오시는 길을 알고 싶어요.', a: '홈페이지 하단 오시는길 섹션 또는 네이버 지도에서 사찰명으로 검색하시면 됩니다.' },
  ]
}

// ── AI 자동 사찰소개 200자 ────────────────────────────────────────────────────
function buildAboutText(name: string, denomination: string, address: string, founded?: string) {
  return `${name}은(는) ${denomination} 소속 사찰로, ${address ? address + '에 위치합니다. ' : ''}` +
    `${founded ? founded + '년에 창건되어 오랜 역사와 전통을 이어오고 있으며, ' : ''}` +
    `부처님의 가르침을 전하고 지역사회와 함께하는 열린 도량입니다.`
}

// ── AI 자동 주지스님 인사말 300자 ─────────────────────────────────────────────
function buildAbbotMessage(name: string) {
  return `${name}을(를) 찾아주신 모든 분들을 환영합니다. ` +
    `이 도량은 누구에게나 열려 있는 마음의 안식처입니다. ` +
    `부처님의 자비와 지혜가 여러분의 일상에 밝은 빛이 되기를 발원합니다. ` +
    `함께 수행하고, 함께 나누며, 함께 성장하는 ${name}이(가) 되겠습니다. 나무아미타불.`
}

// ── 12대 전각 표준 블록 배치 ──────────────────────────────────────────────────
function buildStandardBlocks(name: string, denomination: string) {
  return [
    // 1. H-05 연등 히어로 (기본값)
    {
      blockType: 'H-05', label: '히어로', order: 1, isVisible: true,
      config: {
        heroTitle: name, badge: `☸ ${denomination}`,
        ticker: [`☸ ${name}`, `✦ ${denomination}`, `✦ 함께하는 도량`],
        cta1Label: '법회 안내', cta1Href: '#events',
        cta2Label: '오시는길', cta2Href: '#visit',
      }
    },
    // 2. I-01 공지사항
    { blockType: 'I-01', label: '공지사항', order: 2, isVisible: true, config: { notices: [] } },
    // 3. E-01 법회·행사
    {
      blockType: 'E-01', label: '법회·행사', order: 3, isVisible: true,
      config: {
        sectionTitle: '법회 · 기도 · 행사',
        events: buildDefaultEvents(name),
        _isAIGenerated: true,
      }
    },
    // 4. D-01 오늘의 법문 (법륜 로직 자동)
    { blockType: 'D-01', label: '오늘의 법문', order: 4, isVisible: true, config: {} },
    // 7. G-01 갤러리
    { blockType: 'G-01', label: '갤러리', order: 7, isVisible: true, config: { gallery: [] } },
    // 8. OF-01 기도불사동참 (신규 공정 예정)
    {
      blockType: 'OF-01', label: '기도불사동참', order: 8, isVisible: false,
      config: { ...buildDefaultOfferings(name), _isAIGenerated: true }
    },
    // 10. QA-01 자료관 FAQ
    {
      blockType: 'QA-01', label: '자료관 FAQ', order: 10, isVisible: true,
      config: {
        sectionTitle: `${name} 자료관`,
        faqItems: buildDefaultFaq(name, denomination),
        _isAIGenerated: true,
      }
    },
    // 11. IG-01 숫자로 보는 사찰
    { blockType: 'IG-01', label: '숫자로 보는 사찰', order: 11, isVisible: false, config: {} },
    // 12. P-01 자비의 실천 네트워크
    { blockType: 'P-01', label: '자비의 실천', order: 12, isVisible: false, config: {} },
    // 부가: V-01 오시는길
    { blockType: 'V-01', label: '오시는길', order: 13, isVisible: true, config: {} },
  ]
}

/**
 * 새 사찰 등록 + AI 자동 장엄
 * @param input 사찰 기본 정보
 */
export async function seedNewTemple(input: TempleSeedInput) {
  const {
    code, name,
    denomination = '대한불교 조계종',
    address = '',
    founded,
    phone = '',
    primaryColor = '#8B2500',
    secondaryColor = '#C5A572',
  } = input

  // 중복 체크
  const existing = await db.temple.findUnique({ where: { code } })
  if (existing) {
    console.log(`⚠️  ${name}(${code}) 이미 존재 — 건너뜀`)
    return existing
  }

  const temple = await db.temple.create({
    data: {
      code,
      name,
      denomination,
      address,
      phone,
      primaryColor,
      secondaryColor,
      description: buildAboutText(name, denomination, address, founded),
      abbotName: '',
      isActive: true,
    }
  })

  // 12대 전각 블록 생성
  const blocks = buildStandardBlocks(name, denomination)
  for (const block of blocks) {
    await db.blockConfig.create({
      data: { ...block, templeId: temple.id }
    })
  }

  console.log(`✅ ${name}(${code}) 표준 시드 적재 완료`)
  console.log(`   - 12대 전각 블록 ${blocks.length}개 생성`)
  console.log(`   - AI 장엄 항목: 사찰소개, 법회일정, FAQ`)
  console.log(`   - 관리자 입력 후 Override 필요: 주지스님 인사말, 갤러리, IG-01`)

  return temple
}

/**
 * AI 플래그 확인 유틸
 * config._isAIGenerated === true 이면 아직 수동 입력 전
 */
export function isAIGenerated(config: Record<string, unknown>): boolean {
  return config._isAIGenerated === true
}

// CLI 직접 실행 시 예시
// npx tsx lib/temple-seed.ts
if (require.main === module) {
  seedNewTemple({
    code: 'example-temple',
    name: '예시사',
    denomination: '대한불교 조계종',
    address: '서울특별시 종로구 예시로 1',
    phone: '02-0000-0000',
  }).then(() => db.$disconnect())
}
