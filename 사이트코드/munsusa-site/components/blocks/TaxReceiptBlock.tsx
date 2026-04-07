'use client'
// SEC09-05 기부금 영수증 발급 안내 (UI only — 실제 발급 미구현)
import { useState } from 'react'
import { BlockProps } from './types'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3]

export default function TaxReceiptBlock({ blockData, temple }: BlockProps) {
  const cfg = blockData ?? {}
  if (!cfg.taxInfo && !cfg.showTaxReceipt) return null

  const orgName: string = cfg.taxInfo?.orgName || temple?.name || '본 사찰'
  const regNum: string = cfg.taxInfo?.registrationNumber || ''

  const [form, setForm] = useState({ name: '', rrn: '', address: '', year: String(CURRENT_YEAR - 1), email: '' })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[TaxReceipt] 기부금 영수증 신청 (UI only):', form)
    setSubmitted(true)
  }

  return (
    <section className="section" id="tax-receipt">
      <div className="section-inner" style={{ maxWidth: '640px' }}>
        <p className="section-label">Tax Donation Receipt</p>
        <h2 className="section-title">{cfg.sectionTitle || '기부금 영수증 발급'}</h2>

        {/* 안내 배너 */}
        <div style={{
          marginTop: '1.25rem', marginBottom: '1.5rem',
          padding: '1.25rem 1.5rem',
          background: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '.75rem' }}>
            📋 종교단체 기부금 세액공제 안내
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontFamily: 'var(--font-serif)', fontSize: '.88rem', color: 'var(--color-text)', lineHeight: 2 }}>
            <li>근로소득자 및 종합소득 신고자 모두 공제 가능</li>
            <li>기부금액의 <strong>15%</strong> 세액공제 (1천만원 초과분은 30%)</li>
            <li>소득세법 제34조에 따른 지정기부금 적용</li>
            <li>발급 기관: <strong>{orgName}</strong>{regNum && ` (고유번호: ${regNum})`}</li>
          </ul>
        </div>

        {submitted ? (
          <div style={{
            textAlign: 'center', padding: '3rem 2rem',
            background: 'var(--color-card)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
              영수증 발급 신청이 접수되었습니다
            </h3>
            <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-light)', lineHeight: 1.8 }}>
              입력하신 이메일({form.email})로<br />
              기부금 영수증이 발송됩니다.<br />
              처리에 1~3 영업일이 소요될 수 있습니다.
            </p>
            <button onClick={() => setSubmitted(false)} style={{
              marginTop: '1.25rem', padding: '8px 20px', background: 'var(--color-accent)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
              fontWeight: 600, fontSize: '.85rem', cursor: 'pointer',
            }}>재신청</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* 발급 연도 */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.88rem', color: 'var(--color-text)', marginBottom: '8px' }}>
                발급 연도 <span style={{ color: 'var(--color-warm)' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {YEARS.map(y => (
                  <button key={y} type="button" onClick={() => set('year', String(y))} style={{
                    padding: '8px 20px',
                    background: form.year === String(y) ? 'var(--color-accent)' : 'var(--color-card)',
                    color: form.year === String(y) ? '#fff' : 'var(--color-text)',
                    border: `1px solid ${form.year === String(y) ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                    fontSize: '.88rem', fontWeight: 600, cursor: 'pointer',
                  }}>{y}년</button>
                ))}
              </div>
            </div>

            {[
              { k: 'name', label: '성함', placeholder: '홍길동', type: 'text' },
              { k: 'rrn', label: '주민등록번호 앞자리', placeholder: '900101', type: 'text', maxLength: 6 },
              { k: 'address', label: '주소', placeholder: '서울특별시 중구 ...', type: 'text' },
              { k: 'email', label: '이메일 (수령 주소)', placeholder: 'example@email.com', type: 'email' },
            ].map(({ k, label, placeholder, type, maxLength }) => (
              <div key={k}>
                <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.88rem', color: 'var(--color-text)', marginBottom: '5px' }}>
                  {label} <span style={{ color: 'var(--color-warm)' }}>*</span>
                </label>
                <input
                  type={type} placeholder={placeholder} required
                  maxLength={maxLength}
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
              ⚠ 개인정보는 영수증 발급 외 목적으로 사용되지 않으며, 발급 즉시 파기됩니다.
            </p>

            <button type="submit" style={{
              padding: '12px', background: 'var(--color-accent)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
              fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
            }}>
              📄 기부금 영수증 신청
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
