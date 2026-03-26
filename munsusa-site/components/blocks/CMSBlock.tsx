'use client'
// SEC09-04 CMS 정기 자동이체 신청 (UI only — 실제 CMS 연동 미구현)
import { useState } from 'react'
import { BlockProps } from './types'

const AMOUNT_OPTIONS = [10000, 30000, 50000, 100000]
const DEBIT_DAYS = ['10일', '20일', '25일']

export default function CMSBlock({ blockData, temple }: BlockProps) {
  const cfg = blockData ?? {}
  if (!cfg.cmsInfo && !cfg.bankOptions && !cfg.showCms) return null

  const [amount, setAmount] = useState<number | ''>('')
  const [customAmount, setCustomAmount] = useState('')
  const [debitDay, setDebitDay] = useState('10일')
  const [form, setForm] = useState({ name: '', phone: '', bank: '', account: '' })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const finalAmount = amount === '' ? (parseInt(customAmount.replace(/,/g, '')) || 0) : amount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[CMS] 정기 자동이체 신청 (UI only):', { ...form, amount: finalAmount, debitDay })
    setSubmitted(true)
  }

  return (
    <section className="section" id="cms-donation">
      <div className="section-inner" style={{ maxWidth: '640px' }}>
        <p className="section-label">Regular Donation</p>
        <h2 className="section-title">{cfg.sectionTitle || '정기 자동이체 후원'}</h2>
        {cfg.sectionDesc && <p className="section-desc">{cfg.sectionDesc}</p>}

        {submitted ? (
          <div style={{
            textAlign: 'center', padding: '3rem 2rem', marginTop: '1.5rem',
            background: 'var(--color-card)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
              신청이 접수되었습니다
            </h3>
            <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-light)', lineHeight: 1.8 }}>
              귀한 정기 후원에 감사드립니다.<br />
              사찰 담당자가 확인 후 연락드립니다.
            </p>
            {temple?.phone && (
              <a href={`tel:${temple.phone}`} style={{
                display: 'inline-block', marginTop: '1rem',
                padding: '8px 20px', background: 'var(--color-accent)', color: '#fff',
                borderRadius: 'var(--radius)', textDecoration: 'none',
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.88rem',
              }}>📞 {temple.phone}</a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 월 후원 금액 */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.88rem', color: 'var(--color-text)', marginBottom: '10px' }}>
                월 후원 금액 <span style={{ color: 'var(--color-warm)' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {AMOUNT_OPTIONS.map(opt => (
                  <button key={opt} type="button" onClick={() => { setAmount(opt); setCustomAmount('') }} style={{
                    padding: '8px 16px',
                    background: amount === opt ? 'var(--color-accent)' : 'var(--color-card)',
                    color: amount === opt ? '#fff' : 'var(--color-text)',
                    border: `1px solid ${amount === opt ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                    fontSize: '.88rem', fontWeight: 600, cursor: 'pointer',
                  }}>{(opt / 10000).toFixed(0)}만원</button>
                ))}
                <button type="button" onClick={() => setAmount('')} style={{
                  padding: '8px 16px',
                  background: amount === '' ? 'var(--color-accent)' : 'var(--color-card)',
                  color: amount === '' ? '#fff' : 'var(--color-text)',
                  border: `1px solid ${amount === '' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                  fontSize: '.88rem', fontWeight: 600, cursor: 'pointer',
                }}>직접 입력</button>
              </div>
              {amount === '' && (
                <input
                  type="number" min={1000} placeholder="금액 입력 (원)"
                  value={customAmount} onChange={e => setCustomAmount(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                    background: 'var(--color-card)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                    fontSize: '.92rem', color: 'var(--color-text)', outline: 'none',
                  }}
                />
              )}
              {finalAmount > 0 && (
                <p style={{ marginTop: '6px', fontSize: '.82rem', color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                  월 {finalAmount.toLocaleString()}원 정기 후원
                </p>
              )}
            </div>

            {/* 출금일 */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.88rem', color: 'var(--color-text)', marginBottom: '10px' }}>
                매월 출금일
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {DEBIT_DAYS.map(d => (
                  <button key={d} type="button" onClick={() => setDebitDay(d)} style={{
                    padding: '8px 20px',
                    background: debitDay === d ? 'var(--color-gold)' : 'var(--color-card)',
                    color: debitDay === d ? '#fff' : 'var(--color-text)',
                    border: `1px solid ${debitDay === d ? 'var(--color-gold)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                    fontSize: '.88rem', fontWeight: 600, cursor: 'pointer',
                  }}>매월 {d}</button>
                ))}
              </div>
            </div>

            {/* 신청자 정보 */}
            {[
              { k: 'name', label: '성함', placeholder: '홍길동', type: 'text' },
              { k: 'phone', label: '연락처', placeholder: '010-0000-0000', type: 'tel' },
              { k: 'bank', label: '출금 은행', placeholder: '국민은행', type: 'text' },
              { k: 'account', label: '출금 계좌번호', placeholder: '000-00-000000', type: 'text' },
            ].map(({ k, label, placeholder, type }) => (
              <div key={k}>
                <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.88rem', color: 'var(--color-text)', marginBottom: '5px' }}>
                  {label} <span style={{ color: 'var(--color-warm)' }}>*</span>
                </label>
                <input
                  type={type} placeholder={placeholder} required
                  value={form[k as keyof typeof form]}
                  onChange={e => set(k, e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                    background: 'var(--color-card)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                    fontSize: '.92rem', color: 'var(--color-text)', outline: 'none',
                  }}
                />
              </div>
            ))}

            <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', lineHeight: 1.7, fontFamily: 'var(--font-serif)', padding: '10px 14px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)' }}>
              ⚠ 개인 금융 정보는 정기 자동이체 신청 외 다른 목적으로 사용되지 않습니다.
              신청 완료 후 사찰에서 확인 연락을 드립니다.
            </p>

            <button type="submit" disabled={!finalAmount} style={{
              padding: '12px', background: 'var(--color-accent)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
              fontWeight: 700, fontSize: '.95rem', cursor: finalAmount ? 'pointer' : 'not-allowed',
              opacity: finalAmount ? 1 : 0.5,
            }}>
              정기 후원 신청하기
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
