'use client'
// 사찰 입주 신청 3단계 폼 — 고령자 배려 (큰 글씨, 넓은 터치)
// 모바일 최적화: overflow-x hidden, label 방식 파일 업로드, code 자동 생성
import { useState, useId } from 'react'
import { useRouter } from 'next/navigation'

// ── 타입 ──────────────────────────────────────────────────────────────────
interface FormData {
  name: string
  denomination: string
  address: string
  phone: string
  email: string
  foundedYear: string
  description: string
  logoUrl: string
  heroImageUrl: string
  abbotName: string
  abbotPhone: string
  abbotEmail: string
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
  name: '', denomination: '대한불교조계종', address: '', phone: '', email: '',
  foundedYear: '', description: '', logoUrl: '', heroImageUrl: '',
  abbotName: '', abbotPhone: '', abbotEmail: '',
  themeType: 'theme-1', primaryColor: '#8B2500', secondaryColor: '#C5A572', tier: '1',
}

// ── 사찰 코드 자동 생성 ────────────────────────────────────────────────────
function generateCode(name: string): string {
  const MAP: Record<string, string> = {
    '문':'mun','수':'su','사':'sa','불':'bul','연':'yeon','암':'am','해':'hae','인':'in',
    '통':'tong','도':'do','보':'bo','림':'rim','천':'chun','관':'gwan','광':'gwang',
    '봉':'bong','정':'jeong','법':'beop','화':'hwa','국':'guk','대':'dae','흥':'heung',
    '용':'yong','산':'san','장':'jang','안':'an','선':'seon','심':'sim','원':'won',
    '금':'geum','강':'gang','월':'wol','계':'gye','복':'bok','덕':'deok','운':'un',
    '귀':'gwi','진':'jin','동':'dong','서':'seo','남':'nam','북':'buk','백':'baek',
    '학':'hak','은':'eun','성':'seong','라':'ra','당':'dang','약':'yak','무':'mu',
    '청':'cheong','벽':'byeok','현':'hyeon','마':'ma','니':'ni','미':'mi','타':'ta',
  }
  const trimmed = name.trim()
  const converted = trimmed
    .split('')
    .map(c => MAP[c] || (c.match(/[a-zA-Z0-9]/) ? c.toLowerCase() : ''))
    .join('')
  const base = converted.replace(/[^a-z0-9]/g, '').slice(0, 12) || 'temple'
  return base + Math.floor(1000 + Math.random() * 9000)
}

// ── Cloudinary 업로드 ─────────────────────────────────────────────────────
async function uploadImage(file: File): Promise<string> {
  let compressed: File | Blob = file
  try {
    // @ts-ignore - browser-image-compression types 이슈
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

// ── 공통 스타일 ───────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '14px 16px',
  fontSize: '20px',
  border: '2px solid #d1d5db', borderRadius: '12px',
  fontFamily: 'inherit', color: '#1f2937', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '18px', fontWeight: 700,
  color: '#374151', marginBottom: '8px',
}
const fieldWrap: React.CSSProperties = { marginBottom: '24px' }

// ── 파일 업로드 버튼 (label 방식 — 카카오 인앱 호환) ────────────────────
function FileUploadBtn({
  id, preview, label, onChange,
}: {
  id: string
  preview: string
  label: string
  onChange: (file: File) => void
}) {
  return (
    <div style={fieldWrap}>
      <label htmlFor={id} style={{
        display: 'block', padding: '14px 24px', borderRadius: '12px',
        border: '2px dashed #d1d5db', background: '#f9fafb',
        fontSize: '18px', cursor: 'pointer', width: '100%',
        color: '#6b7280', textAlign: 'center', boxSizing: 'border-box',
      }}>
        {preview ? '이미지 변경' : label}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, overflow: 'hidden' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f) }}
      />
      {preview && (
        <img src={preview} alt="미리보기" style={{ marginTop: '12px', maxHeight: '120px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover', display: 'block' }} />
      )}
    </div>
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────
export default function ApplyPage() {
  const router = useRouter()
  const logoId = useId()
  const heroId = useId()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INIT)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<'logo' | 'hero' | null>(null)
  const [error, setError] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [heroPreview, setHeroPreview] = useState('')

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleFile = async (key: 'logoUrl' | 'heroImageUrl', file: File, setPreview: (s: string) => void, which: 'logo' | 'hero') => {
    setPreview(URL.createObjectURL(file))
    setUploading(which)
    setError('')
    try {
      const url = await uploadImage(file)
      setForm(f => ({ ...f, [key]: url }))
    } catch {
      setError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setUploading(null)
    }
  }

  const next = () => {
    setError('')
    if (step === 1) {
      if (!form.name.trim()) { setError('사찰명을 입력해 주세요.'); return }
      if (!form.address.trim()) { setError('주소를 입력해 주세요.'); return }
      if (!form.phone.trim()) { setError('전화번호를 입력해 주세요.'); return }
      if (uploading) { setError('이미지 업로드 중입니다. 잠시 기다려 주세요.'); return }
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
      // code는 서버에서도 생성 가능하지만 클라이언트에서 미리 생성
      const code = generateCode(form.name)
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, code }),
      })
      const d = await res.json() as { error?: string }
      if (!res.ok) {
        // code 충돌 시 재시도 (1회)
        if (d.error?.includes('코드')) {
          const code2 = generateCode(form.name)
          const res2 = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, code: code2 }),
          })
          const d2 = await res2.json() as { error?: string }
          if (!res2.ok) { setError(d2.error ?? '신청 중 오류가 발생했습니다.'); return }
        } else {
          setError(d.error ?? '신청 중 오류가 발생했습니다.')
          return
        }
      }
      router.push('/apply/complete')
    } catch {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // 1-1: 전체 컨테이너 overflow-x hidden
    <div style={{ minHeight: '100vh', background: '#faf7f2', fontFamily: 'Pretendard, sans-serif', overflowX: 'hidden', maxWidth: '100vw', boxSizing: 'border-box' }}>
      {/* 헤더 */}
      <div style={{ background: '#8B2500', padding: '20px 16px', color: '#fff' }}>
        <p style={{ fontSize: '15px', opacity: 0.8, marginBottom: '4px' }}>108사찰 플랫폼</p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>1080불사 홈페이지 신청서</h1>
      </div>

      {/* 단계 표시 */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '14px 16px', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {[
            { n: 1, label: '사찰' },
            { n: 2, label: '주지스님' },
            { n: 3, label: '테마' },
          ].map(({ n, label }) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < 3 ? 1 : undefined, minWidth: 0 }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                background: step >= n ? '#8B2500' : '#e5e7eb',
                color: step >= n ? '#fff' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '15px',
              }}>{n}</div>
              <span style={{
                marginLeft: '5px', fontSize: '13px',
                color: step === n ? '#8B2500' : '#9ca3af',
                fontWeight: step === n ? 700 : 400,
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}>
                {label}
              </span>
              {n < 3 && <div style={{ flex: 1, height: '2px', background: step > n ? '#8B2500' : '#e5e7eb', margin: '0 6px', minWidth: '12px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* 폼 내용 */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 16px', boxSizing: 'border-box' }}>
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5',
            borderRadius: '12px', padding: '14px 16px', marginBottom: '20px',
            fontSize: '17px', color: '#dc2626', lineHeight: 1.5,
          }}>{error}</div>
        )}

        {/* ── 1단계: 사찰 기본 정보 ─────────────────────────────────── */}
        {step === 1 && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', marginBottom: '24px' }}>사찰 기본 정보</h2>

            <div style={fieldWrap}>
              <label style={labelStyle}>사찰명 <span style={{ color: '#dc2626' }}>*</span></label>
              <input style={inputStyle} placeholder="예: 문수사" value={form.name} onChange={set('name')} />
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>사찰 이름을 한글로 입력하세요</p>
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
              <input style={inputStyle} type="email" placeholder="예: info@temple.org" value={form.email} onChange={set('email')} autoComplete="email" />
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

            {/* 1-2: label 방식 파일 업로드 (카카오 인앱 브라우저 호환) */}
            <div style={fieldWrap}>
              <label style={labelStyle}>사찰 로고 이미지</label>
              {uploading === 'logo' && <p style={{ color: '#8B2500', fontSize: '16px', marginBottom: '8px' }}>업로드 중...</p>}
              <FileUploadBtn
                id={logoId}
                preview={logoPreview}
                label="📷 로고 이미지 선택"
                onChange={f => handleFile('logoUrl', f, setLogoPreview, 'logo')}
              />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>대표(히어로) 이미지</label>
              {uploading === 'hero' && <p style={{ color: '#8B2500', fontSize: '16px', marginBottom: '8px' }}>업로드 중...</p>}
              <FileUploadBtn
                id={heroId}
                preview={heroPreview}
                label="🏯 대표 이미지 선택"
                onChange={f => handleFile('heroImageUrl', f, setHeroPreview, 'hero')}
              />
            </div>
          </>
        )}

        {/* ── 2단계: 주지 정보 ──────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', marginBottom: '24px' }}>주지스님 정보</h2>
            <p style={{ fontSize: '17px', color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>
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
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1f2937', marginBottom: '24px' }}>테마 & 플랜 선택</h2>

            <p style={{ ...labelStyle, marginBottom: '14px' }}>색상 테마</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, themeType: t.id, primaryColor: t.bg, secondaryColor: t.sub }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                    border: `3px solid ${form.themeType === t.id ? t.bg : '#e5e7eb'}`,
                    background: form.themeType === t.id ? '#fffbf5' : '#fff',
                    textAlign: 'left', boxSizing: 'border-box', width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: t.bg }} />
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: t.sub }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: '#1f2937' }}>{t.label}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>{t.desc}</div>
                  </div>
                  {form.themeType === t.id && <span style={{ fontSize: '20px', flexShrink: 0 }}>✓</span>}
                </button>
              ))}
            </div>

            <p style={{ ...labelStyle, marginBottom: '14px' }}>이용 플랜</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {TIERS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, tier: t.id }))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                    border: `3px solid ${form.tier === t.id ? '#8B2500' : '#e5e7eb'}`,
                    background: form.tier === t.id ? '#fffbf5' : '#fff',
                    textAlign: 'left', boxSizing: 'border-box', width: '100%',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: '#1f2937' }}>{t.label}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>{t.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: '#8B2500' }}>{t.price}</div>
                    {form.tier === t.id && <span style={{ fontSize: '18px' }}>✓</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* 신청 내용 확인 */}
            <div style={{
              background: '#f3f4f6', borderRadius: '12px', padding: '18px 16px',
              marginBottom: '28px', fontSize: '16px', lineHeight: 1.9,
            }}>
              <p style={{ fontWeight: 700, fontSize: '17px', marginBottom: '8px' }}>신청 내용 확인</p>
              <p>🏯 사찰명: <strong>{form.name}</strong></p>
              <p>📍 주소: {form.address}</p>
              <p>📞 전화: {form.phone}</p>
              <p>🧘 주지: {form.abbotName}</p>
              <p>🎨 테마: {THEMES.find(t => t.id === form.themeType)?.label}</p>
              <p>📋 플랜: {TIERS.find(t => t.id === form.tier)?.label} ({TIERS.find(t => t.id === form.tier)?.price})</p>
            </div>

            <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '20px', lineHeight: 1.7 }}>
              신청 후 관리자 검토를 거쳐 <strong>1~3 영업일 내</strong> 승인 여부를 연락드립니다.<br />
              승인 전까지 홈페이지는 공개되지 않습니다.
            </p>
          </>
        )}

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', paddingBottom: '40px' }}>
          {step > 1 && (
            <button
              type="button"
              onClick={prev}
              style={{
                flex: 1, padding: '18px', borderRadius: '14px',
                border: '2px solid #d1d5db', background: '#fff',
                fontSize: '19px', fontWeight: 600, cursor: 'pointer', color: '#374151',
                boxSizing: 'border-box',
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
                fontSize: '19px', fontWeight: 700, cursor: 'pointer', color: '#fff',
                boxSizing: 'border-box',
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
                fontSize: '19px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', color: '#fff',
                boxSizing: 'border-box',
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
