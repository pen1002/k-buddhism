/**
 * 기존 사찰에 블록 추가 스크립트
 * Usage: npx tsx scripts/add-blocks.ts munsusa
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BLOCKS_TO_ADD: Record<string, Array<{ blockType: string; label: string; config: Record<string, unknown> }>> = {
  munsusa: [
    {
      blockType: 'QA-01',
      label: 'Q&A 슬라이드 자료관',
      config: {
        sectionTitle: '문수사 자료관',
        sectionDesc: '문수사와 산하기관의 활동을 다양한 방식으로 만나보세요',
        source: 'static',
      },
    },
    {
      blockType: 'IG-01',
      label: '숫자 카운터 인포그래픽',
      config: {
        sectionTitle: '숫자로 보는 문수사',
        sectionDesc: '문수복지재단과 위드아시아가 쌓아온 29년의 자비 실천',
        stats: [
          { value: 1996, suffix: '년', label: '복지재단 설립', icon: '🏛' },
          { value: 6, suffix: '개', label: '복지시설 운영', icon: '🏥' },
          { value: 2003, suffix: '년', label: '위드아시아 설립', icon: '🌏' },
          { value: 10, suffix: '개국', label: '해외 지원 국가', icon: '✈️' },
          { value: 29, suffix: '년', label: '지역사회 봉사', icon: '🙏' },
          { value: 500, suffix: '+', label: '봉사자 활동', icon: '🤝' },
        ],
        source: 'static',
      },
    },
  ],
}

async function main() {
  const code = process.argv[2]
  if (!code) { console.error('Usage: npx tsx scripts/add-blocks.ts <code>'); process.exit(1) }

  const temple = await prisma.temple.findUnique({ where: { code } })
  if (!temple) { console.error(`사찰 '${code}' 를 찾을 수 없습니다`); process.exit(1) }

  const blocks = BLOCKS_TO_ADD[code]
  if (!blocks) { console.error(`'${code}' 에 대한 블록 설정이 없습니다`); process.exit(1) }

  // 현재 최대 order 조회
  const existing = await prisma.blockConfig.findMany({
    where: { templeId: temple.id },
    orderBy: { order: 'desc' },
    take: 1,
  })
  let nextOrder = (existing[0]?.order ?? 0) + 1

  for (const block of blocks) {
    // 이미 있으면 스킵
    const dup = await prisma.blockConfig.findFirst({
      where: { templeId: temple.id, blockType: block.blockType },
    })
    if (dup) {
      console.log(`  ⏭ ${block.blockType} 이미 존재 (스킵)`)
      continue
    }
    await prisma.blockConfig.create({
      data: {
        templeId: temple.id,
        blockType: block.blockType,
        label: block.label,
        order: nextOrder++,
        isVisible: true,
        config: block.config,
      },
    })
    console.log(`  ✅ ${block.blockType} (${block.label}) 추가 완료`)
  }

  console.log(`\n✅ ${code} 블록 추가 완료`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
