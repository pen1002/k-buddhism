// SEC06-05 원로 스님
import { BlockProps } from './types'

export default function SeniorMonkBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const monks: { name: string; title?: string; image?: string; description?: string; period?: string }[] = Array.isArray(cfg.monks) ? cfg.monks : []
  if (monks.length === 0) return null
  return (
    <section className="section" id="senior-monk">
      <div className="section-inner">
        <p className="section-label">Senior Monks</p>
        <h2 className="section-title">{cfg.sectionTitle || '원로 스님'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {monks.map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: '100px', height: '100px', margin: '0 auto .75rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-primary)' }}>
                {m.image ? (
                  <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🙏</div>
                )}
              </div>
              {m.title && <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginBottom: '.25rem' }}>{m.title}</p>}
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem' }}>{m.name}</p>
              {m.period && <p style={{ fontSize: '.75rem', color: 'var(--color-text-light)', marginTop: '.25rem' }}>{m.period}</p>}
              {m.description && <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', marginTop: '.5rem', lineHeight: 1.6 }}>{m.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
