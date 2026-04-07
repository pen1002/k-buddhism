// W-01 산하기관
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface Props {
  blockData: Cfg
}

export default function WelfareBlock({ blockData }: Props) {
  const orgs: Cfg[] = Array.isArray(blockData.orgs) ? blockData.orgs : []
  if (orgs.length === 0) return null

  return (
    <section className="section" id="welfare" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">{blockData.sectionLabel || 'Affiliated Organizations'}</p>
        <h2 className="section-title">{blockData.sectionTitle || '산하기관 바로가기'}</h2>
        {blockData.sectionDesc && <p className="section-desc">{blockData.sectionDesc}</p>}
        <div className="welfare-grid">
          {orgs.map((org: Cfg, i: number) => (
            <div key={i} className="welfare-card fade-in">
              <div className="welfare-card-top">
                <div className={`welfare-icon ${org.cls || ''}`}>{org.icon}</div>
                <h3>{org.name}</h3>
              </div>
              <p>{org.desc}</p>
              {org.href && (
                <a href={org.href} target="_blank" rel="noopener" className="welfare-link">홈페이지 방문 →</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
