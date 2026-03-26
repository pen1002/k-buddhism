// SEC10-02 사찰 예절 안내
import { BlockProps } from './types'

const DEFAULT_ETIQUETTES = [
  { title: '합장 인사', icon: '🙏', description: '두 손을 가슴 앞에서 모아 합장하고, 허리를 약간 굽혀 인사합니다.' },
  { title: '복장', icon: '👘', description: '단정한 복장으로 방문하며, 노출이 심한 옷은 삼가주세요.' },
  { title: '정숙', icon: '🤫', description: '사찰 내에서는 조용히 하고, 휴대폰은 진동으로 전환합니다.' },
  { title: '신발', icon: '👟', description: '법당 입장 시 신발을 가지런히 벗어 신발장에 놓습니다.' },
  { title: '촬영', icon: '📷', description: '불상 촬영 시 허가를 받고, 의식 중에는 촬영을 자제합니다.' },
  { title: '음식', icon: '🍱', description: '경내에서는 지정된 장소 외에 음식 섭취를 삼가주세요.' },
]

export default function EtiquetteBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const items: { title: string; icon?: string; description: string }[] = Array.isArray(cfg.items) && cfg.items.length > 0 ? cfg.items : DEFAULT_ETIQUETTES
  return (
    <section className="section" id="etiquette">
      <div className="section-inner">
        <p className="section-label">Etiquette</p>
        <h2 className="section-title">{cfg.sectionTitle || '사찰 예절'}</h2>
        {cfg.intro && <p style={{ marginTop: '.75rem', color: 'var(--color-text-light)', lineHeight: 1.7 }}>{cfg.intro}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{item.icon || '●'}</span>
              <div>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '.375rem' }}>{item.title}</p>
                <p style={{ fontSize: '.85rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
