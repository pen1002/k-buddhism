// E-01 법회·기도·행사
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface Props {
  blockData: Cfg
}

export default function EventBlock({ blockData }: Props) {
  const events: Cfg[] = Array.isArray(blockData.events) ? blockData.events : []
  if (events.length === 0) return null

  return (
    <section className="section" id="events">
      <div className="section-inner">
        <p className="section-label">{blockData.sectionLabel || 'Events & Dharma Services'}</p>
        <h2 className="section-title">{blockData.sectionTitle || '법회 · 기도 · 행사'}</h2>
        {blockData.sectionDesc && <p className="section-desc">{blockData.sectionDesc}</p>}
        <div className="events-grid" id="eventsGrid">
          {events.map((ev: Cfg, i: number) => (
            <div
              key={i} className="event-card fade-in"
              data-schedule={ev.schedule}
              data-lunar-days={ev.lunarDays}
              data-solar-days={ev.solarDays}
              data-lunar-month={ev.lunarMonth}
              data-lunar-start={ev.lunarStart}
              data-lunar-end={ev.lunarEnd}
              data-multi-month={ev.multiMonth}
              data-solar-month={ev.solarMonth}
              data-solar-start={ev.solarStart}
              data-solar-end={ev.solarEnd}
              data-weeks={ev.weeks}
            >
              <div className="event-icon">{ev.icon}</div>
              <span className="event-tag">{ev.tag}</span>
              <h3>{ev.title}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{ev.desc}</p>
              <div className="event-meta">{ev.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
