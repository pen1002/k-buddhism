// SEC02-05 종단 공문 게시판
import { BlockProps } from './types'

export default function OfficialNoticeBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const items: { title: string; number?: string; date?: string; url?: string }[] = Array.isArray(cfg.items) ? cfg.items : []
  if (items.length === 0) return null
  return (
    <section className="section" id="official-notice">
      <div className="section-inner">
        <p className="section-label">Official</p>
        <h2 className="section-title">{cfg.sectionTitle || '종단 공문'}</h2>
        <div style={{ marginTop: '1.5rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.875rem 1.25rem', borderBottom: i < items.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              {item.number && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)', minWidth: '60px', flexShrink: 0 }}>{item.number}</span>}
              <span style={{ flex: 1, fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '.9rem' }}>{item.title}</span>
              {item.date && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)', flexShrink: 0 }}>{item.date}</span>}
              {item.url && <a href={item.url} style={{ fontSize: '.75rem', color: 'var(--color-accent)', flexShrink: 0, textDecoration: 'none' }}>열기</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
