import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 문수사 데이터
  const munsusa = await prisma.temple.upsert({
    where: { code: 'munsusa' },
    update: {
      name: '문수사',
      nameEn: 'Munsusa Temple',
      description: '부산 남구에 위치한 문수사입니다. 문수보살의 지혜와 자비를 나누는 도량입니다.',
      address: '부산광역시 남구 홍곡로336번길 41',
      denomination: '대한불교조계종',
      primaryColor: '#8B2500',
      secondaryColor: '#C5A572',
      customDomain: 'xn--z92bu3hg5a.com',
      subdomain: 'munsusa',
      isActive: true,
    },
    create: {
      code: 'munsusa',
      name: '문수사',
      nameEn: 'Munsusa Temple',
      description: '부산 남구에 위치한 문수사입니다. 문수보살의 지혜와 자비를 나누는 도량입니다.',
      address: '부산광역시 남구 홍곡로336번길 41',
      denomination: '대한불교조계종',
      primaryColor: '#8B2500',
      secondaryColor: '#C5A572',
      customDomain: 'xn--z92bu3hg5a.com',
      subdomain: 'munsusa',
      isActive: true,
    },
  });

  console.log(`✓ 문수사 생성/업데이트: ${munsusa.id}`);

  // 도메인 매핑
  await prisma.domainMap.upsert({
    where: { domain: 'xn--z92bu3hg5a.com' },
    update: { templeId: munsusa.id },
    create: {
      domain: 'xn--z92bu3hg5a.com',
      templeId: munsusa.id,
    },
  });

  await prisma.domainMap.upsert({
    where: { domain: 'munsusa.k-buddhism.com' },
    update: { templeId: munsusa.id },
    create: {
      domain: 'munsusa.k-buddhism.com',
      templeId: munsusa.id,
    },
  });

  console.log('✓ 도메인 매핑 완료');
  console.log('Seed 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
