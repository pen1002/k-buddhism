import { notFound } from 'next/navigation'
import { db } from '@/lib/db'

export const revalidate = 300

// ── 타입 ──────────────────────────────────────────────
interface BlockConfigRow {
  id: string
  blockType: string
  label: string | null
  order: number
  config: Record<string, unknown>
}

// ── 블록 컴포넌트 ─────────────────────────────────────

function HeroBlock({ config }: { config: Record<string, unknown> }) {
  const title = (config.title as string) ?? ''
  const subtitle = (config.subtitle as string) ?? ''
  return (
    <section
      className="relative flex items-center justify-center min-h-[60vh] text-center px-6"
      style={{ background: (config.bgColor as string) ?? '#1B1917' }}
    >
      <div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
        {subtitle && <p className="text-lg md:text-xl text-stone-300">{subtitle}</p>}
      </div>
    </section>
  )
}

function GalleryBlock({ config, templeCode }: { config: Record<string, unknown>; templeCode: string }) {
  const title = (config.title as string) ?? '갤러리'
  return (
    <section className="py-14 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">{title}</h2>
      <div
        id={`gallery-${templeCode}`}
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${(config.columns as number) ?? 3}, 1fr)` }}
      >
        <p className="text-stone-400 col-span-full text-sm">사진을 불러오는 중...</p>
      </div>
    </section>
  )
}

function DharmaBlock({ config }: { config: Record<string, unknown> }) {
  const title = (config.title as string) ?? '오늘의 법문'
  return (
    <section className="py-14 px-4 bg-amber-50">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">{title}</h2>
        <div id="dharma-block" className="text-stone-500 italic">법문을 불러오는 중...</div>
      </div>
    </section>
  )
}

function NoticeBlock({ config }: { config: Record<string, unknown> }) {
  const title = (config.title as string) ?? '공지사항'
  return (
    <section className="py-14 px-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">{title}</h2>
      <ul id="notice-block" className="space-y-3">
        <li className="text-stone-400 text-sm">공지사항을 불러오는 중...</li>
      </ul>
    </section>
  )
}

// ── 블록 라우터 ───────────────────────────────────────
function renderBlock(block: BlockConfigRow, templeCode: string) {
  const cfg = block.config ?? {}
  switch (block.blockType) {
    case 'H-01': return <HeroBlock key={block.id} config={cfg} />
    case 'G-01': return <GalleryBlock key={block.id} config={cfg} templeCode={templeCode} />
    case 'D-01': return <DharmaBlock key={block.id} config={cfg} />
    case 'I-01': return <NoticeBlock key={block.id} config={cfg} />
    default:     return null
  }
}

// ── KV 데이터 클라이언트 스크립트 ────────────────────
function KvScript({ templeCode }: { templeCode: string }) {
  const apiUrl = `https://temple-admin-zeta.vercel.app/api/temple/${templeCode}/public`
  const script = `
(async function() {
  try {
    const res = await fetch('${apiUrl}');
    const data = await res.json();

    // 갤러리
    const gallery = document.getElementById('gallery-${templeCode}');
    if (gallery && Array.isArray(data.gallery) && data.gallery.length > 0) {
      gallery.innerHTML = data.gallery.slice(0, ${6}).map(item => {
        const src = typeof item === 'string' ? item : (item.url || '');
        const alt = item.caption || '문수사 사진';
        if (!src) return '';
        return '<div style="aspect-ratio:1;overflow:hidden;border-radius:8px;">'
          + '<img src="' + src + '" alt="' + alt + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.display=\\'none\\'">'
          + '</div>';
      }).join('');
    }

    // 법문
    const dharma = document.getElementById('dharma-block');
    if (dharma) {
      const text = data.dharmaText || data.dharma_text;
      const source = data.dharmaSource || data.dharma_source;
      if (text) {
        dharma.innerHTML = '<blockquote style="font-size:1.2rem;line-height:1.8;color:#44403c;">'
          + text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          + '</blockquote>'
          + (source ? '<p style="margin-top:12px;color:#78716c;">— ' + source + '</p>' : '');
      } else {
        dharma.innerHTML = '<p style="color:#a8a29e;">등록된 법문이 없습니다.</p>';
      }
    }

    // 공지사항
    const notice = document.getElementById('notice-block');
    if (notice && Array.isArray(data.notices) && data.notices.length > 0) {
      notice.innerHTML = data.notices.slice(0, 5).map(n => {
        const title = typeof n === 'string' ? n : (n.title || n.content || '');
        const date = n.createdAt ? new Date(n.createdAt).toLocaleDateString('ko-KR') : '';
        return '<li style="background:#fff;border:1px solid #e7e5e4;border-radius:8px;padding:16px;">'
          + '<p style="font-weight:600;color:#1c1917;">' + title + '</p>'
          + (date ? '<p style="font-size:0.8rem;color:#a8a29e;margin-top:4px;">' + date + '</p>' : '')
          + '</li>';
      }).join('');
    } else if (notice) {
      notice.innerHTML = '<li style="color:#a8a29e;font-size:0.9rem;">등록된 공지사항이 없습니다.</li>';
    }
  } catch(e) {
    console.warn('[KV]', e);
  }
})();
`
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

// ── Page ─────────────────────────────────────────────
export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const temple = await db.temple.findUnique({
    where: { code: slug, isActive: true },
    include: {
      blockConfigs: {
        where: { isVisible: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!temple) notFound()

  return (
    <>
      <title>{temple.name}</title>
      <main>
        {temple.blockConfigs.map((block) =>
          renderBlock(block as BlockConfigRow, temple.code)
        )}
      </main>
      <KvScript templeCode={temple.code} />
    </>
  )
}

// ── generateStaticParams (빌드 시 사찰 목록 pre-render) ──
export async function generateStaticParams() {
  const temples = await db.temple.findMany({
    where: { isActive: true },
    select: { code: true },
  })
  return temples.map((t) => ({ slug: t.code }))
}
