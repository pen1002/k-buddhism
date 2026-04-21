import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import HeroCanvas from '@/components/HeroCanvas'
import MunsusaClient from '@/components/MunsusaClient'
import HeroImageBlock from '@/components/hero/HeroImageBlock'
import HeroSlideBlock from '@/components/hero/HeroSlideBlock'
import HeroInfoBlock from '@/components/hero/HeroInfoBlock'
import HeroParticleBlock from '@/components/hero/HeroParticleBlock'
import HeroLanternBlock from '@/components/hero/HeroLanternBlock'
import HeroLampBlock from '@/components/hero/HeroLampBlock'
import HeroMorphGridBlock from '@/components/hero/HeroMorphGridBlock'
import HeroVideoBlock from '@/components/blocks/hero/HeroVideoBlock'
import HeroSeasonBlock from '@/components/blocks/hero/HeroSeasonBlock'
import HeroMinimalBlock from '@/components/blocks/hero/HeroMinimalBlock'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import DharmaBlock from '@/components/blocks/DharmaBlock'
import { getTodayDharma } from '@/lib/dharma-rotation'
import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params

  const temple = await db.temple.findUnique({
    where: { code: slug, isActive: true },
    select: {
      name: true,
      denomination: true,
      address: true,
      description: true,
      heroImageUrl: true,
      customDomain: true,
    },
  })

  if (!temple) {
    return {
      title: '사찰 정보 없음',
      robots: { index: false, follow: false },
    }
  }

  const region = temple.address?.split(' ').slice(0, 2).join(' ') ?? ''
  const titleSuffix = [region, temple.denomination].filter(Boolean).join(' ')
  const title = titleSuffix ? `${temple.name} | ${titleSuffix}` : temple.name

  const description = temple.description?.trim()
    || (temple.address && temple.denomination
        ? `${temple.address}에 위치한 ${temple.denomination} ${temple.name}입니다.`
        : `${temple.name} 공식 홈페이지입니다.`)

  const canonicalUrl = temple.customDomain
    ? `https://${temple.customDomain}`
    : undefined

  return {
    title,
    description,
    openGraph: {
      title: temple.name,
      description,
      images: temple.heroImageUrl ? [{ url: temple.heroImageUrl }] : [],
      type: 'website',
      locale: 'ko_KR',
      ...(canonicalUrl && { url: canonicalUrl }),
    },
    twitter: {
      card: 'summary_large_image',
      title: temple.name,
      description,
    },
    robots: { index: true, follow: true },
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600

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

  // 법륜 로직: 오늘의 법문 서버사이드 조회
  const dharma = has(blocks, 'D-01') ? await getTodayDharma(temple.code) : null
  // 활성 히어로 블록 타입 자동 감지 (H-01 ~ H-07)
  const heroBlockType = (['H-01','H-02','H-03','H-04','H-05','H-06','H-07','H-08','H-09','H-10'] as const).find(t => has(blocks, t)) || 'H-01'
  const h01 = cfg(blocks, heroBlockType)   // hero config (어떤 H-* 타입이든 동일하게 읽음)

  const name = temple.name
  const nameEn = temple.nameEn || ''
  const heroTitle = h01.heroTitle || name
  const heroHanja = h01.heroHanja || ''
  const ticker: string[] = Array.isArray(h01.ticker) ? h01.ticker : [`☸ ${name}`, `✦ ${temple.denomination || '대한불교조계종'}`]
  const stats: Array<{ value: string; label: string }> = Array.isArray(h01.stats) ? h01.stats : []

  // Nav links: only show sections that exist
  const navLinks = [
    { href: '#events', label: '법회·행사', emoji: '🎏', show: has(blocks, 'E-01') },
    { href: '#intro', label: '사찰소개', emoji: '🏯', show: true },
    { href: '#pillars', label: '3대 실천', emoji: '☸', show: has(blocks, 'P-01') },
    { href: '#welfare', label: '산하기관', emoji: '🏥', show: has(blocks, 'W-01') },
    { href: '#donate', label: '나눔동참', emoji: '🤝', show: has(blocks, 'DO-01') },
    { href: '#visit', label: '오시는길', emoji: '🗺', show: has(blocks, 'V-01') || !!temple.address },
  ].filter(l => l.show)

  const tier = temple.tier ?? 1
  const showAdvanced = tier >= 2

  const themeClass = temple.themeType || 'theme-2'

  return (
    <div data-theme={themeClass}>
      {/* 사찰별 컬러 테마 (primaryColor/secondaryColor override) */}
      <style>{`:root{--temple-primary:${temple.primaryColor};--temple-secondary:${temple.secondaryColor};}`}</style>

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
      {heroBlockType === 'H-01' && (
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
      {heroBlockType === 'H-02' && (
        <HeroImageBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-03: 슬라이드형) ── */}
      {heroBlockType === 'H-03' && (
        <HeroSlideBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-04: 파티클 전용) ── */}
      {heroBlockType === 'H-04' && (
        <HeroParticleBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-05: 연등 전용) ── */}
      {heroBlockType === 'H-05' && (
        <HeroLanternBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-06: Lamp 광명형) ── */}
      {heroBlockType === 'H-06' && (
        <HeroLampBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-07: 원형→그리드 변환형) ── */}
      {heroBlockType === 'H-07' && (
        <HeroMorphGridBlock config={h01} temple={temple} />
      )}

      {/* ── HERO (H-08: 드론 영상형) ── */}
      {heroBlockType === 'H-08' && (
        <HeroVideoBlock temple={temple} blockData={h01} />
      )}

      {/* ── HERO (H-09: 명상 미니멀 타이포) ── */}
      {heroBlockType === 'H-09' && (
        <HeroMinimalBlock temple={temple} blockData={h01} />
      )}

      {/* ── HERO (H-10: 사계절 자동 전환) ── */}
      {heroBlockType === 'H-10' && (
        <HeroSeasonBlock temple={temple} blockData={h01} />
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

      {/* ────────────────────────────────────────────────────────────────────
       * 12대 전각 배치 표준 (1080사찰 영구 법도)
       * 1.H-*  2.I-01  3.E-01  4.D-01  5.T-01(About)  6.T-02(Quote)
       * 7.G-01  8.OF-01(기도불사동참·신규)  9.PAY-01(결제·미래)
       * 10.QA-01  11.IG-01  12.P-01  + W-01·V-01(부가)
       * ─────────────────────────────────────────────────────────────── */}

      {/* ── 2. 공지사항 (I-01) ── */}
      <BlockRenderer temple={temple} blocks={blocks} only={['I-01']} />

      {/* ── 3. 법회·기도·행사 (E-01) ── */}
      <BlockRenderer temple={temple} blocks={blocks} only={['E-01']} />

      {/* ── 4. 오늘의 법문 (D-01) ── */}
      {dharma && <DharmaBlock blockData={{ dharma }} />}

      {/* ── 5. 사찰소개 T-01 — About Temple ── */}
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

      {/* ── 6. 주지스님 인사말 T-02 — Greeting ── */}
      {h01.quoteText && (
        <div className="quote-banner">
          <h2 style={{ whiteSpace: 'pre-line' }}>&ldquo;{h01.quoteText}&rdquo;</h2>
          {h01.quoteAuthor && <p>{h01.quoteAuthor}</p>}
        </div>
      )}

      {/* ── 7. 갤러리 G-01 ── */}
      <BlockRenderer temple={temple} blocks={blocks} only={['G-01']} />

      {/* ── 8. 기도불사동참 OF-01 (신규 공정 예정) ── */}
      {/* <BlockRenderer temple={temple} blocks={blocks} only={['OF-01']} /> */}

      {/* ── 10. 자료관 QA-01 ── */}
      <BlockRenderer temple={temple} blocks={blocks} only={['QA-01']} />

      {/* ── 11. 숫자로 보는 사찰 IG-01 ── */}
      <BlockRenderer temple={temple} blocks={blocks} only={['IG-01']} />

      {/* ── 12. 자비의 실천 네트워크 P-01 ── */}
      <BlockRenderer temple={temple} blocks={blocks} only={['P-01']} />

      {/* ── 부가: 산하기관 W-01 ── */}
      <BlockRenderer temple={temple} blocks={blocks} only={['W-01']} />

      {/* ── 부가: 나눔동참 DO-01 ── */}
      <BlockRenderer temple={temple} blocks={blocks} only={['DO-01']} />

      {/* ── 부가: 오시는길 V-01 ── */}
      <BlockRenderer temple={temple} blocks={blocks} only={['V-01']} />

      {/* ── SEC* 신규 전각 블록 (2차·3차 공정) — 레거시와 중복 없이 렌더링 ── */}
      <BlockRenderer
        temple={temple}
        blocks={blocks}
        except={['I-01','D-01','G-01','E-01','P-01','W-01','DO-01','V-01','QA-01','IG-01']}
      />

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
            {(has(blocks, 'V-01') || !!temple.address) && <a href="#visit">오시는길</a>}
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
    </div>
  )
}

// ISR: 첫 요청 시 생성 후 300초 캐시 (generateStaticParams 제거 → Supabase 병렬 연결 제한 회피)
