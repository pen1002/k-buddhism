// SEC02-06 종무소 운영 변경 안내
import { BlockProps } from './types'

export default function AdminNoticeBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const notices: { title: string; content: string; validUntil?: string }[] = Array.isArray(cfg.notices) ? cfg.notices : []
  if (notices.length === 0) return null
  return (
    <section className="section" id="admin-notice">
      <div className="section-inner">
        <p className="section-label">Notice</p>
        <h2 className="section-title">{cfg.sectionTitle || '종무소 안내'}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '1.5rem' }}>
          {notices.map((n, i) => (
            <div key={i} style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', borderLeft: '4px solid var(--color-warm)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '.375rem' }}>{n.title}</p>
              <p style={{ fontSize: '.875rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{n.content}</p>
              {n.validUntil && <p style={{ fontSize: '.75rem', color: 'var(--color-text-light)', marginTop: '.375rem' }}>적용 기간: {n.validUntil}까지</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
