// H-03 사계절 자동 테마 전환 히어로
// 현재 월에 따라 배경 그라디언트 자동 변경
import { BlockProps } from '../types'

function getSeason(month: number): { label: string; bg: string; accent: string; emoji: string } {
  if (month >= 3 && month <= 5) return {
    label: '봄', emoji: '🌸',
    bg: 'linear-gradient(135deg, #f8e8ef 0%, #f5d0de 40%, #e8b4c4 100%)',
    accent: '#c0407a',
  }
  if (month >= 6 && month <= 8) return {
    label: '여름', emoji: '🌿',
    bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 40%, #a5d6a7 100%)',
    accent: '#3a7a3a',
  }
  if (month >= 9 && month <= 11) return {
    label: '가을', emoji: '🍂',
    bg: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 40%, #ffcc80 100%)',
    accent: '#c03010',
  }
  return {
    label: '겨울', emoji: '❄️',
    bg: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 40%, #9fa8da 100%)',
    accent: '#1a4a9c',
  }
}

export default function HeroSeasonBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const month = new Date().getMonth() + 1
  const season = getSeason(month)
  const heroTitle: string = cfg.heroTitle || temple.name
  const badge: string = cfg.badge || `☸ ${temple.denomination || '대한불교 조계종'}`

  // 계절별 이미지가 있으면 사용
  const seasonImages: Record<string, string> = cfg.seasonImages ?? {}
  const seasonKey = season.label
  const bgImage: string = seasonImages[seasonKey] || ''

  return (
    <section id="hero" style={{
      position: 'relative',
      minHeight: 'var(--theme-hero-height, 92svh)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      background: bgImage ? `url(${bgImage}) center/cover no-repeat` : season.bg,
    }}>
      {bgImage && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.38)',
        }} />
      )}

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 1.5rem' }}>
        {/* 계절 뱃지 */}
        <div style={{
          display: 'inline-block', marginBottom: '1rem',
          padding: '5px 16px', borderRadius: '20px',
          background: bgImage ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${season.accent}40`,
          color: bgImage ? 'rgba(255,255,255,0.9)' : season.accent,
          fontSize: '.82rem', fontFamily: 'var(--font-serif)',
        }}>
          {season.emoji} {season.label} · {badge}
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 5.5vw, 4rem)',
          fontWeight: 700,
          color: bgImage ? '#fff' : 'var(--color-dark)',
          lineHeight: 1.2, marginBottom: '1rem',
          textShadow: bgImage ? '0 2px 16px rgba(0,0,0,0.5)' : 'none',
        }}>{heroTitle}</h1>

        {cfg.heroDesc && (
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(.95rem, 2vw, 1.15rem)',
            color: bgImage ? 'rgba(255,255,255,0.88)' : 'var(--color-text)',
            maxWidth: '560px', margin: '0 auto 1.8rem',
            lineHeight: 1.75, whiteSpace: 'pre-line',
          }}>{cfg.heroDesc}</p>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {cfg.cta1Label && (
            <a href={cfg.cta1Href || '#events'} style={{
              display: 'inline-block', padding: '0.7rem 1.8rem',
              background: season.accent, color: '#fff',
              borderRadius: 'var(--radius)', fontWeight: 700,
              fontFamily: 'var(--font-sans)', textDecoration: 'none',
            }}>{cfg.cta1Label}</a>
          )}
          {cfg.cta2Label && (
            <a href={cfg.cta2Href || '#visit'} style={{
              display: 'inline-block', padding: '0.7rem 1.8rem',
              border: `2px solid ${season.accent}`,
              color: bgImage ? '#fff' : season.accent,
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-sans)', textDecoration: 'none',
            }}>{cfg.cta2Label}</a>
          )}
        </div>
      </div>
    </section>
  )
}
