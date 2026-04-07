import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── 사찰 정의 ─────────────────────────────────────────────────────────────
const TEMPLES = [
  // ─────────────────────────────────────────────
  // 문수사 (Tier 2)
  // ─────────────────────────────────────────────
  {
    temple: {
      code: 'munsusa',
      name: '문수사',
      nameEn: 'Munsusa Temple',
      description:
        '문수사(文殊寺)는 부산 남구 용당동 당곡공원 옆에 위치한 대한불교 조계종 소속 사찰입니다. 대웅전, 지장전, 삼천불전, 13층 진신사리탑, 삼성각, 종무소, 요사채, 공양간 등과 야외 불상군을 갖추고 있으며, 특히 일주문(대문)이 없는 개방형 사찰로 조성되어 누구나 찾아와 마음의 안정을 얻을 수 있는 도심 속 평화도량입니다.',
      address: '부산광역시 남구 홍곡로336번길 41',
      phone: '051-624-3754',
      email: 'munsusa@buddhism.kr',
      denomination: '대한불교 조계종',
      abbotName: '지원 스님',
      customDomain: 'www.문수사.com',
      primaryColor: '#2B6B7F',
      secondaryColor: '#B8893E',
      tier: 2,
      isActive: true,
    },
    blocks: [
      {
        blockType: 'H-01',
        label: '파티클 히어로',
        order: 1,
        isVisible: true,
        config: {
          badge: '☸ 동체대비(同體大悲) · 도심 속 평화도량',
          heroTitle: '문수사',
          heroHanja: '文 殊 寺',
          heroDesc:
            '나눔과 수행 그리고 실천\n大門 없는 열린 도량에서 자비와 평화를 실천합니다\n부산 남구, 유엔묘지·유엔평화공원과 함께하는 최대 평화구역',
          cta1Label: '자비의 네트워크 보기',
          cta1Href: '#pillars',
          cta2Label: '산하기관 바로가기',
          cta2Href: '#welfare',
          navBlogLabel: 'N 네이버 블로그',
          navBlogHref: 'https://blog.naver.com/jijang-am',
          ticker: [
            '☸ 문수사', '✦ 대한불교조계종', '✦ 도심 속 평화도량',
            '✦ 대문 없는 열린 가람', '✦ 동체대비 · 상구보리 하화중생',
            '✦ 문수복지재단', '✦ 위드아시아 국제구호',
            '✦ 합천평화의집', '✦ 매주정기기도-참회기도도량', '✦ 부산 남구 용당동',
          ],
          stats: [
            { value: '6', label: '산하 복지시설 운영' },
            { value: '7', label: '아시아 국제구호 국가' },
            { value: '매주', label: '정기기도 · 참회기도도량' },
            { value: '2km', label: '반경 최대 평화구역' },
          ],
          quoteText:
            '만물은 나와 한 몸이라는\n동체대비(同體大悲)의 가르침 아래,\n상구보리 하화중생의 보살도를 실천합니다',
          quoteAuthor:
            '— 주지 지원 스님 (조계종 전 사회부장 · 문수복지재단 이사장 · 시인)',
          aboutImageUrl:
            'https://res.cloudinary.com/db3izttcy/image/upload/KakaoTalk_Photo_2026-02-01-22-02-08_009_jiqbed',
          aboutExtra: [
            '사찰 반경 2km 내에 유엔묘지, 유엔평화공원, 유엔평화기념관, 일제강제동원역사관, 부산박물관, 부산문화회관 등이 밀집해 있어 인간의 존귀함과 안락을 추구하는 문수사의 \'평화도량\' 철학과 깊이 맞닿아 있습니다.',
            '매주 수요일 지역 주민을 위한 무료 국수·비빔밥 공양을 실시하며, 미인가 경로당 및 결식아동 후원, 체육센터 부지 개방 등 지역사회와 활발히 소통하는 열린 도량입니다.',
          ],
          aboutInfoExtra: [
            ['특징', '대문 없는 개방형 사찰'],
            ['산하법인', '문수복지재단 · 위드아시아'],
            ['복지시설', '6개소 운영'],
          ],
        },
      },
      {
        blockType: 'E-01',
        label: '법회·행사',
        order: 2,
        isVisible: true,
        config: {
          sectionLabel: 'Events & Dharma Services',
          sectionTitle: '법회 · 기도 · 행사',
          sectionDesc: '문수사의 평화로운 도량에서 마음의 안정과 깊은 기도를 경험하세요',
          events: [
            { icon: '🌕', tag: 'Monthly', title: '정기법회', desc: '매월 초하루법회\n매월 1일(음) · 3일간 인등, 신장기도', meta: '정기법회 · 매월', schedule: 'lunar-monthly', lunarDays: '1,2,3' },
            { icon: '🙏', tag: 'Regular', title: '보름 · 지장기도 · 관음재일 · 다라니', desc: '보름 · 지장기도: 매월 15일(음)\n관음재일기도: 매월 24일(음)\n다라니기도: 매월 1일~3일(양)', meta: '정기기도 · 매월', schedule: 'lunar-monthly', lunarDays: '15,24', solarDays: '1,2,3' },
            { icon: '🎍', tag: 'Seasonal', title: '정초안택 관음기도', desc: '음력 1월 7일~9일 (3일간)', meta: '신년 기도', schedule: 'lunar-range', lunarMonth: '1', lunarStart: '7', lunarEnd: '9' },
            { icon: '📿', tag: 'Seasonal', title: '삼재신장기도', desc: '음력 1월 9일~15일 (7일간)', meta: '신년 기도', schedule: 'lunar-range', lunarMonth: '1', lunarStart: '9', lunarEnd: '15' },
            { icon: '🐟', tag: 'Seasonal', title: '방생법회', desc: '음력 2월 15일', meta: '방생 · 연 1회', schedule: 'lunar-range', lunarMonth: '2', lunarStart: '15', lunarEnd: '15' },
            { icon: '🪷', tag: 'Seasonal · 봉축', title: '부처님오신날 봉축법요식', desc: '봉축법요식: 음력 4월 8일\n봉축연등 접수: 음력 3월 1일 ~ 4월 8일', meta: '봉축대법회 · 연등 접수', schedule: 'lunar-range', lunarMonth: '3,4', lunarStart: '1', lunarEnd: '8', multiMonth: 'true' },
            { icon: '🪔', tag: 'Seasonal', title: '백중 49일 기도', desc: '음력 5월 26일 ~ 7월 15일', meta: '여름안거 · 3개월', schedule: 'lunar-range', lunarMonth: '5,6,7', lunarStart: '26', lunarEnd: '15', multiMonth: 'true' },
            { icon: '❄️', tag: 'Seasonal', title: '동지기도 · 성도절 철야정진', desc: '동지기도: 양력 12월 21~22일경\n성도절 철야용맹정진기도: 음력 12월 7~8일', meta: '동안거 · 특별기도', schedule: 'solar-range', solarMonth: '12', solarStart: '7', solarEnd: '22' },
            { icon: '🍜', tag: 'Weekly', title: '수요 무료 국수 공양', desc: '매월 2주·4주째 수요일\n문수보현봉사단 자원봉사', meta: '수요 나눔 · 무료', schedule: 'weekly-wed', weeks: '2,4' },
            { icon: '🎵', tag: '모집', title: '문수사 마야합창단', desc: '매주 수요일 오전 10:30~ 연습\n단원 상시 모집', meta: '합창단 · 매주 수요일', schedule: 'weekly-wed-all' },
          ],
        },
      },
      {
        blockType: 'G-01',
        label: '갤러리',
        order: 3,
        isVisible: true,
        config: { title: '경내 풍경', columns: 3, limit: 9, source: 'kv' },
      },
      {
        blockType: 'D-01',
        label: '오늘의 법문',
        order: 4,
        isVisible: true,
        config: { title: '오늘의 법문', showSource: true, style: 'quote', source: 'kv' },
      },
      {
        blockType: 'I-01',
        label: '공지사항',
        order: 5,
        isVisible: true,
        config: { title: '공지사항', limit: 5, showDate: true, source: 'kv' },
      },
      {
        blockType: 'P-01',
        label: '3대 실천 네트워크',
        order: 6,
        isVisible: true,
        config: {
          sectionLabel: 'Compassion Network',
          sectionTitle: '대상을 가리지 않는 자비의 3대 실천 네트워크',
          sectionDesc: '\'생명 존중\'을 중심에 두고, 가장 시급한 곳에 전문 법인을 통해 적재적소의 지원을 투입합니다',
          pillars: [
            { cls: 'p1', icon: '🏥', title: '문수복지재단', sub: '지역사회 복지', desc: '영유아부터 어르신까지 생애주기별 맞춤 돌봄과 틈새 복지망을 구축합니다. 산하 6개 복지시설 운영.' },
            { cls: 'p2', icon: '🌏', title: '위드아시아', sub: '국제 구호', desc: '국경을 넘는 빈민 구호, 교육 및 자립 지원. 캄보디아·라오스·인도·태국·북한 등 아시아 7개국 활동.' },
            { cls: 'p3', icon: '🕊️', title: '합천평화의집', sub: '비핵·평화 운동', desc: '한국 원폭 피해자와 2·3세 환우를 위한 유일의 민간 거점 쉼터. 비핵·평화 운동을 전개합니다.' },
          ],
        },
      },
      {
        blockType: 'W-01',
        label: '산하기관',
        order: 7,
        isVisible: true,
        config: {
          sectionLabel: 'Affiliated Organizations',
          sectionTitle: '산하기관 바로가기',
          sectionDesc: '문수사가 운영하는 복지·구호 기관들의 홈페이지로 바로 이동할 수 있습니다',
          orgs: [
            { icon: '🏛', cls: 'blue', name: '문수복지재단', desc: '불교의 \'지혜로운 자비\'를 현대적 복지 행정 시스템으로 승화시킨 불교계 전문 복지 법인', href: 'http://www.moonsubokji.or.kr/' },
            { icon: '🤝', cls: 'green', name: '용호종합사회복지관', desc: '고독사 예방 및 취약계층 마을 안전망 구축, 영유아부터 노인까지 폭넓은 복지 서비스 제공', href: 'https://www.yongho.or.kr/' },
            { icon: '👵', cls: 'orange', name: '문현노인복지관', desc: '\'99세까지 88하게\' 모토로 스마트폰 교육, 평생교육 등 어르신 사회 참여 지원', href: 'http://moon9988.or.kr/' },
            { icon: '💊', cls: 'purple', name: '심청이문수노인복지센터', desc: '장기요양 등급 어르신 주야간보호, 실버브레인케어 인지향상 프로그램 및 방문 의료 연계', href: 'http://www.mscare.or.kr/' },
            { icon: '🌍', cls: 'teal', name: '사단법인 위드아시아', desc: '2003년 설립 외교부 등록 국제개발협력 NGO. 아시아 빈곤촌 교육, 대북 인도적 지원 사업 전개', href: 'https://withasia.co.kr/' },
            { icon: '🕊️', cls: 'orange', name: '합천평화의집', desc: '한국 원폭 피해자와 2·3세 환우를 위한 유일의 민간 거점 쉼터. 비핵·평화 운동 전개', href: 'https://cafe.daum.net/peacehousehapcheon' },
          ],
        },
      },
      {
        blockType: 'DO-01',
        label: '나눔 동참',
        order: 8,
        isVisible: true,
        config: {
          bankName: '부산은행',
          accountHolder: '문수복지재단',
          accountNumber: '051-123-456789',
          email: 'munsusa@buddhism.kr',
          phone: '051-624-3754',
          hours: '평일 09:00~18:00',
        },
      },
      {
        blockType: 'V-01',
        label: '오시는 길',
        order: 9,
        isVisible: true,
        config: {
          address: '부산광역시 남구 홍곡로336번길 41',
          transport: '지하철 2호선 경성대·부경대역 하차 후 버스 이용',
          bus: '56번, 138번, 남구1번 버스 이용',
          parking: '경내 주차 가능 (무료)',
          mapLines: [
            '📍 부산광역시 남구 홍곡로336번길 41',
            '☎ 051-624-3754',
            '🚌 56번, 138번, 남구1번 버스 이용',
            '🅿 경내 주차 가능 (무료)',
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 보림사 (Tier 3 — 프리미엄)
  // 전남 장흥 가지산 보림사 · 한국 최초 선종 사찰
  // ─────────────────────────────────────────────
  {
    temple: {
      code: 'borimsa',
      name: '보림사',
      nameEn: 'Borimsa Temple',
      description:
        '보림사(寶林寺)는 전라남도 장흥군 유치면 가지산 기슭에 자리한 천년 고찰로, 신라 헌안왕 2년(858년) 도의국사와 염거화상이 창건한 한국 최초의 선종 사찰입니다. 가지산문(迦智山門)의 종찰로서 9산선문의 으뜸 도량이며, 국보 제117호 철조비로자나불좌상과 국보 제44호 보림사 삼층석탑 및 석등을 보유한 보물의 숲입니다.',
      address: '전라남도 장흥군 유치면 봉덕리 45',
      phone: '061-432-2847',
      email: 'borimsa@buddhism.kr',
      denomination: '대한불교 조계종',
      abbotName: '정인 스님',
      primaryColor: '#3D6B4F',
      secondaryColor: '#C8952C',
      tier: 3,
      isActive: true,
    },
    blocks: [
      {
        blockType: 'H-01',
        label: '파티클 히어로',
        order: 1,
        isVisible: true,
        config: {
          badge: '☸ 가지산문 종찰 · 한국 최초 선종 도량 · 국보의 숲',
          heroTitle: '보림사',
          heroHanja: '寶 林 寺',
          heroDesc:
            '신라 858년, 한국 선종의 첫 물줄기가 흐른 곳\n가지산 기슭에서 천년을 이어온 수행의 보금자리\n국보 2점을 간직한 전남 장흥의 천년 고찰',
          cta1Label: '사찰 소개 보기',
          cta1Href: '#intro',
          cta2Label: '오시는 길',
          cta2Href: '#visit',
          ticker: [
            '☸ 보림사', '✦ 대한불교조계종', '✦ 한국 최초 선종 사찰',
            '✦ 가지산문 종찰', '✦ 9산선문', '✦ 국보 제117호 철조비로자나불좌상',
            '✦ 국보 제44호 삼층석탑', '✦ 전남 장흥군 유치면',
          ],
          stats: [
            { value: '858년', label: '신라 헌안왕 창건' },
            { value: '국보 2점', label: '보유 문화재' },
            { value: '1,168년', label: '사찰 역사' },
            { value: '가지산', label: '9산선문 종찰' },
          ],
          quoteText:
            '천하의 보배가 모인 숲,\n가지산 보림(寶林)에서\n마음의 보배를 발견하세요',
          quoteAuthor: '— 보림사',
          aboutImageUrl: '',
          aboutExtra: [
            '보림사는 도의국사가 당나라에서 남종선(南宗禪)을 전래한 뒤, 그 제자 염거화상이 가지산 기슭에 세운 가람입니다. 이후 체징화상이 크게 중창하여 왕실의 귀의를 받아 가지산문의 종찰로 자리 잡았습니다.',
            '경내에는 국보 제117호 철조비로자나불좌상과 국보 제44호 삼층석탑 및 석등을 비롯해 보물 및 지방문화재 다수가 현존하여 \'보물의 숲\'이라는 이름에 걸맞은 문화유산의 보고입니다.',
          ],
          aboutInfoExtra: [
            ['창건', '신라 헌안왕 2년(858년)'],
            ['특징', '한국 최초 선종 가람 · 가지산문 종찰'],
            ['문화재', '국보 2점 · 보물 다수'],
          ],
        },
      },
      {
        blockType: 'E-01',
        label: '법회·행사',
        order: 2,
        isVisible: true,
        config: {
          sectionLabel: 'Events & Dharma Services',
          sectionTitle: '법회 · 기도 · 행사',
          sectionDesc: '보림사의 청정 도량에서 정진과 기도의 인연을 맺으세요',
          events: [
            { icon: '🌕', tag: 'Monthly', title: '초하루 정기법회', desc: '매월 음력 1일\n연등 공양 및 사시불공', meta: '정기법회 · 매월', schedule: 'lunar-monthly', lunarDays: '1' },
            { icon: '🙏', tag: 'Regular', title: '보름 기도법회', desc: '매월 음력 15일\n보름 정기 기도 및 참회 의식', meta: '보름기도 · 매월', schedule: 'lunar-monthly', lunarDays: '15' },
            { icon: '🐟', tag: 'Seasonal', title: '방생법회', desc: '음력 2월 15일\n가지산 계곡 방생 의식', meta: '방생 · 연 1회', schedule: 'lunar-range', lunarMonth: '2', lunarStart: '15', lunarEnd: '15' },
            { icon: '🪷', tag: '봉축', title: '부처님오신날 봉축법요식', desc: '봉축법요식: 음력 4월 8일\n연등 공양 접수: 음력 3월 1일~', meta: '봉축대법회', schedule: 'lunar-range', lunarMonth: '3,4', lunarStart: '1', lunarEnd: '8', multiMonth: 'true' },
            { icon: '🪔', tag: 'Seasonal', title: '백중 기도', desc: '음력 7월 15일\n선망 조상 천도 기도', meta: '백중재 · 연 1회', schedule: 'lunar-range', lunarMonth: '7', lunarStart: '1', lunarEnd: '15' },
            { icon: '❄️', tag: 'Seasonal', title: '동안거 결제 · 해제', desc: '음력 10월 15일 결제\n음력 1월 15일 해제\n선방 집중 수행 기간', meta: '동안거 · 3개월', schedule: 'lunar-range', lunarMonth: '10,11,12,1', lunarStart: '15', lunarEnd: '15', multiMonth: 'true' },
          ],
        },
      },
      {
        blockType: 'G-01',
        label: '갤러리',
        order: 3,
        isVisible: true,
        config: { title: '경내 풍경', columns: 3, limit: 9, source: 'kv' },
      },
      {
        blockType: 'D-01',
        label: '오늘의 법문',
        order: 4,
        isVisible: true,
        config: { title: '오늘의 법문', showSource: true, style: 'quote', source: 'kv' },
      },
      {
        blockType: 'I-01',
        label: '공지사항',
        order: 5,
        isVisible: true,
        config: { title: '공지사항', limit: 5, showDate: true, source: 'kv' },
      },
      {
        blockType: 'V-01',
        label: '오시는 길',
        order: 6,
        isVisible: true,
        config: {
          address: '전라남도 장흥군 유치면 봉덕리 45',
          transport: '장흥버스터미널에서 유치행 버스 이용 (1일 수회)',
          bus: '장흥 → 유치면 보림사 방향 버스',
          parking: '사찰 입구 주차장 이용 (무료)',
          mapLines: [
            '📍 전라남도 장흥군 유치면 봉덕리 45',
            '☎ 061-432-2847',
            '🚌 장흥버스터미널 → 유치면 방향 버스',
            '🅿 사찰 입구 주차장 이용 (무료)',
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 천관사 (Tier 2 — 표준)
  // 전남 장흥 천관산 천관사
  // ─────────────────────────────────────────────
  {
    temple: {
      code: 'chunkwansa',
      name: '천관사',
      nameEn: 'Chunkwansa Temple',
      description:
        '천관사(天冠寺)는 전라남도 장흥군 관산읍 천관산 도립공원 내에 위치한 고찰입니다. 신라 말기 도선국사가 창건하였다고 전해지며, 천관산(天冠山)의 빼어난 경관 속에서 청정 수행과 기도의 전통을 이어오고 있습니다. 기암괴석과 노송이 어우러진 천관산의 품에서 마음을 정화하는 도량입니다.',
      address: '전라남도 장흥군 관산읍 농안리',
      phone: '061-867-0444',
      email: 'chunkwansa@buddhism.kr',
      denomination: '대한불교 조계종',
      abbotName: '성운 스님',
      primaryColor: '#5C4A7C',
      secondaryColor: '#C5A572',
      tier: 2,
      isActive: true,
    },
    blocks: [
      {
        blockType: 'H-01',
        label: '파티클 히어로',
        order: 1,
        isVisible: true,
        config: {
          badge: '☸ 천관산 도립공원 · 도선국사 창건 고찰',
          heroTitle: '천관사',
          heroHanja: '天 冠 寺',
          heroDesc:
            '천관산(天冠山)의 품에서 천년을 수행한 고찰\n기암괴석과 노송이 어우러진 청정 수행도량\n전남 장흥의 아름다운 산사에서 마음을 쉬어 가세요',
          cta1Label: '사찰 소개 보기',
          cta1Href: '#intro',
          cta2Label: '오시는 길',
          cta2Href: '#visit',
          ticker: [
            '☸ 천관사', '✦ 대한불교조계종', '✦ 천관산 도립공원',
            '✦ 전남 장흥군 관산읍', '✦ 도선국사 창건 고찰',
            '✦ 청정 수행도량', '✦ 기암괴석의 절경',
          ],
          stats: [
            { value: '신라 말', label: '도선국사 창건' },
            { value: '천관산', label: '도립공원 내 위치' },
            { value: '720m', label: '천관산 정상 고도' },
            { value: '장흥', label: '전남 소재 고찰' },
          ],
          quoteText:
            '하늘의 관(天冠)을 쓴 산처럼\n높고 맑은 마음으로\n세상을 내려다보는 지혜를 얻으세요',
          quoteAuthor: '— 천관사',
          aboutImageUrl: '',
          aboutExtra: [
            '천관사는 천관산의 웅장한 기암괴석 아래 자리한 고찰로, 신라 말기 풍수지리의 대가 도선국사가 이 땅의 수려한 기운을 알아보고 창건하였다고 전합니다.',
            '천관산 도립공원 내에 위치하여 사계절 아름다운 자연과 함께 청정한 수행 환경을 제공합니다. 봄의 진달래, 가을의 억새, 겨울의 설경이 도량을 아름답게 감쌉니다.',
          ],
          aboutInfoExtra: [
            ['창건', '신라 말기 도선국사'],
            ['특징', '천관산 도립공원 내 청정 고찰'],
            ['주변', '천관산 기암괴석 · 도립공원'],
          ],
        },
      },
      {
        blockType: 'D-01',
        label: '오늘의 법문',
        order: 2,
        isVisible: true,
        config: { title: '오늘의 법문', showSource: true, style: 'quote', source: 'kv' },
      },
      {
        blockType: 'I-01',
        label: '공지사항',
        order: 3,
        isVisible: true,
        config: { title: '공지사항', limit: 5, showDate: true, source: 'kv' },
      },
      {
        blockType: 'V-01',
        label: '오시는 길',
        order: 4,
        isVisible: true,
        config: {
          address: '전라남도 장흥군 관산읍 농안리',
          transport: '장흥버스터미널에서 관산 방면 버스 이용',
          bus: '장흥 → 관산읍 방향 버스',
          parking: '천관산 도립공원 주차장 이용',
          mapLines: [
            '📍 전라남도 장흥군 관산읍 농안리',
            '☎ 061-867-0444',
            '🚌 장흥터미널 → 관산읍 방향 버스',
            '🅿 천관산 도립공원 주차장 이용',
          ],
        },
      },
    ],
  },
]

// ── 메인 시드 함수 ──────────────────────────────────────────────────────────
async function main() {
  for (const { temple: templeData, blocks } of TEMPLES) {
    console.log(`\n🌱 Seeding ${templeData.name} (Tier ${templeData.tier})...`)

    const temple = await prisma.temple.upsert({
      where: { code: templeData.code },
      update: {
        name: templeData.name,
        tier: templeData.tier,
        abbotName: templeData.abbotName,
        description: templeData.description,
        address: templeData.address,
        phone: templeData.phone,
        email: templeData.email,
        primaryColor: templeData.primaryColor,
        secondaryColor: templeData.secondaryColor,
        ...(templeData.customDomain ? { customDomain: templeData.customDomain } : {}),
      },
      create: {
        ...templeData,
      },
    })

    console.log(`  ✅ Temple: ${temple.name} (id: ${temple.id})`)

    await prisma.blockConfig.deleteMany({ where: { templeId: temple.id } })

    await prisma.blockConfig.createMany({
      data: blocks.map((b) => ({
        ...b,
        templeId: temple.id,
        config: b.config as object,
      })),
    })

    const blockTypes = blocks.map((b) => b.blockType).join(' → ')
    console.log(`  ✅ Blocks (${blocks.length}개): ${blockTypes}`)
  }

  console.log('\n🎉 Seed 완료!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
