// SEC02-04 언론 보도 링크
import { BlockProps } from './types'

export default function PressBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const items: { title: string; media: string; date?: string; url?: string }[] = Array.isArray(cfg.items) ? cfg.items : []
  if (items.length === 0) return null
  return (
    <section className="section" id="press">
      <div className="section-inner">
        <p className="section-label">Press</p>
        <h2 className="section-title">{cfg.sectionTitle || '언론 보도'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {items.map((item, i) => (
            <a key={i} href={item.url || '#'} target="_blank" rel="noopener"
              style={{ display: 'block', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem', textDecoration: 'none', transition: 'box-shadow .2s' }}>
              <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginBottom: '.5rem' }}>{item.media}{item.date && ` · ${item.date}`}</p>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '.95rem', lineHeight: 1.5 }}>{item.title}</p>
              <p style={{ marginTop: '.5rem', fontSize: '.8rem', color: 'var(--color-accent)' }}>기사 보기 →</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
