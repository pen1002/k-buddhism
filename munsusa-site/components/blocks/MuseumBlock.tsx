// SEC05-04 성보박물관
import { BlockProps } from './types'

export default function MuseumBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const items: { name: string; era?: string; description?: string; image?: string; designated?: string }[] = Array.isArray(cfg.items) ? cfg.items : []
  if (items.length === 0) return null
  return (
    <section className="section" id="museum">
      <div className="section-inner">
        <p className="section-label">Museum</p>
        <h2 className="section-title">{cfg.sectionTitle || '성보박물관'}</h2>
        {cfg.description && <p style={{ marginTop: '.75rem', color: 'var(--color-text-light)', lineHeight: 1.7 }}>{cfg.description}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              {item.image ? (
                <img src={item.image} alt={item.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '4/3', background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2rem' }}>🏛</span>
                </div>
              )}
              <div style={{ padding: '1rem' }}>
                {item.designated && <span style={{ fontSize: '.7rem', background: 'var(--color-warm)', color: '#fff', borderRadius: '3px', padding: '.15rem .4rem', marginBottom: '.375rem', display: 'inline-block' }}>{item.designated}</span>}
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '.95rem' }}>{item.name}</p>
                {item.era && <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginTop: '.25rem' }}>{item.era}</p>}
                {item.description && <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', marginTop: '.375rem', lineHeight: 1.5 }}>{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
