// SEC06-01 주지스님 인사말 (필수)
// 사진 + 인사 메시지, AI 자동 장엄 지원
import { BlockProps } from './types'

function buildDefaultMessage(name: string): string {
  return `${name}을(를) 찾아주신 모든 분들을 환영합니다.\n\n` +
    `이 도량은 누구에게나 열려 있는 마음의 안식처입니다. ` +
    `부처님의 자비와 지혜가 여러분의 일상에 밝은 빛이 되기를 발원합니다.\n\n` +
    `함께 수행하고, 함께 나누며, 함께 성장하는 도량이 되겠습니다.\n\n나무아미타불 관세음보살.`
}

export default function AbbotGreetingBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const abbotName: string = cfg.abbotName || temple.abbotName || ''
  const abbotTitle: string = cfg.abbotTitle || '주지'
  const abbotPhoto: string = cfg.abbotPhoto || cfg.abbotPhotoUrl || ''
  const message: string = cfg.abbotMessage || cfg.message ||
    (abbotName ? '' : buildDefaultMessage(temple.name))
  const isAI = !cfg.abbotMessage && !cfg.message && !abbotName

  if (!message && !abbotName) return null

  return (
    <section className="section" id="abbot" style={{ background: 'var(--color-bg)' }}>
      <div className="section-inner" style={{ maxWidth: '860px' }}>
        <p className="section-label">Abbot&apos;s Greeting</p>
        <h2 className="section-title">주지스님 인사말</h2>

        <div style={{
          display: 'flex', gap: '3rem', alignItems: 'flex-start',
          marginTop: '2.5rem', flexWrap: 'wrap',
        }}>
          {/* 스님 사진 */}
          {abbotPhoto && (
            <div style={{ flexShrink: 0, textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={abbotPhoto} alt={abbotName || '주지스님'}
                style={{
                  width: '160px', height: '160px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: 'var(--shadow-md)',
                  border: '3px solid var(--color-gold)',
                }}
              />
              {abbotName && (
                <div style={{ marginTop: '12px' }}>
                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700, fontSize: '1rem',
                    color: 'var(--color-text)',
                  }}>{abbotName}</p>
                  <p style={{ fontSize: '.82rem', color: 'var(--color-text-light)' }}>
                    {abbotTitle} · {temple.name}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 인사말 */}
          <div style={{ flex: 1, minWidth: '260px' }} className="fade-in">
            {isAI && (
              <p style={{
                display: 'inline-block', marginBottom: '12px',
                fontSize: '.75rem', padding: '2px 10px', borderRadius: '10px',
                background: 'var(--color-bg-alt)', color: 'var(--color-text-light)',
                border: '1px solid var(--color-border)',
              }}>✨ AI 자동 장엄 — 주지스님 인사말 입력 전</p>
            )}

            {/* 인용 부호 */}
            <div style={{
              fontSize: '3.5rem', lineHeight: 1, fontFamily: 'var(--font-serif)',
              color: 'var(--color-gold)', opacity: .4, marginBottom: '-0.8rem',
            }}>&ldquo;</div>

            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(.95rem, 1.5vw, 1.1rem)',
              lineHeight: 2, color: 'var(--color-text)',
              whiteSpace: 'pre-line',
            }}>{message}</p>

            {!abbotPhoto && abbotName && (
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '1.2rem',
                }}>🙏</div>
                <div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)' }}>
                    {abbotName}
                  </p>
                  <p style={{ fontSize: '.82rem', color: 'var(--color-text-light)' }}>
                    {abbotTitle} · {temple.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
