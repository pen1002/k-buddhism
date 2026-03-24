'use client'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    fetch(`https://temple-admin-zeta.vercel.app/api/temple/${templeCode}/public`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({}))
  }, [templeCode])

  const has = (t: string) => blocks.some(b => b.blockType === t)

  return (
    <>
      {/* I-01 공지사항 */}
      {has('I-01') && (
        <section className="section" id="notice">
          <div className="section-inner">
            <p className="section-label">Notice</p>
            <h2 className="section-title">공지사항</h2>
            <p className="section-desc">{templeName}의 최신 소식과 안내를 확인하세요</p>
            <div className="notice-list">
              {!data ? (
                <p className="notice-empty">공지사항을 불러오는 중입니다…</p>
              ) : !data.notices?.length ? (
                <p className="notice-empty">등록된 공지사항이 없습니다.</p>
              ) : (
                (data.notices as Array<{ title?: string; content?: string; createdAt?: string } | string>)
                  .slice(0, 5)
                  .map((n, i) => {
                    const title = typeof n === 'string' ? n : (n.title || n.content || '')
                    const date = typeof n === 'object' && n.createdAt
                      ? new Date(n.createdAt).toLocaleDateString('ko-KR') : ''
                    return (
                      <div key={i} className="notice-item fade-in visible">
                        <span className="notice-bullet" />
                        <div>
                          <p className="notice-text">{title}</p>
                          {date && <p className="notice-date">{date}</p>}
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </div>
        </section>
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
                <p className="kv-gallery-empty" style={{ gridColumn: '1/-1' }}>등록된 사진이 없습니다.</p>
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
