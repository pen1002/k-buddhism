// SEC07-03 앨범 아카이브
import { BlockProps } from './types'

export default function AlbumArchiveBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const albums: { title: string; year?: string; cover?: string; count?: number; url?: string }[] = Array.isArray(cfg.albums) ? cfg.albums : []
  if (albums.length === 0) return null
  return (
    <section className="section" id="album-archive">
      <div className="section-inner">
        <p className="section-label">Archive</p>
        <h2 className="section-title">{cfg.sectionTitle || '사진 아카이브'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {albums.map((a, i) => (
            <a key={i} href={a.url || '#'} style={{ display: 'block', textDecoration: 'none', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ aspectRatio: '4/3', background: 'var(--color-bg-alt)', position: 'relative' }}>
                {a.cover ? (
                  <img src={a.cover} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '2rem' }}>🖼</span></div>
                )}
                {a.count && (
                  <div style={{ position: 'absolute', bottom: '.5rem', right: '.5rem', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '.75rem', borderRadius: '3px', padding: '.15rem .4rem' }}>{a.count}장</div>
                )}
              </div>
              <div style={{ padding: '.875rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)' }}>{a.title}</p>
                {a.year && <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginTop: '.25rem' }}>{a.year}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
