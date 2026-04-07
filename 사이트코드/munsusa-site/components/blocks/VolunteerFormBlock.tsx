// SEC12-05 봉사 신청 폼
'use client'
import { useState } from 'react'
import { BlockProps } from './types'

export default function VolunteerFormBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const [form, setForm] = useState({ name: '', phone: '', date: '', area: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const areas: string[] = Array.isArray(cfg.areas) ? cfg.areas : ['공양간', '도서관', '법당 청소', '안내', '기타']
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }
  if (submitted) {
    return (
      <section className="section" id="volunteer-form">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
          <h2 className="section-title">신청이 완료되었습니다</h2>
          <p style={{ marginTop: '.75rem', color: 'var(--color-text-light)' }}>봉사 신청을 감사드립니다. 담당자가 연락드리겠습니다.</p>
        </div>
      </section>
    )
  }
  return (
    <section className="section" id="volunteer-form">
      <div className="section-inner">
        <p className="section-label">Apply</p>
        <h2 className="section-title">{cfg.sectionTitle || '봉사 신청'}</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--color-text-light)', marginBottom: '.375rem' }}>이름 *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: '.9rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--color-text-light)', marginBottom: '.375rem' }}>연락처 *</label>
            <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: '.9rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--color-text-light)', marginBottom: '.375rem' }}>희망 날짜 *</label>
            <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: '.9rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--color-text-light)', marginBottom: '.375rem' }}>봉사 분야 *</label>
            <select required value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: '.9rem', boxSizing: 'border-box' }}>
              <option value="">선택하세요</option>
              {areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.85rem', color: 'var(--color-text-light)', marginBottom: '.375rem' }}>신청 내용</label>
            <textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: '.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ padding: '.75rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>봉사 신청하기</button>
        </form>
      </div>
    </section>
  )
}
