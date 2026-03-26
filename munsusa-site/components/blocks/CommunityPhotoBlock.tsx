// SEC07-07 신도 커뮤니티 사진
import { BlockProps } from './types'

export default function CommunityPhotoBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const photos: { src: string; author?: string; caption?: string; date?: string; likes?: number }[] = Array.isArray(cfg.photos) ? cfg.photos : []
  if (photos.length === 0) return null
  return (
    <section className="section" id="community-photo">
      <div className="section-inner">
        <p className="section-label">Community</p>
        <h2 className="section-title">{cfg.sectionTitle || '신도 사진'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {photos.map((p, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <img src={p.src} alt={p.caption || ''} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '.625rem .75rem' }}>
                {p.author && <p style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--color-text)' }}>{p.author}</p>}
                {p.caption && <p style={{ fontSize: '.75rem', color: 'var(--color-text-light)', marginTop: '.2rem', lineHeight: 1.4 }}>{p.caption}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.375rem' }}>
                  {p.date && <span style={{ fontSize: '.7rem', color: 'var(--color-text-light)' }}>{p.date}</span>}
                  {p.likes !== undefined && <span style={{ fontSize: '.7rem', color: 'var(--color-text-light)' }}>♥ {p.likes}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
