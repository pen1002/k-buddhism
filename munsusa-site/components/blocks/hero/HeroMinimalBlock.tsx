// H-09 명상 미니멀 타이포 히어로
// 선어록 중심 여백 극대화 미니멀 히어로
import { BlockProps } from '../types'

export default function HeroMinimalBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const heroTitle: string = cfg.heroTitle || temple.name
  const heroHanja: string = cfg.heroHanja || ''
  const quoteText: string = cfg.quoteText || cfg.heroDesc || ''
  const badge: string = cfg.badge || `☸ ${temple.denomination || '대한불교 조계종'}`

  return (
    <section id="hero" style={{
      minHeight: 'var(--theme-hero-height, 95svh)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: '0 2rem',
      position: 'relative',
    }}>
      {/* 배경 수직 장식선 */}
      <div style={{
        position: 'absolute', top: '10%', bottom: '10%',
        left: '50%', width: '1px',
        background: 'linear-gradient(to bottom, transparent, var(--color-border), var(--color-gold), var(--color-border), transparent)',
        transform: 'translateX(-50%)',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>
        {/* 종단 뱃지 */}
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '.78rem', letterSpacing: '.18em',
          color: 'var(--color-text-light)',
          marginBottom: '3rem',
          textTransform: 'uppercase',
        }}>{badge}</p>

        {/* 사찰명 */}
        <h1 style={{
          fontFamily: 'var(--font-display, var(--font-serif))',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 400, letterSpacing: '.12em',
          color: 'var(--color-dark)',
          lineHeight: 1.1,
          marginBottom: heroHanja ? '0.5rem' : '2rem',
        }}>{heroTitle}</h1>

        {heroHanja && (
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            letterSpacing: '.3em',
            color: 'var(--color-text-light)',
            marginBottom: '2.5rem',
          }}>{heroHanja}</p>
        )}

        {/* 구분선 */}
        <div style={{
          width: '60px', height: '2px',
          background: 'var(--color-gold)',
          margin: '0 auto 2.5rem',
        }} />

        {/* 선어록 */}
        {quoteText && (
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
            color: 'var(--color-text)',
            lineHeight: 2, maxWidth: '560px',
            margin: '0 auto 3rem',
            fontStyle: 'italic',
          }}>&ldquo;{quoteText}&rdquo;</p>
        )}

        {/* CTA */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {cfg.cta1Label && (
            <a href={cfg.cta1Href || '#intro'} style={{
              display: 'inline-block', padding: '0.8rem 2.2rem',
              background: 'var(--color-accent)', color: '#fff',
              borderRadius: 'var(--radius)', fontWeight: 600,
              fontFamily: 'var(--font-sans)', fontSize: '.9rem',
              textDecoration: 'none', letterSpacing: '.04em',
            }}>{cfg.cta1Label}</a>
          )}
          {cfg.cta2Label && (
            <a href={cfg.cta2Href || '#visit'} style={{
              display: 'inline-block', padding: '0.8rem 2.2rem',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)', borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-sans)', fontSize: '.9rem',
              textDecoration: 'none',
            }}>{cfg.cta2Label}</a>
          )}
        </div>
      </div>

      {/* 스크롤 힌트 */}
      <div style={{
        position: 'absolute', bottom: '2rem',
        left: '50%', transform: 'translateX(-50%)',
        color: 'var(--color-text-light)', fontSize: '.7rem',
        letterSpacing: '.12em', display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: '4px',
      }}>
        <span style={{ opacity: .5 }}>SCROLL</span>
        <span style={{ opacity: .4 }}>▼</span>
      </div>
    </section>
  )
}
