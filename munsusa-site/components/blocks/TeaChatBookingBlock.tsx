'use client'
// SEC06-04 스님 차담 예약 폼 (UI only — 실제 발송 미구현)
import { useState } from 'react'
import { BlockProps } from './types'

interface TeaChatInfo {
  availableDays?: string[]
  hours?: string
  email?: string
  notice?: string
}

export default function TeaChatBookingBlock({ blockData, temple }: BlockProps) {
  const cfg = blockData ?? {}
  const info: TeaChatInfo = cfg.teaChatInfo ?? cfg
  const availableDays: string[] = Array.isArray(info.availableDays) ? info.availableDays : ['화', '수', '목', '금', '토']
  const hours: string = info.hours || '오전 10:00 ~ 오후 4:00'
  const notice: string = info.notice || '예약 접수 후 사찰에서 확인 전화를 드립니다.'

  if (!cfg.teaChatInfo && !cfg.availableDays && !cfg.hours) return null

  const [form, setForm] = useState({ name: '', phone: '', date: '', topic: '' })
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[TeaChat] 차담 예약 접수 (UI only):', form)
    setSubmitted(true)
  }

  return (
    <section className="section" id="tea-chat-booking">
      <div className="section-inner" style={{ maxWidth: '640px' }}>
        <p className="section-label">Tea Chat Reservation</p>
        <h2 className="section-title">{cfg.sectionTitle || '스님과의 차담 예약'}</h2>

        {/* 운영 안내 */}
        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap',
          marginTop: '1.25rem', marginBottom: '2rem',
        }}>
          <div style={{ padding: '10px 18px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)' }}>
            <p style={{ fontSize: '.72rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>가능 요일</p>
            <p style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '.9rem' }}>
              {availableDays.join('·')}요일
            </p>
          </div>
          <div style={{ padding: '10px 18px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)' }}>
            <p style={{ fontSize: '.72rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>운영 시간</p>
            <p style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '.9rem' }}>{hours}</p>
          </div>
        </div>

        {submitted ? (
          <div style={{
            textAlign: 'center', padding: '3rem 2rem',
            background: 'var(--color-card)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☸</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
              예약이 접수되었습니다
            </h3>
            <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-light)', lineHeight: 1.8 }}>
              {notice}
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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { k: 'name', label: '성함', placeholder: '홍길동', type: 'text', required: true },
              { k: 'phone', label: '연락처', placeholder: '010-0000-0000', type: 'tel', required: true },
              { k: 'date', label: '희망 날짜', placeholder: '', type: 'date', required: true },
            ].map(({ k, label, placeholder, type, required }) => (
              <div key={k}>
                <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.88rem', color: 'var(--color-text)', marginBottom: '6px' }}>
                  {label} {required && <span style={{ color: 'var(--color-warm)' }}>*</span>}
                </label>
                <input
                  type={type} placeholder={placeholder} required={required}
                  value={form[k as keyof typeof form]}
                  onChange={e => set(k, e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', boxSizing: 'border-box',
                    background: 'var(--color-card)', border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                    fontSize: '.92rem', color: 'var(--color-text)',
                    outline: 'none',
                  }}
                />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.88rem', color: 'var(--color-text)', marginBottom: '6px' }}>
                상담 주제
              </label>
              <textarea
                placeholder="마음 수행, 인생 상담, 불교 입문 등 자유롭게 적어주세요."
                rows={3} value={form.topic}
                onChange={e => set('topic', e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', boxSizing: 'border-box',
                  background: 'var(--color-card)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)', fontFamily: 'var(--font-serif)',
                  fontSize: '.92rem', color: 'var(--color-text)',
                  resize: 'vertical', lineHeight: 1.7, outline: 'none',
                }}
              />
            </div>

            {notice && (
              <p style={{ fontSize: '.82rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-serif)', lineHeight: 1.7, padding: '10px 14px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)' }}>
                ℹ {notice}
              </p>
            )}

            <button type="submit" style={{
              padding: '12px', background: 'var(--color-accent)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
              fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
            }}>
              ☸ 예약 신청
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
