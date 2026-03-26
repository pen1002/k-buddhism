'use client'
// 사찰 입주 신청 3단계 폼 — 고령자 배려 (큰 글씨, 넓은 터치)
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ── 타입 ──────────────────────────────────────────────────────────────────
interface FormData {
  // 1단계: 사찰 기본 정보
  name: string
  code: string
  denomination: string
  address: string
  phone: string
  email: string
  foundedYear: string
  description: string
  logoUrl: string
  heroImageUrl: string
  // 2단계: 주지 정보
  abbotName: string
  abbotPhone: string
  abbotEmail: string
  // 3단계: 테마 선택
  themeType: string
  primaryColor: string
  secondaryColor: string
  tier: string
}

const THEMES = [
  { id: 'theme-1', label: '전통 단청', bg: '#8B2500', sub: '#C5A572', desc: '단청 주황+금 — 전통 사찰' },
  { id: 'theme-2', label: '소나무 청록', bg: '#1B4332', sub: '#A7C957', desc: '청록+연두 — 선종·자연' },
  { id: 'theme-3', label: '연꽃 분홍', bg: '#7C3357', sub: '#F4A7B9', desc: '보랏빛+분홍 — 관음성지' },
  { id: 'theme-4', label: '금강 청명', bg: '#1A3A5C', sub: '#D4AF37', desc: '감청+금 — 경건·위엄' },
]

const TIERS = [
  { id: '1', label: '기본', price: '무료', desc: '기본 블록 10개 이하' },
  { id: '2', label: '표준', price: '월 3만원', desc: '블록 30개 + 행사 달력' },
  { id: '3', label: '프리미엄', price: '월 5만원', desc: '전체 65개 블록 + 템플스테이' },
]

const INIT: FormData = {
  name: '', code: '', denomination: '대한불교조계종', address: '', phone: '', email: '',
  foundedYear: '', description: '', logoUrl: '', heroImageUrl: '',
  abbotName: '', abbotPhone: '', abbotEmail: '',
  themeType: 'theme-1', primaryColor: '#8B2500', secondaryColor: '#C5A572', tier: '1',
}

// ── Cloudinary 업로드 ─────────────────────────────────────────────────────
async function uploadImage(file: File): Promise<string> {
  // browser-image-compression으로 압축 후 Cloudinary 업로드
  let compressed: File | Blob = file
  try {
    const mod = await import('browser-image-compression')
    const compress = mod.default ?? mod
    compressed = await compress(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true })
  } catch { /* 압축 실패 시 원본 사용 */ }

  const fd = new FormData()
  fd.append('file', compressed)
  fd.append('upload_preset', 'temple_uploads')
  const res = await fetch('https://api.cloudinary.com/v1_1/db3izttcy/image/upload', { method: 'POST', body: fd })
  const d = await res.json() as { secure_url?: string }
  if (!d.secure_url) throw new Error('업로드 실패')
  return d.secure_url
}

// ── 입력 스타일 ───────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '14px 16px',
  fontSize: '20px', // 고령자 배려
  border: '2px solid #d1d5db', borderRadius: '12px',
  fontFamily: 'inherit', color: '#1f2937', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '18px', fontWeight: 700,
  color: '#374151', marginBottom: '8px',
}
const fieldWrap: React.CSSProperties = { marginBottom: '24px' }

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────
export default function ApplyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1·2·3
  const [form, setForm] = useState<FormData>(INIT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [heroPreview, setHeroPreview] = useState('')
  const logoRef = useRef<HTMLInputElement>(null)
  const heroRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleFile = async (key: 'logoUrl' | 'heroImageUrl', file: File, setPreview: (s: string) => void) => {
    setPreview(URL.createObjectURL(file))
    try {
      const url = await uploadImage(file)
      setForm(f => ({ ...f, [key]: url }))
    } catch {
      setError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  const next = () => {
    setError('')
    if (step === 1) {
      if (!form.name.trim()) { setError('사찰명을 입력해 주세요.'); return }
      if (!form.code.trim()) { setError('사찰 코드를 입력해 주세요.'); return }
      if (!/^[a-z0-9-]+$/.test(form.code)) { setError('사찰 코드는 영문 소문자, 숫자, 하이픈만 가능합니다.'); return }
      if (!form.address.trim()) { setError('주소를 입력해 주세요.'); return }
      if (!form.phone.trim()) { setError('전화번호를 입력해 주세요.'); return }
    }
    if (step === 2) {
      if (!form.abbotName.trim()) { setError('주지스님 법명을 입력해 주세요.'); return }
    }
    setStep(s => s + 1)
  }
  const prev = () => { setError(''); setStep(s => s - 1) }

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json() as { error?: string }
      if (!res.ok) { setError(d.error ?? '신청 중 오류가 발생했습니다.'); return }
      router.push('/apply/complete')
    } catch {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  // 공통 레이아웃
  return (
    <div style={{ minHeight: '100vh', background: '#faf7f2', fontFamily: 'Pretendard, sans-serif' }}>
      {/* 헤더 */}
      <div style={{ background: '#8B2500', padding: '20px 24px', color: '#fff' }}>
        <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '4px' }}>108사찰 플랫폼</p>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0 }}>사찰 홈페이지 입주 신청</h1>
      </div>

      {/* 단계 표시 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < 3 ? 1 : undefined }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: step >= n ? '#8B2500' : '#e5e7eb',
                color: step >= n ? '#fff' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '18px', flexShrink: 0,
              }}>{n}</div>
              <span style={{
                marginLeft: '8px', fontSize: '16px',
                color: step === n ? '#8B2500' : '#9ca3af',
                fontWeight: step === n ? 700 : 400,
                whiteSpace: 'nowrap',
              }}>
                {n === 1 ? '사찰 정보' : n === 2 ? '주지 정보' : '테마 선택'}
              </span>
              {n < 3 && <div style={{ flex: 1, height: '2px', background: step > n ? '#8B2500' : '#e5e7eb', margin: '0 12px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* 폼 내용 */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: '12px', padding: '16px 20px', marginBottom: '24px',
            fontSize: '18px', color: '#dc2626',
          }}>{error}</div>
        )}

        {/* ── 1단계: 사찰 기본 정보 ─────────────────────────────────── */}
        {step === 1 && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', marginBottom: '28px' }}>사찰 기본 정보</h2>

            <div style={fieldWrap}>
              <label style={labelStyle}>사찰명 <span style={{ color: '#dc2626' }}>*</span></label>
              <input style={inputStyle} placeholder="예: 문수사" value={form.name} onChange={set('name')} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>사찰 코드 <span style={{ color: '#dc2626' }}>*</span></label>
              <input style={inputStyle} placeholder="예: munsusa (영문소문자+숫자+하이픈)" value={form.code} onChange={set('code')} />
              <p style={{ fontSize: '15px', color: '#6b7280', marginTop: '6px' }}>
                홈페이지 주소가 됩니다: <strong>munsusa-site.vercel.app/{form.code || 'code'}</strong>
              </p>
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>종단</label>
              <select style={inputStyle} value={form.denomination} onChange={set('denomination')}>
                <option>대한불교조계종</option>
                <option>한국불교태고종</option>
                <option>대한불교천태종</option>
                <option>대한불교진각종</option>
                <option>한국불교법화종</option>
                <option>기타</option>
              </select>
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>주소 <span style={{ color: '#dc2626' }}>*</span></label>
              <input style={inputStyle} placeholder="예: 경남 양산시 하북면 통도사로 108" value={form.address} onChange={set('address')} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>전화번호 <span style={{ color: '#dc2626' }}>*</span></label>
              <input style={inputStyle} type="tel" placeholder="예: 055-382-7182" value={form.phone} onChange={set('phone')} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>이메일</label>
              <input style={inputStyle} type="email" placeholder="예: info@temple.org" value={form.email} onChange={set('email')} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>창건 연도</label>
              <input style={inputStyle} type="number" placeholder="예: 646" value={form.foundedYear} onChange={set('foundedYear')} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>사찰 소개</label>
              <textarea
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                placeholder="사찰의 역사와 특색을 간략히 소개해 주세요."
                value={form.description}
                onChange={set('description')}
              />
            </div>

            {/* 로고 업로드 */}
            <div style={fieldWrap}>
              <label style={labelStyle}>사찰 로고 이미지</label>
              <button
                type="button"
                onClick={() => logoRef.current?.click()}
                style={{
                  padding: '14px 24px', borderRadius: '12px',
                  border: '2px dashed #d1d5db', background: '#f9fafb',
                  fontSize: '18px', cursor: 'pointer', width: '100%',
                  color: '#6b7280',
                }}
              >
                {logoPreview ? '이미지 변경' : '📷 로고 이미지 선택'}
              </button>
              <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleFile('logoUrl', e.target.files[0], setLogoPreview)} />
              {logoPreview && (
                <img src={logoPreview} alt="로고 미리보기" style={{ marginTop: '12px', maxHeight: '100px', borderRadius: '8px' }} />
              )}
            </div>

            {/* 대표 이미지 업로드 */}
            <div style={fieldWrap}>
              <label style={labelStyle}>대표(히어로) 이미지</label>
              <button
                type="button"
                onClick={() => heroRef.current?.click()}
                style={{
                  padding: '14px 24px', borderRadius: '12px',
                  border: '2px dashed #d1d5db', background: '#f9fafb',
                  fontSize: '18px', cursor: 'pointer', width: '100%',
                  color: '#6b7280',
                }}
              >
                {heroPreview ? '이미지 변경' : '🏯 대표 이미지 선택'}
              </button>
              <input ref={heroRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleFile('heroImageUrl', e.target.files[0], setHeroPreview)} />
              {heroPreview && (
                <img src={heroPreview} alt="대표 이미지 미리보기" style={{ marginTop: '12px', maxWidth: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />
              )}
            </div>
          </>
        )}

        {/* ── 2단계: 주지 정보 ──────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', marginBottom: '28px' }}>주지스님 정보</h2>
            <p style={{ fontSize: '17px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.6 }}>
              입주 승인 및 관리자 계정 안내를 위해 필요합니다.<br />
              정보는 외부에 공개되지 않습니다.
            </p>

            <div style={fieldWrap}>
              <label style={labelStyle}>주지스님 법명 <span style={{ color: '#dc2626' }}>*</span></label>
              <input style={inputStyle} placeholder="예: 혜봉" value={form.abbotName} onChange={set('abbotName')} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>연락처 (휴대폰)</label>
              <input style={inputStyle} type="tel" placeholder="예: 010-1234-5678" value={form.abbotPhone} onChange={set('abbotPhone')} />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>이메일</label>
              <input style={inputStyle} type="email" placeholder="예: abbot@temple.org" value={form.abbotEmail} onChange={set('abbotEmail')} />
            </div>
          </>
        )}

        {/* ── 3단계: 테마·플랜 선택 ─────────────────────────────────── */}
        {step === 3 && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', marginBottom: '28px' }}>테마 & 플랜 선택</h2>

            {/* 테마 */}
            <p style={{ ...labelStyle, marginBottom: '16px' }}>색상 테마</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, themeType: t.id, primaryColor: t.bg, secondaryColor: t.sub }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                    border: `3px solid ${form.themeType === t.id ? t.bg : '#e5e7eb'}`,
                    background: form.themeType === t.id ? '#fffbf5' : '#fff',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: t.bg }} />
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: t.sub }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>{t.label}</div>
                    <div style={{ fontSize: '15px', color: '#6b7280' }}>{t.desc}</div>
                  </div>
                  {form.themeType === t.id && (
                    <span style={{ marginLeft: 'auto', fontSize: '22px' }}>✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* 플랜 */}
            <p style={{ ...labelStyle, marginBottom: '16px' }}>이용 플랜</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {TIERS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, tier: t.id }))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                    border: `3px solid ${form.tier === t.id ? '#8B2500' : '#e5e7eb'}`,
                    background: form.tier === t.id ? '#fffbf5' : '#fff',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>{t.label}</div>
                    <div style={{ fontSize: '15px', color: '#6b7280' }}>{t.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#8B2500' }}>{t.price}</div>
                    {form.tier === t.id && <span style={{ fontSize: '20px' }}>✓</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* 신청 내용 확인 */}
            <div style={{
              background: '#f3f4f6', borderRadius: '12px', padding: '20px 24px',
              marginBottom: '32px', fontSize: '17px', lineHeight: 2,
            }}>
              <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>신청 내용 확인</p>
              <p>🏯 사찰명: <strong>{form.name}</strong></p>
              <p>🔗 코드: <strong>{form.code}</strong></p>
              <p>📍 주소: {form.address}</p>
              <p>📞 전화: {form.phone}</p>
              <p>🧘 주지: {form.abbotName}</p>
              <p>🎨 테마: {THEMES.find(t => t.id === form.themeType)?.label}</p>
              <p>📋 플랜: {TIERS.find(t => t.id === form.tier)?.label} ({TIERS.find(t => t.id === form.tier)?.price})</p>
            </div>

            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px', lineHeight: 1.7 }}>
              신청 후 관리자 검토를 거쳐 <strong>1~3 영업일 내</strong> 승인 여부를 연락드립니다.<br />
              승인 전까지 홈페이지는 공개되지 않습니다.
            </p>
          </>
        )}

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          {step > 1 && (
            <button
              type="button"
              onClick={prev}
              style={{
                flex: 1, padding: '18px', borderRadius: '14px',
                border: '2px solid #d1d5db', background: '#fff',
                fontSize: '20px', fontWeight: 600, cursor: 'pointer', color: '#374151',
              }}
            >
              ← 이전
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={next}
              style={{
                flex: 2, padding: '18px', borderRadius: '14px',
                border: 'none', background: '#8B2500',
                fontSize: '20px', fontWeight: 700, cursor: 'pointer', color: '#fff',
              }}
            >
              다음 단계 →
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              style={{
                flex: 2, padding: '18px', borderRadius: '14px',
                border: 'none', background: loading ? '#9ca3af' : '#8B2500',
                fontSize: '20px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', color: '#fff',
              }}
            >
              {loading ? '신청 중...' : '입주 신청하기 ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
