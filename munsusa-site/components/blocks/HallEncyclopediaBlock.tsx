'use client'
// SEC05-02 전각 도감 — 사찰 내 전각 아코디언 해설
import { useState } from 'react'
import { BlockProps } from './types'

interface HallInfo { desc: string; icon: string }

const HALL_DATA: Record<string, HallInfo> = {
  '대웅전':  { icon: '🏛', desc: '석가모니불을 주불로 모신 사찰의 중심 전각. 사찰에서 가장 크고 중요한 법당으로, 매일 예불과 법회가 봉행됩니다.' },
  '극락전':  { icon: '🪷', desc: '아미타불을 주불로 모신 전각. 서방 극락세계 왕생을 발원하며, 영가 천도와 관련된 기도가 주로 이루어집니다.' },
  '관음전':  { icon: '🙏', desc: '관세음보살을 모신 자비의 전각. 중생의 고통을 구제하는 관음보살 기도가 이루어지며, 많은 불자들이 찾는 기도처입니다.' },
  '지장전':  { icon: '📿', desc: '지장보살을 모신 전각. 지옥 중생을 제도하는 지장보살께 영가 천도와 기도를 올리는 공간입니다.' },
  '미륵전':  { icon: '✨', desc: '미래불인 미륵보살을 모신 전각. 미래에 이 세상에 오실 미륵부처님의 자비로운 세상을 기원하는 공간입니다.' },
  '비로전':  { icon: '☀', desc: '비로자나불을 모신 전각. 법신불인 비로자나불은 온 우주에 두루한 진리의 빛을 상징합니다.' },
  '삼성각':  { icon: '⛰', desc: '산신·칠성·독성을 함께 모신 전각. 한국 불교의 토착 신앙이 결합된 공간으로, 건강과 자녀 기도를 올립니다.' },
  '나한전':  { icon: '🧘', desc: '부처님의 16나한과 500나한을 모신 전각. 깨달음을 이룬 성인들께 기도하는 특별한 공간입니다.' },
  '팔상전':  { icon: '📜', desc: '부처님의 탄생부터 열반까지 8장면을 그린 팔상도를 봉안한 전각. 부처님 생애를 한눈에 볼 수 있습니다.' },
  '약사전':  { icon: '💊', desc: '약사여래를 모신 전각. 중생의 병고를 치유하는 약사불께 건강과 쾌유를 기원하는 기도가 이루어집니다.' },
  '적멸보궁': { icon: '💎', desc: '부처님의 진신사리를 봉안한 성소. 불상 없이 진신사리만을 모시는 최고 성지로, 예불 시 탑을 향해 예경합니다.' },
  '장경각':  { icon: '📚', desc: '불교 경전, 특히 팔만대장경을 보관하는 건물. 목판의 보존을 위해 자연환기 시스템이 설치된 과학적 건축물입니다.' },
  '범종각':  { icon: '🔔', desc: '범종·법고·목어·운판 사물(四物)을 안치한 누각. 새벽과 저녁 예불 때 사물을 타종하여 모든 중생을 깨웁니다.' },
  '요사채':  { icon: '🏠', desc: '스님들이 수행하며 생활하는 공간. 침실, 공부방, 참선실 등으로 구성된 수행자의 생활 공간입니다.' },
  '공양간':  { icon: '🍚', desc: '사찰의 부엌이자 공양 공간. 발우공양의 전통을 이어가며, 공양 준비 또한 수행의 일환으로 여깁니다.' },
  '부도탑':  { icon: '🗿', desc: '고승 스님의 사리나 유골을 봉안한 탑. 사찰 역사와 함께한 수행자들의 삶과 공덕을 기리는 성소입니다.' },
  '보호수':  { icon: '🌳', desc: '수백 년 된 노거수(老巨樹)로 지정된 보호수. 사찰의 역사와 함께 살아온 자연의 증인입니다.' },
  '마애불':  { icon: '🪨', desc: '바위 면에 새긴 불상. 자연 암벽 또는 석벽에 직접 조각한 불상으로, 야외에서 예경하는 독특한 불교 문화유산입니다.' },
  '종무소':  { icon: '📋', desc: '사찰 행정 업무를 담당하는 사무 공간. 기도·불사 신청, 각종 문의, 사찰 행사 안내 등의 업무를 처리합니다.' },
}

export default function HallEncyclopediaBlock({ temple, blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const hallsRaw = cfg.halls ?? cfg.hallList
  const halls: string[] = Array.isArray(hallsRaw) && hallsRaw.length > 0
    ? hallsRaw
    : ['대웅전', '관음전', '삼성각', '범종각'] // 기본 4개
  const [openHall, setOpenHall] = useState<string | null>(null)

  return (
    <section className="section" id="halls">
      <div className="section-inner">
        <p className="section-label">Hall Encyclopedia</p>
        <h2 className="section-title">{cfg.sectionTitle || `${temple.name} 전각 도감`}</h2>
        <p className="section-desc" style={{ color: 'var(--color-text-light)' }}>
          경내 {halls.length}개 전각 안내
        </p>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {halls.map(hall => {
            const info = HALL_DATA[hall] ?? { icon: '🏯', desc: `${hall}에 대한 해설을 준비 중입니다.` }
            const isOpen = openHall === hall
            return (
              <div key={hall} style={{
                background: 'var(--color-card)',
                border: `1px solid ${isOpen ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                transition: 'var(--transition)',
              }}>
                <button
                  onClick={() => setOpenHall(isOpen ? null : hall)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: '12px', padding: '1rem 1.25rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{info.icon}</span>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1rem', fontWeight: 600,
                    color: isOpen ? 'var(--color-accent)' : 'var(--color-text)',
                    flex: 1,
                  }}>{hall}</span>
                  <span style={{
                    color: 'var(--color-text-light)', fontSize: '.85rem',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'var(--transition)',
                  }}>▼</span>
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 1.25rem 1.2rem 3.5rem',
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    <p style={{
                      fontSize: '.92rem', color: 'var(--color-text)',
                      lineHeight: 1.85, fontFamily: 'var(--font-sans)',
                      paddingTop: '1rem',
                    }}>{info.desc}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
