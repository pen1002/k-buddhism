// SEC05-05 스탬프 투어
import { BlockProps } from './types'

export default function StampTourBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const stamps: { name: string; location?: string; description?: string; image?: string; order?: number }[] = Array.isArray(cfg.stamps) ? cfg.stamps : []
  if (stamps.length === 0) return null
  return (
    <section className="section" id="stamp-tour">
      <div className="section-inner">
        <p className="section-label">Stamp Tour</p>
        <h2 className="section-title">{cfg.sectionTitle || '스탬프 투어'}</h2>
        {cfg.description && <p style={{ marginTop: '.75rem', color: 'var(--color-text-light)', lineHeight: 1.7 }}>{cfg.description}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {stamps.map((s, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', margin: '0 auto .75rem', background: 'var(--color-bg-alt)', borderRadius: '50%', border: '2px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.image ? (
                  <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-primary)', fontSize: '.9rem' }}>{s.order ?? i + 1}</span>
                )}
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '.875rem' }}>{s.name}</p>
              {s.location && <p style={{ fontSize: '.75rem', color: 'var(--color-text-light)', marginTop: '.25rem' }}>{s.location}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
