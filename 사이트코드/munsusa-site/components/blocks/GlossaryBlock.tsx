// SEC10-03 불교 용어 사전
'use client'
import { useState } from 'react'
import { BlockProps } from './types'

const DEFAULT_TERMS = [
  { term: '불(佛)', reading: '불', definition: '깨달음을 얻은 존재, 부처님을 가리킵니다.' },
  { term: '법(法)', reading: '법', definition: '부처님의 가르침, 진리를 뜻합니다.' },
  { term: '승(僧)', reading: '승', definition: '수행하는 사람들의 공동체, 스님을 뜻합니다.' },
  { term: '반야(般若)', reading: '반야', definition: '지혜를 뜻하는 산스크리트어 prajna의 음역입니다.' },
  { term: '열반(涅槃)', reading: '열반', definition: '번뇌가 소멸된 완전한 평화의 경지입니다.' },
  { term: '사성제(四聖諦)', reading: '사성제', definition: '고(苦)·집(集)·멸(滅)·도(道)의 네 가지 성스러운 진리입니다.' },
]

export default function GlossaryBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const [search, setSearch] = useState('')
  const terms: { term: string; reading?: string; definition: string; category?: string }[] =
    Array.isArray(cfg.terms) && cfg.terms.length > 0 ? cfg.terms : DEFAULT_TERMS
  const filtered = search ? terms.filter(t => t.term.includes(search) || t.definition.includes(search)) : terms
  return (
    <section className="section" id="glossary">
      <div className="section-inner">
        <p className="section-label">Glossary</p>
        <h2 className="section-title">{cfg.sectionTitle || '불교 용어 사전'}</h2>
        <div style={{ marginTop: '1.25rem', position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="용어 검색..." style={{ width: '100%', padding: '.625rem 1rem .625rem 2.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: '.9rem', boxSizing: 'border-box' }} />
          <span style={{ position: 'absolute', left: '.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }}>🔍</span>
        </div>
        <div style={{ marginTop: '1rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>검색 결과가 없습니다.</p>
          ) : filtered.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '.875rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, minWidth: '80px' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)' }}>{t.term}</p>
                {t.reading && <p style={{ fontSize: '.7rem', color: 'var(--color-text-light)' }}>{t.reading}</p>}
              </div>
              <p style={{ flex: 1, fontSize: '.875rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{t.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
