'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>
interface MenuItem { label: string; emoji: string; href: string }
interface Props {
  config: Cfg
  temple: { name: string; primaryColor: string; secondaryColor: string; phone?: string | null }
}

const DEFAULT_MENU: MenuItem[] = [
  { label: '법회·행사', emoji: '🎏', href: '#events' },
  { label: '사찰소개', emoji: '🏯', href: '#intro' },
  { label: '기도·불공', emoji: '🙏', href: '#pillars' },
  { label: '행사안내', emoji: '📅', href: '#events' },
  { label: '갤러리', emoji: '📸', href: '#gallery' },
  { label: '오시는길', emoji: '🗺', href: '#visit' },
  { label: '주지인사말', emoji: '☸', href: '#intro' },
  { label: '문화재', emoji: '🏛', href: '#intro' },
  { label: '템플스테이', emoji: '🌿', href: '#events' },
  { label: '후원하기', emoji: '💛', href: '#donate' },
  { label: '공지사항', emoji: '📢', href: '#notice' },
  { label: '법문', emoji: '📿', href: '#dharma' },
  { label: '연혁', emoji: '📜', href: '#intro' },
  { label: '불사동참', emoji: '🪔', href: '#donate' },
  { label: 'SNS', emoji: '📱', href: '#' },
  { label: '연락처', emoji: '📞', href: '#visit' },
]

export default function HeroMorphGridBlock({ config, temple }: Props) {
  const heroTitle  = config.heroTitle || temple.name
  const heroHanja  = config.heroHanja || ''
  const badge      = config.badge || ''
  const menuItems: MenuItem[] = Array.isArray(config.menuItems) ? config.menuItems : DEFAULT_MENU
  const gold       = temple.secondaryColor || '#D4AF37'

  const [expanded, setExpanded] = useState(false)

  // 스크롤 50px 이상 → 그리드로 전환
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 50 && !expanded) setExpanded(true) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [expanded])

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
        background: '#FFF8E7',
      }}
    >
      {/* 배경 수묵화 그라디언트 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 30%, ${gold}18 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      <AnimatePresence mode="wait">
        {!expanded ? (
          /* ── 원형 초기 상태 ── */
          <motion.div
            key="circle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* 외부 회전 링 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: '340px', height: '340px',
                borderRadius: '50%',
                border: `2px dashed ${gold}55`,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />

            {/* 메인 원 */}
            <motion.button
              onClick={() => setExpanded(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '300px', height: '300px',
                borderRadius: '50%',
                border: `3px solid ${gold}`,
                background: `radial-gradient(circle at 40% 35%, #fff 0%, #FFF8E7 100%)`,
                boxShadow: `0 0 60px ${gold}33, 0 8px 40px rgba(0,0,0,0.08)`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: '24px',
                gap: '8px',
              }}
            >
              {badge && (
                <span style={{ fontSize: '0.72rem', color: gold, letterSpacing: '0.06em', fontWeight: 600 }}>
                  {badge}
                </span>
              )}
              <h1 style={{
                fontFamily: 'var(--font-serif,serif)',
                fontSize: 'clamp(2rem,8vw,2.8rem)',
                fontWeight: 900,
                letterSpacing: '0.1em',
                color: '#1a0f08',
                margin: 0, lineHeight: 1.1,
              }}>
                {heroTitle}
              </h1>
              {heroHanja && (
                <div style={{ fontFamily: 'var(--font-serif,serif)', fontSize: '1rem', letterSpacing: '0.3em', color: gold, opacity: 0.8 }}>
                  {heroHanja}
                </div>
              )}
              <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', letterSpacing: '0.1em' }}>
                스크롤 또는 탭 ↓
              </div>
            </motion.button>

            {/* 골드 점 장식 */}
            {[0,60,120,180,240,300].map((deg,i) => (
              <div key={i} style={{
                position: 'absolute',
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: gold,
                top: `calc(50% + ${Math.sin(deg*Math.PI/180)*170}px - 3px)`,
                left: `calc(50% + ${Math.cos(deg*Math.PI/180)*170}px - 3px)`,
                opacity: 0.6,
              }} />
            ))}
          </motion.div>
        ) : (
          /* ── 4×4 그리드 전개 상태 ── */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '900px', padding: '40px 20px' }}
          >
            {/* 그리드 헤더 */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: 'center', marginBottom: '32px' }}
            >
              <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(1.8rem,5vw,2.8rem)', fontWeight: 900, color: '#1a0f08', margin: '0 0 4px', letterSpacing: '0.08em' }}>
                {heroTitle}
              </h2>
              {heroHanja && (
                <div style={{ fontFamily: 'var(--font-serif,serif)', fontSize: '1rem', letterSpacing: '0.3em', color: gold, opacity: 0.8 }}>
                  {heroHanja}
                </div>
              )}
            </motion.div>

            {/* 4×4 메뉴 그리드 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'clamp(8px, 2vw, 16px)',
            }}>
              {menuItems.slice(0, 16).map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  initial={{ opacity: 0, y: 20, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.03 + 0.15, type: 'spring', stiffness: 280, damping: 22 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: 'clamp(12px,3vw,20px) 8px',
                    background: '#fff',
                    borderRadius: '16px',
                    border: `1px solid ${gold}33`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    gap: '8px',
                    minHeight: 'clamp(80px,12vw,110px)',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseOver={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${gold}33`)}
                  onMouseOut={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)')}
                >
                  <span style={{ fontSize: 'clamp(1.4rem,4vw,2rem)' }}>{item.emoji}</span>
                  <span style={{ fontSize: 'clamp(0.7rem,2vw,0.88rem)', fontWeight: 700, color: '#1a0f08', textAlign: 'center', lineHeight: 1.3 }}>
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* 원형으로 돌아가기 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ textAlign: 'center', marginTop: '24px' }}
            >
              <button
                onClick={() => { setExpanded(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                style={{ fontSize: '0.78rem', color: gold, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textDecoration: 'underline' }}
              >
                ☸ 처음으로
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
