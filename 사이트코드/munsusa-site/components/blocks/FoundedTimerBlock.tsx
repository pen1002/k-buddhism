// SEC11-01 창건 D-Day 카운터
'use client'
import { useEffect, useState } from 'react'
import { BlockProps } from './types'

export default function FoundedTimerBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const [days, setDays] = useState<number | null>(null)
  const foundedYear: number | null = cfg.foundedYear ?? null
  useEffect(() => {
    if (!foundedYear) return
    const founded = new Date(`${foundedYear}-01-01`)
    const now = new Date()
    const diff = Math.floor((now.getTime() - founded.getTime()) / (1000 * 60 * 60 * 24))
    setDays(diff)
  }, [foundedYear])
  if (!foundedYear) return null
  return (
    <section className="section" id="founded-timer">
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <p className="section-label">Founded</p>
        <h2 className="section-title">{cfg.sectionTitle || '창건 기념'}</h2>
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '.9rem', color: 'var(--color-text-light)', marginBottom: '.75rem' }}>{foundedYear}년 창건</p>
          {days !== null ? (
            <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '.25rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(3rem, 10vw, 5rem)', color: 'var(--color-primary)', lineHeight: 1 }}>
                {days.toLocaleString()}
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-text-light)', paddingBottom: '.5rem' }}>일째</span>
            </div>
          ) : (
            <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--color-text-light)' }}>···</span>
            </div>
          )}
          {cfg.subtitle && <p style={{ marginTop: '1rem', fontSize: '1rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-serif)' }}>{cfg.subtitle}</p>}
        </div>
      </div>
    </section>
  )
}
