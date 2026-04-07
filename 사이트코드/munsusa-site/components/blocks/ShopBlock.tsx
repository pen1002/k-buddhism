// SEC12-06 불교 용품 안내
import { BlockProps } from './types'

export default function ShopBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const products: { name: string; price?: number; description?: string; image?: string; url?: string; category?: string }[] = Array.isArray(cfg.products) ? cfg.products : []
  if (products.length === 0) return null
  return (
    <section className="section" id="shop">
      <div className="section-inner">
        <p className="section-label">Shop</p>
        <h2 className="section-title">{cfg.sectionTitle || '불교 용품'}</h2>
        {cfg.notice && <p style={{ marginTop: '.75rem', fontSize: '.875rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{cfg.notice}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {products.map((p, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ aspectRatio: '1/1', background: 'var(--color-bg-alt)' }}>
                {p.image ? (
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🛕</div>
                )}
              </div>
              <div style={{ padding: '.875rem' }}>
                {p.category && <span style={{ fontSize: '.7rem', color: 'var(--color-text-light)', display: 'block', marginBottom: '.2rem' }}>{p.category}</span>}
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-text)', fontSize: '.9rem' }}>{p.name}</p>
                {p.description && <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginTop: '.25rem', lineHeight: 1.4 }}>{p.description}</p>}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.625rem' }}>
                  {p.price !== undefined && (
                    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-primary)' }}>{p.price.toLocaleString()}원</span>
                  )}
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener" style={{ fontSize: '.78rem', color: 'var(--color-accent)', textDecoration: 'none' }}>자세히 →</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
