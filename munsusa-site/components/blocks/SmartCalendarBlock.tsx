// SmartCalendarBlock — SEC03-20
// 서버 컴포넌트: DB에서 이벤트 조회 → 클라이언트 달력에 전달
import { db } from '@/lib/db'
import { BlockProps } from './types'
import SmartCalendarClient from './SmartCalendarClient'

export default async function SmartCalendarBlock({ temple }: BlockProps) {
  let events: { id: string; title: string; startDate: string; description: string | null }[] = []

  try {
    const dbEvents = await db.event.findMany({
      where: { templeId: (temple as { id?: string }).id, isPublished: true },
      orderBy: { startDate: 'asc' },
      select: { id: true, title: true, startDate: true, description: true },
    })

    events = dbEvents.map(ev => ({
      id: ev.id,
      title: ev.title,
      startDate: ev.startDate.toISOString().slice(0, 10), // YYYY-MM-DD
      description: ev.description,
    }))
  } catch {
    // DB 오류 시 빈 달력 렌더링
  }

  return <SmartCalendarClient templeName={temple.name} events={events} />
}
