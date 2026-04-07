// SEC04-04 다국어 법문
'use client'
import { useState } from 'react'
import { BlockProps } from './types'

const LANG_LABELS: Record<string, string> = {
  ko: '한국어', en: 'English', zh: '中文', ja: '日本語',
}

export default function DharmaMultiLangBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const [activeLang, setActiveLang] = useState('ko')
  const dharmas: { lang: string; title: string; content: string; source?: string }[] = Array.isArray(cfg.dharmas) ? cfg.dharmas : []
  if (dharmas.length === 0) return null
  const langs = [...new Set(dharmas.map(d => d.lang))]
  const active = dharmas.find(d => d.lang === activeLang) || dharmas[0]
  return (
    <section className="section" id="dharma-multilang">
      <div className="section-inner">
        <p className="section-label">Multi-Language</p>
        <h2 className="section-title">{cfg.sectionTitle || '다국어 법문'}</h2>
        <div style={{ display: 'flex', gap: '.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {langs.map(lang => (
            <button key={lang} onClick={() => setActiveLang(lang)} style={{ padding: '.4rem 1rem', borderRadius: '999px', border: '1px solid', fontSize: '.85rem', cursor: 'pointer', background: activeLang === lang ? 'var(--color-primary)' : 'transparent', color: activeLang === lang ? '#fff' : 'var(--color-text)', borderColor: activeLang === lang ? 'var(--color-primary)' : 'var(--color-border)' }}>
              {LANG_LABELS[lang] || lang}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '1.25rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)', marginBottom: '1rem' }}>{active.title}</h3>
          <p style={{ fontSize: '.95rem', color: 'var(--color-text)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{active.content}</p>
          {active.source && <p style={{ marginTop: '1rem', fontSize: '.8rem', color: 'var(--color-text-light)' }}>— {active.source}</p>}
        </div>
      </div>
    </section>
  )
}
