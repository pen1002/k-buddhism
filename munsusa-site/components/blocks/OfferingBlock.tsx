'use client'
// SEC08-01~10 범용 기도불사동참 (탭형 4탭)
import { useState } from 'react'
import { BlockProps } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface OfferingPlan { icon: string; name: string; price: string; desc: string }

const DEFAULT_PLANS: OfferingPlan[] = [
  { icon: '🕯️', name: '연등 불사',   price: '₩150,000', desc: '대웅전 연등 / 매일 법회 시 스님 독송' },
  { icon: '📿', name: '백일기도',    price: '₩100,000', desc: '백일 간 매일 기도 / 분기별 회향' },
  { icon: '🙏', name: '일년기도',    price: '₩300,000', desc: '일 년 기도 등록 / 정기법회 우선 참석' },
  { icon: '🌱', name: '땅 한 평 사기', price: '₩200,000', desc: '도량 수호 불사 동참 / 영구 명부 등재' },
]

const TABS = [
  { key: 'lantern',  label: '연등·인등' },
  { key: 'prayer',   label: '기도' },
  { key: 'annual',   label: '년중기도' },
  { key: 'land',     label: '땅한평' },
]

export default function OfferingBlock({ temple, blockData }: BlockProps) {
  const cfg: Cfg = blockData ?? {}
  const [activeTab, setActiveTab] = useState(0)

  // 탭별 plans (없으면 기본값 분배)
  const tabPlans: OfferingPlan[][] = TABS.map((tab, i) => {
    const raw = cfg[tab.key] ?? cfg.plans
    if (Array.isArray(raw)) return raw
    // 기본값: 탭별 1개씩 분배
    return [DEFAULT_PLANS[i] ?? DEFAULT_PLANS[0]]
  })

  const currentPlans = tabPlans[activeTab] ?? []
  const bankInfo: Cfg = cfg.bankInfo ?? {}
  const isAI = !cfg.plans && !cfg.lantern

  return (
    <section className="section" id="offerings" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Dharma Offerings</p>
        <h2 className="section-title">{cfg.sectionTitle || '기도 · 불사 동참'}</h2>
        {isAI && (
          <p className="section-desc" style={{ fontSize: '.82rem', color: 'var(--color-text-light)' }}>
            ✨ AI 자동 장엄 — 관리자 입력 시 업데이트됩니다
          </p>
        )}

        {/* 탭 */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius)',
                border: `1.5px solid ${activeTab === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
                background: activeTab === i ? 'var(--color-accent)' : 'var(--color-card)',
                color: activeTab === i ? '#fff' : 'var(--color-text)',
                fontFamily: 'var(--font-sans)', fontSize: '.85rem',
                fontWeight: activeTab === i ? 700 : 400,
                cursor: 'pointer',
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* 불사 카드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          {currentPlans.map((plan, i) => (
            <div key={i} style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1.25rem',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{plan.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem', fontWeight: 700,
                color: 'var(--color-text)', marginBottom: '4px',
              }}>{plan.name}</h3>
              <p style={{
                fontSize: '1.15rem', fontWeight: 700,
                color: 'var(--color-accent)',
                marginBottom: '8px',
              }}>{plan.price}</p>
              <p style={{
                fontSize: '.82rem', color: 'var(--color-text-light)',
                lineHeight: 1.65, whiteSpace: 'pre-line',
              }}>{plan.desc}</p>
            </div>
          ))}
        </div>

        {/* 계좌 정보 */}
        {(bankInfo.account || temple.phone) && (
          <div style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem 1.5rem',
            display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center',
          }}>
            {bankInfo.account && (
              <div>
                <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginBottom: '2px' }}>계좌 안내</p>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontWeight: 700,
                  color: 'var(--color-text)',
                  fontSize: '.95rem',
                }}>
                  {bankInfo.bank ?? ''} {bankInfo.account} ({bankInfo.holder ?? ''})
                </p>
              </div>
            )}
            {temple.phone && (
              <a href={`tel:${temple.phone}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px',
                background: 'var(--color-accent)', color: '#fff',
                borderRadius: 'var(--radius)', textDecoration: 'none',
                fontFamily: 'var(--font-sans)', fontSize: '.88rem', fontWeight: 600,
              }}>📞 {temple.phone}</a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
