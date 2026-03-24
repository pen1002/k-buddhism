'use client'
import { useState, useRef, useEffect } from 'react'

interface FaqItem { q: string; a: string }
interface Slide { url: string; title: string }

interface Config {
  sectionTitle?: string
  sectionDesc?: string
  faqItems?: FaqItem[]
  slides?: Slide[]
  infographicUrl?: string
  infographicCaption?: string
}

const DEFAULT_FAQ: FaqItem[] = [
  {
    q: '문수사는 어떤 사찰인가요?',
    a: '문수사는 부산 남구 용당동에 위치한 대한불교조계종 소속 사찰입니다. 일주문(대문)이 없는 개방형 사찰로 조성되어, 지역 주민의 휴식과 산책을 위한 공공재로서 기능합니다. 대웅전, 지장전, 삼천불전, 13층 진신사리탑, 삼성각, 종무소, 요사채, 공양간 등과 야외 불상군을 갖추고 있습니다.',
  },
  {
    q: "'평화도량'이란 어떤 의미인가요?",
    a: '문수사 반경 2km 내에 유엔묘지, 유엔평화공원, 유엔평화기념관, 일제강제동원역사관, 부산박물관, 부산문화회관 등이 밀집해 있습니다. 이 지역적 의미와 문수사의 동체대비(同體大悲) 정신이 결합되어 평화도량이라 불립니다.',
  },
  {
    q: '문수복지재단은 어떤 활동을 하나요?',
    a: '1996년 설립된 불교계 전문 복지 법인으로, 영유아부터 어르신까지 생애주기별 맞춤 돌봄을 실천합니다. 용호종합사회복지관, 문현노인복지관, 심청이문수노인복지센터, 남천재가노인서비스지원센터, 못골다함께돌봄센터 등 6개 시설을 운영합니다.',
  },
  {
    q: '위드아시아는 어떤 단체인가요?',
    a: '2003년 주지 지원스님이 설립한 외교부 등록 국제개발협력 NGO입니다. 캄보디아 빈곤 아동 공부방 및 생명의 우물 건립, 라오스 학교 개보수, 인도·태국 소수민족 학교 설립, 북한 어린이 영양 보충식 지원 등 국경을 넘는 자비를 실천합니다.',
  },
  {
    q: '합천평화의집은 무엇인가요?',
    a: '1945년 히로시마·나가사키 원자폭탄 투하로 희생된 한국인 피해자와 2·3세 환우들을 위해 경남 합천에 설립된 유일의 민간 거점 쉼터입니다. 매년 합천 비핵·평화대회를 개최하며 아시아·태평양 피폭자 증언을 연대합니다.',
  },
  {
    q: '수요 무료 공양은 어떻게 진행되나요?',
    a: '매월 2주·4주째 수요일에 지역주민을 위한 무료 국수 공양을 실시합니다. 문수보현봉사단의 자원봉사로 운영되며, 별도의 자격 조건 없이 누구나 방문하여 따뜻한 한 끼를 나눌 수 있습니다.',
  },
  {
    q: '후원은 어떻게 하나요?',
    a: '결연후원, 정기/일시후원, 기업/물품후원을 접수합니다. 투명한 경영 원칙 아래 기부금 영수증 발급과 연차보고서를 공개하여 후원금 사용 내역을 투명하게 안내합니다. 자원봉사도 상시 모집합니다.',
  },
  {
    q: '문수사에서 드리는 기도불사는?',
    a: '정기법회(매월 초하루, 3일간 인등·신장기도), 보름·지장기도(매월 음 15일), 관음재일기도(매월 음 24일), 다라니기도(매월 양 1~3일)를 봉행합니다. 절기별로 부처님오신날 봉축법요식, 백중49일기도, 동지기도, 성도절 철야용맹정진기도 등이 있습니다.',
  },
]

const DEFAULT_SLIDES: Slide[] = [
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0001_tkbm8k', title: '자비의 확장: 도심 포교에서 지구촌 평화까지' },
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0002_tcxbg9', title: '철학의 전환: 산중에서 도심으로, 의례에서 실천으로' },
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0003_fjt4wn', title: '대상을 가리지 않는 자비의 3대 실천 네트워크' },
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0004_jqfhan', title: '요람에서 무덤까지, 빈틈없는 지역사회 보호망' },
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0005_tsgxhs', title: '상태와 욕구에 맞춘 3단계 노인 돌봄 시스템' },
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0006_zrm8ne', title: '국경과 이념을 넘어선 아시아 구호 연대' },
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0007_f79wiz', title: '단순 시혜를 넘어선 자조 공동체 완성 모델' },
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0008_bbz1eq', title: '잊혀진 역사의 상처를 치유하는 예언자적 연대' },
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0009_u848c7', title: '자비의 그물망을 움직이는 투명한 동력' },
  { url: 'https://res.cloudinary.com/db3izttcy/image/upload/munsusa_slide_page-0010_s5eemc', title: '당신의 작은 관심이 세상을 엮는 그물이 됩니다' },
]

type Tab = 'faq' | 'slides' | 'infographic'

export default function QASlideBlock({ config }: { config: Config }) {
  const faqItems = config.faqItems ?? DEFAULT_FAQ
  const slides = config.slides ?? DEFAULT_SLIDES
  const sectionTitle = config.sectionTitle ?? '자료관'
  const sectionDesc = config.sectionDesc ?? '사찰과 산하기관의 활동을 다양한 방식으로 만나보세요'
  const infographicUrl = config.infographicUrl ?? ''
  const infographicCaption = config.infographicCaption ?? '자비의 실천, 세상을 바꾸는 따뜻한 연대 — 인포그래픽'

  const [activeTab, setActiveTab] = useState<Tab>('faq')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [slideIdx, setSlideIdx] = useState(0)

  // Touch swipe for slides
  const touchStartX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? nextSlide() : prevSlide()
    touchStartX.current = null
  }

  const prevSlide = () => setSlideIdx(i => (i - 1 + slides.length) % slides.length)
  const nextSlide = () => setSlideIdx(i => (i + 1) % slides.length)

  // Keyboard nav for slides
  useEffect(() => {
    if (activeTab !== 'slides') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeTab, slides.length])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'faq', label: '📋 FAQ' },
    { key: 'slides', label: '🖼 슬라이드' },
    ...(infographicUrl ? [{ key: 'infographic' as Tab, label: '📊 인포그래픽' }] : []),
  ]

  return (
    <section className="section" id="qa-resource" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Learning &amp; Explore</p>
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-desc">{sectionDesc}</p>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                border: '2px solid',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderColor: activeTab === t.key ? 'var(--color-accent)' : 'var(--color-border)',
                background: activeTab === t.key ? 'var(--color-accent)' : 'var(--color-card)',
                color: activeTab === t.key ? '#fff' : 'var(--color-text)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── FAQ panel ── */}
        {activeTab === 'faq' && (
          <div style={{ marginTop: '32px', maxWidth: '800px' }}>
            {faqItems.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid',
                  borderColor: openFaq === i ? 'var(--color-gold)' : 'var(--color-border)',
                  borderRadius: '12px',
                  marginBottom: '10px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--color-dark)',
                    background: 'none',
                    gap: '12px',
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{ color: 'var(--color-gold)', fontSize: '1.2rem', flexShrink: 0 }}>
                    {openFaq === i ? '－' : '＋'}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 20px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: 1.85 }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Slides panel ── */}
        {activeTab === 'slides' && (
          <div style={{ marginTop: '32px' }}>
            <div
              style={{
                background: '#1b1917',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
              }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {/* Viewport */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                {slides.map((s, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={s.url}
                    alt={s.title}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: '#111',
                      opacity: i === slideIdx ? 1 : 0,
                      transition: 'opacity 0.5s ease',
                    }}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
              {/* Dots */}
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', padding: '10px', background: 'rgba(26,26,24,0.95)' }}>
                {slides.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setSlideIdx(i)}
                    style={{
                      display: 'inline-block',
                      width: i === slideIdx ? '24px' : '8px',
                      height: '8px',
                      borderRadius: i === slideIdx ? '4px' : '50%',
                      background: i === slideIdx ? 'var(--color-gold)' : 'rgba(255,255,255,0.25)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  />
                ))}
              </div>
              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(26,26,24,0.95)' }}>
                <button
                  onClick={prevSlide}
                  style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 500, padding: '8px 18px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', cursor: 'pointer' }}
                >
                  ← 이전
                </button>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>
                  {slideIdx + 1} / {slides.length}
                </span>
                <button
                  onClick={nextSlide}
                  style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 500, padding: '8px 18px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', cursor: 'pointer' }}
                >
                  다음 →
                </button>
              </div>
            </div>
            <p style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--color-text-light)', textAlign: 'center' }}>
              {slides[slideIdx].title}
            </p>
          </div>
        )}

        {/* ── Infographic panel ── */}
        {activeTab === 'infographic' && infographicUrl && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', display: 'inline-block', maxWidth: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={infographicUrl}
                alt={infographicCaption}
                style={{ width: '100%', maxWidth: '1200px', cursor: 'zoom-in' }}
              />
              <div style={{ padding: '16px 24px', textAlign: 'left', borderTop: '1px solid var(--color-border)' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-dark)', marginBottom: '4px' }}>
                  {infographicCaption}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>클릭하면 확대됩니다</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
