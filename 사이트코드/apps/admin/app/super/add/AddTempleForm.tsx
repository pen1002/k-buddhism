'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BlockGrid, { getBlockName } from './BlockGrid'

interface Result { ok?: boolean; code?: string; name?: string; blockCount?: number; error?: string }

// ── 테마 → 색상 자동 바인딩 ────────────────────────────────────────────────────
const THEME_COLORS: Record<string, { primary: string; secondary: string }> = {
  'theme-1':  { primary: '#8B1A1A', secondary: '#C5A030' },
  'theme-2':  { primary: '#2B6B7F', secondary: '#B8893E' },
  'theme-3':  { primary: '#D0580A', secondary: '#B89050' },
  'theme-4':  { primary: '#D4A825', secondary: '#8B5A00' },
  'theme-5':  { primary: '#3A7A3A', secondary: '#A09040' },
  'theme-6':  { primary: '#404850', secondary: '#9A8A60' },
  'theme-7':  { primary: '#505050', secondary: '#909090' },
  'theme-8':  { primary: '#C0407A', secondary: '#D49050' },
  'theme-9':  { primary: '#C03010', secondary: '#C88020' },
  'theme-10': { primary: '#1A4A9C', secondary: '#4A8AC0' },
}

// ── Tier 설명 ──────────────────────────────────────────────────────────────────
const TIER_INFO = [
  {
    v: '1', label: 'Standard', subLabel: '기본',
    tagline: '포교 중심 소규모 사찰',
    features: ['필수 블록 13개 + 히어로 1종', '갤러리 5장', '어드민 3대 메뉴'],
    color: '#6B7280',
  },
  {
    v: '2', label: 'Pro', subLabel: '표준',
    tagline: '재정 기반 중규모 사찰',
    features: ['Tier 1 + 템플스테이 + 기도불사 4탭', '갤러리 10장 · 행사 달력', '전각 도감'],
    color: '#3B82F6',
    recommended: true,
  },
  {
    v: '3', label: 'Enterprise', subLabel: '프리미엄',
    tagline: '본사급 대사찰',
    features: ['전체 124개 블록 사용 가능', '다국어 · PG 결제 · CMS', '불교굿즈 연동'],
    color: '#D4AF37',
  },
]

// ── 미리보기 너비 ──────────────────────────────────────────────────────────────
const PREVIEW_WIDTHS = [
  { key: 'desktop',  label: '🖥️ 데스크톱', width: '100%' },
  { key: 'tablet',   label: '📱 태블릿',   width: '768px' },
  { key: 'mobile',   label: '📲 모바일',   width: '375px' },
]

export default function AddTempleForm() {
  const router = useRouter()
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>(['H-01', 'D-01', 'I-01', 'V-01'])
  const [selectedTheme, setSelectedTheme] = useState('theme-2')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)

  const [form, setForm] = useState({
    code: '', name: '', nameEn: '', description: '', address: '',
    phone: '', denomination: '대한불교조계종', abbotName: '',
    primaryColor: THEME_COLORS['theme-2'].primary,
    secondaryColor: THEME_COLORS['theme-2'].secondary,
    tier: '2', pin: '',
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  // 테마 선택 시 색상 자동 바인딩
  const handleThemeChange = (themeCode: string) => {
    setSelectedTheme(themeCode)
    const colors = THEME_COLORS[themeCode]
    if (colors) {
      setForm(f => ({ ...f, primaryColor: colors.primary, secondaryColor: colors.secondary }))
    }
  }

  const submitForm = async () => {
    if (!form.code || !form.name || !form.tier) { setError('코드, 이름, 등급은 필수입니다.'); return }
    if (selectedBlocks.length === 0) { setError('블록을 최소 1개 이상 선택해주세요.'); return }
    setLoading(true); setError('')
    const body = {
      temple: {
        code: form.code.trim().toLowerCase(),
        name: form.name.trim(),
        nameEn: form.nameEn || undefined,
        description: form.description || undefined,
        address: form.address || undefined,
        phone: form.phone || undefined,
        denomination: form.denomination,
        abbotName: form.abbotName || undefined,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
        tier: Number(form.tier),
        themeType: selectedTheme,
      },
      blocks: selectedBlocks.map((id, i) => {
        const config: Record<string, unknown> = id === 'H-01' ? {
          heroTitle: form.name,
          badge: `☸ ${form.denomination}`,
          ticker: [`☸ ${form.name}`, `✦ ${form.denomination}`],
          source: 'kv',
        } : { source: 'kv' }
        return { blockType: id, label: getBlockName(id), order: i + 1, isVisible: true, config }
      }),
    }
    try {
      const res = await fetch('/api/super/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json() as Result
      if (!res.ok) { setError(d.error || '등록 실패'); setLoading(false); return }
      setResult(d)
      const code = form.code.trim().toLowerCase()
      if (form.pin && code) {
        await fetch(`/api/super/temples/${code}/pin`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: form.pin }),
        })
      }
    } catch { setError('네트워크 오류') }
    finally { setLoading(false) }
  }

  const resetForm = () => {
    setResult(null)
    setSelectedBlocks(['H-01', 'D-01', 'I-01', 'V-01'])
    setSelectedTheme('theme-2')
    setForm({
      code: '', name: '', nameEn: '', description: '', address: '',
      phone: '', denomination: '대한불교조계종', abbotName: '',
      primaryColor: THEME_COLORS['theme-2'].primary,
      secondaryColor: THEME_COLORS['theme-2'].secondary,
      tier: '2', pin: '',
    })
    setError('')
    setShowAdvanced(false)
    setShowPreview(false)
  }

  // ── 점안 완료 화면 ─────────────────────────────────────────────────────────
  if (result?.ok) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: 'linear-gradient(180deg, #1a0f08, #2C1810)' }}>
        <div className="bg-temple-cream rounded-3xl p-8 w-full max-w-sm text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-temple-brown mb-2">점안 완료!</h2>
          <p className="text-gray-600 text-lg mb-1">{result.name}</p>
          <p className="text-gray-500 text-base mb-4">
            블록 {result.blockCount}개 · 코드: <code className="bg-gray-100 px-1.5 rounded">{result.code}</code>
          </p>
          <div className="space-y-3">
            <a
              href={`https://munsusa-site-fmwyrdut3-bae-yeonams-projects.vercel.app/${result.code}`}
              target="_blank" rel="noopener"
              className="btn-primary"
            >
              🌐 사이트 확인하기
            </a>
            <button onClick={resetForm} className="btn-secondary">
              + 또 다른 사찰 등록
            </button>
            <button onClick={() => router.push('/super/dashboard')} className="text-gray-400 text-base underline w-full text-center">
              관제 대시보드로 →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── 등록 폼 ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #1a0f08 0%, #2C1810 20%, #FFF8E7 20%)' }}>
      {/* 헤더 */}
      <div className="px-5 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => router.push('/super/dashboard')} className="text-temple-gold text-2xl">←</button>
        <div>
          <h1 className="text-2xl font-bold text-white">새 사찰 등록</h1>
          <p className="text-gray-400 text-base">점안(點眼) 의식</p>
        </div>
      </div>

      <div className="flex-1 bg-temple-cream rounded-t-3xl px-5 pt-6 pb-10 space-y-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-base">⚠️ {error}</div>
        )}

        {/* ① 기본 정보 — 그리드 레이아웃 ─────────────────────────────────── */}
        <section>
          <h2 className="text-temple-brown font-bold text-lg mb-4">① 사찰 기본 정보</h2>

          {/* Row 1: 코드 | 사찰명 | 영문명 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-temple-brown font-bold text-sm mb-1">사찰 코드 *</label>
              <input type="text" value={form.code} onChange={e => set('code', e.target.value)}
                placeholder="haeinsa" className="input-field text-sm" />
              <p className="text-gray-400 text-xs mt-1">영문 소문자·숫자·하이픈만</p>
            </div>
            <div>
              <label className="block text-temple-brown font-bold text-sm mb-1">사찰명 *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="해인사" className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-temple-brown font-bold text-sm mb-1">영문명</label>
              <input type="text" value={form.nameEn} onChange={e => set('nameEn', e.target.value)}
                placeholder="Haeinsa Temple" className="input-field text-sm" />
            </div>
          </div>

          {/* Row 2: 주소 (전체 너비) */}
          <div className="mb-4">
            <label className="block text-temple-brown font-bold text-sm mb-1">주소</label>
            <input type="text" value={form.address} onChange={e => set('address', e.target.value)}
              placeholder="경상남도 합천군 가야면 해인사길 122" className="input-field text-sm" />
          </div>

          {/* Row 3: 전화 | 종단 | 주지스님 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-temple-brown font-bold text-sm mb-1">전화번호</label>
              <input type="text" value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="055-000-0000" className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-temple-brown font-bold text-sm mb-1">종단</label>
              <select value={form.denomination} onChange={e => set('denomination', e.target.value)}
                className="input-field text-sm">
                <option>대한불교조계종</option>
                <option>한국불교태고종</option>
                <option>대한불교천태종</option>
                <option>대한불교진각종</option>
                <option>한국불교법화종</option>
                <option>기타</option>
              </select>
            </div>
            <div>
              <label className="block text-temple-brown font-bold text-sm mb-1">주지스님</label>
              <input type="text" value={form.abbotName} onChange={e => set('abbotName', e.target.value)}
                placeholder="현응 스님" className="input-field text-sm" />
            </div>
          </div>

          {/* Row 4: 사찰 소개 (전체 너비) */}
          <div className="mb-4">
            <label className="block text-temple-brown font-bold text-sm mb-1">사찰 소개</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="사찰의 역사와 특색을 간략히 소개해 주세요."
              rows={3} className="input-field resize-none text-sm" />
          </div>

          {/* PIN */}
          <div>
            <label className="block text-temple-brown font-bold text-sm mb-1">관리자 PIN (선택)</label>
            <input type="text" inputMode="numeric" maxLength={8} value={form.pin}
              onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="4~8자리 숫자 (나중에 설정 가능)"
              className="input-field text-sm w-full sm:w-48" />
          </div>
        </section>

        {/* ② 사찰 등급 (Tier) — 상세 설명 포함 ─────────────────────────── */}
        <section>
          <h2 className="text-temple-brown font-bold text-lg mb-4">② 사찰 등급 선택</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIER_INFO.map(t => (
              <button
                key={t.v}
                type="button"
                onClick={() => set('tier', t.v)}
                className={`relative text-left rounded-2xl border-2 p-4 transition-all ${
                  form.tier === t.v
                    ? 'shadow-md'
                    : 'bg-white border-gray-200'
                }`}
                style={form.tier === t.v ? {
                  borderColor: t.color,
                  background: t.color + '10',
                } : {}}
              >
                {t.recommended && (
                  <span className="absolute -top-2.5 right-3 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">
                    기본값
                  </span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: t.color }}>
                      Tier {t.v}
                    </span>
                  </div>
                  {form.tier === t.v && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: t.color }}>✓</span>
                  )}
                </div>
                <p className="font-bold text-base text-temple-brown mb-0.5">{t.label}</p>
                <p className="text-xs text-gray-500 mb-2 italic">{t.tagline}</p>
                <ul className="space-y-1">
                  {t.features.map((f, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-[10px] mt-0.5" style={{ color: t.color }}>●</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </section>

        {/* ③ 블록 구성 선택 — 사이드바 UI ────────────────────────────────── */}
        <section>
          <h2 className="text-temple-brown font-bold text-lg mb-1">③ 블록 구성 선택</h2>
          <p className="text-gray-400 text-sm mb-4">사찰 홈페이지에 표시할 섹션을 선택하세요</p>
          <BlockGrid
            selected={selectedBlocks}
            onChange={setSelectedBlocks}
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
          />
        </section>

        {/* ④ 고급 설정 (색상 수동 입력 — 접이식) ───────────────────────── */}
        <section>
          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-temple-brown transition-colors"
          >
            <span>{showAdvanced ? '▼' : '▶'}</span>
            고급 설정 (색상 수동 조정)
            <span className="text-xs text-gray-400">— 현재: {form.primaryColor}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-400 mb-3">테마 선택 시 자동 설정됩니다. 직접 조정이 필요할 때만 변경하세요.</p>
              <div className="grid grid-cols-2 gap-4">
                {[['primaryColor', '메인 컬러'], ['secondaryColor', '보조 컬러']].map(([k, l]) => (
                  <div key={k}>
                    <label className="block text-temple-brown font-bold text-sm mb-1">{l}</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={form[k as keyof typeof form]}
                        onChange={e => set(k, e.target.value)}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer flex-shrink-0" />
                      <input type="text" value={form[k as keyof typeof form]}
                        onChange={e => set(k, e.target.value)}
                        className="input-field text-sm flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ⑤ 미리보기 (iframe) ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-temple-brown font-bold text-lg">⑤ 사이트 미리보기</h2>
            <button
              type="button"
              onClick={() => setShowPreview(v => !v)}
              className="bg-blue-50 text-blue-600 border border-blue-200 font-semibold px-3 py-2 rounded-xl text-sm active:opacity-70"
            >
              {showPreview ? '접기' : '🖥️ 미리보기 열기'}
            </button>
          </div>

          {showPreview && (
            <div>
              {/* 너비 전환 버튼 */}
              <div className="flex gap-2 mb-3">
                {PREVIEW_WIDTHS.map(pw => (
                  <button
                    key={pw.key}
                    type="button"
                    onClick={() => setPreviewWidth(pw.key as typeof previewWidth)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      previewWidth === pw.key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    {pw.label}
                  </button>
                ))}
              </div>

              {/* iframe 컨테이너 */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100"
                style={{ display: 'flex', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{
                  width: PREVIEW_WIDTHS.find(p => p.key === previewWidth)?.width,
                  maxWidth: '100%',
                  transition: 'width 0.3s ease',
                }}>
                  {form.code ? (
                    <iframe
                      src={`https://munsusa-site-fmwyrdut3-bae-yeonams-projects.vercel.app/${form.code}`}
                      style={{ width: '100%', height: '600px', border: 'none' }}
                      title="사이트 미리보기"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <span className="text-4xl mb-3">🏯</span>
                      <p className="text-base font-medium">저장 후 미리보기가 가능합니다</p>
                      <p className="text-sm mt-1">사찰 코드를 입력하고 등록해 주세요</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ⑥ 점안 버튼 ─────────────────────────────────────────────────────── */}
        <button
          onClick={submitForm}
          disabled={loading || !form.code || !form.name}
          className="btn-primary text-xl py-5 disabled:opacity-40 w-full"
        >
          {loading ? '⚙️ 등록 중...' : '☸ 이 사찰 점안하기'}
        </button>
      </div>
    </div>
  )
}
