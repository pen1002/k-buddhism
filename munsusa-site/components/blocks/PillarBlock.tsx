// SEC12-01 기둥(핵심 가치/사찰 정신)
import { BlockProps } from './types'

export default function PillarBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const pillars: { title: string; description?: string; icon?: string }[] = Array.isArray(cfg.pillars) ? cfg.pillars : []
  if (pillars.length === 0) return null
  return (
    <section className="section" id="pillar">
      <div className="section-inner">
        <p className="section-label">Pillars</p>
        <h2 className="section-title">{cfg.sectionTitle || '사찰 정신'}</h2>
        {cfg.description && <p style={{ marginTop: '.75rem', color: 'var(--color-text-light)', lineHeight: 1.7, textAlign: 'center' }}>{cfg.description}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(pillars.length, 4)},1fr)`, gap: '1.5rem', marginTop: '2rem' }}>
          {pillars.map((p, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
              {p.icon ? (
                <div style={{ fontSize: '2.5rem', marginBottom: '.875rem' }}>{p.icon}</div>
              ) : (
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-primary)', margin: '0 auto .875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>{i + 1}</span>
                </div>
              )}
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '1.05rem', marginBottom: '.5rem' }}>{p.title}</p>
              {p.description && <p style={{ fontSize: '.85rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{p.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
