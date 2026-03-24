'use client'
import { useState, useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface Props {
  config: Cfg
  temple: { name: string; nameEn?: string | null; denomination?: string | null; foundedYear?: number | null; primaryColor: string; secondaryColor: string; heroImageUrl?: string | null; address?: string | null; phone?: string | null }
}

function useDDays(nextEventDate?: string) {
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => {
    if (!nextEventDate) return
    const target = new Date(nextEventDate)
    const now = new Date()
    const diff = Math.ceil((target.getTime() - now.getTime()) / 86400000)
    setDays(diff)
  }, [nextEventDate])
  return days
}

interface QAPreview { q: string; a: string }

export default function HeroInfoBlock({ config, temple }: Props) {
  const heroTitle      = config.heroTitle      || temple.name
  const heroHanja      = config.heroHanja      || ''
  const badge          = config.badge          || ''
  const bgImage        = config.bgImage        || temple.heroImageUrl || ''
  const founded        = config.founded        || (temple.foundedYear ? `${temple.foundedYear}년` : '')
  const heritageCount  = config.heritageCount  || ''
  const nextEventLabel = config.nextEventLabel || ''
  const nextEventDate  = config.nextEventDate  || ''
  const qaPreview: QAPreview[] = Array.isArray(config.qaPreview) ? config.qaPreview : []

  const ddays = useDDays(nextEventDate)

  const infoItems = [
    founded        && { icon: '📅', label: '창건', value: founded },
    heritageCount  && { icon: '🏛', label: '문화재', value: String(heritageCount) },
    nextEventLabel && { icon: '☸', label: '다음 행사', value: nextEventLabel },
  ].filter(Boolean) as { icon: string; label: string; value: string }[]

  return (
    <section
      id="hero"
      style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden', background: '#1a0f08' }}
    >
      {/* 모바일: 상하 / 데스크탑: 좌우 분할 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        minHeight: '100svh',
      }}>
        <style>{`
          @media (min-width: 768px) {
            #hero-split { grid-template-columns: 60fr 40fr !important; }
          }
        `}</style>

        {/* 좌측: 배경 이미지 + 사찰명 */}
        <div id="hero-split" style={{
          display: 'contents',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
          }} id="hero-inner-grid">
            <style>{`
              @media (min-width: 768px) {
                #hero-inner-grid { grid-template-columns: 60fr 40fr; min-height: 100svh; }
              }
            `}</style>

            {/* 좌: 이미지 + 텍스트 */}
            <div style={{ position: 'relative', minHeight: '60svh', display: 'flex', alignItems: 'flex-end' }}>
              {bgImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bgImage}
                  alt={heroTitle}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                  loading="eager"
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 60%, ${temple.primaryColor}55, #1a0f08 70%)` }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)' }} />
              <div style={{ position: 'relative', zIndex: 2, padding: '40px', color: '#fff' }}>
                {badge && (
                  <div style={{ display: 'inline-block', padding: '5px 14px', border: `1px solid ${temple.secondaryColor}`, borderRadius: '20px', fontSize: '0.78rem', color: temple.secondaryColor, marginBottom: '16px', letterSpacing: '0.05em' }}>
                    {badge}
                  </div>
                )}
                <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(2.8rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1, margin: '0 0 10px', textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
                  {heroTitle}
                </h1>
                {heroHanja && (
                  <div style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(1rem, 3vw, 1.5rem)', letterSpacing: '0.3em', color: temple.secondaryColor, opacity: 0.9 }}>
                    {heroHanja}
                  </div>
                )}
              </div>
            </div>

            {/* 우: 핵심 정보 카드 */}
            <div style={{
              background: 'rgba(20, 12, 6, 0.95)',
              backdropFilter: 'blur(12px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: 'clamp(24px, 4vw, 48px)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}>
              <p style={{ color: temple.secondaryColor, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>
                Temple Info
              </p>

              {/* 기본 정보 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                {infoItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', marginBottom: '2px' }}>{item.label}</p>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{item.value}</p>
                    </div>
                  </div>
                ))}

                {/* D-Day 카운터 */}
                {nextEventLabel && ddays !== null && (
                  <div style={{
                    padding: '16px', background: `${temple.primaryColor}22`,
                    border: `1px solid ${temple.primaryColor}44`, borderRadius: '10px',
                    textAlign: 'center',
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginBottom: '4px' }}>{nextEventLabel}</p>
                    <p style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2rem', fontWeight: 900, color: temple.secondaryColor, lineHeight: 1 }}>
                      {ddays > 0 ? `D-${ddays}` : ddays === 0 ? 'D-Day' : `D+${Math.abs(ddays)}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Q&A 미리보기 */}
              {qaPreview.length > 0 && (
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '10px' }}>
                    자주 묻는 질문
                  </p>
                  {qaPreview.slice(0, 2).map((qa, i) => (
                    <details key={i} style={{ marginBottom: '8px' }}>
                      <summary style={{
                        color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', cursor: 'pointer',
                        padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
                        borderRadius: '8px', listStyle: 'none',
                        display: 'flex', justifyContent: 'space-between',
                      }}>
                        {qa.q}
                        <span style={{ color: temple.secondaryColor, marginLeft: '8px' }}>＋</span>
                      </summary>
                      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.7, padding: '10px 12px', margin: 0 }}>
                        {qa.a}
                      </p>
                    </details>
                  ))}
                </div>
              )}

              {/* 연락처 */}
              {temple.phone && (
                <a href={`tel:${temple.phone}`} style={{
                  marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px',
                  color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                  onMouseOver={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                  onMouseOut={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
                >
                  <span>📞</span> {temple.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
