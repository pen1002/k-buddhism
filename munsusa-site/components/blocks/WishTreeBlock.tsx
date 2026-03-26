'use client'
// SEC08-12 모바일 소원지 / 소원나무
import { useState, useCallback } from 'react'

interface Wish { name: string; text: string; id: number }

const LEAF_COLORS = [
  'var(--color-accent)', 'var(--color-gold)', 'var(--color-warm)',
  'var(--color-accent-light)', 'var(--color-gold-light)',
]

const MASK_NAME = (name: string) => name.length <= 1 ? `${name}○님` : `${name[0]}${'○'.repeat(name.length - 1)}님`

const SAMPLE_WISHES: Wish[] = [
  { id: 1, name: '김○○', text: '가족 모두 건강하고 행복하기를 발원합니다.' },
  { id: 2, name: '이○○', text: '수능 잘 보고 좋은 학교 입학하게 해주세요.' },
  { id: 3, name: '박○○', text: '사업이 잘 되어 많은 사람들에게 도움이 되기를.' },
  { id: 4, name: '최○○', text: '아픈 부모님이 빨리 쾌차하시기를 기도합니다.' },
  { id: 5, name: '정○○', text: '마음의 평화를 찾고 지혜롭게 살아가기를 원합니다.' },
]

function WishLeaf({ wish, idx }: { wish: Wish; idx: number }) {
  const color = LEAF_COLORS[idx % LEAF_COLORS.length]
  const rotate = ((idx * 37) % 30) - 15
  const left = 10 + (idx % 5) * 18

  return (
    <div style={{
      position: 'absolute',
      left: `${left}%`,
      top: `${20 + (idx * 13) % 60}%`,
      transform: `rotate(${rotate}deg)`,
      animation: `sway-${idx % 3} ${2 + (idx % 3)}s ease-in-out infinite alternate`,
    }}>
      <div style={{
        background: color,
        borderRadius: '50% 10% 50% 10%',
        width: '80px', height: '90px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        cursor: 'default',
      }}>
        <span style={{ fontSize: '.65rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-sans)' }}>
          {wish.name}
        </span>
        <span style={{
          fontSize: '.6rem', color: 'rgba(255,255,255,0.9)',
          fontFamily: 'var(--font-serif)', lineHeight: 1.4,
          textAlign: 'center', marginTop: '4px',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        }}>
          {wish.text}
        </span>
      </div>
      {/* 실 */}
      <div style={{
        width: '1px', height: '30px',
        background: 'var(--color-gold-dark)',
        margin: '0 auto',
      }} />
    </div>
  )
}

export default function WishTreeBlock() {
  const [wishes, setWishes] = useState<Wish[]>(SAMPLE_WISHES)
  const [form, setForm] = useState({ name: '', text: '' })
  const [submitted, setSubmitted] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    const newWish: Wish = {
      id: Date.now(),
      name: MASK_NAME(form.name.trim()),
      text: form.text.trim(),
    }
    setAnimating(true)
    setTimeout(() => {
      setWishes(prev => [newWish, ...prev].slice(0, 20))
      setSubmitted(true)
      setAnimating(false)
    }, 600)
  }, [form])

  return (
    <section className="section" id="wish-tree" style={{ background: 'var(--color-bg-alt)' }}>
      <style>{`
        @keyframes sway-0 { from { transform: rotate(-8deg); } to { transform: rotate(8deg); } }
        @keyframes sway-1 { from { transform: rotate(-5deg); } to { transform: rotate(12deg); } }
        @keyframes sway-2 { from { transform: rotate(-12deg); } to { transform: rotate(5deg); } }
        @keyframes float-up { from { opacity:0; transform:translateY(60px) scale(0.8); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>
      <div className="section-inner">
        <p className="section-label">Wish Tree</p>
        <h2 className="section-title">소원나무</h2>
        <p className="section-desc">간절한 소원을 나무에 걸어 부처님께 전하세요.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem', marginTop: '2rem', alignItems: 'start',
        }}>
          {/* 소원나무 시각화 */}
          <div style={{ textAlign: 'center' }}>
            {/* 나무 */}
            <div style={{ position: 'relative', height: '420px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              {/* 가지 */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '80px' }}>
                {wishes.slice(0, 8).map((w, i) => (
                  <WishLeaf key={w.id} wish={w} idx={i} />
                ))}
              </div>
              {/* 나무 몸통 */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '4rem', lineHeight: 1 }}>🌳</div>
                <div style={{ fontSize: '.78rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', marginTop: '4px' }}>
                  소원 {wishes.length}개 걸림
                </div>
              </div>
            </div>
          </div>

          {/* 소원 작성 폼 */}
          <div>
            {submitted && !animating ? (
              <div style={{
                textAlign: 'center', padding: '2.5rem 1.5rem',
                background: 'var(--color-card)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
                animation: 'float-up .6s ease-out',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍃</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  소원이 나무에 걸렸습니다
                </h3>
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-light)', lineHeight: 1.8, fontSize: '.9rem', marginBottom: '1.5rem' }}>
                  간절한 마음으로 기도하면 반드시 이루어집니다. ☸
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', text: '' }) }} style={{
                  padding: '8px 20px', background: 'var(--color-accent)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                  fontWeight: 600, fontSize: '.85rem', cursor: 'pointer',
                }}>또 다른 소원 남기기</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                background: 'var(--color-card)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)', padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  🍃 소원 남기기
                </h3>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.85rem', color: 'var(--color-text)', marginBottom: '5px' }}>
                    성함 <span style={{ color: 'var(--color-warm)' }}>*</span>
                  </label>
                  <input
                    type="text" maxLength={10} required
                    placeholder="홍길동"
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    style={{
                      width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                      background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                      fontSize: '.9rem', color: 'var(--color-text)', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.85rem', color: 'var(--color-text)', marginBottom: '5px' }}>
                    소원 내용 <span style={{ color: 'var(--color-warm)' }}>*</span>
                    <span style={{ fontWeight: 400, color: 'var(--color-text-light)', marginLeft: '6px' }}>
                      ({form.text.length}/100)
                    </span>
                  </label>
                  <textarea
                    maxLength={100} required rows={3}
                    placeholder="부처님께 드리고 싶은 소원을 적어주세요. (100자 이내)"
                    value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                    style={{
                      width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                      background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)', fontFamily: 'var(--font-serif)',
                      fontSize: '.9rem', color: 'var(--color-text)', lineHeight: 1.7,
                      resize: 'none', outline: 'none',
                    }}
                  />
                </div>
                <button type="submit" disabled={animating} style={{
                  padding: '11px', background: 'var(--color-accent)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                  fontWeight: 700, fontSize: '.92rem', cursor: animating ? 'not-allowed' : 'pointer',
                  opacity: animating ? 0.7 : 1,
                }}>
                  {animating ? '소원 걸리는 중...' : '🍃 소원 걸기'}
                </button>
              </form>
            )}

            {/* 최근 소원 롤링 목록 */}
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)', marginBottom: '8px' }}>
                최근 소원 ({wishes.length}개)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                {wishes.slice(0, 10).map((w, i) => (
                  <div key={w.id} style={{
                    padding: '8px 12px',
                    background: 'var(--color-bg-alt)',
                    borderRadius: 'var(--radius)',
                    borderLeft: `3px solid ${LEAF_COLORS[i % LEAF_COLORS.length]}`,
                  }}>
                    <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-sans)', marginRight: '8px' }}>{w.name}</span>
                    <span style={{ fontSize: '.82rem', color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>{w.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
