// SEC13-06 템플스테이 참가자 후기
import { BlockProps } from './types'

interface Review { name: string; date?: string; rating?: number; text: string; photo?: string; program?: string }

const STARS = (n: number) => '★'.repeat(Math.max(1, Math.min(5, n))) + '☆'.repeat(5 - Math.max(1, Math.min(5, n)))

const DEFAULT_REVIEWS: Review[] = [
  { name: '김○○', date: '2025-10', rating: 5, program: '휴식형', text: '도심의 소음을 잊고 진정한 휴식을 얻었습니다. 새벽 예불 소리에 눈을 뜨는 경험이 일상의 소중함을 일깨워 주었습니다.' },
  { name: '이○○', date: '2025-08', rating: 5, program: '체험형', text: '108배와 발우공양이 처음엔 낯설었지만 마치고 나니 마음이 가벼워졌습니다. 스님께서 친절하게 안내해 주셔서 편안했습니다.' },
  { name: '박○○', date: '2025-06', rating: 4, program: '당일형', text: '외국에서 오신 가족과 함께 방문했습니다. 한국 불교 문화를 체험하기에 최고였습니다. 다음에 1박 프로그램도 꼭 도전해 볼 예정입니다.' },
]

export default function TemplestayReviewBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const rawReviews = cfg.reviews ?? cfg.templestayReviews
  const reviews: Review[] = Array.isArray(rawReviews) && rawReviews.length > 0
    ? rawReviews.slice(0, 5) : DEFAULT_REVIEWS
  const isAI = !Array.isArray(rawReviews) || rawReviews.length === 0

  return (
    <section className="section" id="templestay-reviews">
      <div className="section-inner">
        <p className="section-label">Participant Reviews</p>
        <h2 className="section-title">{cfg.sectionTitle || '참가자 후기'}</h2>
        {isAI && (
          <p className="section-desc" style={{ fontSize: '.82rem', color: 'var(--color-text-light)' }}>
            ✨ AI 샘플 후기 — 실제 후기 등록 시 교체됩니다
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem', marginTop: '2rem',
        }}>
          {reviews.map((rv, i) => (
            <div key={i} className="fade-in" style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              {/* 헤더 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-sans)' }}>{rv.name}</span>
                  {rv.program && (
                    <span style={{
                      marginLeft: '8px', fontSize: '.72rem',
                      padding: '1px 8px', borderRadius: '10px',
                      background: 'var(--color-bg-alt)',
                      color: 'var(--color-accent)',
                      fontWeight: 700,
                    }}>{rv.program}</span>
                  )}
                </div>
                {rv.date && (
                  <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)' }}>{rv.date}</span>
                )}
              </div>

              {/* 별점 */}
              {rv.rating && (
                <p style={{ color: 'var(--color-gold)', fontSize: '.9rem', letterSpacing: '2px', lineHeight: 1 }}>
                  {STARS(rv.rating)}
                </p>
              )}

              {/* 후기 본문 */}
              <p style={{
                fontSize: '.9rem', color: 'var(--color-text)',
                lineHeight: 1.8, fontFamily: 'var(--font-serif)',
                flex: 1,
              }}>&ldquo;{rv.text}&rdquo;</p>

              {/* 사진 */}
              {rv.photo && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={rv.photo} alt="후기 사진"
                  style={{ width: '100%', borderRadius: 'var(--radius)', objectFit: 'cover', aspectRatio: '16/9' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
