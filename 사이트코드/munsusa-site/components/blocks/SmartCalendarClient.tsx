'use client'
// SmartCalendarBlock 인터랙티브 클라이언트 파트
// 양력+음력 동시 표시, 불교 기념일/재일 자동 표기, 행사 점 표시
import { useState, useMemo } from 'react'

// ── 음력 변환 ──────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let LunarLib: any = null
if (typeof window !== 'undefined') {
  // 클라이언트에서만 로드
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LunarLib = require('korean-lunar-calendar')
}

function getLunar(year: number, month: number, day: number): { month: number; day: number; leapMonth: boolean } {
  try {
    const Ctor = LunarLib?.default ?? LunarLib
    if (!Ctor) return { month: 0, day: 0, leapMonth: false }
    const cal = new Ctor()
    cal.setSolarDate(year, month, day)
    const l = cal.getLunarCalendar()
    return { month: l.month, day: l.day, leapMonth: l.leapMonth }
  } catch {
    return { month: 0, day: 0, leapMonth: false }
  }
}

function buddhistHoliday(lm: number, ld: number): string | null {
  if (lm === 4 && ld === 8)  return '부처님오신날'
  if (lm === 12 && ld === 8) return '성도절'
  if (lm === 2 && ld === 8)  return '출가절'
  if (lm === 2 && ld === 15) return '열반절'
  return null
}

function regularService(ld: number): string | null {
  if (ld === 1)  return '초하루'
  if (ld === 15) return '보름'
  if (ld === 18) return '지장재일'
  if (ld === 24) return '관음재일'
  return null
}

// ── 타입 ───────────────────────────────────────────────────────────────────
interface CalEvent {
  id: string
  title: string
  startDate: string      // ISO string
  description?: string | null
}

interface DayCell {
  date: Date
  solarDay: number
  lunarMonth: number
  lunarDay: number
  leapMonth: boolean
  isToday: boolean
  isCurrentMonth: boolean
  buddhistHoliday: string | null
  regularService: string | null
  events: CalEvent[]
}

interface Props {
  templeName: string
  events: CalEvent[]
}

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS_KO = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

// ── 컴포넌트 ───────────────────────────────────────────────────────────────
export default function SmartCalendarClient({ templeName, events }: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1) // 1-indexed
  const [selectedDay, setSelectedDay] = useState<DayCell | null>(null)

  const days = useMemo<DayCell[]>(() => {
    const first = new Date(viewYear, viewMonth - 1, 1)
    const last = new Date(viewYear, viewMonth, 0)
    const startPad = first.getDay() // 0=일 ~ 6=토
    const totalCells = Math.ceil((startPad + last.getDate()) / 7) * 7
    const cells: DayCell[] = []

    for (let i = 0; i < totalCells; i++) {
      const d = new Date(viewYear, viewMonth - 1, 1 - startPad + i)
      const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate()
      const lunar = getLunar(y, m, day)
      const isToday = d.toDateString() === today.toDateString()
      const isCurrentMonth = m === viewMonth && y === viewYear
      const isoDate = `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`
      const dayEvents = events.filter(e => e.startDate.startsWith(isoDate))

      cells.push({
        date: d, solarDay: day,
        lunarMonth: lunar.month, lunarDay: lunar.day, leapMonth: lunar.leapMonth,
        isToday, isCurrentMonth,
        buddhistHoliday: buddhistHoliday(lunar.month, lunar.day),
        regularService: regularService(lunar.day),
        events: dayEvents,
      })
    }
    return cells
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewYear, viewMonth, events])

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12) }
    else setViewMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1) }
    else setViewMonth(m => m + 1)
    setSelectedDay(null)
  }

  return (
    <section className="section" id="smart-calendar" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Temple Calendar</p>
        <h2 className="section-title">{templeName} 법회 달력</h2>

        {/* 월 네비게이션 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '1.5rem', marginTop: '1.5rem', marginBottom: '1rem',
        }}>
          <button onClick={prevMonth} style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'var(--color-card)', color: 'var(--color-text)',
            fontSize: '1rem', cursor: 'pointer', fontWeight: 700,
          }}>◀</button>
          <span style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700,
            color: 'var(--color-text)', minWidth: '110px', textAlign: 'center',
          }}>
            {viewYear}년 {MONTHS_KO[viewMonth - 1]}
          </span>
          <button onClick={nextMonth} style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'var(--color-card)', color: 'var(--color-text)',
            fontSize: '1rem', cursor: 'pointer', fontWeight: 700,
          }}>▶</button>
          <button onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth() + 1); setSelectedDay(null) }} style={{
            padding: '6px 14px', borderRadius: 'var(--radius)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-card)', color: 'var(--color-text-light)',
            fontFamily: 'var(--font-sans)', fontSize: '.8rem', cursor: 'pointer',
          }}>오늘</button>
        </div>

        {/* 요일 헤더 */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
          marginBottom: '4px',
        }}>
          {DAYS_KO.map((d, i) => (
            <div key={d} style={{
              textAlign: 'center', padding: '6px 0',
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '.82rem',
              color: i === 0 ? '#E24B4A' : i === 6 ? '#3B7DD8' : 'var(--color-text-light)',
            }}>{d}</div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
          {days.map((cell, i) => {
            const isSelected = selectedDay?.date.toDateString() === cell.date.toDateString()
            const isSun = cell.date.getDay() === 0
            const isSat = cell.date.getDay() === 6
            const hasBadge = cell.buddhistHoliday || cell.regularService

            return (
              <div
                key={i}
                onClick={() => setSelectedDay(isSelected ? null : cell)}
                style={{
                  minHeight: 'clamp(52px, 10vw, 72px)',
                  padding: '4px',
                  background: cell.isToday
                    ? 'var(--color-accent)' // 오늘: 강조
                    : isSelected
                      ? 'var(--color-gold-light)'
                      : cell.isCurrentMonth
                        ? 'var(--color-card)'
                        : 'transparent',
                  border: cell.events.length > 0
                    ? '2px solid var(--color-gold)'
                    : cell.isCurrentMonth
                      ? '1px solid var(--color-border)'
                      : '1px solid transparent',
                  borderRadius: 'var(--radius)',
                  cursor: cell.isCurrentMonth ? 'pointer' : 'default',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '2px', position: 'relative',
                  opacity: cell.isCurrentMonth ? 1 : 0.3,
                }}
              >
                {/* 양력 날짜 */}
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: 'clamp(.8rem,2.5vw,.95rem)',
                  fontWeight: cell.isToday ? 700 : 500,
                  color: cell.isToday ? '#fff'
                    : isSun ? '#E24B4A'
                    : isSat ? '#3B7DD8'
                    : 'var(--color-text)',
                }}>
                  {cell.solarDay}
                </span>

                {/* 음력 날짜 */}
                {cell.isCurrentMonth && cell.lunarDay > 0 && (
                  <span style={{
                    fontSize: 'clamp(8px,2vw,10px)',
                    color: cell.isToday ? 'rgba(255,255,255,0.8)' : 'var(--color-text-light)',
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1,
                  }}>
                    {cell.lunarDay === 1 ? `${cell.lunarMonth}월` : cell.lunarDay}
                    {cell.leapMonth ? '(윤)' : ''}
                  </span>
                )}

                {/* 불교 기념일 / 재일 뱃지 */}
                {cell.isCurrentMonth && hasBadge && (
                  <span style={{
                    fontSize: 'clamp(7px,1.8vw,9px)',
                    padding: '1px 3px',
                    borderRadius: '3px',
                    background: cell.buddhistHoliday
                      ? 'var(--color-warm)'
                      : 'var(--color-accent)',
                    color: '#fff',
                    fontWeight: 700,
                    fontFamily: 'var(--font-sans)',
                    lineHeight: 1.2,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {cell.buddhistHoliday ?? cell.regularService}
                  </span>
                )}

                {/* 행사 점(dot) */}
                {cell.events.length > 0 && (
                  <div style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: cell.isToday ? '#fff' : 'var(--color-gold)',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* 선택한 날짜 행사 상세 */}
        {selectedDay && (
          <div style={{
            marginTop: '1rem',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700,
              color: 'var(--color-text)', marginBottom: '.75rem',
            }}>
              {selectedDay.solarDay}일
              {selectedDay.lunarDay > 0 && ` (음력 ${selectedDay.lunarMonth}/${selectedDay.lunarDay})`}
              {selectedDay.buddhistHoliday && ` · ${selectedDay.buddhistHoliday}`}
              {!selectedDay.buddhistHoliday && selectedDay.regularService && ` · ${selectedDay.regularService}`}
            </h3>

            {selectedDay.events.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '.88rem', color: 'var(--color-text-light)' }}>
                이 날의 등록된 행사가 없습니다.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedDay.events.map((ev, i) => (
                  <div key={i} style={{
                    padding: '10px 14px',
                    background: 'var(--color-bg-alt)',
                    borderRadius: 'var(--radius)',
                    borderLeft: '3px solid var(--color-gold)',
                  }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '.95rem', color: 'var(--color-text)', margin: 0 }}>
                      {ev.title}
                    </p>
                    {ev.description && (
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '.85rem', color: 'var(--color-text-light)', marginTop: '4px', margin: '4px 0 0' }}>
                        {ev.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 범례 */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '.75rem', fontFamily: 'var(--font-sans)', color: 'var(--color-text-light)' }}>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: 'var(--color-warm)', marginRight: '4px', verticalAlign: 'middle' }}></span>불교 기념일</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: 'var(--color-accent)', marginRight: '4px', verticalAlign: 'middle' }}></span>정기 재일</span>
          <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-gold)', marginRight: '4px', verticalAlign: 'middle' }}></span>행사 등록</span>
        </div>
      </div>
    </section>
  )
}
