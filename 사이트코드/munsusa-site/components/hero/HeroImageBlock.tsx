'use client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface Props {
  config: Cfg
  temple: { name: string; nameEn?: string | null; denomination?: string | null; primaryColor: string; secondaryColor: string; heroImageUrl?: string | null }
}

export default function HeroImageBlock({ config, temple }: Props) {
  const heroTitle  = config.heroTitle  || temple.name
  const heroHanja  = config.heroHanja  || ''
  const heroDesc   = config.heroDesc   || ''
  const badge      = config.badge      || ''
  const bgImage    = config.bgImage    || temple.heroImageUrl || ''
  const cta1Label  = config.cta1Label  || '법회 안내'
  const cta1Href   = config.cta1Href   || '#events'
  const cta2Label  = config.cta2Label  || '오시는 길'
  const cta2Href   = config.cta2Href   || '#visit'

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#1a0f08',
      }}
    >
      {/* 배경 이미지 */}
      {bgImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgImage}
          alt={heroTitle}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: 0.55,
          }}
          loading="eager"
        />
      ) : (
        /* 이미지 없을 때 그라디언트 배경 */
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 30% 50%, ${temple.primaryColor}33, #1a0f08 70%)`,
        }} />
      )}

      {/* 그라디언트 오버레이 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.8) 100%)',
      }} />

      {/* 컨텐츠 */}
      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', color: '#fff',
        padding: '0 24px', maxWidth: '800px',
      }}>
        {badge && (
          <div style={{
            display: 'inline-block',
            padding: '6px 18px',
            border: `1px solid ${temple.secondaryColor}`,
            borderRadius: '24px',
            fontSize: '0.82rem',
            color: temple.secondaryColor,
            marginBottom: '24px',
            letterSpacing: '0.05em',
          }}>
            {badge}
          </div>
        )}

        <h1 style={{
          fontFamily: 'var(--font-serif, serif)',
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          fontWeight: 900,
          letterSpacing: '0.08em',
          lineHeight: 1.1,
          margin: '0 0 12px',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          {heroTitle}
        </h1>

        {heroHanja && (
          <div style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
            letterSpacing: '0.3em',
            color: temple.secondaryColor,
            marginBottom: '20px',
            opacity: 0.9,
          }}>
            {heroHanja}
          </div>
        )}

        {heroDesc && (
          <p style={{
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.7,
            marginBottom: '36px',
            whiteSpace: 'pre-line',
          }}>
            {heroDesc}
          </p>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={cta1Href}
            style={{
              padding: '14px 32px',
              background: temple.primaryColor,
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            {cta1Label}
          </a>
          <a
            href={cta2Href}
            style={{
              padding: '14px 32px',
              border: `2px solid ${temple.secondaryColor}`,
              color: temple.secondaryColor,
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            {cta2Label}
          </a>
        </div>
      </div>

      {/* 하단 스크롤 힌트 */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '0.1em',
        animation: 'bounce 2s infinite',
      }}>
        <span>SCROLL</span>
        <span style={{ fontSize: '1.1rem' }}>↓</span>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  )
}
