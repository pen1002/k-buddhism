// SEC10-06 하루 수행 일과
import { BlockProps } from './types'

const DEFAULT_SCHEDULE = [
  { time: '04:00', activity: '도량석', description: '아침 타종 후 도량을 돌며 경을 읽습니다' },
  { time: '04:30', activity: '새벽예불', description: '삼보일배와 함께 새벽 예불을 올립니다' },
  { time: '06:00', activity: '공양', description: '발우를 사용하여 아침 공양을 합니다' },
  { time: '07:00', activity: '울력', description: '대중 함께 경내를 청소합니다' },
  { time: '09:00', activity: '오전 수행', description: '좌선, 독경 등 자율 수행 시간입니다' },
  { time: '11:00', activity: '사시예불', description: '사시에 올리는 낮 예불입니다' },
  { time: '12:00', activity: '점심 공양', description: '오공양을 합니다' },
  { time: '13:00', activity: '포살/울력', description: '오후 울력 및 자율 수행입니다' },
  { time: '18:00', activity: '저녁예불', description: '저녁 예불을 올립니다' },
  { time: '19:00', activity: '저녁 공양', description: '저녁 공양 후 자유 시간입니다' },
  { time: '21:00', activity: '취침', description: '하루 수행을 마무리합니다' },
]

export default function MonkDayBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const schedule: { time: string; activity: string; description?: string }[] =
    Array.isArray(cfg.schedule) && cfg.schedule.length > 0 ? cfg.schedule : DEFAULT_SCHEDULE
  return (
    <section className="section" id="monk-day">
      <div className="section-inner">
        <p className="section-label">Daily Schedule</p>
        <h2 className="section-title">{cfg.sectionTitle || '하루 수행 일과'}</h2>
        <div style={{ marginTop: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '80px', top: 0, bottom: 0, width: '2px', background: 'var(--color-border)' }} />
          {schedule.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '.875rem', alignItems: 'flex-start' }}>
              <span style={{ width: '70px', textAlign: 'right', flexShrink: 0, fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-primary)', fontSize: '.9rem', paddingTop: '.15rem' }}>{s.time}</span>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)', border: '2px solid var(--color-primary)', flexShrink: 0, marginTop: '.3rem', position: 'relative', zIndex: 1 }} />
              <div>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '.9rem' }}>{s.activity}</p>
                {s.description && <p style={{ fontSize: '.8rem', color: 'var(--color-text-light)', marginTop: '.2rem', lineHeight: 1.5 }}>{s.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
