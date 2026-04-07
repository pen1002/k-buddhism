// SEC10-05 염불 파일 다운로드
import { BlockProps } from './types'

export default function ChantDownloadBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const files: { name: string; description?: string; url: string; format?: string; size?: string }[] = Array.isArray(cfg.files) ? cfg.files : []
  if (files.length === 0) return null
  return (
    <section className="section" id="chant-download">
      <div className="section-inner">
        <p className="section-label">Download</p>
        <h2 className="section-title">{cfg.sectionTitle || '염불 자료 다운로드'}</h2>
        <div style={{ marginTop: '1.5rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.875rem 1.25rem', borderBottom: i < files.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{f.format === 'mp3' || f.format === 'wav' ? '🔊' : '📄'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontWeight: 600 }}>{f.name}</p>
                {f.description && <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginTop: '.2rem' }}>{f.description}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexShrink: 0 }}>
                {f.format && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>{f.format}</span>}
                {f.size && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)' }}>{f.size}</span>}
                <a href={f.url} download style={{ padding: '.35rem .875rem', background: 'var(--color-primary)', color: '#fff', borderRadius: 'var(--radius)', fontSize: '.8rem', textDecoration: 'none' }}>다운로드</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
