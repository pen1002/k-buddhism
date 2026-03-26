// SEC08-03 온라인 결제
import { BlockProps } from './types'

export default function PaymentBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const items: { name: string; amount: number; description?: string; category?: string }[] = Array.isArray(cfg.items) ? cfg.items : []
  if (items.length === 0) return null
  return (
    <section className="section" id="payment">
      <div className="section-inner">
        <p className="section-label">Payment</p>
        <h2 className="section-title">{cfg.sectionTitle || '온라인 결제'}</h2>
        {cfg.notice && (
          <div style={{ marginTop: '1rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', fontSize: '.875rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{cfg.notice}</div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              {item.category && <span style={{ fontSize: '.7rem', color: 'var(--color-text-light)', display: 'block', marginBottom: '.25rem' }}>{item.category}</span>}
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '.375rem' }}>{item.name}</p>
              {item.description && <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', lineHeight: 1.5, marginBottom: '.75rem' }}>{item.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{item.amount.toLocaleString()}원</span>
                <button style={{ padding: '.45rem 1rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '.85rem' }}>결제하기</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
