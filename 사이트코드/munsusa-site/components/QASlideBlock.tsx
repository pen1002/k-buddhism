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

// 기본값 없음 — 사찰별 config에서 faqItems/slides 필드로 주입
const DEFAULT_FAQ: FaqItem[] = []
const DEFAULT_SLIDES: Slide[] = []

type Tab = 'faq' | 'slides' | 'infographic'

export default function QASlideBlock({ config }: { config: Config }) {
  // config.faqItems 또는 config.items(어드민 저장 키) 모두 허용
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faqItems: FaqItem[] = config.faqItems ?? (config as any).items ?? DEFAULT_FAQ
  const slides = config.slides ?? DEFAULT_SLIDES
  const sectionTitle = config.sectionTitle ?? (config as any).title ?? '자료관'
  const sectionDesc = config.sectionDesc ?? '사찰과 산하기관의 활동을 다양한 방식으로 만나보세요'

  // 데이터 없으면 렌더링 생략
  if (faqItems.length === 0 && slides.length === 0 && !config.infographicUrl) return null
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
