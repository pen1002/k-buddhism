'use client'
// I-01 공지사항 슬라이드
import { useEffect, useRef, useState } from 'react'

interface NoticeItem {
  title: string
  content: string
  date: string
}

interface Props {
  templeCode: string
}

export default function NoticeBlock({ templeCode }: Props) {
  const [slides, setSlides] = useState<NoticeItem[]>([])
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch(`https://temple-admin-zeta.vercel.app/api/temple/${templeCode}/public`)
      .then(r => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        const notices = data?.notices ?? []
        const mapped: NoticeItem[] = (notices as Array<{ title?: string; content?: string; createdAt?: string } | string>)
          .slice(0, 2)
          .map(n =>
            typeof n === 'string'
              ? { title: n, content: '', date: '' }
              : {
                  title: n.title || '',
                  content: n.content || '',
                  date: n.createdAt ? new Date(n.createdAt).toLocaleDateString('ko-KR') : '',
                }
          )
        setSlides(mapped)
      })
      .catch(() => {})
  }, [templeCode])

  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % slides.length), 10000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [slides])

  if (slides.length === 0) return null

  return (
    <div style={{ maxWidth: 'var(--max-w, 960px)', margin: '0 auto', padding: '32px 24px 0' }}>
      <section id="notice" style={{
        background: 'linear-gradient(135deg, #FFF8E7, #FDF0CC)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 28px',
        border: '1px solid #D4AF37',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{
            display: 'inline-block',
            background: '#D4AF37', color: '#fff',
            padding: '5px 14px', borderRadius: '20px',
            fontSize: '.82rem', fontWeight: 700, letterSpacing: '.04em',
          }}>📢 공지사항</span>
        </div>

        {slides.map((s, i) => (
          <div key={i} style={{ display: i === current ? 'block' : 'none' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px', color: '#8B6914' }}>{s.title}</h3>
            {s.content && (
              <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: '12px' }}>{s.content}</p>
            )}
            {s.date && (
              <span style={{ fontSize: '.78rem', color: '#8B6914', opacity: .7 }}>{s.date}</span>
            )}
          </div>
        ))}

        {slides.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setCurrent(i) }}
                style={{
                  width: i === current ? '22px' : '8px', height: '8px',
                  borderRadius: '4px', border: 'none', cursor: 'pointer', padding: 0,
                  background: i === current ? '#D4AF37' : '#ccc',
                  transition: 'all .3s',
                }}
                aria-label={`공지 ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
