// P-01 핵심 실천 가치 (3대 실천)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface Props {
  blockData: Cfg
}

export default function PrayerBlock({ blockData }: Props) {
  const pillars: Cfg[] = Array.isArray(blockData.pillars) ? blockData.pillars : []
  if (pillars.length === 0) return null

  return (
    <section className="section" id="pillars">
      <div className="section-inner">
        <p className="section-label">{blockData.sectionLabel || 'Mission'}</p>
        <h2 className="section-title">{blockData.sectionTitle || '핵심 실천 가치'}</h2>
        {blockData.sectionDesc && <p className="section-desc">{blockData.sectionDesc}</p>}
        <div className="pillar-grid">
          {pillars.map((p: Cfg, i: number) => (
            <div key={i} className={`pillar-card ${p.cls || `p${i + 1}`} fade-in`}>
              <div className="pillar-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <div className="pillar-sub">{p.sub}</div>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
