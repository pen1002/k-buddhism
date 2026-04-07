// SEC11-05 방문자 카운터
import { BlockProps } from './types'

export default function VisitorCountBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const counts: { label: string; value: number; icon?: string; period?: string }[] = Array.isArray(cfg.counts) ? cfg.counts : []
  if (counts.length === 0) return null
  return (
    <section className="section" id="visitor-count">
      <div className="section-inner">
        <p className="section-label">Visitors</p>
        <h2 className="section-title">{cfg.sectionTitle || '방문자 현황'}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '1.5rem', justifyContent: 'center' }}>
          {counts.map((c, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.5rem 2rem', textAlign: 'center', minWidth: '140px' }}>
              {c.icon && <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{c.icon}</div>}
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-primary)', lineHeight: 1 }}>
                {c.value.toLocaleString()}
              </p>
              <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', marginTop: '.375rem' }}>{c.label}</p>
              {c.period && <p style={{ fontSize: '.72rem', color: 'var(--color-text-light)', marginTop: '.2rem' }}>{c.period}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
