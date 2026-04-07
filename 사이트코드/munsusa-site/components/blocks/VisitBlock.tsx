// V-01 오시는 길
import { TempleData } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface Props {
  blockData: Cfg
  temple: TempleData
}

export default function VisitBlock({ blockData, temple }: Props) {
  const visitAddress = blockData.address || temple.address || ''
  const mapLines: string[] = Array.isArray(blockData.mapLines) ? blockData.mapLines : []

  return (
    <section className="section" id="visit" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Location &amp; Access</p>
        <h2 className="section-title">오시는 길</h2>
        {visitAddress && <p className="section-desc">{visitAddress}</p>}
        <div className="visit-info-grid">
          <div className="fade-in">
            <dl className="about-info">
              {[
                ['주소', visitAddress],
                blockData.transport ? ['대중교통', blockData.transport] : null,
                blockData.bus ? ['버스', blockData.bus] : null,
                blockData.parking ? ['주차', blockData.parking] : null,
              ].filter(Boolean).map((row) => {
                const [k, v] = row as [string, string]
                return <div key={k} className="about-info-item"><dt>{k}</dt><dd>{v}</dd></div>
              })}
            </dl>
            {blockData.naverMapUrl && (
              <a
                href={blockData.naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  marginTop: '16px', padding: '10px 20px',
                  background: '#03C75A', color: '#fff',
                  borderRadius: '8px', fontSize: '.88rem', fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                🗺️ 네이버 지도로 보기
              </a>
            )}
          </div>
          {mapLines.length > 0 && (
            <div className="fade-in" style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--color-border)' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--color-text-light)', lineHeight: '1.85' }}>
                {mapLines.map((line: string, i: number) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
