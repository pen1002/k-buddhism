/**
 * scripts/add-temple.ts
 * 사찰 자동 점안(點眼) 도구 — Phase 3 Step 2
 *
 * 사용법:
 *   npx tsx scripts/add-temple.ts <temple-json-파일>
 *   npx tsx scripts/add-temple.ts scripts/temples/haeinsa.json
 *
 * 선택적 PIN 등록 (환경변수 설정 시 자동 처리):
 *   VERCEL_TOKEN=<token> TEMPLE_ADMIN_PROJECT_ID=<id> VERCEL_TEAM_ID=<teamId>
 *   npx tsx scripts/add-temple.ts scripts/temples/haeinsa.json --pin 802802
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// ── 인터페이스 정의 ─────────────────────────────────────────────────────────
interface TempleInput {
  code: string
  name: string
  nameEn?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  denomination?: string
  abbotName?: string
  foundedYear?: number
  customDomain?: string
  primaryColor?: string
  secondaryColor?: string
  tier: number
  isActive?: boolean
}

interface BlockInput {
  blockType: string
  label?: string
  order: number
  isVisible?: boolean
  config: Record<string, unknown>
}

interface TempleJson {
  temple: TempleInput
  blocks: BlockInput[]
}

// ── 핵심 삽입 함수 ──────────────────────────────────────────────────────────
async function upsertTemple(data: TempleJson): Promise<void> {
  const { temple: t, blocks } = data

  // 필수 필드 검증
  if (!t.code || !t.name || !t.tier) {
    throw new Error('필수 필드 누락: temple.code, temple.name, temple.tier 가 필요합니다.')
  }
  if (!blocks || blocks.length === 0) {
    throw new Error('blocks 배열이 비어 있습니다. 최소 1개 이상의 블록이 필요합니다.')
  }

  console.log(`\n🏛  [${t.name}] 점안(點眼) 시작 — Tier ${t.tier}`)
  console.log(`   코드: ${t.code}  |  블록 수: ${blocks.length}개`)

  // Temple upsert
  const temple = await prisma.temple.upsert({
    where: { code: t.code },
    update: {
      name: t.name,
      tier: t.tier,
      ...(t.nameEn !== undefined && { nameEn: t.nameEn }),
      ...(t.description !== undefined && { description: t.description }),
      ...(t.address !== undefined && { address: t.address }),
      ...(t.phone !== undefined && { phone: t.phone }),
      ...(t.email !== undefined && { email: t.email }),
      ...(t.denomination !== undefined && { denomination: t.denomination }),
      ...(t.abbotName !== undefined && { abbotName: t.abbotName }),
      ...(t.foundedYear !== undefined && { foundedYear: t.foundedYear }),
      ...(t.customDomain !== undefined && { customDomain: t.customDomain }),
      ...(t.primaryColor !== undefined && { primaryColor: t.primaryColor }),
      ...(t.secondaryColor !== undefined && { secondaryColor: t.secondaryColor }),
      ...(t.isActive !== undefined && { isActive: t.isActive }),
    },
    create: {
      code: t.code,
      name: t.name,
      tier: t.tier,
      nameEn: t.nameEn,
      description: t.description,
      address: t.address,
      phone: t.phone,
      email: t.email,
      denomination: t.denomination ?? '대한불교 조계종',
      abbotName: t.abbotName,
      foundedYear: t.foundedYear,
      customDomain: t.customDomain,
      primaryColor: t.primaryColor ?? '#8B2500',
      secondaryColor: t.secondaryColor ?? '#C5A572',
      isActive: t.isActive ?? true,
    },
  })
  console.log(`  ✅ Temple: ${temple.name} (id: ${temple.id})`)

  // BlockConfig 초기화 후 재생성
  const deleted = await prisma.blockConfig.deleteMany({ where: { templeId: temple.id } })
  if (deleted.count > 0) {
    console.log(`  ♻️  기존 블록 ${deleted.count}개 초기화`)
  }

  await prisma.blockConfig.createMany({
    data: blocks.map(b => ({
      templeId: temple.id,
      blockType: b.blockType,
      label: b.label,
      order: b.order,
      isVisible: b.isVisible ?? true,
      config: b.config as object,
    })),
  })

  const blockSummary = blocks.map(b => b.blockType).join(' → ')
  console.log(`  ✅ BlockConfig (${blocks.length}개): ${blockSummary}`)

  console.log(`\n  🔗 접속 URL (로컬): http://localhost:3000/${t.code}`)
  console.log(`  🔗 접속 URL (프로덕션): https://munsusa-site-bae-yeonams-projects.vercel.app/${t.code}`)
}

// ── Vercel 환경변수로 PIN 등록 (선택) ────────────────────────────────────────
async function registerPin(templeCode: string, pin: string): Promise<void> {
  const token = process.env.VERCEL_TOKEN
  const projectId = process.env.TEMPLE_ADMIN_PROJECT_ID ?? 'prj_gd7hAE5VhKvmjrj3CwWFUHjJVoYo'
  const teamId = process.env.VERCEL_TEAM_ID ?? 'team_ans7ObJvQ8lTHHdtdg0qr9nc'

  if (!token) {
    console.log(`\n  ⚠️  VERCEL_TOKEN 미설정 — PIN 등록 건너뜀`)
    console.log(`     수동 등록: temple-admin Vercel 프로젝트 환경변수에`)
    console.log(`     ${templeCode.toUpperCase()}_PIN = ${pin}  을 추가하세요.`)
    return
  }

  const envKey = `${templeCode.toUpperCase()}_PIN`
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: envKey,
        value: pin,
        type: 'encrypted',
        target: ['production', 'preview', 'development'],
      }),
    }
  )

  const json = await res.json() as { id?: string; created?: { id?: string; key?: string }; failed?: unknown[]; error?: string }
  const registeredId = json.id || json.created?.id
  const hasFailed = Array.isArray(json.failed) && json.failed.length > 0
  if (registeredId && !hasFailed) {
    console.log(`  ✅ PIN 등록: ${envKey} = ${pin}  (id: ${registeredId})`)
  } else if (hasFailed || json.error) {
    console.log(`  ⚠️  PIN 등록 실패: ${JSON.stringify(json)}`)
  } else {
    console.log(`  ℹ️  PIN 응답: ${JSON.stringify(json).slice(0, 80)}...`)
  }
}

// ── 진입점 ──────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
사찰 자동 점안 도구
------------------
사용법:
  npx tsx scripts/add-temple.ts <temple.json> [--pin <6자리PIN>]

예시:
  npx tsx scripts/add-temple.ts scripts/temples/haeinsa.json
  npx tsx scripts/add-temple.ts scripts/temples/haeinsa.json --pin 802802

JSON 형식 (scripts/temples/example.json 참고):
  {
    "temple": { "code": "...", "name": "...", "tier": 3, ... },
    "blocks": [ { "blockType": "H-01", "order": 1, "config": { ... } }, ... ]
  }
`)
    process.exit(0)
  }

  const jsonPath = path.resolve(args[0])
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ 파일을 찾을 수 없습니다: ${jsonPath}`)
    process.exit(1)
  }

  let data: TempleJson
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as TempleJson
  } catch (e) {
    console.error(`❌ JSON 파싱 오류: ${e}`)
    process.exit(1)
  }

  // PIN 플래그
  const pinIdx = args.indexOf('--pin')
  const pin = pinIdx !== -1 ? args[pinIdx + 1] : null

  try {
    await upsertTemple(data)
    if (pin) await registerPin(data.temple.code, pin)
    console.log('\n🎉 점안 완료!\n')
  } catch (e) {
    console.error(`\n❌ 오류 발생:`, e)
    process.exit(1)
  }
}

main().finally(() => prisma.$disconnect())
