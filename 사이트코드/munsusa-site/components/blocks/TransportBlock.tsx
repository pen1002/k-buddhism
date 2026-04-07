// SEC10-08 교통편 안내
import { BlockProps } from './types'

export default function TransportBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const routes: { method: string; icon?: string; details: string[]; note?: string }[] = Array.isArray(cfg.routes) ? cfg.routes : []
  if (routes.length === 0 && !cfg.address) return null
  return (
    <section className="section" id="transport">
      <div className="section-inner">
        <p className="section-label">Transport</p>
        <h2 className="section-title">{cfg.sectionTitle || '교통편 안내'}</h2>
        {cfg.address && (
          <div style={{ marginTop: '1rem', padding: '.875rem 1.25rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem' }}>📍</span>
            <div>
              <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginBottom: '.2rem' }}>주소</p>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-text)' }}>{cfg.address}</p>
            </div>
          </div>
        )}
        {routes.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            {routes.map((r, i) => (
              <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{r.icon || '🚌'}</span>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)' }}>{r.method}</p>
                </div>
                <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
                  {r.details.map((d, j) => (
                    <li key={j} style={{ fontSize: '.85rem', color: 'var(--color-text-light)', lineHeight: 1.5 }}>{d}</li>
                  ))}
                </ul>
                {r.note && <p style={{ marginTop: '.625rem', fontSize: '.78rem', color: 'var(--color-accent)', borderTop: '1px solid var(--color-border)', paddingTop: '.5rem' }}>{r.note}</p>}
              </div>
            ))}
          </div>
        )}
        {cfg.mapEmbedUrl && (
          <div style={{ marginTop: '1.25rem', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <iframe src={cfg.mapEmbedUrl} width="100%" height="320" style={{ border: 'none', display: 'block' }} title="지도" loading="lazy" />
          </div>
        )}
      </div>
    </section>
  )
}
