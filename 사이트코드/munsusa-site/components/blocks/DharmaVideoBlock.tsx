// SEC04-02 법문 동영상
import { BlockProps } from './types'

export default function DharmaVideoBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const videos: { title: string; youtubeId?: string; url?: string; date?: string; speaker?: string; thumbnail?: string }[] = Array.isArray(cfg.videos) ? cfg.videos : []
  if (videos.length === 0) return null
  return (
    <section className="section" id="dharma-video">
      <div className="section-inner">
        <p className="section-label">Video</p>
        <h2 className="section-title">{cfg.sectionTitle || '법문 영상'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {videos.map((v, i) => {
            const thumb = v.thumbnail || (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg` : null)
            const href = v.url || (v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : '#')
            return (
              <a key={i} href={href} target="_blank" rel="noopener" style={{ display: 'block', textDecoration: 'none', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--color-bg-alt)' }}>
                  {thumb && <img src={thumb} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontSize: '1.25rem', marginLeft: '3px' }}>▶</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '.95rem', lineHeight: 1.5 }}>{v.title}</p>
                  <div style={{ display: 'flex', gap: '.75rem', marginTop: '.375rem' }}>
                    {v.speaker && <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)' }}>{v.speaker}</span>}
                    {v.date && <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)' }}>{v.date}</span>}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
