// SEC05-01 사찰 연혁 및 창건 설화 (필수)
// 타임라인 + 창건 설화 텍스트
import { BlockProps } from './types'

interface HistoryItem { year: string | number; event: string }

function buildDefaultDesc(name: string, denomination: string, address: string, founded?: string): string {
  return `${name}은(는) ${denomination} 소속 사찰로${address ? `, ${address}에 위치합니다.` : '.'} ` +
    `${founded ? `${founded}년에 창건되어 오랜 역사와 전통을 이어오고 있으며, ` : ''}` +
    `부처님의 가르침을 전하고 지역사회와 함께하는 열린 도량입니다.`
}

export default function TempleHistoryBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const history: HistoryItem[] = Array.isArray(cfg.history) ? cfg.history : []
  const aboutText: string = cfg.aboutText || temple.description ||
    buildDefaultDesc(temple.name, temple.denomination || '대한불교 조계종', temple.address || '', String(cfg.founded || ''))
  const imageUrl: string = cfg.aboutImageUrl || cfg.imageUrl || ''
  const isAI = !temple.description && !cfg.aboutText

  return (
    <section className="section" id="history" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Temple History</p>
        <h2 className="section-title">{cfg.sectionTitle || `${temple.name} 역사`}</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: imageUrl ? '1fr 1fr' : '1fr',
          gap: '3rem',
          alignItems: 'start',
          marginTop: '2rem',
        }}>
          {/* 텍스트 영역 */}
          <div className="fade-in">
            {isAI && (
              <p style={{
                display: 'inline-block', marginBottom: '12px',
                fontSize: '.75rem', padding: '2px 10px', borderRadius: '10px',
                background: 'var(--color-bg)', color: 'var(--color-text-light)',
                border: '1px solid var(--color-border)',
              }}>✨ AI 자동 장엄 — 관리자 입력 시 업데이트</p>
            )}
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1rem', lineHeight: 2,
              color: 'var(--color-text)',
              marginBottom: history.length > 0 ? '2.5rem' : 0,
            }}>{aboutText}</p>

            {/* 연혁 타임라인 */}
            {history.length > 0 && (
              <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                {/* 세로선 */}
                <div style={{
                  position: 'absolute', left: '6px', top: 0, bottom: 0, width: '2px',
                  background: 'linear-gradient(to bottom, var(--color-accent), transparent)',
                }} />
                {history.map((h, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: '1.25rem' }}>
                    {/* 점 */}
                    <div style={{
                      position: 'absolute', left: '-1.35rem', top: '5px',
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: i === 0 ? 'var(--color-accent)' : 'var(--color-border)',
                      border: `2px solid var(--color-accent)`,
                    }} />
                    <span style={{
                      display: 'inline-block',
                      fontSize: '.78rem', fontWeight: 700,
                      color: 'var(--color-accent)',
                      marginBottom: '2px',
                    }}>{h.year}년</span>
                    <p style={{
                      fontSize: '.9rem', color: 'var(--color-text)',
                      lineHeight: 1.65,
                    }}>{h.event}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 이미지 */}
          {imageUrl && (
            <div className="fade-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={`${temple.name} 전경`}
                style={{
                  width: '100%', borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)', objectFit: 'cover',
                }}
              />
            </div>
          )}
        </div>

        {/* 사찰 기본 정보 */}
        <dl className="about-info" style={{ marginTop: '2.5rem' }}>
          {[
            ['종단', temple.denomination || '대한불교 조계종'],
            temple.abbotName ? ['주지', temple.abbotName] : null,
            temple.address ? ['소재지', temple.address] : null,
            cfg.founded ? ['창건', `${cfg.founded}년`] : null,
          ].filter(Boolean).map(row => {
            const [k, v] = row as [string, string]
            return (
              <div key={k} className="about-info-item">
                <dt>{k}</dt><dd>{v}</dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
