// SEC02-03 / SEC06-05 / SEC10-05 사보·PDF 다운로드
import { BlockProps } from './types'

interface Publication {
  title: string
  coverImage?: string
  pdfUrl: string
  date: string
  issue?: string
}

export default function PublicationBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const pubs: Publication[] = Array.isArray(cfg.publications) ? cfg.publications.slice(0, 6) : []
  if (pubs.length === 0) return null

  return (
    <section className="section" id="publications">
      <div className="section-inner">
        <p className="section-label">Publications</p>
        <h2 className="section-title">{cfg.sectionTitle || '사보 · 자료집'}</h2>
        {cfg.sectionDesc && (
          <p className="section-desc">{cfg.sectionDesc}</p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: '1.5rem', marginTop: '2rem',
        }}>
          {pubs.map((p, i) => (
            <div key={i} className="fade-in" style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex', flexDirection: 'column',
            }}>
              {p.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={p.coverImage} alt={p.title}
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  aspectRatio: '3/4', background: 'var(--color-bg-alt)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  <span style={{ fontSize: '2.5rem' }}>📄</span>
                  {p.issue && (
                    <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)' }}>
                      {p.issue}호
                    </span>
                  )}
                </div>
              )}
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{
                  fontFamily: 'var(--font-serif)', fontSize: '.95rem', fontWeight: 700,
                  color: 'var(--color-text)', margin: 0, lineHeight: 1.4,
                }}>{p.title}</h4>
                <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                  {p.date}
                </p>
                <a
                  href={p.pdfUrl}
                  target="_blank" rel="noopener noreferrer"
                  download
                  style={{
                    marginTop: 'auto',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '7px 0', background: 'var(--color-accent)', color: '#fff',
                    borderRadius: 'var(--radius)', fontSize: '.8rem', fontWeight: 700,
                    textDecoration: 'none', fontFamily: 'var(--font-sans)',
                  }}
                >
                  📥 PDF 다운로드
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
