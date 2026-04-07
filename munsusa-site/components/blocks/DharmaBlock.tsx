'use client'
// D-01 오늘의 법문
import { useEffect, useState } from 'react'

interface Props {
  templeCode: string
}

export default function DharmaBlock({ templeCode }: Props) {
  const [dharmaText, setDharmaText] = useState<string | null>(null)
  const [dharmaSource, setDharmaSource] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`https://temple-admin-zeta.vercel.app/api/temple/${templeCode}/public`)
      .then(r => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) => {
        setDharmaText(data?.dharmaText || null)
        setDharmaSource(data?.dharmaSource || null)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [templeCode])

  // 로드 완료 후 법문 없으면 섹션 자체를 숨김
  if (loaded && !dharmaText) return null

  return (
    <section className="section" id="dharma" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Today&apos;s Dharma</p>
        <h2 className="section-title">오늘의 법문</h2>
        <p className="section-desc">스님의 가르침으로 하루를 여세요</p>
        <div className="dharma-box">
          {!loaded ? (
            <p className="dharma-empty">법문을 불러오는 중입니다…</p>
          ) : (
            <div className="fade-in visible">
              <blockquote className="dharma-quote">{dharmaText}</blockquote>
              {dharmaSource && (
                <p className="dharma-source">— {dharmaSource}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
