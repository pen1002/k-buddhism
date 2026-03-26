// SEC02-07 봉사자 모집 공고
import { BlockProps } from './types'

export default function VolunteerNoticeBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const items: { title: string; period?: string; quota?: string; contact?: string; description?: string }[] = Array.isArray(cfg.items) ? cfg.items : []
  if (items.length === 0) return null
  return (
    <section className="section" id="volunteer-notice">
      <div className="section-inner">
        <p className="section-label">Volunteer</p>
        <h2 className="section-title">{cfg.sectionTitle || '봉사자 모집'}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderLeft: '4px solid var(--color-primary)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem', marginBottom: '.5rem' }}>{item.title}</p>
              {item.description && <p style={{ fontSize: '.875rem', color: 'var(--color-text-light)', lineHeight: 1.6, marginBottom: '.5rem' }}>{item.description}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginTop: '.5rem' }}>
                {item.period && <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)' }}>📅 {item.period}</span>}
                {item.quota && <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)' }}>👥 {item.quota}</span>}
                {item.contact && <span style={{ fontSize: '.78rem', color: 'var(--color-accent)' }}>📞 {item.contact}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
