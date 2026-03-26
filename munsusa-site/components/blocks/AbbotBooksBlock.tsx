// SEC06-07 주지 저서
import { BlockProps } from './types'

export default function AbbotBooksBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const books: { title: string; year?: string; publisher?: string; description?: string; cover?: string; url?: string }[] = Array.isArray(cfg.books) ? cfg.books : []
  if (books.length === 0) return null
  return (
    <section className="section" id="abbot-books">
      <div className="section-inner">
        <p className="section-label">Books</p>
        <h2 className="section-title">{cfg.sectionTitle || '주지 스님 저서'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {books.map((b, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ aspectRatio: '3/4', background: 'var(--color-bg-alt)', position: 'relative' }}>
                {b.cover ? (
                  <img src={b.cover} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary)', opacity: 0.15 }}>
                    <span style={{ fontSize: '3rem', opacity: 5 }}>📖</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '.875rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '.9rem', lineHeight: 1.4 }}>{b.title}</p>
                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.375rem' }}>
                  {b.year && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)' }}>{b.year}</span>}
                  {b.publisher && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)' }}>{b.publisher}</span>}
                </div>
                {b.url && <a href={b.url} target="_blank" rel="noopener" style={{ display: 'inline-block', marginTop: '.5rem', fontSize: '.75rem', color: 'var(--color-accent)', textDecoration: 'none' }}>구매하기 →</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
