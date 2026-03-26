// SEC05-05 둘레길 / 숲길 안내
import { BlockProps } from './types'

interface Trail {
  name: string
  distance?: string
  duration?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  season?: string[]
  description: string
  image?: string
  sections?: { label: string; desc: string }[]
}

const DIFFICULTY_MAP = { easy: { label: '쉬움', color: 'var(--color-accent)' }, medium: { label: '보통', color: 'var(--color-gold)' }, hard: { label: '어려움', color: 'var(--color-warm)' } }
const SEASON_EMOJI: Record<string, string> = { 봄: '🌸', 여름: '🌿', 가을: '🍂', 겨울: '❄️' }

export default function TrailBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const trails: Trail[] = Array.isArray(cfg.trails) ? cfg.trails : []
  if (trails.length === 0) return null

  return (
    <section className="section" id="trails">
      <div className="section-inner">
        <p className="section-label">Forest Trail</p>
        <h2 className="section-title">{cfg.sectionTitle || '둘레길 · 숲길 안내'}</h2>
        {cfg.sectionDesc && <p className="section-desc">{cfg.sectionDesc}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
          {trails.map((trail, i) => {
            const diff = trail.difficulty ? DIFFICULTY_MAP[trail.difficulty] : null
            return (
              <div key={i} className="fade-in" style={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}>
                {/* 지도 이미지 */}
                {trail.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={trail.image} alt={`${trail.name} 코스 지도`}
                    style={{ width: '100%', maxHeight: '320px', objectFit: 'cover' }}
                  />
                )}

                <div style={{ padding: '1.5rem 2rem' }}>
                  {/* 헤더 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                      🥾 {trail.name}
                    </h3>
                    {diff && (
                      <span style={{
                        padding: '2px 10px', borderRadius: '10px',
                        background: diff.color, color: '#fff',
                        fontSize: '.72rem', fontWeight: 700, fontFamily: 'var(--font-sans)',
                      }}>{diff.label}</span>
                    )}
                  </div>

                  {/* 코스 정보 배지 */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {trail.distance && (
                      <div style={{ padding: '6px 14px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)' }}>
                        <span style={{ fontSize: '.72rem', color: 'var(--color-text-light)' }}>거리 </span>
                        <span style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--color-accent)' }}>{trail.distance}</span>
                      </div>
                    )}
                    {trail.duration && (
                      <div style={{ padding: '6px 14px', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)' }}>
                        <span style={{ fontSize: '.72rem', color: 'var(--color-text-light)' }}>소요 </span>
                        <span style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--color-accent)' }}>{trail.duration}</span>
                      </div>
                    )}
                    {Array.isArray(trail.season) && trail.season.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {trail.season.map(s => (
                          <span key={s} style={{ fontSize: '1.2rem' }} title={s}>{SEASON_EMOJI[s] || '🌲'}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 설명 */}
                  <p style={{ fontFamily: 'var(--font-serif)', lineHeight: 1.8, color: 'var(--color-text)', marginBottom: trail.sections?.length ? '1.25rem' : 0 }}>
                    {trail.description}
                  </p>

                  {/* 구간별 설명 아코디언 (간략 표시) */}
                  {trail.sections && trail.sections.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '.9rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '.75rem' }}>구간별 안내</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {trail.sections.map((sec, j) => (
                          <div key={j} style={{
                            display: 'flex', gap: '12px',
                            padding: '10px 14px',
                            background: 'var(--color-bg-alt)',
                            borderRadius: 'var(--radius)',
                            borderLeft: '3px solid var(--color-accent)',
                          }}>
                            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--color-accent)', fontSize: '.85rem', minWidth: '20px' }}>{j + 1}</span>
                            <div>
                              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '.88rem', color: 'var(--color-text)', margin: '0 0 2px' }}>{sec.label}</p>
                              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '.83rem', color: 'var(--color-text-light)', margin: 0 }}>{sec.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
