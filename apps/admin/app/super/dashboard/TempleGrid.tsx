'use client'
import { useState } from 'react'

interface TempleRow {
  id: string; code: string; name: string; nameEn: string
  tier: number; tierLabel: string; tierColor: string
  isActive: boolean; status: string; address: string; phone: string
  denomination: string; abbotName: string; primaryColor: string
  blockCount: number; createdAt: string
}

const SITE_BASE = 'https://munsusa-site-fmwyrdut3-bae-yeonams-projects.vercel.app'

export default function TempleGrid({
  temples,
  pendingTemples,
}: {
  temples: TempleRow[]
  pendingTemples: TempleRow[]
}) {
  const [tab, setTab] = useState<'active' | 'pending'>('active')
  const [pinModal, setPinModal] = useState<string | null>(null)
  const [newPin, setNewPin] = useState('')
  const [pinLoading, setPinLoading] = useState(false)
  const [pinMsg, setPinMsg] = useState('')
  const [actionMsg, setActionMsg] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
  const [deleteTarget, setDeleteTarget] = useState<{ code: string; name: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteMsg, setDeleteMsg] = useState('')

  const PROTECTED = ['munsusa']

  const handlePinSave = async (code: string) => {
    if (newPin.length < 4) { setPinMsg('4자리 이상 입력하세요'); return }
    setPinLoading(true); setPinMsg('')
    try {
      const res = await fetch(`/api/super/temples/${code}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: newPin }),
      })
      const d = await res.json() as { message?: string; error?: string; envKey?: string }
      if (res.ok) {
        setPinMsg(`✅ ${d.message}`)
        setTimeout(() => { setPinModal(null); setPinMsg(''); setNewPin('') }, 2000)
      } else {
        setPinMsg(`⚠️ ${d.error}${d.envKey ? ` (env: ${d.envKey})` : ''}`)
      }
    } catch { setPinMsg('네트워크 오류') }
    finally { setPinLoading(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteMsg('')
    try {
      const res = await fetch(`/api/super/temples/${deleteTarget.code}/delete`, { method: 'DELETE' })
      const d = await res.json() as { message?: string; error?: string }
      if (res.ok) {
        setDeleteMsg(`✅ ${d.message}`)
        setTimeout(() => { setDeleteTarget(null); setDeleteMsg(''); window.location.reload() }, 1500)
      } else {
        setDeleteMsg(`⚠️ ${d.error}`)
        setDeleteLoading(false)
      }
    } catch {
      setDeleteMsg('네트워크 오류')
      setDeleteLoading(false)
    }
  }

  const handleAction = async (code: string, action: 'approve' | 'reject') => {
    setActionLoading(p => ({ ...p, [code]: true }))
    setActionMsg(p => ({ ...p, [code]: '' }))
    try {
      const res = await fetch(`/api/super/temples/${code}/${action}`, { method: 'POST' })
      const d = await res.json() as { message?: string; error?: string }
      if (res.ok) {
        setActionMsg(p => ({ ...p, [code]: `✅ ${d.message}` }))
        // 1.5초 후 새로고침
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setActionMsg(p => ({ ...p, [code]: `⚠️ ${d.error}` }))
      }
    } catch {
      setActionMsg(p => ({ ...p, [code]: '네트워크 오류' }))
    } finally {
      setActionLoading(p => ({ ...p, [code]: false }))
    }
  }

  const tabBtnStyle = (active: boolean) => ({
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    background: active ? '#8B2500' : '#e5e7eb',
    color: active ? '#fff' : '#6b7280',
    fontWeight: 700 as const,
    fontSize: '16px',
    cursor: 'pointer',
    position: 'relative' as const,
  })

  return (
    <>
      {/* 탭 */}
      <div className="flex gap-3 mb-5">
        <button style={tabBtnStyle(tab === 'active')} onClick={() => setTab('active')}>
          전체 사찰 ({temples.length})
        </button>
        <button style={tabBtnStyle(tab === 'pending')} onClick={() => setTab('pending')}>
          신규 접수
          {pendingTemples.length > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-6px',
              background: '#dc2626', color: '#fff', borderRadius: '50%',
              width: '22px', height: '22px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700,
            }}>{pendingTemples.length}</span>
          )}
        </button>
      </div>

      {/* ── 전체 사찰 탭 ──────────────────────────────────────────── */}
      {tab === 'active' && (
        <>
          {temples.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🏯</div>
              <p className="text-xl">등록된 사찰이 없습니다</p>
              <a href="/super/add" className="inline-block mt-4 text-temple-gold underline text-lg">
                첫 번째 사찰 등록하기 →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {temples.map(t => (
                <div key={t.id} className="card border border-gray-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: t.primaryColor }} />
                  <div className="pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl font-bold text-temple-brown">{t.name}</h2>
                          <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full text-white"
                            style={{ background: t.tierColor }}>
                            Tier {t.tier} · {t.tierLabel}
                          </span>
                          {!t.isActive && (
                            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-gray-400 text-white">
                              비활성
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-base mt-0.5">
                          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{t.code}</code>
                          {t.nameEn && <span className="ml-2">{t.nameEn}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-600 text-base space-y-0.5 mb-3">
                      {t.denomination && <p>🏛 {t.denomination}{t.abbotName ? ` · ${t.abbotName}` : ''}</p>}
                      {t.address && <p>📍 {t.address}</p>}
                      {t.phone && <p>📞 {t.phone}</p>}
                      <p>🧩 블록 {t.blockCount}개 · {t.createdAt} 등록</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`${SITE_BASE}/${t.code}`}
                        target="_blank" rel="noopener"
                        className="bg-blue-50 text-blue-600 border border-blue-200 font-semibold px-3 py-2 rounded-xl text-base active:opacity-70"
                      >
                        🌐 사이트 보기
                      </a>
                      <a
                        href={`/admin/${t.code}`}
                        className="bg-green-50 text-green-600 border border-green-200 font-semibold px-3 py-2 rounded-xl text-base active:opacity-70"
                      >
                        ✏️ 콘텐츠 관리
                      </a>
                      <button
                        onClick={() => { setPinModal(t.code); setNewPin(''); setPinMsg('') }}
                        className="bg-amber-50 text-amber-700 border border-amber-200 font-semibold px-3 py-2 rounded-xl text-base active:opacity-70"
                      >
                        🔑 PIN 변경
                      </button>
                      <button
                        onClick={() => !PROTECTED.includes(t.code) && setDeleteTarget({ code: t.code, name: t.name })}
                        disabled={PROTECTED.includes(t.code)}
                        className={`font-semibold px-3 py-2 rounded-xl text-base border transition-opacity ${
                          PROTECTED.includes(t.code)
                            ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed opacity-50'
                            : 'bg-red-50 text-red-600 border-red-200 active:opacity-70'
                        }`}
                        title={PROTECTED.includes(t.code) ? '보호된 사찰 — 삭제 불가' : '사찰 삭제'}
                      >
                        🗑 삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── 신규 접수 탭 ──────────────────────────────────────────── */}
      {tab === 'pending' && (
        <>
          {pendingTemples.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-xl">신규 접수 대기 건이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTemples.map(t => (
                <div key={t.id} className="card border-2 border-amber-200 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-amber-400" />
                  <div className="pl-4">
                    {/* 신규 접수 뱃지 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-amber-100 text-amber-800 text-sm font-bold px-2.5 py-0.5 rounded-full">
                        ⏳ 승인 대기
                      </span>
                      <span className="text-gray-400 text-sm">{t.createdAt} 신청</span>
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-xl font-bold text-temple-brown">{t.name}</h2>
                        <p className="text-gray-500 text-base mt-0.5">
                          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{t.code}</code>
                          <span className="ml-2 text-sm">Tier {t.tier} · {t.tierLabel}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-600 text-base space-y-0.5 mb-4">
                      {t.denomination && <p>🏛 {t.denomination}{t.abbotName ? ` · 주지 ${t.abbotName}` : ''}</p>}
                      {t.address && <p>📍 {t.address}</p>}
                      {t.phone && <p>📞 {t.phone}</p>}
                    </div>

                    {/* 승인/반려 버튼 */}
                    {actionMsg[t.code] ? (
                      <p className={`text-base font-semibold ${actionMsg[t.code].startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {actionMsg[t.code]}
                      </p>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAction(t.code, 'approve')}
                          disabled={actionLoading[t.code]}
                          className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-xl text-base active:opacity-70 disabled:opacity-40"
                        >
                          {actionLoading[t.code] ? '처리 중...' : '✅ 승인'}
                        </button>
                        <button
                          onClick={() => handleAction(t.code, 'reject')}
                          disabled={actionLoading[t.code]}
                          className="flex-1 bg-red-50 text-red-600 border border-red-200 font-bold py-2.5 rounded-xl text-base active:opacity-70 disabled:opacity-40"
                        >
                          {actionLoading[t.code] ? '처리 중...' : '❌ 반려'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* + 새 사찰 등록 FAB */}
      <div className="fixed bottom-6 right-5 z-50">
        <a
          href="/super/add"
          className="flex items-center gap-2 bg-temple-brown text-temple-gold font-bold px-5 py-3.5 rounded-2xl shadow-lg text-lg active:opacity-80"
        >
          <span className="text-2xl">+</span> 새 사찰 등록
        </a>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget && !deleteLoading) { setDeleteTarget(null); setDeleteMsg('') } }}
        >
          <div className="bg-temple-cream rounded-t-3xl w-full max-w-lg px-6 pt-6 pb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-xl font-bold text-red-700">사찰 삭제</h3>
            </div>
            <p className="text-gray-700 text-base mb-1">
              정말 삭제하시겠습니까?
            </p>
            <p className="text-gray-500 text-base mb-5">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-bold text-red-600">{deleteTarget.name}</code>
              {' '}및 관련 데이터가 영구 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            {deleteMsg && (
              <p className={`text-base mb-4 font-semibold ${deleteMsg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {deleteMsg}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteLoading || !!deleteMsg}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl text-base disabled:opacity-40"
              >
                {deleteLoading ? '삭제 중...' : '🗑 삭제 확인'}
              </button>
              <button
                onClick={() => { if (!deleteLoading) { setDeleteTarget(null); setDeleteMsg('') } }}
                disabled={deleteLoading}
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-base disabled:opacity-40"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN 변경 모달 */}
      {pinModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setPinModal(null) }}>
          <div className="bg-temple-cream rounded-t-3xl w-full max-w-lg px-6 pt-6 pb-10">
            <h3 className="text-xl font-bold text-temple-brown mb-1">🔑 PIN 변경</h3>
            <p className="text-gray-500 text-base mb-4">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded">{pinModal}</code> 사찰의 관리자 PIN
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              value={newPin}
              onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="새 PIN (4~8자리 숫자)"
              className="input-field mb-3"
              autoFocus
            />
            {pinMsg && (
              <p className={`text-base mb-3 ${pinMsg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {pinMsg}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => handlePinSave(pinModal)}
                disabled={pinLoading || newPin.length < 4}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                {pinLoading ? '저장 중...' : '💾 PIN 저장'}
              </button>
              <button
                onClick={() => { setPinModal(null); setNewPin(''); setPinMsg('') }}
                className="btn-secondary flex-1"
              >
                취소
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-3 text-center">
              저장 후 관리앱 재배포 시 적용됩니다
            </p>
          </div>
        </div>
      )}
    </>
  )
}
