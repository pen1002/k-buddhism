// SEC12-02 자선 활동
import { BlockProps } from './types'

export default function CharityBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const activities: { title: string; description?: string; target?: string; period?: string; image?: string }[] = Array.isArray(cfg.activities) ? cfg.activities : []
  if (activities.length === 0) return null
  return (
    <section className="section" id="charity">
      <div className="section-inner">
        <p className="section-label">Charity</p>
        <h2 className="section-title">{cfg.sectionTitle || '자선 활동'}</h2>
        {cfg.intro && <p style={{ marginTop: '.75rem', color: 'var(--color-text-light)', lineHeight: 1.7 }}>{cfg.intro}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {activities.map((a, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              {a.image ? (
                <img src={a.image} alt={a.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              ) : (
                <div style={{ aspectRatio: '16/9', background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🤝</div>
              )}
              <div style={{ padding: '1.125rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '.375rem' }}>{a.title}</p>
                {a.description && <p style={{ fontSize: '.85rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{a.description}</p>}
                <div style={{ display: 'flex', gap: '.75rem', marginTop: '.625rem' }}>
                  {a.target && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)' }}>👥 {a.target}</span>}
                  {a.period && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)' }}>📅 {a.period}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
