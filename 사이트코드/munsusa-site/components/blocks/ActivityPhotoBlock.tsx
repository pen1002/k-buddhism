// SEC07-04 활동 사진
import { BlockProps } from './types'

export default function ActivityPhotoBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const photos: { src: string; caption?: string; date?: string; category?: string }[] = Array.isArray(cfg.photos) ? cfg.photos : []
  if (photos.length === 0) return null
  return (
    <section className="section" id="activity-photo">
      <div className="section-inner">
        <p className="section-label">Activity</p>
        <h2 className="section-title">{cfg.sectionTitle || '활동 사진'}</h2>
        <div style={{ columns: '2 200px', gap: '1rem', marginTop: '1.5rem' }}>
          {photos.map((p, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: '1rem', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <img src={p.src} alt={p.caption || ''} style={{ width: '100%', display: 'block' }} />
              {(p.caption || p.date) && (
                <div style={{ background: 'var(--color-card)', padding: '.5rem .75rem' }}>
                  {p.category && <span style={{ fontSize: '.7rem', color: 'var(--color-accent)', marginRight: '.4rem' }}>#{p.category}</span>}
                  {p.caption && <span style={{ fontSize: '.8rem', color: 'var(--color-text)' }}>{p.caption}</span>}
                  {p.date && <p style={{ fontSize: '.75rem', color: 'var(--color-text-light)', marginTop: '.2rem' }}>{p.date}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
