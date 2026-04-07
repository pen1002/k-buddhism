// SEC12-07 신도 커뮤니티 게시판
import { BlockProps } from './types'

export default function CommunityBlock({ blockData }: BlockProps) {
  const cfg = blockData ?? {}
  const posts: { title: string; author?: string; date?: string; category?: string; views?: number }[] = Array.isArray(cfg.posts) ? cfg.posts : []
  if (posts.length === 0) return null
  return (
    <section className="section" id="community">
      <div className="section-inner">
        <p className="section-label">Community</p>
        <h2 className="section-title">{cfg.sectionTitle || '신도 게시판'}</h2>
        <div style={{ marginTop: '1.5rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {posts.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.875rem 1.25rem', borderBottom: i < posts.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              {p.category && <span style={{ fontSize: '.72rem', color: 'var(--color-accent)', background: 'var(--color-bg-alt)', borderRadius: '3px', padding: '.15rem .4rem', flexShrink: 0 }}>{p.category}</span>}
              <span style={{ flex: 1, fontFamily: 'var(--font-serif)', color: 'var(--color-text)', fontSize: '.9rem' }}>{p.title}</span>
              {p.author && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)', flexShrink: 0 }}>{p.author}</span>}
              {p.date && <span style={{ fontSize: '.75rem', color: 'var(--color-text-light)', flexShrink: 0 }}>{p.date}</span>}
              {p.views !== undefined && <span style={{ fontSize: '.72rem', color: 'var(--color-text-light)', flexShrink: 0 }}>조회 {p.views}</span>}
            </div>
          ))}
        </div>
        {cfg.linkUrl && (
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <a href={cfg.linkUrl} style={{ display: 'inline-block', padding: '.6rem 1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', color: 'var(--color-text)', textDecoration: 'none', fontSize: '.9rem' }}>게시판 더 보기</a>
          </div>
        )}
      </div>
    </section>
  )
}
