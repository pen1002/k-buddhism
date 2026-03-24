'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface SlideItem {
  image?: string
  title?: string
  desc?: string
}

interface Props {
  config: Cfg
  temple: { name: string; nameEn?: string | null; denomination?: string | null; primaryColor: string; secondaryColor: string; heroImageUrl?: string | null }
}

function normalizeSlides(rawSlides: unknown, fallbackImage?: string | null): SlideItem[] {
  if (!Array.isArray(rawSlides) || rawSlides.length === 0) {
    return [{ image: fallbackImage || '', title: '' }]
  }
  return rawSlides.map(s =>
    typeof s === 'string'
      ? { image: fallbackImage || '', title: s }
      : { image: s.image || fallbackImage || '', title: s.title || '', desc: s.desc || '' }
  )
}

export default function HeroSlideBlock({ config, temple }: Props) {
  const heroTitle  = config.heroTitle  || temple.name
  const heroHanja  = config.heroHanja  || ''
  const badge      = config.badge      || ''
  const heroDesc   = config.heroDesc   || ''
  const bgImage    = config.bgImage    || temple.heroImageUrl || ''
  const slides     = normalizeSlides(config.slides, bgImage)
  const autoDelay  = config.autoDelay  || 5000

  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((idx: number) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(idx)
      setFading(false)
    }, 300)
  }, [])

  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo])
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo])

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(next, autoDelay)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [next, autoDelay, slides.length])

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      if (timerRef.current) clearInterval(timerRef.current)
      dx < 0 ? next() : prev()
    }
    touchStartX.current = null
  }

  const slide = slides[current]
  const hasImages = slides.some(s => s.image)

  return (
    <section
      id="hero"
      style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#1a0f08' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 슬라이드 배경 이미지 */}
      {hasImages && slides.map((s, i) => s.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={s.image}
          alt={s.title || heroTitle}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: i === current && !fading ? 0.55 : 0,
            transition: 'opacity 0.8s ease',
          }}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      {/* 이미지 없을 때 — 사찰 색상 그라디언트 배경 */}
      {!hasImages && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 30% 50%, ${temple.primaryColor}44, #1a0f08 70%)`,
        }} />
      )}

      {/* 다크 오버레이 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.8) 100%)',
      }} />

      {/* 컨텐츠 */}
      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff',
        padding: '0 24px', maxWidth: '860px',
        opacity: fading ? 0 : 1, transition: 'opacity 0.3s ease',
      }}>
        {badge && (
          <div style={{
            display: 'inline-block', padding: '6px 18px',
            border: `1px solid ${temple.secondaryColor}`, borderRadius: '24px',
            fontSize: '0.82rem', color: temple.secondaryColor,
            marginBottom: '20px', letterSpacing: '0.05em',
          }}>
            {badge}
          </div>
        )}

        <h1 style={{
          fontFamily: 'var(--font-serif, serif)',
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1.1,
          margin: '0 0 12px', textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          {heroTitle}
        </h1>

        {heroHanja && (
          <div style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
            letterSpacing: '0.3em', color: temple.secondaryColor,
            marginBottom: '16px', opacity: 0.9,
          }}>
            {heroHanja}
          </div>
        )}

        {/* 현재 슬라이드 타이틀 (zone 이름 등) */}
        {slide.title && (
          <div style={{
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.15em',
            marginBottom: '12px',
            textTransform: 'uppercase' as const,
          }}>
            {slide.title}
          </div>
        )}

        {heroDesc && !slide.desc && (
          <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '32px', whiteSpace: 'pre-line' }}>
            {heroDesc}
          </p>
        )}
        {slide.desc && (
          <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '32px' }}>
            {slide.desc}
          </p>
        )}
      </div>

      {/* 좌우 화살표 (2장 이상일 때) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => { if (timerRef.current) clearInterval(timerRef.current); prev() }}
            style={{
              position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 3, background: 'rgba(0,0,0,0.35)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50%',
              width: '48px', height: '48px', fontSize: '1.2rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            aria-label="이전"
          >‹</button>
          <button
            onClick={() => { if (timerRef.current) clearInterval(timerRef.current); next() }}
            style={{
              position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 3, background: 'rgba(0,0,0,0.35)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50%',
              width: '48px', height: '48px', fontSize: '1.2rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            aria-label="다음"
          >›</button>
        </>
      )}

      {/* 하단 도트 인디케이터 */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '10px', zIndex: 3,
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (timerRef.current) clearInterval(timerRef.current); goTo(i) }}
              style={{
                width: i === current ? '28px' : '8px', height: '8px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: i === current ? temple.secondaryColor : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease', padding: 0,
              }}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* 슬라이드 카운터 */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '40px', right: '24px', zIndex: 3,
          color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', letterSpacing: '0.05em',
        }}>
          {current + 1} / {slides.length}
        </div>
      )}
    </section>
  )
}
