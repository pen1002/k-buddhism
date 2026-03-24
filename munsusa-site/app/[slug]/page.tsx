import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import HeroCanvas from '@/components/HeroCanvas'
import KvBlocks from '@/components/KvBlocks'
import MunsusaClient from '@/components/MunsusaClient'
import QASlideBlock from '@/components/QASlideBlock'
import InfoGraphicBlock from '@/components/InfoGraphicBlock'
import HeroImageBlock from '@/components/hero/HeroImageBlock'
import HeroSlideBlock from '@/components/hero/HeroSlideBlock'
import HeroInfoBlock from '@/components/hero/HeroInfoBlock'
import HeroParticleBlock from '@/components/hero/HeroParticleBlock'
import HeroLanternBlock from '@/components/hero/HeroLanternBlock'
import HeroLampBlock from '@/components/hero/HeroLampBlock'
import HeroMorphGridBlock from '@/components/hero/HeroMorphGridBlock'

export const revalidate = 300

// ── 타입 ───────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>

interface BlockDef { blockType: string; config: Cfg }

function cfg(blocks: BlockDef[], type: string): Cfg {
  return (blocks.find(b => b.blockType === type)?.config ?? {}) as Cfg
}
function has(blocks: BlockDef[], type: string): boolean {
  return blocks.some(b => b.blockType === type)
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const temple = await db.temple.findUnique({
    where: { code: slug, isActive: true },
    include: { blockConfigs: { where: { isVisible: true }, orderBy: { order: 'asc' } } },
  })
  if (!temple) notFound()

  const blocks = temple.blockConfigs as BlockDef[]
  // 활성 히어로 블록 타입 자동 감지 (H-01 ~ H-07)
  const heroBlockType = (['H-01','H-02','H-03','H-04','H-05','H-06','H-07','H-08','H-09','H-10'] as const).find(t => has(blocks, t)) || 'H-01'
  const h01 = cfg(blocks, heroBlockType)   // hero config (어떤 H-* 타입이든 동일하게 읽음)
  const e01 = cfg(blocks, 'E-01')
  const p01 = cfg(blocks, 'P-01')
  const w01 = cfg(blocks, 'W-01')
  const do01 = cfg(blocks, 'DO-01')
  const v01 = cfg(blocks, 'V-01')

  const name = temple.name
  const nameEn = temple.nameEn || ''
  const heroTitle = h01.heroTitle || name
  const heroHanja = h01.heroHanja || ''
  const ticker: string[] = Array.isArray(h01.ticker) ? h01.ticker : [`☸ ${name}`, `✦ ${temple.denomination || '대한불교조계종'}`]
  const stats: Array<{ value: string; label: string }> = Array.isArray(h01.stats) ? h01.stats : []
  const events: Cfg[] = Array.isArray(e01.events) ? e01.events : []
  const pillars: Cfg[] = Array.isArray(p01.pillars) ? p01.pillars : []
  const orgs: Cfg[] = Array.isArray(w01.orgs) ? w01.orgs : []
  const visitAddress = v01.address || temple.address || ''
  const mapLines: string[] = Array.isArray(v01.mapLines) ? v01.mapLines : []

  // Nav links: only show sections that exist
  const navLinks = [
    { href: '#events', label: '법회·행사', emoji: '🎏', show: has(blocks, 'E-01') },
    { href: '#intro', label: '사찰소개', emoji: '🏯', show: true },
    { href: '#pillars', label: '3대 실천', emoji: '☸', show: has(blocks, 'P-01') },
    { href: '#welfare', label: '산하기관', emoji: '🏥', show: has(blocks, 'W-01') },
    { href: '#donate', label: '나눔동참', emoji: '🤝', show: has(blocks, 'DO-01') },
    { href: '#visit', label: '오시는길', emoji: '🗺', show: has(blocks, 'V-01') || !!temple.address },
  ].filter(l => l.show)

  return (
    <>
      {/* 사찰별 컬러 테마 */}
      <style>{`:root{--color-accent:${temple.primaryColor};--color-gold:${temple.secondaryColor};}`}</style>

      {/* ── NAV ── */}
      <nav className="nav" id="nav">
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">
            {heroTitle}{heroHanja && <span style={{ marginLeft: '0.4em', fontSize: '0.8em', opacity: 0.7 }}>{temple.nameEn ? `· ${nameEn}` : ''}</span>}
          </a>
          <div className="nav-links">
            {navLinks.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
            {h01.navBlogHref && (
              <a href={h01.navBlogHref} target="_blank" rel="noopener" className="nav-cta">{h01.navBlogLabel || '블로그'}</a>
            )}
          </div>
          <button className="nav-toggle" id="navToggle" aria-label="메뉴">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className="mobile-menu" id="mobileMenu">
        {navLinks.map(l => <a key={l.href} href={l.href}>{l.emoji} {l.label}</a>)}
        {h01.navBlogHref && (
          <a href={h01.navBlogHref} target="_blank" rel="noopener">📝 {h01.navBlogLabel || '블로그'}</a>
        )}
      </div>

      {/* ── HERO (H-01: 파티클 연등형) ── */}
      {has(blocks, 'H-01') && (
        <section className="hero" id="hero">
          <div className="hero-bg" />
          <canvas id="lanternCanvas" />
          <canvas id="particleCanvas" />
          <HeroCanvas words={Array.isArray(h01.particleWords) ? h01.particleWords : [name]} />
          <div className="hero-content">
            {h01.badge && <div className="hero-badge">{h01.badge}</div>}
            <h1>{heroTitle}</h1>
            {heroHanja && <div className="hero-hanja">{heroHanja}</div>}
            {h01.heroDesc && (
              <p className="hero-desc" style={{ whiteSpace: 'pre-line' }}>{h01.heroDesc}</p>
            )}
            <div className="hero-btns">
              {h01.cta1Label && (
                <a href={h01.cta1Href || '#intro'} className="btn-primary">{h01.cta1Label}</a>
              )}
              {h01.cta2Label && (
                <a href={h01.cta2Href || '#visit'} className="btn-outline">{h01.cta2Label}</a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── HERO (H-02: 정지 이미지형) ── */}
      {has(blocks, 'H-02') && (
        <HeroImageBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-03: 슬라이드형) ── */}
      {has(blocks, 'H-03') && (
        <HeroSlideBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-04: 파티클 전용) ── */}
      {has(blocks, 'H-04') && (
        <HeroParticleBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-05: 연등 전용) ── */}
      {has(blocks, 'H-05') && (
        <HeroLanternBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-06: Lamp 광명형) ── */}
      {has(blocks, 'H-06') && (
        <HeroLampBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-07: 원형→그리드 변환형) ── */}
      {has(blocks, 'H-07') && (
        <HeroMorphGridBlock config={h01} temple={temple} />
      )}

      {/* ── TICKER ── */}
      {ticker.length > 0 && (
        <div className="ticker">
          <div className="ticker-track">
            {[...ticker, ...ticker].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
      )}

      {/* ── STATS ── */}
      {stats.length > 0 && (
        <div className="stats-bar">
          <div className="stats-inner">
            {stats.map((s, i) => (
              <div key={i} className="stat-item"><h3>{s.value}</h3><p>{s.label}</p></div>
            ))}
          </div>
        </div>
      )}

      {/* ── EVENTS (E-01) ── */}
      {has(blocks, 'E-01') && events.length > 0 && (
        <section className="section" id="events">
          <div className="section-inner">
            <p className="section-label">{e01.sectionLabel || 'Events & Dharma Services'}</p>
            <h2 className="section-title">{e01.sectionTitle || '법회 · 기도 · 행사'}</h2>
            {e01.sectionDesc && <p className="section-desc">{e01.sectionDesc}</p>}
            <div className="events-grid" id="eventsGrid">
              {events.map((ev: Cfg, i: number) => (
                <div
                  key={i} className="event-card fade-in"
                  data-schedule={ev.schedule}
                  data-lunar-days={ev.lunarDays}
                  data-solar-days={ev.solarDays}
                  data-lunar-month={ev.lunarMonth}
                  data-lunar-start={ev.lunarStart}
                  data-lunar-end={ev.lunarEnd}
                  data-multi-month={ev.multiMonth}
                  data-solar-month={ev.solarMonth}
                  data-solar-start={ev.solarStart}
                  data-solar-end={ev.solarEnd}
                  data-weeks={ev.weeks}
                >
                  <div className="event-icon">{ev.icon}</div>
                  <span className="event-tag">{ev.tag}</span>
                  <h3>{ev.title}</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{ev.desc}</p>
                  <div className="event-meta">{ev.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── KV BLOCKS (I-01 · D-01 · G-01) ── */}
      <KvBlocks templeCode={slug} templeName={name} blocks={blocks} />

      {/* ── QA SLIDE (QA-01) ── */}
      {has(blocks, 'QA-01') && (
        <QASlideBlock config={cfg(blocks, 'QA-01')} />
      )}

      {/* ── INFOGRAPHIC (IG-01) ── */}
      {has(blocks, 'IG-01') && (
        <InfoGraphicBlock config={cfg(blocks, 'IG-01')} />
      )}

      {/* ── ABOUT ── */}
      <section className="section" id="intro" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="section-inner">
          <p className="section-label">About Temple</p>
          <h2 className="section-title">{name}</h2>
          <div className="about-layout">
            <div className="about-text fade-in">
              {temple.description && <p>{temple.description}</p>}
              {(h01.aboutExtra as string[] | undefined)?.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
              <dl className="about-info">
                {[
                  ['종단', temple.denomination || '대한불교 조계종'],
                  ['주지', temple.abbotName || '-'],
                  ['소재지', temple.address || '-'],
                  ...((h01.aboutInfoExtra as [string, string][] | undefined) ?? []),
                ].map(([dt, dd]) => (
                  <div key={dt} className="about-info-item"><dt>{dt}</dt><dd>{dd}</dd></div>
                ))}
              </dl>
            </div>
            {h01.aboutImageUrl && (
              <div className="about-images fade-in">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={h01.aboutImageUrl}
                  alt={`${name} 전경`}
                  style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      {h01.quoteText && (
        <div className="quote-banner">
          <h2 style={{ whiteSpace: 'pre-line' }}>&ldquo;{h01.quoteText}&rdquo;</h2>
          {h01.quoteAuthor && <p>{h01.quoteAuthor}</p>}
        </div>
      )}

      {/* ── PILLARS (P-01) ── */}
      {has(blocks, 'P-01') && pillars.length > 0 && (
        <section className="section" id="pillars">
          <div className="section-inner">
            <p className="section-label">{p01.sectionLabel || 'Mission'}</p>
            <h2 className="section-title">{p01.sectionTitle || '핵심 실천 가치'}</h2>
            {p01.sectionDesc && <p className="section-desc">{p01.sectionDesc}</p>}
            <div className="pillar-grid">
              {pillars.map((p: Cfg, i: number) => (
                <div key={i} className={`pillar-card ${p.cls || `p${i + 1}`} fade-in`}>
                  <div className="pillar-icon">{p.icon}</div>
                  <h3>{p.title}</h3>
                  <div className="pillar-sub">{p.sub}</div>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WELFARE (W-01) ── */}
      {has(blocks, 'W-01') && orgs.length > 0 && (
        <section className="section" id="welfare" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="section-inner">
            <p className="section-label">{w01.sectionLabel || 'Affiliated Organizations'}</p>
            <h2 className="section-title">{w01.sectionTitle || '산하기관 바로가기'}</h2>
            {w01.sectionDesc && <p className="section-desc">{w01.sectionDesc}</p>}
            <div className="welfare-grid">
              {orgs.map((org: Cfg, i: number) => (
                <div key={i} className="welfare-card fade-in">
                  <div className="welfare-card-top">
                    <div className={`welfare-icon ${org.cls || ''}`}>{org.icon}</div>
                    <h3>{org.name}</h3>
                  </div>
                  <p>{org.desc}</p>
                  {org.href && (
                    <a href={org.href} target="_blank" rel="noopener" className="welfare-link">홈페이지 방문 →</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DONATE (DO-01) ── */}
      {has(blocks, 'DO-01') && (
        <section className="section" id="donate">
          <div className="section-inner">
            <p className="section-label">Support &amp; Donation</p>
            <h2 className="section-title">나눔에 동참하세요</h2>
            <p className="section-desc">여러분의 소중한 후원이 사찰과 지역사회 발전의 원동력이 됩니다</p>
            <div className="donate-grid">
              <div className="donate-card fade-in">
                <h3>🏦 후원 계좌</h3>
                <div className="bank-info">
                  {[
                    ['은행', do01.bankName || '-'],
                    ['예금주', do01.accountHolder || name],
                    ['계좌번호', do01.accountNumber || '-'],
                  ].map(([k, v]) => (
                    <div key={k} className="bank-row"><span>{k}</span><span>{v}</span></div>
                  ))}
                </div>
              </div>
              <div className="donate-card fade-in">
                <h3>📞 후원 문의</h3>
                <div className="bank-info">
                  {[
                    ['대표 전화', do01.phone || temple.phone || '-'],
                    ['이메일', do01.email || temple.email || '-'],
                    ['운영시간', do01.hours || '평일 09:00~18:00'],
                  ].map(([k, v]) => (
                    <div key={k} className="bank-row"><span>{k}</span><span>{v}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── VISIT (V-01) ── */}
      {(has(blocks, 'V-01') || visitAddress) && (
        <section className="section" id="visit" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="section-inner">
            <p className="section-label">Location &amp; Access</p>
            <h2 className="section-title">오시는 길</h2>
            {visitAddress && <p className="section-desc">{visitAddress}</p>}
            {has(blocks, 'V-01') && (
              <div style={{ marginTop: '36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div className="fade-in">
                  <dl className="about-info">
                    {[
                      ['주소', v01.address || visitAddress],
                      v01.transport ? ['대중교통', v01.transport] : null,
                      v01.bus ? ['버스', v01.bus] : null,
                      v01.parking ? ['주차', v01.parking] : null,
                    ].filter(Boolean).map((row) => {
                      const [k, v] = row as [string, string]
                      return <div key={k} className="about-info-item"><dt>{k}</dt><dd>{v}</dd></div>
                    })}
                  </dl>
                </div>
                {mapLines.length > 0 && (
                  <div className="fade-in" style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--color-border)' }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--color-text-light)', lineHeight: '1.85' }}>
                      {mapLines.map((line: string, i: number) => (
                        <span key={i}>{line}<br /></span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>☸ {name}</h3>
            <p>
              {nameEn && <>{nameEn}<br /></>}
              {temple.denomination || '대한불교 조계종'}<br />
              {temple.address}
            </p>
          </div>
          <div className="footer-col">
            <h4>사찰 안내</h4>
            {has(blocks, 'E-01') && <a href="#events">법회·행사</a>}
            <a href="#intro">사찰 소개</a>
            {has(blocks, 'P-01') && <a href="#pillars">핵심 실천</a>}
            {has(blocks, 'W-01') && <a href="#welfare">산하기관</a>}
            {has(blocks, 'DO-01') && <a href="#donate">나눔동참</a>}
            {(has(blocks, 'V-01') || visitAddress) && <a href="#visit">오시는길</a>}
          </div>
          <div className="footer-col">
            <h4>연락처</h4>
            {temple.phone && <a href={`tel:${temple.phone}`}>📞 {temple.phone}</a>}
            {temple.address && <span>📍 {temple.address}</span>}
            {h01.navBlogHref && <a href={h01.navBlogHref} target="_blank" rel="noopener">📝 블로그</a>}
            {has(blocks, 'DO-01') && <a href="#donate">🤝 후원 안내</a>}
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 {name} · {temple.denomination || '대한불교 조계종'} · {temple.address}
        </div>
      </footer>

      {/* ── LIGHTBOX ── */}
      <div className="lightbox" id="lightbox">
        <span className="lightbox-close">✕</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img id="lightboxImg" src="" alt="" />
      </div>

      {/* ── SCROLL TO TOP ── */}
      <div className="scroll-top" id="scrollTop">↑</div>

      {/* ── CLIENT SCRIPTS ── */}
      <MunsusaClient />
    </>
  )
}

// ISR: 첫 요청 시 생성 후 300초 캐시 (generateStaticParams 제거 → Supabase 병렬 연결 제한 회피)
