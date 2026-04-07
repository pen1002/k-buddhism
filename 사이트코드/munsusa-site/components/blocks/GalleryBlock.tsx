'use client'
// G-01 갤러리 — API 폴백 → blockData.gallery 정적 데이터 우선
import { useEffect, useState } from 'react'

type GalleryItem = { url?: string; caption?: string } | string

interface Props {
  templeCode: string
  templeName: string
  blockData?: { gallery?: GalleryItem[] }
}

export default function GalleryBlock({ templeCode, templeName, blockData }: Props) {
  const staticGallery = blockData?.gallery
  const [gallery, setGallery] = useState<GalleryItem[] | null>(
    staticGallery && staticGallery.length > 0 ? staticGallery : null
  )

  useEffect(() => {
    // 정적 데이터가 있으면 API 호출 생략
    if (staticGallery && staticGallery.length > 0) return

    fetch(`https://temple-admin-zeta.vercel.app/api/temple/${templeCode}/public`)
      .then(r => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => setGallery(data?.gallery ?? []))
      .catch(() => setGallery([]))
  }, [templeCode, staticGallery])

  return (
    <section className="section" id="gallery">
      <div className="section-inner">
        <p className="section-label">Gallery</p>
        <h2 className="section-title">{templeName} 갤러리</h2>
        <div className="kv-gallery-grid">
          {!gallery ? (
            <p className="kv-gallery-empty" style={{ gridColumn: '1/-1' }}>사진을 불러오는 중입니다…</p>
          ) : gallery.length === 0 ? (
            <p className="kv-gallery-empty" style={{ gridColumn: '1/-1' }}>사진을 준비 중입니다. 곧 업데이트됩니다.</p>
          ) : (
            gallery
              .filter(item => typeof item === 'string' ? !!item : !!(item as { url?: string }).url)
              .slice(0, 10)
              .map((item, i) => {
                const src = typeof item === 'string' ? item : ((item as { url?: string }).url || '')
                const alt = typeof item === 'object' && (item as { caption?: string }).caption
                  ? (item as { caption?: string }).caption!
                  : `${templeName} 사진 ${i + 1}`
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
  )
}
