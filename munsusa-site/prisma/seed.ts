import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding 문수사...')

  // ── Temple 삽입 (upsert) ──────────────────────────────
  const temple = await prisma.temple.upsert({
    where: { code: 'munsusa' },
    update: {
      name: '문수사',
      tier: 2,
      customDomain: 'www.문수사.com',
    },
    create: {
      code: 'munsusa',
      name: '문수사',
      nameEn: 'Munsusa Temple',
      description:
        '부산 남구 도심 속 열린 가람 문수사. 동체대비의 가르침 아래 지역복지·국제구호·비핵평화를 실천하는 평화도량입니다.',
      address: '부산광역시 남구 문현동',
      phone: '051-000-0000',
      denomination: '대한불교조계종',
      customDomain: 'www.문수사.com',
      primaryColor: '#2B6B7F',
      secondaryColor: '#B8893E',
      tier: 2,
      isActive: true,
    },
  })

  console.log(`✅ Temple: ${temple.name} (id: ${temple.id})`)

  // ── BlockConfig 삽입 (기존 삭제 후 재생성) ──────────────
  await prisma.blockConfig.deleteMany({ where: { templeId: temple.id } })

  const blocks = [
    {
      blockType: 'H-01',
      label: '파티클 히어로',
      order: 1,
      isVisible: true,
      config: {
        title: '문수사 文殊寺',
        subtitle: '도심 속 평화도량, 부산 남구',
        particles: true,
        bgColor: '#1B1917',
        textColor: '#FFFFFF',
      },
    },
    {
      blockType: 'G-01',
      label: '갤러리',
      order: 2,
      isVisible: true,
      config: {
        title: '경내 풍경',
        columns: 3,
        limit: 6,
        source: 'kv', // temple-admin KV에서 불러옴
      },
    },
    {
      blockType: 'D-01',
      label: '오늘의 법문',
      order: 3,
      isVisible: true,
      config: {
        title: '오늘의 법문',
        showSource: true,
        style: 'quote',
        source: 'kv',
      },
    },
    {
      blockType: 'I-01',
      label: '공지사항',
      order: 4,
      isVisible: true,
      config: {
        title: '공지사항',
        limit: 5,
        showDate: true,
        source: 'kv',
      },
    },
  ]

  await prisma.blockConfig.createMany({
    data: blocks.map((b) => ({ ...b, templeId: temple.id })),
  })

  console.log(`✅ BlockConfig: ${blocks.length}개 블록 삽입 완료`)
  console.log('   H-01 (파티클 히어로) → G-01 (갤러리) → D-01 (법문) → I-01 (공지)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
