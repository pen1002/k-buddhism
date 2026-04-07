'use client'
// SEC09-02 무통장 입금 안내 (계좌번호 클립보드 복사)
import { useState } from 'react'
import { BlockProps } from './types'

export default function BankTransferBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const bankInfo = cfg.bankInfo ?? cfg ?? {}
  const bank: string = bankInfo.bank || cfg.bank || ''
  const account: string = bankInfo.account || cfg.account || ''
  const holder: string = bankInfo.holder || cfg.holder || ''
  const [copied, setCopied] = useState(false)

  if (!account) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback: select text
    }
  }

  return (
    <section className="section" id="bank-transfer">
      <div className="section-inner" style={{ maxWidth: '620px' }}>
        <p className="section-label">Bank Transfer</p>
        <h2 className="section-title">무통장 입금 안내</h2>

        <div style={{
          marginTop: '2rem',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ marginBottom: '1.2rem' }}>
            <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>은행명</p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {bank || '—'}
            </p>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>계좌번호</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <p style={{
                fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 700,
                color: 'var(--color-accent)', letterSpacing: '.06em',
              }}>{account}</p>
              <button
                onClick={handleCopy}
                style={{
                  padding: '6px 16px',
                  background: copied ? 'var(--color-gold)' : 'var(--color-bg-alt)',
                  color: copied ? '#fff' : 'var(--color-text)',
                  border: `1px solid ${copied ? 'var(--color-gold)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-sans)', fontSize: '.82rem',
                  cursor: 'pointer', transition: 'var(--transition)',
                  fontWeight: copied ? 700 : 400,
                }}
              >{copied ? '✓ 복사됨!' : '복사'}</button>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginBottom: '4px', fontFamily: 'var(--font-sans)' }}>예금주</p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)' }}>
              {holder || temple.name}
            </p>
          </div>

          {cfg.notice && (
            <p style={{
              fontSize: '.85rem', color: 'var(--color-text-light)',
              lineHeight: 1.75, borderTop: '1px solid var(--color-border)',
              paddingTop: '1rem', whiteSpace: 'pre-line',
            }}>{cfg.notice}</p>
          )}

          {temple.phone && (
            <a href={`tel:${temple.phone}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              marginTop: '1rem', padding: '10px 20px',
              background: 'var(--color-accent)', color: '#fff',
              borderRadius: 'var(--radius)', textDecoration: 'none',
              fontFamily: 'var(--font-sans)', fontSize: '.88rem', fontWeight: 600,
            }}>📞 후원 문의: {temple.phone}</a>
          )}
        </div>
      </div>
    </section>
  )
}
