// SEC13-02~05 템플스테이 프로그램 상세 (dataKey로 구분)
import { BlockProps } from './types'

interface Schedule { time: string; activity: string }

const PROGRAM_INFO: Record<string, {
  title: string; icon: string; color: string
  defaultSchedule: Schedule[]
  defaultFee: string; defaultPrepare: string
}> = {
  program_rest: {
    title: '휴식형', icon: '🌿', color: 'var(--color-accent)',
    defaultFee: '1박 2일 / 70,000원',
    defaultPrepare: '편한 복장, 세면도구, 개인 약품',
    defaultSchedule: [
      { time: '16:00', activity: '입소 및 방 배정' },
      { time: '18:00', activity: '저녁 발우공양' },
      { time: '19:30', activity: '자유 명상 · 경내 산책' },
      { time: '21:00', activity: '취침' },
      { time: '04:00', activity: '새벽 예불 (자유 참여)' },
      { time: '07:00', activity: '아침 발우공양' },
      { time: '10:00', activity: '퇴소' },
    ],
  },
  program_experience: {
    title: '체험형', icon: '🎋', color: 'var(--color-gold-dark)',
    defaultFee: '1박 2일 / 80,000원',
    defaultPrepare: '편한 복장, 세면도구',
    defaultSchedule: [
      { time: '14:00', activity: '입소 및 방 배정' },
      { time: '15:00', activity: '연등 만들기 체험' },
      { time: '18:00', activity: '저녁 발우공양' },
      { time: '19:30', activity: '108배 참회 수행' },
      { time: '21:00', activity: '취침' },
      { time: '04:00', activity: '새벽 예불' },
      { time: '06:00', activity: '108배 및 포행' },
      { time: '07:00', activity: '아침 발우공양' },
      { time: '09:00', activity: '사찰음식 만들기' },
      { time: '11:00', activity: '퇴소' },
    ],
  },
  program_meditation: {
    title: '선명상형', icon: '🧘', color: 'var(--color-text-light)',
    defaultFee: '2박 3일 / 150,000원',
    defaultPrepare: '편한 복장, 세면도구, 묵언 수행 각오',
    defaultSchedule: [
      { time: '14:00', activity: '입소 및 방 배정 · 묵언 시작' },
      { time: '18:00', activity: '저녁 발우공양 (묵언)' },
      { time: '19:30', activity: '좌선 (1시간)' },
      { time: '04:00', activity: '새벽 예불 · 좌선' },
      { time: '07:00', activity: '아침 공양' },
      { time: '09:00', activity: '스님 지도 참선' },
      { time: '14:00', activity: '포행 명상' },
      { time: '19:30', activity: '야간 좌선' },
      { time: '10:00', activity: '회향 · 퇴소' },
    ],
  },
  program_daytrip: {
    title: '당일형', icon: '☀', color: 'var(--color-warm)',
    defaultFee: '당일 / 30,000원',
    defaultPrepare: '편한 복장',
    defaultSchedule: [
      { time: '09:30', activity: '집결 및 오리엔테이션' },
      { time: '10:00', activity: '새벽 예불 체험 · 경내 안내' },
      { time: '11:00', activity: '참선 체험 (30분)' },
      { time: '12:00', activity: '사찰 공양 체험' },
      { time: '13:30', activity: '연등 만들기 또는 108배' },
      { time: '15:00', activity: '다도 체험 · 스님과의 차담' },
      { time: '16:00', activity: '퇴소' },
    ],
  },
}

export default function TemplestayProgramBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const dataKey: string = cfg.dataKey || 'program_rest'
  const info = PROGRAM_INFO[dataKey] ?? PROGRAM_INFO.program_rest

  const title: string = cfg.title || info.title
  const fee: string = cfg.fee || info.defaultFee
  const prepare: string = cfg.prepare || info.defaultPrepare
  const notice: string = cfg.notice || ''
  const rawSched = cfg.schedule ?? cfg.timetable
  const schedule: Schedule[] = Array.isArray(rawSched) && rawSched.length > 0
    ? rawSched : info.defaultSchedule

  return (
    <section className="section" id={`program-${dataKey}`}>
      <div className="section-inner" style={{ maxWidth: '780px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '2rem' }}>{info.icon}</span>
          <p className="section-label" style={{ margin: 0 }}>템플스테이 프로그램</p>
        </div>
        <h2 className="section-title">{title}</h2>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem', marginTop: '0.5rem' }}>
          <div style={{
            padding: '8px 18px',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
          }}>
            <p style={{ fontSize: '.72rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>참가비</p>
            <p style={{ fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-sans)' }}>{fee}</p>
          </div>
          <div style={{
            padding: '8px 18px',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
          }}>
            <p style={{ fontSize: '.72rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>준비물</p>
            <p style={{ fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-sans)', fontSize: '.88rem' }}>{prepare}</p>
          </div>
        </div>

        {/* 타임테이블 */}
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontSize: '1rem',
          color: 'var(--color-text)', marginBottom: '1rem',
        }}>일정표</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {schedule.map((row, i) => (
            <div key={i} style={{
              display: 'flex', gap: '1rem', alignItems: 'baseline',
              padding: '10px 16px',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              borderLeft: `3px solid ${info.color}`,
            }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontWeight: 700,
                color: info.color, fontSize: '.88rem',
                minWidth: '52px', flexShrink: 0,
              }}>{row.time}</span>
              <span style={{
                fontSize: '.92rem', color: 'var(--color-text)',
                fontFamily: 'var(--font-sans)',
              }}>{row.activity}</span>
            </div>
          ))}
        </div>

        {notice && (
          <p style={{
            marginTop: '1.5rem', fontSize: '.85rem',
            color: 'var(--color-text-light)', lineHeight: 1.75,
            padding: '1rem', background: 'var(--color-bg-alt)',
            borderRadius: 'var(--radius)',
          }}>⚠ {notice}</p>
        )}
      </div>
    </section>
  )
}
