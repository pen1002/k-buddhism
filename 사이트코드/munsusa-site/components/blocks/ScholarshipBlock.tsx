// SEC12-04 장학 사업
import { BlockProps } from './types'

export default function ScholarshipBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const programs: { name: string; description?: string; amount?: string; quota?: string; deadline?: string; requirements?: string[] }[] = Array.isArray(cfg.programs) ? cfg.programs : []
  if (programs.length === 0) return null
  return (
    <section className="section" id="scholarship">
      <div className="section-inner">
        <p className="section-label">Scholarship</p>
        <h2 className="section-title">{cfg.sectionTitle || '장학 사업'}</h2>
        {cfg.intro && <p style={{ marginTop: '.75rem', color: 'var(--color-text-light)', lineHeight: 1.7 }}>{cfg.intro}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          {programs.map((p, i) => (
            <div key={i} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderLeft: '4px solid var(--color-secondary)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem', marginBottom: '.5rem' }}>{p.name}</p>
              {p.description && <p style={{ fontSize: '.875rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{p.description}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '.75rem' }}>
                {p.amount && (
                  <div>
                    <p style={{ fontSize: '.7rem', color: 'var(--color-text-light)', marginBottom: '.15rem' }}>장학금</p>
                    <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-primary)' }}>{p.amount}</p>
                  </div>
                )}
                {p.quota && (
                  <div>
                    <p style={{ fontSize: '.7rem', color: 'var(--color-text-light)', marginBottom: '.15rem' }}>인원</p>
                    <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-text)' }}>{p.quota}</p>
                  </div>
                )}
                {p.deadline && (
                  <div>
                    <p style={{ fontSize: '.7rem', color: 'var(--color-text-light)', marginBottom: '.15rem' }}>마감일</p>
                    <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-text)' }}>{p.deadline}</p>
                  </div>
                )}
              </div>
              {p.requirements && p.requirements.length > 0 && (
                <div style={{ marginTop: '.75rem' }}>
                  <p style={{ fontSize: '.78rem', color: 'var(--color-text-light)', marginBottom: '.375rem' }}>지원 자격</p>
                  <ul style={{ paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                    {p.requirements.map((r, j) => (
                      <li key={j} style={{ fontSize: '.82rem', color: 'var(--color-text-light)' }}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
