// SEC06-06 역대 주지
import { BlockProps } from './types'

export default function AbbotLineageBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const abbots: { name: string; period: string; term?: string; description?: string }[] = Array.isArray(cfg.abbots) ? cfg.abbots : []
  if (abbots.length === 0) return null
  return (
    <section className="section" id="abbot-lineage">
      <div className="section-inner">
        <p className="section-label">Lineage</p>
        <h2 className="section-title">{cfg.sectionTitle || '역대 주지'}</h2>
        <div style={{ marginTop: '1.5rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {abbots.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.875rem 1.25rem', borderBottom: i < abbots.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ width: '28px', height: '28px', background: 'var(--color-bg-alt)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', color: 'var(--color-text-light)', flexShrink: 0, fontWeight: 700 }}>{i + 1}</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', flex: 1 }}>{a.name}</span>
              <span style={{ fontSize: '.8rem', color: 'var(--color-text-light)' }}>{a.period}</span>
              {a.term && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)' }}>{a.term}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
