// SEC03-02~19 범용 행사 카드 (dataKey로 행사 종류 구분)
import { BlockProps } from './types'

// 행사 기본 데이터 (dataKey → 기본값 매핑)
const EVENT_DEFAULTS: Record<string, { icon: string; tag: string; title: string; desc: string; meta: string }> = {
  event_buddha_birthday: { icon: '🪔', tag: '봉축', title: '부처님 오신 날 봉축 법요식', desc: '음력 4월 8일 봉축 법요식 및 연등 행렬', meta: '음력 4월 8일 · 연 1회' },
  event_baekjung:        { icon: '📿', tag: '천도', title: '백중 49일 천도 기도', desc: '영가를 위한 49일 특별 천도기도', meta: '음력 7월 15일 · 연 1회' },
  event_dongji:          { icon: '🌙', tag: '동지', title: '동지 팥죽 기도', desc: '동짓날 팥죽 나눔 및 동지기도 봉행', meta: '양력 12월 22일경' },
  event_csat:            { icon: '📚', tag: '기도', title: '수능 합격 발원 기도', desc: '100일 합격 기도 및 수험생 응원', meta: '시험 100일 전 · 연 1회' },
}

export default function EventCardBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const dataKey: string = cfg.dataKey || ''
  const defaults = EVENT_DEFAULTS[dataKey] ?? {}

  const icon: string = cfg.icon || defaults.icon || '☸'
  const tag: string = cfg.tag || defaults.tag || '행사'
  const title: string = cfg.title || defaults.title || cfg.name || ''
  const desc: string = cfg.desc || defaults.desc || ''
  const meta: string = cfg.meta || defaults.meta || ''
  const ctaLabel: string = cfg.ctaLabel || ''
  const ctaHref: string = cfg.ctaHref || '#'

  if (!title) return null

  return (
    <section className="section" id={`event-${dataKey || 'card'}`}>
      <div className="section-inner" style={{ maxWidth: '760px' }}>
        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.5rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: '2.8rem', lineHeight: 1, flexShrink: 0 }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-block',
                background: 'var(--color-accent)', color: '#fff',
                padding: '3px 12px', borderRadius: '12px',
                fontSize: '.78rem', fontWeight: 700,
              }}>{tag}</span>
              <span style={{
                fontSize: '.8rem', color: 'var(--color-text-light)',
                fontFamily: 'var(--font-sans)',
              }}>{meta}</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 700, color: 'var(--color-dark)',
              marginBottom: '0.75rem',
            }}>{title}</h2>
            {desc && (
              <p style={{
                fontSize: '.95rem',
                color: 'var(--color-text)',
                lineHeight: 1.8, whiteSpace: 'pre-line',
                marginBottom: ctaLabel ? '1.2rem' : 0,
              }}>{desc}</p>
            )}
            {ctaLabel && (
              <a href={ctaHref} style={{
                display: 'inline-block', padding: '0.6rem 1.5rem',
                background: 'var(--color-accent)', color: '#fff',
                borderRadius: 'var(--radius)', fontWeight: 600,
                fontFamily: 'var(--font-sans)', fontSize: '.88rem',
                textDecoration: 'none',
              }}>{ctaLabel}</a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
