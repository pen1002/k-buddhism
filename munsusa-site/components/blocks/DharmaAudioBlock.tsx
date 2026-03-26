'use client'
// SEC04-05 오디오 법문 / 독경 플레이어
import { useState, useRef, useEffect } from 'react'
import { BlockProps } from './types'

interface AudioTrack {
  title: string
  speaker: string
  audioUrl: string
  duration?: string
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function DharmaAudioBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const tracks: AudioTrack[] = Array.isArray(cfg.audioFiles) ? cfg.audioFiles : []
  if (tracks.length === 0) return null

  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const track = tracks[current]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onDuration = () => setDuration(audio.duration || 0)
    const onEnded = () => {
      if (current < tracks.length - 1) {
        setCurrent(c => c + 1)
      } else {
        setPlaying(false)
      }
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [current, tracks.length])

  useEffect(() => {
    if (duration > 0) setProgress((currentTime / duration) * 100)
  }, [currentTime, duration])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = track.audioUrl
    if (playing) audio.play()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  const seek = (pct: number) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    audio.currentTime = (pct / 100) * duration
  }

  return (
    <section className="section" id="dharma-audio" style={{ background: 'var(--color-dark)' }}>
      <div className="section-inner">
        <p className="section-label" style={{ color: 'var(--color-gold)' }}>Audio Dharma</p>
        <h2 className="section-title" style={{ color: 'var(--color-bg)' }}>
          {cfg.sectionTitle || '오디오 법문'}
        </h2>

        {/* 메인 플레이어 */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginTop: '1.5rem',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-bg)', marginBottom: '4px' }}>
              {track.title}
            </p>
            <p style={{ fontSize: '.83rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)' }}>
              {track.speaker}
              {track.duration && ` · ${track.duration}`}
            </p>
          </div>

          {/* 진행 바 */}
          <div
            style={{
              width: '100%', height: '6px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '3px', cursor: 'pointer', marginBottom: '12px',
            }}
            onClick={e => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
              seek(((e.clientX - rect.left) / rect.width) * 100)
            }}
          >
            <div style={{
              height: '100%', borderRadius: '3px',
              background: 'var(--color-gold)',
              width: `${progress}%`, transition: 'width 0.1s linear',
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--color-text-light)', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : track.duration || '--:--'}</span>
          </div>

          {/* 컨트롤 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent', color: 'var(--color-bg)',
                fontSize: '1rem', cursor: current === 0 ? 'not-allowed' : 'pointer',
                opacity: current === 0 ? 0.4 : 1,
              }}
            >⏮</button>

            <button
              onClick={togglePlay}
              style={{
                width: '60px', height: '60px', borderRadius: '50%',
                border: 'none', background: 'var(--color-gold)', color: '#fff',
                fontSize: '1.4rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >{playing ? '⏸' : '▶'}</button>

            <button
              onClick={() => setCurrent(c => Math.min(tracks.length - 1, c + 1))}
              disabled={current === tracks.length - 1}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'transparent', color: 'var(--color-bg)',
                fontSize: '1rem', cursor: current === tracks.length - 1 ? 'not-allowed' : 'pointer',
                opacity: current === tracks.length - 1 ? 0.4 : 1,
              }}
            >⏭</button>
          </div>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio ref={audioRef} style={{ display: 'none' }} />
        </div>

        {/* 플레이리스트 */}
        {tracks.length > 1 && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tracks.map((t, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setPlaying(true) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', textAlign: 'left',
                  background: current === i ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: `1px solid ${current === i ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--color-bg)',
                }}
              >
                <span style={{ fontSize: '.8rem', color: 'var(--color-gold)', fontFamily: 'var(--font-sans)', minWidth: '20px' }}>
                  {current === i && playing ? '♪' : String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '.9rem', fontWeight: 600, margin: 0, color: 'var(--color-bg)' }}>{t.title}</p>
                  <p style={{ fontSize: '.75rem', color: 'var(--color-text-light)', margin: 0, fontFamily: 'var(--font-sans)' }}>{t.speaker}{t.duration && ` · ${t.duration}`}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
