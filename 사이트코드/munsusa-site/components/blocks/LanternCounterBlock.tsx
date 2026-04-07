// SEC11-02 연등 후원 카운터
'use client'
import { useEffect, useRef, useState } from 'react'
import { BlockProps } from './types'

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const started = useRef(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          setCount(Math.floor(p * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])
  return { count, ref }
}

export default function LanternCounterBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const total: number = cfg.total ?? 0
  const year: number = cfg.year ?? new Date().getFullYear()
  const { count, ref } = useCountUp(total)
  if (!total) return null
  return (
    <section className="section" id="lantern-counter">
      <div className="section-inner" style={{ textAlign: 'center' }}>
        <p className="section-label">Lanterns</p>
        <h2 className="section-title">{cfg.sectionTitle || '연등 후원 현황'}</h2>
        <div ref={ref} style={{ marginTop: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>🪔</div>
          <p style={{ fontSize: '.9rem', color: 'var(--color-text-light)', marginBottom: '.5rem' }}>{year}년 연등 후원</p>
          <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '.25rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: 'var(--color-primary)', lineHeight: 1 }}>
              {count.toLocaleString()}
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-light)', paddingBottom: '.375rem' }}>등</span>
          </div>
          {cfg.goal && (
            <div style={{ marginTop: '1.25rem', maxWidth: '360px', margin: '1.25rem auto 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.78rem', color: 'var(--color-text-light)', marginBottom: '.375rem' }}>
                <span>달성률</span><span>{Math.min(Math.round(total / cfg.goal * 100), 100)}%</span>
              </div>
              <div style={{ background: 'var(--color-border)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(total / cfg.goal * 100, 100)}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '999px' }} />
              </div>
              <p style={{ fontSize: '.75rem', color: 'var(--color-text-light)', marginTop: '.375rem' }}>목표: {cfg.goal.toLocaleString()}등</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
