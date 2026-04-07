// SEC05-03 경내 인터랙티브 지도
'use client'
import { useState } from 'react'
import { BlockProps } from './types'

export default function InteractiveMapBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const [selected, setSelected] = useState<number | null>(null)
  const spots: { name: string; description?: string; x: number; y: number; icon?: string }[] = Array.isArray(cfg.spots) ? cfg.spots : []
  const imageUrl: string = cfg.mapImage || ''
  if (!imageUrl && spots.length === 0) return null
  const spot = selected !== null ? spots[selected] : null
  return (
    <section className="section" id="interactive-map">
      <div className="section-inner">
        <p className="section-label">Map</p>
        <h2 className="section-title">{cfg.sectionTitle || '경내 안내도'}</h2>
        <div style={{ marginTop: '1.5rem', position: 'relative', display: 'inline-block', width: '100%' }}>
          {imageUrl ? (
            <img src={imageUrl} alt="경내 지도" style={{ width: '100%', borderRadius: 'var(--radius)', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '4/3', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--color-text-light)' }}>경내 지도 이미지</span>
            </div>
          )}
          {spots.map((s, i) => (
            <button key={i} onClick={() => setSelected(selected === i ? null : i)}
              style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)', background: selected === i ? 'var(--color-primary)' : 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
              {s.icon || '●'}
            </button>
          ))}
        </div>
        {spot && (
          <div style={{ marginTop: '1rem', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)' }}>{spot.name}</p>
            {spot.description && <p style={{ fontSize: '.875rem', color: 'var(--color-text-light)', marginTop: '.375rem', lineHeight: 1.6 }}>{spot.description}</p>}
          </div>
        )}
        {spots.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '1rem' }}>
            {spots.map((s, i) => (
              <button key={i} onClick={() => setSelected(selected === i ? null : i)}
                style={{ fontSize: '.78rem', padding: '.3rem .75rem', borderRadius: '999px', border: '1px solid var(--color-border)', cursor: 'pointer', background: selected === i ? 'var(--color-primary)' : 'transparent', color: selected === i ? '#fff' : 'var(--color-text)' }}>
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
