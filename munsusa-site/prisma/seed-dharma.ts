// prisma/seed-dharma.ts — 일일 법문 30개 초기 시드
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const DHARMA_QUOTES = [
  // ── 자비 (compassion) ──
  { dayIndex: 1,  text: '한 생각 자비로우면 천 가지 복이 찾아온다.', source: '화엄경', category: 'compassion' },
  { dayIndex: 2,  text: '남을 해치지 않는 것이 가장 큰 보시이다.', source: '법구경', category: 'compassion' },
  { dayIndex: 3,  text: '모든 중생이 행복하기를, 모든 중생이 평안하기를.', source: '자비경', category: 'compassion' },
  { dayIndex: 4,  text: '자비는 불교의 근본이요, 방편은 자비의 근본이다.', source: '관음현의', category: 'compassion' },
  { dayIndex: 5,  text: '원수를 사랑으로 이기고, 악을 선으로 이기라.', source: '법구경', category: 'compassion' },

  // ── 지혜 (wisdom) ──
  { dayIndex: 6,  text: '마음이 곧 부처요, 부처가 곧 마음이니라.', source: '육조단경', category: 'wisdom' },
  { dayIndex: 7,  text: '집착을 내려놓으면 그 자리가 곧 극락이다.', source: '금강경', category: 'wisdom' },
  { dayIndex: 8,  text: '천 마디 말보다 한 순간의 깨달음이 낫다.', source: '법구경', category: 'wisdom' },
  { dayIndex: 9,  text: '있는 그대로 보는 것, 그것이 지혜의 시작이다.', source: '반야심경', category: 'wisdom' },
  { dayIndex: 10, text: '번뇌 즉 보리요, 생사 즉 열반이니라.', source: '유마경', category: 'wisdom' },

  // ── 정진 (practice) ──
  { dayIndex: 11, text: '오늘 하루를 백 년처럼, 백 년을 하루처럼 살라.', source: '선가귀감', category: 'practice' },
  { dayIndex: 12, text: '한 걸음 한 걸음이 모두 도량이다.', source: '화엄경', category: 'practice' },
  { dayIndex: 13, text: '물방울이 모여 바다를 이루듯, 작은 수행이 큰 깨달음이 된다.', source: '법구경', category: 'practice' },
  { dayIndex: 14, text: '게으름은 만악의 근원이요, 정진은 만복의 뿌리이다.', source: '대지도론', category: 'practice' },
  { dayIndex: 15, text: '부지런히 정진하라, 모든 것은 덧없나니.', source: '열반경', category: 'practice' },

  // ── 수행 (devotion) ──
  { dayIndex: 16, text: '참선은 다른 것이 아니라 일상 속에서 깨어 있는 것이다.', source: '조사어록', category: 'devotion' },
  { dayIndex: 17, text: '향 한 자루 피우는 마음이 곧 기도의 시작이다.', source: '선문염송', category: 'devotion' },
  { dayIndex: 18, text: '절 한 번에 업장 하나가 녹아내린다.', source: '지장경', category: 'devotion' },
  { dayIndex: 19, text: '나무아미타불 한 마디에 삼천대천세계가 밝아진다.', source: '아미타경', category: 'devotion' },
  { dayIndex: 20, text: '고요히 앉아 호흡을 살피면, 마음의 본래 모습이 드러난다.', source: '안반수의경', category: 'devotion' },

  // ── 인연 (karma) ──
  { dayIndex: 21, text: '뿌린 대로 거둔다. 이것이 인과의 법칙이다.', source: '잡아함경', category: 'karma' },
  { dayIndex: 22, text: '만남은 우연이 아니라 오래전부터 맺어진 인연이다.', source: '화엄경', category: 'karma' },
  { dayIndex: 23, text: '좋은 인연을 짓는 것이 가장 큰 재산이다.', source: '보현행원품', category: 'karma' },
  { dayIndex: 24, text: '지금 이 순간의 선택이 내일의 나를 만든다.', source: '중아함경', category: 'karma' },
  { dayIndex: 25, text: '은혜를 알고 은혜에 보답하는 것, 이것이 사람의 도리이다.', source: '대반열반경', category: 'karma' },

  // ── 보시 (generosity) ──
  { dayIndex: 26, text: '주는 기쁨은 받는 기쁨보다 크다.', source: '잡보장경', category: 'generosity' },
  { dayIndex: 27, text: '재물 보시보다 법 보시가 으뜸이다.', source: '금강경', category: 'generosity' },
  { dayIndex: 28, text: '미소 한 번이 가장 아름다운 보시이다.', source: '무량수경', category: 'generosity' },
  { dayIndex: 29, text: '나누면 나눌수록 더 풍요로워진다.', source: '보시바라밀경', category: 'generosity' },
  { dayIndex: 30, text: '두려움 없는 마음을 주는 것이 무외시이다.', source: '법화경', category: 'generosity' },
]

const SPECIAL_QUOTES = [
  { dayIndex: 901, text: '천상천하유아독존. 삼계개고 아당안지.', source: '부처님오신날', category: 'devotion', isSpecial: true, specialDate: '05-05' },
  { dayIndex: 902, text: '별을 보고 크게 깨달으시니, 일체중생이 모두 불성을 갖추었도다.', source: '성도절', category: 'wisdom', isSpecial: true, specialDate: '12-08' },
  { dayIndex: 903, text: '왕궁을 떠나 진리를 찾으시니, 출가의 공덕 한량없도다.', source: '출가절', category: 'practice', isSpecial: true, specialDate: '02-08' },
  { dayIndex: 904, text: '열반에 드시며 이르시되, 부지런히 정진하라.', source: '열반절', category: 'practice', isSpecial: true, specialDate: '02-15' },
]

async function main() {
  await prisma.dharmaQuote.deleteMany()

  for (const q of [...DHARMA_QUOTES, ...SPECIAL_QUOTES]) {
    await prisma.dharmaQuote.create({ data: q })
  }

  console.log(`법문 ${DHARMA_QUOTES.length + SPECIAL_QUOTES.length}개 적재 완료`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
