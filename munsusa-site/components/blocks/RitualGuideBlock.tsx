// SEC10-04 의례 안내
import { BlockProps } from './types'

export default function RitualGuideBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const rituals: { name: string; description?: string; steps?: string[]; time?: string; occasion?: string }[] = Array.isArray(cfg.rituals) ? cfg.rituals : []
  if (rituals.length === 0) return null
  return (
    <section className="section" id="ritual-guide">
      <div className="section-inner">
        <p className="section-label">Ritual</p>
        <h2 className="section-title">{cfg.sectionTitle || '의례 안내'}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          {rituals.map((r, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem' }}>{r.name}</p>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  {r.time && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)', background: 'var(--color-bg-alt)', borderRadius: '3px', padding: '.15rem .4rem' }}>{r.time}</span>}
                  {r.occasion && <span style={{ fontSize: '.75rem', color: 'var(--color-accent)', background: 'var(--color-bg-alt)', borderRadius: '3px', padding: '.15rem .4rem' }}>{r.occasion}</span>}
                </div>
              </div>
              {r.description && <p style={{ fontSize: '.875rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{r.description}</p>}
              {r.steps && r.steps.length > 0 && (
                <ol style={{ marginTop: '.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
                  {r.steps.map((step, j) => (
                    <li key={j} style={{ fontSize: '.85rem', color: 'var(--color-text-light)', lineHeight: 1.5 }}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
