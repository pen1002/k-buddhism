// SEC11-03 문화재 보유 현황
import { BlockProps } from './types'

export default function HeritageCountBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const stats: { label: string; count: number; icon?: string; color?: string }[] = Array.isArray(cfg.stats) ? cfg.stats : []
  const items: { name: string; type?: string; designated?: string; year?: string }[] = Array.isArray(cfg.items) ? cfg.items : []
  if (stats.length === 0 && items.length === 0) return null
  return (
    <section className="section" id="heritage-count">
      <div className="section-inner">
        <p className="section-label">Heritage</p>
        <h2 className="section-title">{cfg.sectionTitle || '문화재 현황'}</h2>
        {stats.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)},1fr)`, gap: '1rem', marginTop: '1.5rem' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
                {s.icon && <div style={{ fontSize: '1.75rem', marginBottom: '.5rem' }}>{s.icon}</div>}
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2rem', color: s.color ? s.color : 'var(--color-primary)' }}>{s.count.toLocaleString()}</p>
                <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', marginTop: '.25rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <div style={{ marginTop: '1.25rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.875rem 1.25rem', borderBottom: i < items.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                {item.designated && <span style={{ fontSize: '.7rem', background: 'var(--color-warm)', color: '#fff', borderRadius: '3px', padding: '.15rem .4rem', flexShrink: 0 }}>{item.designated}</span>}
                <span style={{ flex: 1, fontFamily: 'var(--font-serif)', color: 'var(--color-text)' }}>{item.name}</span>
                {item.type && <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)', flexShrink: 0 }}>{item.type}</span>}
                {item.year && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)', flexShrink: 0 }}>{item.year}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
