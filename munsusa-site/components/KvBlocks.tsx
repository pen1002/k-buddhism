'use client'
import { useEffect, useRef, useState } from 'react'

interface KvData {
  notices?: Array<{ title?: string; content?: string; createdAt?: string } | string>
  dharmaText?: string
  dharmaSource?: string
  gallery?: Array<{ url?: string; caption?: string } | string>
}

interface BlockCfg { blockType: string }

interface Props {
  templeCode: string
  templeName: string
  blocks: BlockCfg[]
}

export default function KvBlocks({ templeCode, templeName, blocks }: Props) {
  const [data, setData] = useState<KvData | null>(null)
  const [currentNotice, setCurrentNotice] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch(`https://temple-admin-zeta.vercel.app/api/temple/${templeCode}/public`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({}))
  }, [templeCode])

  // 공지 2개 이상이면 10초 자동 전환
  useEffect(() => {
    const count = Math.min(data?.notices?.length ?? 0, 2)
    if (count <= 1) return
    timerRef.current = setInterval(() => setCurrentNotice(c => (c + 1) % count), 10000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [data])

  const has = (t: string) => blocks.some(b => b.blockType === t)

  // 공지 슬라이드 데이터 (최대 2개)
  const noticeSlides = (data?.notices ?? []).slice(0, 2).map(n =>
    typeof n === 'string'
      ? { title: n, content: '', date: '' }
      : {
          title: n.title || '',
          content: n.content || '',
          date: n.createdAt ? new Date(n.createdAt).toLocaleDateString('ko-KR') : '',
        }
  )

  return (
    <>
      {/* I-01 공지사항 슬라이드 */}
      {has('I-01') && data && noticeSlides.length > 0 && (
        <div style={{ maxWidth: 'var(--max-w, 960px)', margin: '0 auto', padding: '32px 24px 0' }}>
          <section id="notice" style={{
            background: 'var(--color-bg-alt)',
            borderRadius: '16px',
            padding: '28px 32px',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{
                background: 'var(--color-accent)', color: '#fff',
                padding: '4px 14px', borderRadius: '20px',
                fontSize: '.8rem', fontWeight: 600, letterSpacing: '.04em',
              }}>📢 공지사항</span>
            </div>

            {/* 슬라이드 */}
            {noticeSlides.map((s, i) => (
              <div key={i} style={{ display: i === currentNotice ? 'block' : 'none' }}>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)', marginBottom: '8px', lineHeight: 1.4 }}>{s.title}</p>
                {s.content && (
                  <p style={{ fontSize: '.9rem', color: 'var(--color-text-light)', lineHeight: 1.75, whiteSpace: 'pre-line', marginBottom: '8px' }}>{s.content}</p>
                )}
                {s.date && (
                  <span style={{ fontSize: '.78rem', color: 'var(--color-accent)', opacity: .7 }}>{s.date}</span>
                )}
              </div>
            ))}

            {/* dots (2개일 때만) */}
            {noticeSlides.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                {noticeSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setCurrentNotice(i) }}
                    style={{
                      width: i === currentNotice ? '22px' : '8px', height: '8px',
                      borderRadius: '4px', border: 'none', cursor: 'pointer', padding: 0,
                      background: i === currentNotice ? 'var(--color-accent)' : 'rgba(0,0,0,.18)',
                      transition: 'all .3s',
                    }}
                    aria-label={`공지 ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* D-01 오늘의 법문 */}
      {has('D-01') && (
        <section className="section" id="dharma" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="section-inner">
            <p className="section-label">Today&apos;s Dharma</p>
            <h2 className="section-title">오늘의 법문</h2>
            <p className="section-desc">스님의 가르침으로 하루를 여세요</p>
            <div className="dharma-box">
              {!data ? (
                <p className="dharma-empty">법문을 불러오는 중입니다…</p>
              ) : !data.dharmaText ? (
                <p className="dharma-empty">등록된 법문이 없습니다.</p>
              ) : (
                <div className="fade-in visible">
                  <blockquote className="dharma-quote">{data.dharmaText}</blockquote>
                  {data.dharmaSource && (
                    <p className="dharma-source">— {data.dharmaSource}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* G-01 갤러리 */}
      {has('G-01') && (
        <section className="section" id="gallery">
          <div className="section-inner">
            <p className="section-label">Gallery</p>
            <h2 className="section-title">최근 사진</h2>
            <p className="section-desc">{templeName}의 아름다운 순간들을 담았습니다</p>
            <div className="kv-gallery-grid">
              {!data ? (
                <p className="kv-gallery-empty" style={{ gridColumn: '1/-1' }}>사진을 불러오는 중입니다…</p>
              ) : !data.gallery?.length ? (
                <p className="kv-gallery-empty" style={{ gridColumn: '1/-1' }}>사진을 준비 중입니다. 곧 업데이트됩니다.</p>
              ) : (
                (data.gallery as Array<{ url?: string; caption?: string } | string>)
                  .slice(0, 9)
                  .map((item, i) => {
                    const src = typeof item === 'string' ? item : (item.url || '')
                    const alt = typeof item === 'object' && item.caption ? item.caption : `${templeName} 사진 ${i + 1}`
                    if (!src) return null
                    return (
                      <div
                        key={i}
                        className="kv-gallery-item fade-in visible"
                        onClick={() => {
                          const lb = document.getElementById('lightbox')
                          const lbImg = document.getElementById('lightboxImg') as HTMLImageElement
                          if (lb && lbImg) { lbImg.src = src; lb.classList.add('open') }
                        }}
                      >
                        <img
                          src={src}
                          alt={alt}
                          loading="lazy"
                          onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none' }}
                        />
                      </div>
                    )
                  })
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
