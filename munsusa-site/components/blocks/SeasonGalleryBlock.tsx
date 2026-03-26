// SEC07-05 계절 갤러리
'use client'
import { useState } from 'react'
import { BlockProps } from './types'

const SEASONS = ['봄', '여름', '가을', '겨울'] as const
type Season = typeof SEASONS[number]

export default function SeasonGalleryBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const [season, setSeason] = useState<Season>('봄')
  const gallery: Record<Season, { src: string; caption?: string }[]> = cfg.gallery ?? {}
  const hasAny = SEASONS.some(s => (gallery[s]?.length ?? 0) > 0)
  if (!hasAny) return null
  const photos = gallery[season] ?? []
  return (
    <section className="section" id="season-gallery">
      <div className="section-inner">
        <p className="section-label">Seasons</p>
        <h2 className="section-title">{cfg.sectionTitle || '계절 갤러리'}</h2>
        <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem', justifyContent: 'center' }}>
          {SEASONS.map(s => (
            <button key={s} onClick={() => setSeason(s)}
              style={{ padding: '.5rem 1.25rem', borderRadius: '999px', border: '1px solid', cursor: 'pointer', background: season === s ? 'var(--color-primary)' : 'transparent', color: season === s ? '#fff' : 'var(--color-text)', borderColor: season === s ? 'var(--color-primary)' : 'var(--color-border)' }}>
              {s}
            </button>
          ))}
        </div>
        {photos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            {photos.map((p, i) => (
              <div key={i} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <img src={p.src} alt={p.caption || ''} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                {p.caption && <p style={{ padding: '.5rem .75rem', fontSize: '.8rem', color: 'var(--color-text-light)' }}>{p.caption}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', marginTop: '1.5rem', padding: '2rem' }}>{season} 사진이 없습니다.</p>
        )}
      </div>
    </section>
  )
}
