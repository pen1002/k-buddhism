// SEC03-01 정기법회 일정 (필수)
// 초하루/보름/지장재일/관음재일 등 정기 법회 카드 + 다음 법회 D-Day
import { BlockProps } from './types'

interface ServiceItem {
  name: string
  lunarDay: string | number
  time: string
  desc?: string
  icon?: string
}

// 조계종 표준 정기법회 (AI 자동 장엄)
const DEFAULT_SERVICES: ServiceItem[] = [
  { name: '초하루 법회', lunarDay: 1, time: '오전 10:00', icon: '🌑', desc: '매월 음력 1일 정기 법회 및 기도' },
  { name: '보름 기도', lunarDay: 15, time: '오전 10:00', icon: '🌕', desc: '매월 음력 15일 보름기도 봉행' },
  { name: '지장재일', lunarDay: 18, time: '오전 10:00', icon: '📿', desc: '매월 음력 18일 지장보살 기도' },
  { name: '관음재일', lunarDay: 24, time: '오전 10:00', icon: '🙏', desc: '매월 음력 24일 관음보살 기도' },
]

export default function RegularServiceBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const raw = cfg.regularServices ?? cfg.services
  const services: ServiceItem[] = Array.isArray(raw) && raw.length > 0 ? raw : DEFAULT_SERVICES
  const isAI = !Array.isArray(raw) || raw.length === 0

  return (
    <section className="section" id="services" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Regular Dharma Services</p>
        <h2 className="section-title">{cfg.sectionTitle || '정기 법회 일정'}</h2>
        {isAI && (
          <p className="section-desc" style={{ color: 'var(--color-text-light)', fontSize: '.85rem' }}>
            ☸ {temple.denomination || '대한불교 조계종'} 표준 정기법회 일정
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginTop: '2rem',
        }}>
          {services.map((svc, i) => (
            <div key={i} className="fade-in" style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1.25rem',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* 상단 색상 바 */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: 'var(--color-accent)',
              }} />

              {/* 아이콘 + 재일 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}>{svc.icon || '☸'}</span>
                <span style={{
                  fontSize: '.75rem', fontWeight: 700,
                  color: 'var(--color-accent)',
                  background: 'var(--color-bg-alt)',
                  padding: '2px 10px', borderRadius: '12px',
                  fontFamily: 'var(--font-sans)',
                }}>음력 {svc.lunarDay}일</span>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.05rem', fontWeight: 700,
                color: 'var(--color-text)',
                marginBottom: '6px',
              }}>{svc.name}</h3>

              <p style={{
                fontSize: '.9rem', fontWeight: 600,
                color: 'var(--color-gold-dark)',
                marginBottom: '8px',
              }}>⏰ {svc.time}</p>

              {svc.desc && (
                <p style={{
                  fontSize: '.82rem',
                  color: 'var(--color-text-light)',
                  lineHeight: 1.65,
                }}>{svc.desc}</p>
              )}
            </div>
          ))}
        </div>

        {cfg.notice && (
          <p style={{
            marginTop: '1.5rem', textAlign: 'center',
            fontSize: '.85rem', color: 'var(--color-text-light)',
            lineHeight: 1.7,
          }}>{cfg.notice}</p>
        )}
      </div>
    </section>
  )
}
