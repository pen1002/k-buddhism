import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import HeroCanvas from '@/components/HeroCanvas'
import KvBlocks from '@/components/KvBlocks'
import MunsusaClient from '@/components/MunsusaClient'

export const revalidate = 300

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const temple = await db.temple.findUnique({
    where: { code: slug, isActive: true },
    include: { blockConfigs: { where: { isVisible: true }, orderBy: { order: 'asc' } } },
  })
  if (!temple) notFound()

  const blocks = temple.blockConfigs as Array<{ blockType: string; config: Record<string, unknown> }>

  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav" id="nav">
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">문수사 <span>文殊寺</span></a>
          <div className="nav-links">
            <a href="#events">법회·행사</a>
            <a href="#intro">사찰소개</a>
            <a href="#pillars">3대 실천</a>
            <a href="#welfare">산하기관</a>
            <a href="#donate">나눔동참</a>
            <a href="#visit">오시는길</a>
            <a href="https://blog.naver.com/jijang-am" target="_blank" rel="noopener" className="nav-cta">N 네이버 블로그</a>
          </div>
          <button className="nav-toggle" id="navToggle" aria-label="메뉴">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className="mobile-menu" id="mobileMenu">
        <a href="#events">🎏 법회·행사</a>
        <a href="#intro">🏯 사찰소개</a>
        <a href="#pillars">☸ 3대 실천</a>
        <a href="#welfare">🏥 산하기관</a>
        <a href="#donate">🤝 나눔동참</a>
        <a href="#visit">🗺 오시는길</a>
        <a href="https://blog.naver.com/jijang-am" target="_blank" rel="noopener">📝 네이버 블로그</a>
      </div>

      {/* ── HERO (H-01) ── */}
      {blocks.some(b => b.blockType === 'H-01') && (
        <section className="hero" id="hero">
          <div className="hero-bg" />
          <canvas id="lanternCanvas" />
          <canvas id="particleCanvas" />
          <HeroCanvas />
          <div className="hero-content">
            <div className="hero-badge">☸ 동체대비(同體大悲) · 도심 속 평화도량</div>
            <h1>문수사</h1>
            <div className="hero-hanja">文 殊 寺</div>
            <p className="hero-desc">
              나눔과 수행 그리고 실천<br />
              大門 없는 열린 도량에서 자비와 평화를 실천합니다<br />
              부산 남구, 유엔묘지·유엔평화공원과 함께하는 최대 평화구역
            </p>
            <div className="hero-btns">
              <a href="#pillars" className="btn-primary">자비의 네트워크 보기</a>
              <a href="#welfare" className="btn-outline">산하기관 바로가기</a>
            </div>
          </div>
        </section>
      )}

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-track">
          {[
            '☸ 문수사','✦ 대한불교조계종','✦ 도심 속 평화도량','✦ 대문 없는 열린 가람',
            '✦ 동체대비 · 상구보리 하화중생','✦ 문수복지재단','✦ 위드아시아 국제구호',
            '✦ 합천평화의집','✦ 매주정기기도-참회기도도량','✦ 부산 남구 용당동',
            '☸ 문수사','✦ 대한불교조계종','✦ 도심 속 평화도량','✦ 대문 없는 열린 가람',
            '✦ 동체대비 · 상구보리 하화중생','✦ 문수복지재단','✦ 위드아시아 국제구호',
            '✦ 합천평화의집','✦ 매주정기기도-참회기도도량','✦ 부산 남구 용당동',
          ].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item"><h3>6</h3><p>산하 복지시설 운영</p></div>
          <div className="stat-item"><h3>7</h3><p>아시아 국제구호 국가</p></div>
          <div className="stat-item"><h3>매주</h3><p>정기기도 · 참회기도도량</p></div>
          <div className="stat-item"><h3>2km</h3><p>반경 최대 평화구역</p></div>
        </div>
      </div>

      {/* ── EVENTS ── */}
      <section className="section" id="events">
        <div className="section-inner">
          <p className="section-label">Events &amp; Dharma Services</p>
          <h2 className="section-title">법회 · 기도 · 행사</h2>
          <p className="section-desc">문수사의 평화로운 도량에서 마음의 안정과 깊은 기도를 경험하세요</p>
          <div className="events-grid" id="eventsGrid">
            {[
              { icon:'🌕', tag:'Monthly', title:'정기법회', desc:'매월 초하루법회\n매월 1일(음) · 3일간 인등, 신장기도', meta:'정기법회 · 매월', schedule:'lunar-monthly', lunarDays:'1,2,3' },
              { icon:'🙏', tag:'Regular', title:'보름 · 지장기도 · 관음재일 · 다라니', desc:'보름 · 지장기도: 매월 15일(음)\n관음재일기도: 매월 24일(음)\n다라니기도: 매월 1일~3일(양)', meta:'정기기도 · 매월', schedule:'lunar-monthly', lunarDays:'15,24', solarDays:'1,2,3' },
              { icon:'🎍', tag:'Seasonal', title:'정초안택 관음기도', desc:'음력 1월 7일~9일 (3일간)', meta:'신년 기도', schedule:'lunar-range', lunarMonth:'1', lunarStart:'7', lunarEnd:'9' },
              { icon:'📿', tag:'Seasonal', title:'삼재신장기도', desc:'음력 1월 9일~15일 (7일간)', meta:'신년 기도', schedule:'lunar-range', lunarMonth:'1', lunarStart:'9', lunarEnd:'15' },
              { icon:'🐟', tag:'Seasonal', title:'방생법회', desc:'음력 2월 15일', meta:'방생 · 연 1회', schedule:'lunar-range', lunarMonth:'2', lunarStart:'15', lunarEnd:'15' },
              { icon:'🪷', tag:'Seasonal · 봉축', title:'부처님오신날 봉축법요식', desc:'봉축법요식: 음력 4월 8일\n봉축연등 접수: 음력 3월 1일 ~ 4월 8일', meta:'봉축대법회 · 연등 접수', schedule:'lunar-range', lunarMonth:'3,4', lunarStart:'1', lunarEnd:'8', multiMonth:'true' },
              { icon:'🪔', tag:'Seasonal', title:'백중 49일 기도', desc:'음력 5월 26일 ~ 7월 15일', meta:'여름안거 · 3개월', schedule:'lunar-range', lunarMonth:'5,6,7', lunarStart:'26', lunarEnd:'15', multiMonth:'true' },
              { icon:'❄️', tag:'Seasonal', title:'동지기도 · 성도절 철야정진', desc:'동지기도: 양력 12월 21~22일경\n성도절 철야용맹정진기도: 음력 12월 7~8일', meta:'동안거 · 특별기도', schedule:'solar-range', solarMonth:'12', solarStart:'7', solarEnd:'22' },
              { icon:'🍜', tag:'Weekly', title:'수요 무료 국수 공양', desc:'매월 2주·4주째 수요일\n문수보현봉사단 자원봉사', meta:'수요 나눔 · 무료', schedule:'weekly-wed', weeks:'2,4' },
              { icon:'🎵', tag:'모집', title:'문수사 마야합창단', desc:'매주 수요일 오전 10:30~ 연습\n단원 상시 모집', meta:'합창단 · 매주 수요일', schedule:'weekly-wed-all' },
            ].map((ev, i) => (
              <div
                key={i} className="event-card fade-in"
                data-schedule={ev.schedule}
                data-lunar-days={ev.lunarDays}
                data-solar-days={ev.solarDays}
                data-lunar-month={ev.lunarMonth}
                data-lunar-start={ev.lunarStart}
                data-lunar-end={ev.lunarEnd}
                data-multi-month={ev.multiMonth}
                data-solar-month={ev.solarMonth}
                data-solar-start={ev.solarStart}
                data-solar-end={ev.solarEnd}
                data-weeks={ev.weeks}
              >
                <div className="event-icon">{ev.icon}</div>
                <span className="event-tag">{ev.tag}</span>
                <h3>{ev.title}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{ev.desc}</p>
                <div className="event-meta">{ev.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KV BLOCKS (Notice I-01 / Dharma D-01 / Gallery G-01) ── */}
      <KvBlocks templeCode={slug} blocks={blocks} />

      {/* ── ABOUT ── */}
      <section className="section" id="intro" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="section-inner">
          <p className="section-label">About Temple</p>
          <h2 className="section-title">도심 속 열린 가람, 문수사</h2>
          <div className="about-layout">
            <div className="about-text fade-in">
              <p>문수사(文殊寺)는 부산 남구 용당동 당곡공원 옆에 위치한 대한불교 조계종 소속 사찰입니다. 대웅전, 지장전, 삼천불전, 13층 진신사리탑, 삼성각, 종무소, 요사채, 공양간(식당) 등과 야외 불상군을 갖추고 있으며, 특히 일주문(대문)이 없는 <strong>개방형 사찰</strong>로 조성되어 누구나 찾아와 마음의 안정을 얻을 수 있는 도심 속 평화도량입니다.</p>
              <p>사찰 반경 2km 내에 <strong>유엔묘지, 유엔평화공원, 유엔평화기념관, 일제강제동원역사관, 부산박물관, 부산문화회관</strong> 등이 밀집해 있어 인간의 존귀함과 안락을 추구하는 문수사의 '평화도량' 철학과 깊이 맞닿아 있습니다.</p>
              <p>매주 수요일 지역 주민을 위한 무료 국수·비빔밥 공양을 실시하며, 미인가 경로당 및 결식아동 후원, 체육센터 부지 개방 등 지역사회와 활발히 소통하는 열린 도량입니다.</p>
              <dl className="about-info">
                {[['종단','대한불교 조계종'],['주지','지원 스님'],['소재지','부산 남구 용당동'],['특징','대문 없는 개방형 사찰'],['산하법인','문수복지재단 · 위드아시아'],['복지시설','6개소 운영']].map(([dt,dd]) => (
                  <div key={dt} className="about-info-item"><dt>{dt}</dt><dd>{dd}</dd></div>
                ))}
              </dl>
            </div>
            <div className="about-images fade-in">
              <img
                src="https://res.cloudinary.com/db3izttcy/image/upload/KakaoTalk_Photo_2026-02-01-22-02-08_009_jiqbed"
                alt="문수사 전경"
                style={{ width:'100%', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-md)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <div className="quote-banner">
        <h2>&ldquo;만물은 나와 한 몸이라는<br />동체대비(同體大悲)의 가르침 아래,<br />상구보리 하화중생의 보살도를 실천합니다&rdquo;</h2>
        <p>— 주지 지원 스님 (조계종 전 사회부장 · 문수복지재단 이사장 · 시인)</p>
      </div>

      {/* ── PILLARS ── */}
      <section className="section" id="pillars">
        <div className="section-inner">
          <p className="section-label">Compassion Network</p>
          <h2 className="section-title">대상을 가리지 않는 자비의 3대 실천 네트워크</h2>
          <p className="section-desc">&apos;생명 존중&apos;을 중심에 두고, 가장 시급한 곳에 전문 법인을 통해 적재적소의 지원을 투입합니다</p>
          <div className="pillar-grid">
            <div className="pillar-card p1 fade-in"><div className="pillar-icon">🏥</div><h3>문수복지재단</h3><div className="pillar-sub">지역사회 복지</div><p>영유아부터 어르신까지 생애주기별 맞춤 돌봄과 틈새 복지망을 구축합니다. 산하 6개 복지시설 운영.</p></div>
            <div className="pillar-card p2 fade-in"><div className="pillar-icon">🌏</div><h3>위드아시아</h3><div className="pillar-sub">국제 구호</div><p>국경을 넘는 빈민 구호, 교육 및 자립 지원. 캄보디아·라오스·인도·태국·북한 등 아시아 7개국 활동.</p></div>
            <div className="pillar-card p3 fade-in"><div className="pillar-icon">🕊️</div><h3>합천평화의집</h3><div className="pillar-sub">비핵·평화 운동</div><p>한국 원폭 피해자와 2·3세 환우를 위한 유일의 민간 거점 쉼터. 비핵·평화 운동을 전개합니다.</p></div>
          </div>
        </div>
      </section>

      {/* ── WELFARE ── */}
      <section className="section" id="welfare" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="section-inner">
          <p className="section-label">Affiliated Organizations</p>
          <h2 className="section-title">산하기관 바로가기</h2>
          <p className="section-desc">문수사가 운영하는 복지·구호 기관들의 홈페이지로 바로 이동할 수 있습니다</p>
          <div className="welfare-grid">
            {[
              { icon:'🏛', cls:'blue', name:'문수복지재단', desc:'불교의 \'지혜로운 자비\'를 현대적 복지 행정 시스템으로 승화시킨 불교계 전문 복지 법인', href:'http://www.moonsubokji.or.kr/' },
              { icon:'🤝', cls:'green', name:'용호종합사회복지관', desc:'고독사 예방 및 취약계층 마을 안전망 구축, 영유아부터 노인까지 폭넓은 복지 서비스 제공', href:'https://www.yongho.or.kr/' },
              { icon:'👵', cls:'orange', name:'문현노인복지관', desc:'\'99세까지 88하게\' 모토로 스마트폰 교육, 평생교육 등 어르신 사회 참여 지원', href:'http://moon9988.or.kr/' },
              { icon:'💊', cls:'purple', name:'심청이문수노인복지센터', desc:'장기요양 등급 어르신 주야간보호, 실버브레인케어 인지향상 프로그램 및 방문 의료 연계', href:'http://www.mscare.or.kr/' },
              { icon:'🌍', cls:'teal', name:'사단법인 위드아시아', desc:'2003년 설립 외교부 등록 국제개발협력 NGO. 아시아 빈곤촌 교육, 대북 인도적 지원 사업 전개', href:'https://withasia.co.kr/' },
              { icon:'🕊️', cls:'orange', name:'합천평화의집', desc:'한국 원폭 피해자와 2·3세 환우를 위한 유일의 민간 거점 쉼터. 비핵·평화 운동 전개', href:'https://cafe.daum.net/peacehousehapcheon' },
            ].map(w => (
              <div key={w.name} className="welfare-card fade-in">
                <div className="welfare-card-top">
                  <div className={`welfare-icon ${w.cls}`}>{w.icon}</div>
                  <h3>{w.name}</h3>
                </div>
                <p>{w.desc}</p>
                <a href={w.href} target="_blank" rel="noopener" className="welfare-link">홈페이지 방문 →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DONATE ── */}
      <section className="section" id="donate">
        <div className="section-inner">
          <p className="section-label">Support &amp; Donation</p>
          <h2 className="section-title">나눔에 동참하세요</h2>
          <p className="section-desc">여러분의 소중한 후원이 지역 복지와 국제 구호 활동의 원동력이 됩니다</p>
          <div className="donate-grid">
            <div className="donate-card fade-in">
              <h3>🏦 후원 계좌</h3>
              <div className="bank-info">
                {[['은행','부산은행'],['예금주','문수복지재단'],['계좌번호','051-123-456789']].map(([k,v]) => (
                  <div key={k} className="bank-row"><span>{k}</span><span>{v}</span></div>
                ))}
              </div>
            </div>
            <div className="donate-card fade-in">
              <h3>📞 후원 문의</h3>
              <div className="bank-info">
                {[['대표 전화','051-624-3754'],['이메일','munsusa@buddhism.kr'],['운영시간','평일 09:00~18:00']].map(([k,v]) => (
                  <div key={k} className="bank-row"><span>{k}</span><span>{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISIT ── */}
      <section className="section" id="visit" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="section-inner">
          <p className="section-label">Location &amp; Access</p>
          <h2 className="section-title">오시는 길</h2>
          <p className="section-desc">부산 남구 용당동 당곡공원 옆, 대문 없는 열린 사찰입니다</p>
          <div style={{ marginTop:'36px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
            <div className="fade-in">
              <dl className="about-info">
                {[['주소','부산광역시 남구 홍곡로336번길 41'],['대중교통','지하철 2호선 경성대·부경대역 하차 후 버스 이용'],['버스','남구청, 유엔묘지 방향 버스 이용'],['주차','사찰 내 주차 가능']].map(([k,v]) => (
                  <div key={k} className="about-info-item"><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </div>
            <div className="fade-in" style={{ background:'var(--color-card)', borderRadius:'var(--radius-lg)', padding:'24px', border:'1px solid var(--color-border)' }}>
              <p style={{ fontFamily:'var(--font-serif)', fontSize:'1rem', color:'var(--color-text-light)', lineHeight:'1.85' }}>
                📍 부산광역시 남구 홍곡로336번길 41<br />
                ☎ 051-624-3754<br />
                🚌 56번, 138번, 남구1번 버스 이용<br />
                🅿 경내 주차 가능 (무료)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>☸ 문수사</h3>
            <p>Munsusa · 文殊寺<br />도심 속 평화도량<br />부산 남구 용당동</p>
          </div>
          <div className="footer-col">
            <h4>사찰 안내</h4>
            <a href="#intro">사찰 소개</a>
            <a href="#pillars">3대 실천</a>
            <a href="#events">법회·행사</a>
            <a href="#donate">나눔동참</a>
            <a href="#visit">오시는길</a>
          </div>
          <div className="footer-col">
            <h4>산하기관</h4>
            <a href="http://www.moonsubokji.or.kr/" target="_blank" rel="noopener">문수복지재단</a>
            <a href="https://www.yongho.or.kr/" target="_blank" rel="noopener">용호종합사회복지관</a>
            <a href="http://moon9988.or.kr/" target="_blank" rel="noopener">문현노인복지관</a>
            <a href="https://withasia.co.kr/" target="_blank" rel="noopener">위드아시아</a>
            <a href="https://cafe.daum.net/peacehousehapcheon" target="_blank" rel="noopener">합천평화의집</a>
          </div>
          <div className="footer-col">
            <h4>연락처</h4>
            <a href="tel:051-624-3754">📞 051-624-3754</a>
            <a href="#visit">📍 부산 남구 용당동</a>
            <a href="https://blog.naver.com/jijang-am" target="_blank" rel="noopener">📝 네이버 블로그</a>
            <a href="#donate">🤝 후원 안내</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 문수사(文殊寺) · 대한불교 조계종 · 부산시 남구 홍곡로336번길 41<br />
          Peace · Compassion · Community
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      <div className="lightbox" id="lightbox">
        <span className="lightbox-close">✕</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img id="lightboxImg" src="" alt="" />
      </div>

      {/* ── SCROLL TO TOP (클릭 핸들러는 MunsusaClient가 담당) ── */}
      <div className="scroll-top" id="scrollTop">↑</div>

      {/* ── CLIENT SCRIPTS ── */}
      <MunsusaClient />
    </>
  )
}

export async function generateStaticParams() {
  const temples = await db.temple.findMany({ where: { isActive: true }, select: { code: true } })
  return temples.map(t => ({ slug: t.code }))
}
