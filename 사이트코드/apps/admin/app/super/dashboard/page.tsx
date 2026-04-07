import { redirect } from 'next/navigation'
import { getSuperSession } from '@/lib/superAuth'
import { db } from '@/lib/db'
import TempleGrid from './TempleGrid'
import LogoutButton from './LogoutButton'

export const dynamic = 'force-dynamic'

const TIER_LABEL: Record<number, string> = { 1: '기본', 2: '표준', 3: '프리미엄' }
const TIER_COLOR: Record<number, string> = {
  1: '#6B7280',
  2: '#3B82F6',
  3: '#D4AF37',
}

export default async function SuperDashboard() {
  const ok = await getSuperSession()
  if (!ok) redirect('/super/login')

  const temples = await db.temple.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { blockConfigs: true } } },
  })

  const toRow = (t: typeof temples[number]) => ({
    id: t.id,
    code: t.code,
    name: t.name,
    nameEn: t.nameEn ?? '',
    tier: t.tier,
    tierLabel: TIER_LABEL[t.tier] ?? `Tier ${t.tier}`,
    tierColor: TIER_COLOR[t.tier] ?? '#6B7280',
    isActive: t.isActive,
    status: t.status,
    address: t.address ?? '',
    phone: t.phone ?? '',
    denomination: t.denomination ?? '',
    abbotName: t.abbotName ?? '',
    primaryColor: t.primaryColor,
    blockCount: t._count.blockConfigs,
    createdAt: t.createdAt.toLocaleDateString('ko-KR'),
  })

  const activeRows = temples.filter(t => t.status !== 'pending').map(toRow)
  const pendingRows = temples.filter(t => t.status === 'pending').map(toRow)

  return (
    <div className="min-h-screen" style={{ background: '#1a0f08' }}>
      {/* 헤더 */}
      <div className="px-5 pt-10 pb-6 flex items-center justify-between">
        <div>
          <p className="text-temple-gold text-base">108사찰 플랫폼</p>
          <h1 className="text-2xl font-bold text-white mt-1">통합 관제 시스템</h1>
          <p className="text-gray-400 text-base mt-0.5">
            등록 {activeRows.length}개
            {pendingRows.length > 0 && (
              <span className="ml-2 bg-red-600 text-white text-sm font-bold px-2 py-0.5 rounded-full">
                신규 {pendingRows.length}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <a
            href="/super/add"
            className="bg-temple-gold text-temple-brown font-bold px-4 py-2.5 rounded-xl text-base active:opacity-80 whitespace-nowrap"
          >
            + 새 사찰 등록
          </a>
          <LogoutButton />
        </div>
      </div>

      {/* 사찰 그리드 (탭 포함) */}
      <div className="bg-temple-cream rounded-t-3xl px-4 pt-6 pb-20 min-h-[70vh]">
        <TempleGrid temples={activeRows} pendingTemples={pendingRows} />
      </div>
    </div>
  )
}
