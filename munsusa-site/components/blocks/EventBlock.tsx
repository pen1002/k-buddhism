'use client'

// E-01 법회·기도·행사
import { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface Props {
  blockData: Cfg
}

// ── 정기법회 여부 판단 ────────────────────────────────────────────────────────
// isRecurring 필드 → category 필드 → schedule/title/meta/desc 키워드 순으로 판단
function isRecurring(ev: Cfg): boolean {
  if (ev.isRecurring === true) return true
  if (ev.category === 'regular') return true
  const sched: string = ev.schedule || ''
  if (sched.includes('monthly') || sched.includes('weekly')) return true
  const text = `${ev.title || ''} ${ev.meta || ''} ${ev.desc || ''}`
  return /매월|매주|정기/.test(text)
}

// ── 시즌 행사 종료 날짜 추정 (양력, 현재 연도 기준) ──────────────────────────
function getApproxEndDate(ev: Cfg): Date | null {
  const year = new Date().getFullYear()

  if (ev.schedule === 'solar-range' && ev.solarMonth && ev.solarEnd) {
    const months = String(ev.solarMonth).split(',').map(Number)
    const lastMonth = months[months.length - 1]
    return new Date(year, lastMonth - 1, Number(ev.solarEnd))
  }

  if (ev.schedule === 'lunar-range' && ev.lunarMonth) {
    // 음력 → 양력 근사: 음력 월 + 1개월 (보수적 추정)
    const months = String(ev.lunarMonth).split(',').map(Number)
    const lastLunarMonth = months[months.length - 1]
    const approxSolarMonth = lastLunarMonth + 1
    const endDay = Number(ev.lunarEnd || 28)
    if (approxSolarMonth > 12) {
      return new Date(year + 1, approxSolarMonth - 13, endDay)
    }
    return new Date(year, approxSolarMonth - 1, endDay)
  }

  return null
}

function isPastSeasonal(ev: Cfg): boolean {
  if (isRecurring(ev)) return false
  const endDate = getApproxEndDate(ev)
  if (!endDate) return false
  return endDate < new Date()
}

export default function EventBlock({ blockData }: Props) {
  const [pastOpen, setPastOpen] = useState(false)
  const events: Cfg[] = Array.isArray(blockData.events) ? blockData.events : []
  if (events.length === 0) return null

  const upcomingEvents = events.filter(ev => !isPastSeasonal(ev))
  const pastEvents = events.filter(ev => isPastSeasonal(ev)).slice(0, 5)

  return (
    <section className="section" id="events">
      <div className="section-inner">
        <p className="section-label">{blockData.sectionLabel || 'Events & Dharma Services'}</p>
        <h2 className="section-title">{blockData.sectionTitle || '법회 · 기도 · 행사'}</h2>
        {blockData.sectionDesc && <p className="section-desc">{blockData.sectionDesc}</p>}

        {/* ── 다가오는 행사 + 정기법회 ── */}
        <div className="events-grid" id="eventsGrid">
          {upcomingEvents.map((ev: Cfg, i: number) => (
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

        {/* ── 지난 행사 (접이식, 최근 5건) ── */}
        {pastEvents.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={() => setPastOpen(o => !o)}
              style={{
                background: 'none',
                border: '1px solid var(--color-border, #ddd)',
                borderRadius: 'var(--radius-sm, 6px)',
                padding: '0.5rem 1.2rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'var(--color-text-muted, #888)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {pastOpen ? '▲' : '▼'} 지난 행사 ({pastEvents.length}건)
            </button>
            {pastOpen && (
              <div className="events-grid" style={{ marginTop: '1rem', opacity: 0.6 }}>
                {pastEvents.map((ev: Cfg, i: number) => (
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
                    <span className="event-tag" style={{ textDecoration: 'line-through' }}>{ev.tag}</span>
                    <h3>{ev.title}</h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{ev.desc}</p>
                    <div className="event-meta">{ev.meta}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
