'use client'
import { useEffect, useRef, useState } from 'react'

interface StatItem {
  value: number
  suffix?: string
  label: string
  icon?: string
}

interface Config {
  sectionTitle?: string
  sectionDesc?: string
  stats?: StatItem[]
  imageUrl?: string
  imageCaption?: string
}

const DEFAULT_STATS: StatItem[] = [
  { value: 1996, suffix: '년', label: '복지재단 설립', icon: '🏛' },
  { value: 6, suffix: '개', label: '복지시설 운영', icon: '🏥' },
  { value: 2003, suffix: '년', label: '위드아시아 설립', icon: '🌏' },
  { value: 10, suffix: '개국', label: '해외 지원 국가', icon: '✈️' },
  { value: 29, suffix: '년', label: '지역사회 봉사', icon: '🙏' },
  { value: 500, suffix: '+', label: '봉사자 활동', icon: '🤝' },
]

function useCountUp(target: number, duration = 1800, active = false) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      setCurrent(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return active ? current : 0
}

function StatCard({ stat, active }: { stat: StatItem; active: boolean }) {
  const count = useCountUp(stat.value, 1600, active)
  return (
    <div
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '28px 20px',
        textAlign: 'center',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
    >
      {stat.icon && <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{stat.icon}</div>}
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1 }}>
        {count.toLocaleString()}<span style={{ fontSize: '1rem', fontWeight: 600 }}>{stat.suffix}</span>
      </div>
      <div style={{ marginTop: '8px', fontSize: '0.88rem', color: 'var(--color-text-light)', fontWeight: 500 }}>
        {stat.label}
      </div>
    </div>
  )
}

export default function InfoGraphicBlock({ config }: { config: Config }) {
  const stats = config.stats ?? DEFAULT_STATS
  const sectionTitle = config.sectionTitle ?? '숫자로 보는 문수사'
  const sectionDesc = config.sectionDesc ?? '문수복지재단과 위드아시아가 쌓아온 29년의 자비 실천'
  const imageUrl = config.imageUrl ?? ''
  const imageCaption = config.imageCaption ?? ''

  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section" id="infographic">
      <div className="section-inner">
        <p className="section-label">Impact &amp; Numbers</p>
        <h2 className="section-title">{sectionTitle}</h2>
        <p className="section-desc">{sectionDesc}</p>

        {/* Counter grid */}
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '16px',
            marginTop: '48px',
          }}
        >
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} active={active} />
          ))}
        </div>

        {/* Optional infographic image */}
        {imageUrl && (
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', display: 'inline-block', maxWidth: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={imageCaption}
                style={{ width: '100%', maxWidth: '1200px', cursor: 'zoom-in' }}
              />
              {imageCaption && (
                <div style={{ padding: '16px 24px', textAlign: 'left', borderTop: '1px solid var(--color-border)' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-dark)' }}>
                    {imageCaption}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
