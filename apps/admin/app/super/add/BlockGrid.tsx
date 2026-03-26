'use client'
import { useState } from 'react'
import { BLOCK_CATALOG, getBlockName, type BlockMeta } from '@/lib/block-catalog'

// ── 재수출 (AddTempleForm 등 하위 호환) ──────────────────────────────────────
export { getBlockName, BLOCK_CATALOG } from '@/lib/block-catalog'

// ── 테마 카탈로그 ─────────────────────────────────────────────────────────────
interface ThemeItem { code: string; name: string; desc: string; primaryColor: string; accentColor: string }

export const THEME_CATALOG_LOCAL: ThemeItem[] = [
  { code: 'theme-1',  name: '삼천사 전통 권위형',   desc: '진홍+먹색 — 전통 사찰 권위와 격식',          primaryColor: '#8B1A1A', accentColor: '#C5A030' },
  { code: 'theme-2',  name: '문수사 청해 선형',      desc: '청록+금색 — 선(禪)의 고요함 (기본값)',       primaryColor: '#2B6B7F', accentColor: '#B8893E' },
  { code: 'theme-3',  name: '봉은사 도심 현대형',    desc: '차콜+오렌지 — 도심 속 현대 사찰 감각',       primaryColor: '#D0580A', accentColor: '#B89050' },
  { code: 'theme-4',  name: '해인사 법보 황금형',    desc: '다크+황금 — 법보종찰의 깊고 화려한 위엄',    primaryColor: '#D4A825', accentColor: '#8B5A00' },
  { code: 'theme-5',  name: '통도사 자연 생태형',    desc: '녹색+흙색 — 자연과 생태의 힐링 도량',        primaryColor: '#3A7A3A', accentColor: '#A09040' },
  { code: 'theme-6',  name: '송광사 수묵 선비형',    desc: '먹+회색 — 수묵화 같은 선비 품격',            primaryColor: '#404850', accentColor: '#9A8A60' },
  { code: 'theme-7',  name: '선암사 은빛 미니멀형',  desc: '화이트+실버 — 여백의 미, 미니멀 모던',       primaryColor: '#505050', accentColor: '#909090' },
  { code: 'theme-8',  name: '백양사 봄벚꽃 낭만형',  desc: '핑크+자주 — 봄벚꽃 같은 낭만과 온기',       primaryColor: '#C0407A', accentColor: '#D49050' },
  { code: 'theme-9',  name: '화엄사 붉은 단풍형',    desc: '단풍+가을 — 화엄의 붉은 가을 정취',          primaryColor: '#C03010', accentColor: '#C88020' },
  { code: 'theme-10', name: '테크 프로페셔널형',     desc: '네이비+청색 — 디지털 시대 전문 사찰',        primaryColor: '#1A4A9C', accentColor: '#4A8AC0' },
]

// ── 14개 카테고리 정의 ─────────────────────────────────────────────────────────
type CatKey = 'THEME' | 'SEC01' | 'SEC02' | 'SEC03' | 'SEC04' | 'SEC05' | 'SEC06' | 'SEC07' | 'SEC08' | 'SEC09' | 'SEC10' | 'SEC11' | 'SEC12' | 'SEC13'

const CATEGORIES: { key: CatKey; icon: string; label: string; color: string; section?: number; count: number }[] = [
  { key: 'THEME', icon: '🎨', label: '테마',           color: '#8A60C0', count: 10 },
  { key: 'SEC01', icon: '🏯', label: '히어로',          color: '#1B3A6B', section: 1,  count: 10 },
  { key: 'SEC02', icon: '📢', label: '공지사항',        color: '#D4AF37', section: 2,  count: 8 },
  { key: 'SEC03', icon: '📿', label: '법회·기도·행사',  color: '#8B0000', section: 3,  count: 20 },
  { key: 'SEC04', icon: '📖', label: '오늘의 법문',     color: '#2D5A3D', section: 4,  count: 7 },
  { key: 'SEC05', icon: '🏛',  label: '사찰소개',        color: '#5C3A00', section: 5,  count: 25 },
  { key: 'SEC06', icon: '🙏', label: '주지스님 인사말', color: '#6B4226', section: 6,  count: 5 },
  { key: 'SEC07', icon: '📸', label: '갤러리',          color: '#2C5F8A', section: 7,  count: 6 },
  { key: 'SEC08', icon: '🪔', label: '기도·불사동참',   color: '#B8860B', section: 8,  count: 12 },
  { key: 'SEC09', icon: '💳', label: '결제·보시',       color: '#4A4A4A', section: 9,  count: 5 },
  { key: 'SEC10', icon: '❓', label: '자료관',          color: '#3D5A3E', section: 10, count: 8 },
  { key: 'SEC11', icon: '📊', label: '인포그래픽',      color: '#1A3A6A', section: 11, count: 5 },
  { key: 'SEC12', icon: '🤝', label: '실천 네트워크',   color: '#5A3A8A', section: 12, count: 7 },
  { key: 'SEC13', icon: '🏕', label: '템플스테이',      color: '#3A6A3A', section: 13, count: 6 },
]

// ── 필수 항목 ─────────────────────────────────────────────────────────────────
const MANDATORY_ITEMS = [
  '주지스님 인사말', '우리절 연혁', '공지사항 배너',
  '오늘의 부처님말씀', '우리절 갤러리', '오시는길 (네이버지도)',
  '하단 푸터 (연락처·링크)',
]

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  selected: string[]
  onChange: (ids: string[]) => void
  selectedTheme?: string
  onThemeChange?: (themeCode: string) => void
}

// ── ThemeCard ─────────────────────────────────────────────────────────────────
function ThemeCard({ theme, isSelected, onSelect }: {
  theme: ThemeItem; isSelected: boolean; onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative rounded-xl border-2 overflow-hidden text-left transition-all active:scale-95 flex flex-col ${
        isSelected ? 'border-purple-500 shadow-md' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="w-full h-8 flex">
        <div className="flex-1" style={{ backgroundColor: theme.primaryColor }} />
        <div className="flex-1" style={{ backgroundColor: theme.accentColor }} />
      </div>
      <div className={`flex-1 px-3 py-2.5 ${isSelected ? 'bg-purple-50' : 'bg-white'}`}>
        <code className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded mb-1.5 inline-block"
          style={{ backgroundColor: '#F3E8FF', color: '#6B21A8' }}>{theme.code}</code>
        <p className={`text-sm font-bold leading-tight mb-1 ${isSelected ? 'text-purple-900' : 'text-gray-700'}`}>
          {theme.name}
        </p>
        <p className="text-[10px] text-gray-400 leading-tight line-clamp-2">{theme.desc}</p>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-sm bg-purple-600">
          <span className="text-white text-[10px] font-bold">✓</span>
        </div>
      )}
    </button>
  )
}

// ── BlockCard ─────────────────────────────────────────────────────────────────
function BlockCard({ block, isSelected, catColor, onToggle }: {
  block: BlockMeta; isSelected: boolean; catColor: string; onToggle: () => void
}) {
  const locked = block.required
  const active = isSelected || locked

  return (
    <button
      onClick={() => !locked && onToggle()}
      disabled={locked}
      className={`relative rounded-xl border-2 overflow-hidden text-left transition-all flex flex-col w-full ${
        locked
          ? 'border-amber-400 bg-amber-50 cursor-default'
          : active
            ? 'border-[color:var(--card-color)] shadow-md bg-yellow-50'
            : 'border-gray-200 bg-white active:scale-95'
      }`}
      style={{ '--card-color': catColor } as React.CSSProperties}
    >
      {/* 카테고리 컬러 바 */}
      <div className="w-full h-1" style={{ backgroundColor: locked ? '#D4AF37' : catColor }} />

      {/* 카드 본문 */}
      <div className="flex-1 px-3 py-3">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <code
            className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded inline-block"
            style={{
              backgroundColor: (locked ? '#D4AF37' : catColor) + '25',
              color: locked ? '#92400e' : active ? catColor : '#999999',
            }}
          >
            {block.code}
          </code>
          {locked && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: '#D4AF37', color: '#fff' }}>필수</span>
          )}
          {block.priority === 1 && !locked && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">1차</span>
          )}
        </div>
        <p className={`text-sm font-bold leading-tight mb-1 ${locked ? 'text-amber-800' : active ? 'text-temple-brown' : 'text-gray-700'}`}>
          {block.name}
        </p>
        <p className="text-[10px] text-gray-400 leading-tight line-clamp-2">{block.desc}</p>
      </div>

      {/* 잠금/선택 뱃지 */}
      {locked ? (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-sm bg-amber-400">
          <span className="text-white text-[10px]">🔒</span>
        </div>
      ) : isSelected ? (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: catColor }}>
          <span className="text-white text-[10px] font-bold">✓</span>
        </div>
      ) : null}
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function BlockGrid({ selected, onChange, selectedTheme = 'theme-2', onThemeChange }: Props) {
  const [activeTab, setActiveTab] = useState<CatKey>('THEME')

  const toggle = (code: string) => {
    const meta = BLOCK_CATALOG.find(b => b.code === code)
    if (meta?.required) return
    onChange(selected.includes(code) ? selected.filter(c => c !== code) : [...selected, code])
  }

  const activeCat = CATEGORIES.find(c => c.key === activeTab)!
  const activeBlocks = activeCat.section !== undefined
    ? BLOCK_CATALOG.filter(b => b.section === activeCat.section)
    : []

  // 탭별 선택 카운트 (필수 제외한 선택 블록)
  const getSelCount = (cat: typeof CATEGORIES[0]) => {
    if (!cat.section) return 0
    return BLOCK_CATALOG
      .filter(b => b.section === cat.section && !b.required)
      .filter(b => selected.includes(b.code)).length
  }

  return (
    <div>
      {/* 헤더 요약 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-temple-brown font-bold text-base">
          블록 보물함 <span className="text-gray-400 font-normal text-sm">({BLOCK_CATALOG.length}개)</span>
        </p>
        <span className="bg-temple-gold text-temple-brown text-sm font-bold px-3 py-1 rounded-full">
          {selected.length}개 선택
        </span>
      </div>

      {/* 모바일: 드롭다운 */}
      <div className="sm:hidden mb-4">
        <select
          value={activeTab}
          onChange={e => setActiveTab(e.target.value as CatKey)}
          className="input-field text-sm"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.key} value={cat.key}>
              {cat.icon} {cat.label} ({cat.count})
            </option>
          ))}
        </select>
      </div>

      {/* 데스크톱: 사이드바 + 콘텐츠 */}
      <div className="hidden sm:flex gap-0 border border-gray-200 rounded-2xl overflow-hidden bg-white">
        {/* 좌측 사이드바 */}
        <div className="w-[180px] min-w-[180px] border-r border-gray-100 bg-gray-50 py-2 overflow-y-auto"
          style={{ maxHeight: '540px' }}>
          {CATEGORIES.map(cat => {
            const isActive = cat.key === activeTab
            const selCount = getSelCount(cat)
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-all text-left"
                style={{
                  backgroundColor: isActive ? cat.color + '18' : 'transparent',
                  borderLeft: isActive ? `3px solid ${cat.color}` : '3px solid transparent',
                  color: isActive ? cat.color : '#6b7280',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                <span className="text-base flex-shrink-0">{cat.icon}</span>
                <span className="flex-1 leading-tight text-xs">{cat.label}</span>
                {selCount > 0 && (
                  <span className="text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: cat.color }}>
                    {selCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* 우측 콘텐츠 */}
        <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: '540px' }}>
          {/* 테마 선택 */}
          {activeTab === 'THEME' && (
            <div className="grid grid-cols-2 gap-2.5">
              {THEME_CATALOG_LOCAL.map(theme => (
                <ThemeCard
                  key={theme.code}
                  theme={theme}
                  isSelected={selectedTheme === theme.code}
                  onSelect={() => onThemeChange?.(theme.code)}
                />
              ))}
            </div>
          )}

          {/* 블록 카드 */}
          {activeTab !== 'THEME' && (
            <>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                  전체 {activeBlocks.length}개
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                  필수 {activeBlocks.filter(b => b.required).length}개
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                  1차 {activeBlocks.filter(b => b.priority === 1).length}개
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {activeBlocks.map(block => (
                  <BlockCard
                    key={block.code}
                    block={block}
                    isSelected={selected.includes(block.code)}
                    catColor={activeCat.color}
                    onToggle={() => toggle(block.code)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 모바일: 블록 카드 그리드 */}
      <div className="sm:hidden mt-4">
        {activeTab === 'THEME' && (
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {THEME_CATALOG_LOCAL.map(theme => (
              <ThemeCard
                key={theme.code}
                theme={theme}
                isSelected={selectedTheme === theme.code}
                onSelect={() => onThemeChange?.(theme.code)}
              />
            ))}
          </div>
        )}
        {activeTab !== 'THEME' && (
          <>
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                전체 {activeBlocks.length}개
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                필수 {activeBlocks.filter(b => b.required).length}개
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {activeBlocks.map(block => (
                <BlockCard
                  key={block.code}
                  block={block}
                  isSelected={selected.includes(block.code)}
                  catColor={activeCat.color}
                  onToggle={() => toggle(block.code)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── 필수 항목 경고 (제3공정) ─────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden border-2 border-red-900 mt-4">
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#8B0000' }}>
          <span className="text-xl flex-shrink-0">⚠️</span>
          <p className="text-white font-bold text-base leading-snug">
            아래 7개 항목은 모든 사찰에 자동 포함되며 해제할 수 없습니다
          </p>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-1.5" style={{ background: '#3D0000' }}>
          {MANDATORY_ITEMS.map(item => (
            <div key={item} className="flex items-center gap-2">
              <span className="text-sm flex-shrink-0">🔒</span>
              <span className="text-white text-xs font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
