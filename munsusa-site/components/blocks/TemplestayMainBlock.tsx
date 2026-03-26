// SEC13-01 템플스테이 종합 안내 (필수)
import { BlockProps } from './types'

const TEMPLESTAY_URL = 'https://www.templestay.com'

const PROGRAM_BADGE_COLOR: Record<string, string> = {
  '휴식형':  'var(--color-accent)',
  '체험형':  'var(--color-gold-dark)',
  '선명상형': 'var(--color-text-light)',
  '당일형':  'var(--color-warm)',
}

export default function TemplestayMainBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const info = cfg.templestay ?? cfg
  const intro: string = info.intro || info.desc ||
    `${temple.name}의 템플스테이에 오신 것을 환영합니다. 산사의 맑은 공기와 청아한 종소리 속에서 바쁜 일상을 내려놓고 자신을 돌아보는 소중한 시간을 보내세요.`
  const programs: string[] = Array.isArray(info.programs) ? info.programs : ['휴식형']
  const imageUrl: string = info.image || cfg.imageUrl || ''
  const phone: string = info.phone || cfg.phone || temple.phone || ''
  const isAI = !info.intro && !cfg.desc

  return (
    <section className="section" id="templestay" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Temple Stay</p>
        <h2 className="section-title">템플스테이</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: imageUrl ? '1fr 1fr' : '1fr',
          gap: '3rem', marginTop: '2rem', alignItems: 'start',
        }}>
          <div className="fade-in">
            {isAI && (
              <p style={{
                display: 'inline-block', marginBottom: '12px',
                fontSize: '.75rem', padding: '2px 10px', borderRadius: '10px',
                background: 'var(--color-bg)', color: 'var(--color-text-light)',
                border: '1px solid var(--color-border)',
              }}>✨ AI 자동 장엄</p>
            )}

            {/* 운영 프로그램 뱃지 */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {programs.map(p => (
                <span key={p} style={{
                  display: 'inline-block',
                  padding: '4px 14px', borderRadius: '20px',
                  background: PROGRAM_BADGE_COLOR[p] ?? 'var(--color-accent)',
                  color: '#fff',
                  fontSize: '.78rem', fontWeight: 700,
                  fontFamily: 'var(--font-sans)',
                }}>{p}</span>
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1rem', lineHeight: 2,
              color: 'var(--color-text)',
              marginBottom: '2rem',
            }}>{intro}</p>

            {/* 예약 버튼 */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={TEMPLESTAY_URL}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '0.75rem 1.8rem',
                  background: 'var(--color-accent)', color: '#fff',
                  borderRadius: 'var(--radius)', fontWeight: 700,
                  fontFamily: 'var(--font-sans)', textDecoration: 'none',
                  fontSize: '.9rem',
                }}
              >🏕 한국불교문화사업단 공식 예약</a>

              {phone && (
                <a href={`tel:${phone}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '0.75rem 1.5rem',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text)', borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-sans)', textDecoration: 'none',
                  fontSize: '.88rem',
                }}>📞 {phone}</a>
              )}
            </div>
          </div>

          {imageUrl && (
            <div className="fade-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl} alt="템플스테이"
                style={{
                  width: '100%', borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-md)', objectFit: 'cover',
                  aspectRatio: '4/3',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
