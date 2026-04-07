'use client'
// SEC03-20 연간 법회 달력
import { useState } from 'react'
import { BlockProps } from './types'

interface CalEvent { month: number; day: number; title: string; type?: string }

const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

export default function AnnualCalendarBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const events: CalEvent[] = Array.isArray(cfg.events) ? cfg.events : []
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
  const [tooltip, setTooltip] = useState<string>('')

  const eventsInMonth = events.filter(e => e.month === activeMonth + 1)

  return (
    <section className="section" id="annual-calendar">
      <div className="section-inner">
        <p className="section-label">Annual Schedule</p>
        <h2 className="section-title">{cfg.sectionTitle || '연간 법회 달력'}</h2>

        {/* 월 탭 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '2rem', justifyContent: 'center' }}>
          {MONTHS.map((m, i) => {
            const hasEvent = events.some(e => e.month === i + 1)
            return (
              <button
                key={i}
                onClick={() => setActiveMonth(i)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius)',
                  border: `1.5px solid ${activeMonth === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: activeMonth === i ? 'var(--color-accent)' : 'var(--color-card)',
                  color: activeMonth === i ? '#fff' : 'var(--color-text)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '.82rem', fontWeight: activeMonth === i ? 700 : 400,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {m}
                {hasEvent && activeMonth !== i && (
                  <span style={{
                    position: 'absolute', top: '2px', right: '2px',
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--color-gold)',
                  }} />
                )}
              </button>
            )
          })}
        </div>

        {/* 선택된 월 행사 목록 */}
        {eventsInMonth.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem',
          }}>
            {eventsInMonth.map((ev, i) => (
              <div key={i} style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderLeft: '3px solid var(--color-accent)',
                borderRadius: 'var(--radius)',
                padding: '1rem 1.2rem',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: '.78rem', color: 'var(--color-gold-dark)', fontWeight: 700, marginBottom: '4px' }}>
                  {activeMonth + 1}월 {ev.day}일
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-text)' }}>
                  {ev.title}
                </div>
                {ev.type && (
                  <span style={{
                    display: 'inline-block', marginTop: '6px',
                    fontSize: '.72rem', padding: '2px 8px', borderRadius: '10px',
                    background: 'var(--color-bg-alt)', color: 'var(--color-text-light)',
                  }}>{ev.type}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '3rem 1rem',
            color: 'var(--color-text-light)', fontFamily: 'var(--font-serif)',
          }}>
            {MONTHS[activeMonth]}에 예정된 행사가 없습니다
          </div>
        )}
      </div>
    </section>
  )
}
