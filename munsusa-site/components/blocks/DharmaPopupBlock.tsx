// SEC04-03 오늘의 법문 팝업 (client component for modal)
'use client'
import { useState } from 'react'
import { BlockProps } from './types'

export default function DharmaPopupBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const [open, setOpen] = useState(false)
  const verses: { text: string; source?: string }[] = Array.isArray(cfg.verses) ? cfg.verses : []
  if (verses.length === 0) return null
  const today = new Date()
  const verse = verses[today.getDate() % verses.length]
  return (
    <>
      <section className="section" id="dharma-popup">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <p className="section-label">Today's Dharma</p>
          <h2 className="section-title">{cfg.sectionTitle || '오늘의 법문'}</h2>
          <div style={{ marginTop: '1.5rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '600px', margin: '1.5rem auto 0' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.8, fontStyle: 'italic' }}>
              "{verse.text}"
            </p>
            {verse.source && <p style={{ marginTop: '1rem', fontSize: '.85rem', color: 'var(--color-text-light)' }}>— {verse.source}</p>}
          </div>
          {verses.length > 1 && (
            <button onClick={() => setOpen(true)} style={{ marginTop: '1.5rem', padding: '.6rem 1.5rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-serif)' }}>
              더 보기
            </button>
          )}
        </div>
      </section>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setOpen(false)}>
          <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '560px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)' }}>법문 모음</h3>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-light)' }}>×</button>
            </div>
            {verses.map((v, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', lineHeight: 1.7 }}>"{v.text}"</p>
                {v.source && <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', marginTop: '.375rem' }}>— {v.source}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
