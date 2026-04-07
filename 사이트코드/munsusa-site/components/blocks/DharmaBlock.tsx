// D-01 오늘의 법문 — 서버에서 전달받은 법문 데이터 표시
import { DharmaData } from '@/lib/dharma-rotation'

interface Props {
  blockData: { dharma?: DharmaData }
}

export default function DharmaBlock({ blockData }: Props) {
  const dharma = blockData?.dharma
  if (!dharma) return null

  return (
    <section className="section" id="dharma" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Today&apos;s Dharma</p>
        <h2 className="section-title">오늘의 법문</h2>
        <p className="section-desc">스님의 가르침으로 하루를 여세요</p>
        <div className="dharma-box">
          <div className="fade-in visible">
            <blockquote className="dharma-quote">{dharma.text}</blockquote>
            {dharma.source && (
              <p className="dharma-source">— {dharma.source}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
