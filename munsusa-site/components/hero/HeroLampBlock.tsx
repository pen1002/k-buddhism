'use client'
import { motion } from 'framer-motion'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>
interface Props {
  config: Cfg
  temple: { name: string; primaryColor: string; secondaryColor: string }
}

export default function HeroLampBlock({ config, temple }: Props) {
  const heroTitle = config.heroTitle || temple.name
  const heroHanja = config.heroHanja || ''
  const badge     = config.badge || ''
  const heroDesc  = config.heroDesc || ''
  const gold      = temple.secondaryColor || '#D4AF37'

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0A0F1E',
      }}
    >
      {/* ── 상단 빛줄기 (conic-gradient) ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%', zIndex: 1, pointerEvents: 'none' }}>
        {/* 메인 원뿔 광선 */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            top: 0, left: '50%',
            transform: 'translateX(-50%)',
            transformOrigin: 'top center',
            width: '120%',
            height: '100%',
            background: `conic-gradient(
              from 270deg at 50% 0%,
              transparent 0deg,
              transparent 155deg,
              ${gold}08 160deg,
              ${gold}22 168deg,
              #E8F4FF33 172deg,
              ${gold}22 176deg,
              ${gold}08 184deg,
              transparent 190deg,
              transparent 360deg
            )`,
          }}
        />

        {/* 내부 강한 빛줄기 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0.7] }}
          transition={{ duration: 2, times: [0, 0.5, 1], ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '100%',
            background: `conic-gradient(
              from 270deg at 50% 0%,
              transparent 0deg,
              transparent 162deg,
              ${gold}11 166deg,
              #E8F4FF44 170deg,
              ${gold}18 174deg,
              transparent 178deg,
              transparent 360deg
            )`,
            filter: 'blur(2px)',
          }}
        />

        {/* 광원 포인트 (상단 중앙) */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '12px', height: '12px',
            borderRadius: '50%',
            background: gold,
            boxShadow: `0 0 24px 8px ${gold}88, 0 0 60px 20px ${gold}44`,
          }}
        />

        {/* 광선 테두리 선 (좌) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            position: 'absolute', top: 0, left: '50%',
            width: '1px', height: '100%',
            transformOrigin: 'top center',
            transform: 'translateX(-50%) rotate(-10deg)',
            background: `linear-gradient(to bottom, ${gold}, transparent)`,
          }}
        />
        {/* 광선 테두리 선 (우) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            position: 'absolute', top: 0, left: '50%',
            width: '1px', height: '100%',
            transformOrigin: 'top center',
            transform: 'translateX(-50%) rotate(10deg)',
            background: `linear-gradient(to bottom, ${gold}, transparent)`,
          }}
        />
      </div>

      {/* 미세 파티클 배경 (CSS 점들) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4,
        backgroundImage: 'radial-gradient(circle, rgba(212,175,55,0.15) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* 바닥 빛 번짐 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        style={{
          position: 'absolute',
          bottom: '15%', left: '50%',
          transform: 'translateX(-50%)',
          width: '60%', height: '200px',
          background: `radial-gradient(ellipse, ${gold}18 0%, transparent 70%)`,
          filter: 'blur(20px)',
          zIndex: 1,
        }}
      />

      {/* ── 콘텐츠 ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', color: '#fff',
          padding: '0 24px', maxWidth: '700px',
        }}
      >
        {badge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{
              display: 'inline-block', padding: '6px 20px',
              border: `1px solid ${gold}88`, borderRadius: '24px',
              fontSize: '0.78rem', color: gold,
              marginBottom: '28px', letterSpacing: '0.12em',
            }}
          >
            {badge}
          </motion.div>
        )}

        <h1 style={{
          fontFamily: 'var(--font-serif,serif)',
          fontSize: 'clamp(3.2rem,10vw,6.5rem)',
          fontWeight: 900,
          letterSpacing: '0.1em',
          lineHeight: 1,
          margin: '0 0 16px',
          textShadow: `0 0 60px ${gold}55, 0 2px 20px rgba(0,0,0,0.5)`,
          color: '#fff',
        }}>
          {heroTitle}
        </h1>

        {heroHanja && (
          <div style={{
            fontFamily: 'var(--font-serif,serif)',
            fontSize: 'clamp(1.1rem,4vw,1.8rem)',
            letterSpacing: '0.35em',
            color: gold,
            marginBottom: '20px',
            opacity: 0.85,
          }}>
            {heroHanja}
          </div>
        )}

        {heroDesc && (
          <p style={{
            fontSize: 'clamp(0.9rem,2.5vw,1.1rem)',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.75,
            whiteSpace: 'pre-line',
          }}>
            {heroDesc}
          </p>
        )}
      </motion.div>

      {/* 펄싱 광명 애니메이션 (반복) */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '5%', left: '50%',
          transform: 'translateX(-50%)',
          width: '2px', height: '2px',
          borderRadius: '50%',
          boxShadow: `0 0 80px 40px ${gold}22`,
          zIndex: 1, pointerEvents: 'none',
        }}
      />
    </section>
  )
}
