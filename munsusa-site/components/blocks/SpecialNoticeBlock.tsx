// SEC02-02 애경사/부음 특별 알림
import { BlockProps } from './types'

interface Notice {
  type: 'funeral' | 'celebration'
  title: string
  content: string
  date: string
}

export default function SpecialNoticeBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const notices: Notice[] = Array.isArray(cfg.specialNotices) ? cfg.specialNotices : []

  // 7일 경과 공지 서버사이드 필터
  const now = Date.now()
  const active = notices.filter(n => {
    const d = new Date(n.date).getTime()
    return now - d <= 7 * 24 * 60 * 60 * 1000
  })

  if (active.length === 0) return null

  return (
    <section className="section" id="special-notice" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <div className="section-inner">
        {active.map((n, i) => (
          <div key={i} style={{
            border: n.type === 'funeral'
              ? '2px solid var(--color-text)'
              : '2px solid var(--color-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem 2rem',
            marginBottom: i < active.length - 1 ? '1rem' : 0,
            background: n.type === 'funeral'
              ? 'var(--color-dark)'
              : 'var(--color-bg-alt)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.4rem' }}>{n.type === 'funeral' ? '🕯' : '🎊'}</span>
              <h3 style={{
                fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, margin: 0,
                color: n.type === 'funeral' ? 'var(--color-bg)' : 'var(--color-text)',
              }}>{n.title}</h3>
              <span style={{
                marginLeft: 'auto', fontSize: '.78rem',
                color: n.type === 'funeral' ? 'var(--color-text-light)' : 'var(--color-text-light)',
              }}>{n.date}</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-serif)', lineHeight: 1.8, margin: 0,
              color: n.type === 'funeral' ? 'var(--color-bg-alt)' : 'var(--color-text)',
              fontSize: '.93rem',
            }}>{n.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
