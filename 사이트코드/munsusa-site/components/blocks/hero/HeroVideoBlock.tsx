'use client'
// H-02 드론 영상 자동재생 히어로
// 모바일: heroImage 폴백 / 데스크톱: videoUrl 자동재생 (음소거)
import { useEffect, useState } from 'react'
import { BlockProps } from '../types'

export default function HeroVideoBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const videoUrl: string = cfg.videoUrl || cfg.heroVideo || ''
  const imageUrl: string = cfg.heroImageUrl || cfg.heroImage || temple.heroImageUrl || ''
  const heroTitle: string = cfg.heroTitle || temple.name
  const badge: string = cfg.badge || `☸ ${temple.denomination || '대한불교 조계종'}`
  const heroDesc: string = cfg.heroDesc || ''
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!videoUrl && !imageUrl) return null

  const showVideo = videoUrl && !isMobile

  return (
    <section id="hero" style={{
      position: 'relative',
      minHeight: 'var(--theme-hero-height, 100svh)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--color-dark)',
    }}>
      {/* 배경 영상 */}
      {showVideo ? (
        <video
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          src={videoUrl}
        />
      ) : imageUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageUrl} alt={heroTitle}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
      ) : null}

      {/* 오버레이 */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%)',
      }} />

      {/* 콘텐츠 */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem' }}>
        {badge && (
          <div style={{
            display: 'inline-block', marginBottom: '1.2rem',
            padding: '6px 18px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'var(--color-gold-light)',
            fontSize: '.85rem', fontFamily: 'var(--font-serif)', letterSpacing: '.08em',
          }}>{badge}</div>
        )}
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
          fontWeight: 700, color: '#fff',
          lineHeight: 1.15, marginBottom: '1rem',
          textShadow: '0 2px 20px rgba(0,0,0,0.6)',
        }}>{heroTitle}</h1>
        {heroDesc && (
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto 1.8rem',
            lineHeight: 1.8, whiteSpace: 'pre-line',
          }}>{heroDesc}</p>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {cfg.cta1Label && (
            <a href={cfg.cta1Href || '#intro'} style={{
              display: 'inline-block', padding: '0.7rem 1.8rem',
              background: 'var(--color-gold)', color: 'var(--color-dark)',
              borderRadius: 'var(--radius)', fontWeight: 700,
              fontFamily: 'var(--font-sans)', fontSize: '.95rem',
              textDecoration: 'none',
            }}>{cfg.cta1Label}</a>
          )}
          {cfg.cta2Label && (
            <a href={cfg.cta2Href || '#visit'} style={{
              display: 'inline-block', padding: '0.7rem 1.8rem',
              border: '2px solid rgba(255,255,255,0.7)',
              color: '#fff', borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-sans)', fontSize: '.95rem',
              textDecoration: 'none',
            }}>{cfg.cta2Label}</a>
          )}
        </div>
      </div>

      {/* 스크롤 힌트 */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 2, color: 'rgba(255,255,255,0.6)', fontSize: '.75rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        animation: 'bounce 2s infinite',
      }}>
        <span>▼</span>
      </div>
    </section>
  )
}
