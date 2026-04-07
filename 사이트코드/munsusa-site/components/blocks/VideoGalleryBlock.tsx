// SEC07-06 동영상 갤러리
import { BlockProps } from './types'

export default function VideoGalleryBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const videos: { title: string; youtubeId?: string; url?: string; thumbnail?: string; date?: string }[] = Array.isArray(cfg.videos) ? cfg.videos : []
  if (videos.length === 0) return null
  return (
    <section className="section" id="video-gallery">
      <div className="section-inner">
        <p className="section-label">Video Gallery</p>
        <h2 className="section-title">{cfg.sectionTitle || '동영상 갤러리'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {videos.map((v, i) => {
            const thumb = v.thumbnail || (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg` : null)
            const href = v.url || (v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : '#')
            return (
              <a key={i} href={href} target="_blank" rel="noopener" style={{ display: 'block', textDecoration: 'none', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--color-bg-alt)' }}>
                  {thumb && <img src={thumb} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ width: '44px', height: '44px', background: 'rgba(0,0,0,0.7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontSize: '1.1rem', marginLeft: '3px' }}>▶</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '.75rem 1rem', background: 'var(--color-card)' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '.9rem', lineHeight: 1.4 }}>{v.title}</p>
                  {v.date && <p style={{ fontSize: '.75rem', color: 'var(--color-text-light)', marginTop: '.25rem' }}>{v.date}</p>}
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
