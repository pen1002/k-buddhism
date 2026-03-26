// SEC11-04 봉사 통계
import { BlockProps } from './types'

export default function VolunteerStatsBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const stats: { label: string; value: string | number; unit?: string; icon?: string }[] = Array.isArray(cfg.stats) ? cfg.stats : []
  if (stats.length === 0) return null
  return (
    <section className="section" id="volunteer-stats">
      <div className="section-inner">
        <p className="section-label">Stats</p>
        <h2 className="section-title">{cfg.sectionTitle || '봉사 현황'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)},1fr)`, gap: '1rem', marginTop: '1.5rem' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.5rem', textAlign: 'center' }}>
              {s.icon && <div style={{ fontSize: '1.75rem', marginBottom: '.625rem' }}>{s.icon}</div>}
              <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '.2rem' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)', lineHeight: 1 }}>
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                </span>
                {s.unit && <span style={{ fontSize: '.9rem', color: 'var(--color-text-light)', paddingBottom: '.25rem' }}>{s.unit}</span>}
              </div>
              <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', marginTop: '.375rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
        {cfg.description && <p style={{ marginTop: '1.25rem', fontSize: '.875rem', color: 'var(--color-text-light)', lineHeight: 1.7, textAlign: 'center' }}>{cfg.description}</p>}
      </div>
    </section>
  )
}
