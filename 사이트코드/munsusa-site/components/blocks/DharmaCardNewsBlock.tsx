'use client'
// SEC04-07 법문 카드뉴스 / 웹툰 슬라이더
import { useState, useCallback } from 'react'
import { BlockProps } from './types'

interface CardNews {
  title: string
  images: string[]
  date?: string
}

export default function DharmaCardNewsBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const items: CardNews[] = Array.isArray(cfg.cardNews) ? cfg.cardNews : []
  if (items.length === 0) return null

  const [newsIdx, setNewsIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const news = items[newsIdx]
  const images = news?.images ?? []
  const total = images.length

  const prev = useCallback(() => setImgIdx(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setImgIdx(i => (i + 1) % total), [total])

  const selectNews = (i: number) => {
    setNewsIdx(i)
    setImgIdx(0)
  }

  if (!news) return null

  return (
    <section className="section" id="dharma-cardnews">
      <div className="section-inner">
        <p className="section-label">Card News</p>
        <h2 className="section-title">{cfg.sectionTitle || '법문 카드뉴스'}</h2>

        {/* 카드뉴스 목록 탭 */}
        {items.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', flexWrap: 'wrap' }}>
            {items.map((it, i) => (
              <button key={i} onClick={() => selectNews(i)} style={{
                padding: '6px 16px',
                background: newsIdx === i ? 'var(--color-accent)' : 'var(--color-card)',
                color: newsIdx === i ? '#fff' : 'var(--color-text)',
                border: `1px solid ${newsIdx === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                fontSize: '.82rem', fontWeight: 600, cursor: 'pointer',
              }}>{it.title}</button>
            ))}
          </div>
        )}

        {/* 슬라이더 */}
        <div style={{ marginTop: '1.5rem', position: 'relative', maxWidth: '480px', margin: '1.5rem auto 0' }}>
          {/* 이미지 */}
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[imgIdx]} alt={`${news.title} ${imgIdx + 1}/${total}`}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            />

            {/* 페이지 카운터 */}
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'rgba(0,0,0,0.55)', color: '#fff',
              padding: '3px 10px', borderRadius: '12px',
              fontSize: '.78rem', fontFamily: 'var(--font-sans)', fontWeight: 700,
            }}>{imgIdx + 1} / {total}</div>

            {/* 전체화면 버튼 */}
            <button
              onClick={() => setFullscreen(true)}
              style={{
                position: 'absolute', bottom: '12px', right: '12px',
                background: 'rgba(0,0,0,0.55)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius)',
                padding: '4px 10px', fontSize: '.78rem', cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >⛶ 전체화면</button>

            {/* 이전/다음 오버레이 버튼 */}
            {total > 1 && (
              <>
                <button onClick={prev} style={{
                  position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.45)', color: '#fff',
                  border: 'none', fontSize: '1rem', cursor: 'pointer',
                }}>‹</button>
                <button onClick={next} style={{
                  position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.45)', color: '#fff',
                  border: 'none', fontSize: '1rem', cursor: 'pointer',
                }}>›</button>
              </>
            )}
          </div>

          {/* 점 인디케이터 */}
          {total > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{
                  width: i === imgIdx ? '20px' : '8px', height: '8px',
                  borderRadius: '4px', border: 'none',
                  background: i === imgIdx ? 'var(--color-accent)' : 'var(--color-border)',
                  cursor: 'pointer', transition: 'width 0.2s',
                }} />
              ))}
            </div>
          )}

          {/* 제목·날짜 */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{news.title}</h3>
            {news.date && <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginTop: '4px', fontFamily: 'var(--font-sans)' }}>{news.date}</p>}
          </div>
        </div>

        {/* 전체화면 오버레이 */}
        {fullscreen && (
          <div
            onClick={() => setFullscreen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[imgIdx]} alt=""
              style={{ maxWidth: '96vw', maxHeight: '92vh', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }}
              onClick={e => e.stopPropagation()}
            />
            <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</div>
            {total > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prev() }} style={{ position: 'absolute', left: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: '2rem', padding: '8px 16px', cursor: 'pointer', borderRadius: 'var(--radius)' }}>‹</button>
                <button onClick={e => { e.stopPropagation(); next() }} style={{ position: 'absolute', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: '2rem', padding: '8px 16px', cursor: 'pointer', borderRadius: 'var(--radius)' }}>›</button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
