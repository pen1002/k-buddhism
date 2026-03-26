// SEC02-08 불사/공사 안내
import { BlockProps } from './types'

export default function ConstructionNoticeBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const projects: { title: string; status?: string; period?: string; description?: string; progress?: number }[] = Array.isArray(cfg.projects) ? cfg.projects : []
  if (projects.length === 0) return null
  return (
    <section className="section" id="construction-notice">
      <div className="section-inner">
        <p className="section-label">Construction</p>
        <h2 className="section-title">{cfg.sectionTitle || '불사 안내'}</h2>
        {cfg.description && <p style={{ marginTop: '.75rem', color: 'var(--color-text-light)', lineHeight: 1.7 }}>{cfg.description}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          {projects.map((p, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)' }}>{p.title}</p>
                {p.status && (
                  <span style={{ fontSize: '.75rem', background: 'var(--color-warm)', color: '#fff', borderRadius: '999px', padding: '.2rem .65rem' }}>{p.status}</span>
                )}
              </div>
              {p.description && <p style={{ fontSize: '.875rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{p.description}</p>}
              {p.period && <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginTop: '.375rem' }}>📅 {p.period}</p>}
              {typeof p.progress === 'number' && (
                <div style={{ marginTop: '.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--color-text-light)', marginBottom: '.25rem' }}>
                    <span>진행률</span><span>{p.progress}%</span>
                  </div>
                  <div style={{ background: 'var(--color-border)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.progress}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '999px' }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
