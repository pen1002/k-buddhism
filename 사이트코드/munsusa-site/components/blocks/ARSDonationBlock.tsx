// SEC08-04 ARS 후원
import { BlockProps } from './types'

export default function ARSDonationBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  if (!cfg.arsNumber && !cfg.description) return null
  return (
    <section className="section" id="ars-donation">
      <div className="section-inner">
        <p className="section-label">ARS Donation</p>
        <h2 className="section-title">{cfg.sectionTitle || 'ARS 후원'}</h2>
        <div style={{ marginTop: '1.5rem', maxWidth: '480px', margin: '1.5rem auto 0', textAlign: 'center' }}>
          <div style={{ background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '.9rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>{cfg.description || 'ARS로 간편하게 후원하실 수 있습니다'}</p>
            {cfg.arsNumber && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📞</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2rem', color: 'var(--color-primary)', letterSpacing: '2px' }}>{cfg.arsNumber}</span>
              </div>
            )}
            {cfg.amount && <p style={{ fontSize: '.875rem', color: 'var(--color-text-light)', marginBottom: '.5rem' }}>1회 통화 = {cfg.amount}원 기부</p>}
            {cfg.charity && <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)' }}>주관: {cfg.charity}</p>}
          </div>
          {cfg.bankAccount && (
            <div style={{ marginTop: '1rem', background: 'var(--color-card)', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', marginBottom: '.375rem' }}>계좌 이체</p>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)' }}>{cfg.bankAccount}</p>
              {cfg.bankName && <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginTop: '.25rem' }}>{cfg.bankName}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
