// 블록 자동 조립 엔진 v3
// H-* 히어로 블록은 page.tsx에서 별도 처리 (제외)
// SEC* 신규 블록은 이 파일에서 처리
import { TempleData } from './types'
import EventBlock from './EventBlock'
import PrayerBlock from './PrayerBlock'
import WelfareBlock from './WelfareBlock'
import DonationBlock from './DonationBlock'
import VisitBlock from './VisitBlock'
import NoticeBlock from './NoticeBlock'
// DharmaBlock은 page.tsx에서 서버사이드로 직접 처리 (법륜 로직)
import GalleryBlock from './GalleryBlock'
import QASlideBlock from '@/components/QASlideBlock'
import InfoGraphicBlock from '@/components/InfoGraphicBlock'
// ── 신규 블록 (2차 공정) ────────────────────────────────────────────────────
import RegularServiceBlock from './RegularServiceBlock'
import EventCardBlock from './EventCardBlock'
import AnnualCalendarBlock from './AnnualCalendarBlock'
import SmartCalendarBlock from './SmartCalendarBlock'
import TempleHistoryBlock from './TempleHistoryBlock'
import HallEncyclopediaBlock from './HallEncyclopediaBlock'
import AbbotGreetingBlock from './AbbotGreetingBlock'
import OfferingBlock from './OfferingBlock'
import BankTransferBlock from './BankTransferBlock'
import TemplestayMainBlock from './TemplestayMainBlock'
import TemplestayProgramBlock from './TemplestayProgramBlock'
import TemplestayReviewBlock from './TemplestayReviewBlock'
// ── 신규 블록 (3차 공정) ────────────────────────────────────────────────────
import SpecialNoticeBlock from './SpecialNoticeBlock'
import PublicationBlock from './PublicationBlock'
import SutraReaderBlock from './SutraReaderBlock'
import DharmaAudioBlock from './DharmaAudioBlock'
import DharmaCardNewsBlock from './DharmaCardNewsBlock'
import TrailBlock from './TrailBlock'
import TeaChatBookingBlock from './TeaChatBookingBlock'
import WishTreeBlock from './WishTreeBlock'
import CMSBlock from './CMSBlock'
import TaxReceiptBlock from './TaxReceiptBlock'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>
interface BlockDef { blockType: string; config: Cfg }

interface Props {
  temple: TempleData
  blocks: BlockDef[]
  /** 렌더링할 blockType 목록 (지정 시 해당 블록만 렌더링) */
  only?: string[]
  /** 렌더링 제외할 blockType 목록 */
  except?: string[]
}

export default function BlockRenderer({ temple, blocks, only, except }: Props) {
  return (
    <>
      {blocks.map((block, idx) => {
        const { blockType, config } = block
        // H-* 히어로 블록은 page.tsx 담당 (H-09 포함)
        if (blockType.startsWith('H-')) return null
        if (only && !only.includes(blockType)) return null
        if (except && except.includes(blockType)) return null

        switch (blockType) {
          // ── 기존 레거시 블록 유지 ──────────────────────────────────────────
          case 'I-01':
            return <NoticeBlock key={idx} templeCode={temple.code} />
          case 'D-01':
            return null // page.tsx에서 getTodayDharma()로 서버사이드 처리
          case 'G-01':
            return <GalleryBlock key={idx} templeCode={temple.code} templeName={temple.name} blockData={config} />
          case 'E-01':
            return <EventBlock key={idx} blockData={config} />
          case 'P-01':
            return <PrayerBlock key={idx} blockData={config} />
          case 'W-01':
            return <WelfareBlock key={idx} blockData={config} />
          case 'DO-01':
            return <DonationBlock key={idx} blockData={config} temple={temple} />
          case 'V-01':
            return <VisitBlock key={idx} blockData={config} temple={temple} />
          case 'QA-01':
            return <QASlideBlock key={idx} config={config} />
          case 'IG-01':
            return <InfoGraphicBlock key={idx} config={config} />

          // ── 제2전각: 공지사항 ─────────────────────────────────────────────
          case 'SEC02-01':
            return <NoticeBlock key={idx} templeCode={temple.code} />
          case 'SEC02-02':
            return <SpecialNoticeBlock key={idx} blockData={config} temple={temple} />
          case 'SEC02-03':
          case 'SEC06-05': // 저서 → PDF 재활용
          case 'SEC10-05': // 다라니 자료 → PDF 재활용
            return <PublicationBlock key={idx} blockData={config} temple={temple} />
          case 'SEC02-04': case 'SEC02-05': case 'SEC02-06': case 'SEC02-07':
            return <EventCardBlock key={idx} temple={temple} blockData={config} />

          // ── 제3전각: 법회·기도·행사 ──────────────────────────────────────
          case 'SEC03-01':
            return <RegularServiceBlock key={idx} temple={temple} blockData={config} />
          case 'SEC03-02': case 'SEC03-03': case 'SEC03-04': case 'SEC03-05':
          case 'SEC03-06': case 'SEC03-07': case 'SEC03-08': case 'SEC03-09':
          case 'SEC03-10': case 'SEC03-11': case 'SEC03-12': case 'SEC03-13':
          case 'SEC03-14': case 'SEC03-15': case 'SEC03-16': case 'SEC03-17':
          case 'SEC03-18': case 'SEC03-19':
            return <EventCardBlock key={idx} temple={temple} blockData={config} />
          case 'SEC03-20':
            return <SmartCalendarBlock key={idx} temple={temple} blockData={config} />

          // ── 제4전각: 법문 ─────────────────────────────────────────────────
          case 'SEC04-01':
            return null // page.tsx에서 getTodayDharma()로 서버사이드 처리
          case 'SEC04-04':
            return <SutraReaderBlock key={idx} />
          case 'SEC04-05':
            return <DharmaAudioBlock key={idx} blockData={config} temple={temple} />
          case 'SEC04-06':
            return null // 다국어 법문 — 4차 공정에서 lang 파라미터 추가 예정
          case 'SEC04-07':
            return <DharmaCardNewsBlock key={idx} blockData={config} temple={temple} />

          // ── 제5전각: 사찰소개 ─────────────────────────────────────────────
          case 'SEC05-01':
            return <TempleHistoryBlock key={idx} temple={temple} blockData={config} />
          case 'SEC05-02': case 'SEC05-03': case 'SEC05-04':
          case 'SEC05-07': case 'SEC05-08': case 'SEC05-09':
          case 'SEC05-10': case 'SEC05-11': case 'SEC05-12': case 'SEC05-13':
          case 'SEC05-14': case 'SEC05-15': case 'SEC05-16': case 'SEC05-17':
          case 'SEC05-18': case 'SEC05-19': case 'SEC05-20': case 'SEC05-21':
          case 'SEC05-22': case 'SEC05-23': case 'SEC05-24': case 'SEC05-25':
            return <HallEncyclopediaBlock key={idx} temple={temple} blockData={config} />
          case 'SEC05-05':
            return <TrailBlock key={idx} blockData={config} temple={temple} />
          case 'SEC05-06':
            return <EventCardBlock key={idx} temple={temple} blockData={config} />

          // ── 제6전각: 주지스님 인사말 ─────────────────────────────────────
          case 'SEC06-01':
            return <AbbotGreetingBlock key={idx} temple={temple} blockData={config} />
          case 'SEC06-02': // 조실법어 → 인사말 컴포넌트 재활용
            return <AbbotGreetingBlock key={idx} temple={temple} blockData={config} />
          case 'SEC06-03': // 역대주지 → 범용카드
            return <EventCardBlock key={idx} temple={temple} blockData={config} />
          case 'SEC06-04':
            return <TeaChatBookingBlock key={idx} blockData={config} temple={temple} />

          // ── 제7전각: 갤러리 ───────────────────────────────────────────────
          case 'SEC07-01': case 'SEC07-02': case 'SEC07-03':
          case 'SEC07-04': case 'SEC07-05': case 'SEC07-06':
            return <GalleryBlock key={idx} templeCode={temple.code} templeName={temple.name} blockData={config} />

          // ── 제8전각: 기도·불사동참 ───────────────────────────────────────
          // SEC08-12는 WishTreeBlock (OfferingBlock과 분리)
          case 'SEC08-01': case 'SEC08-02': case 'SEC08-03': case 'SEC08-04':
          case 'SEC08-05': case 'SEC08-06': case 'SEC08-07': case 'SEC08-08':
          case 'SEC08-09': case 'SEC08-10': case 'SEC08-11':
            return <OfferingBlock key={idx} temple={temple} blockData={config} />
          case 'SEC08-12':
            return <WishTreeBlock key={idx} />

          // ── 제9전각: 결제·보시 ────────────────────────────────────────────
          case 'SEC09-01':
            return null // PG 실제 연동은 4차 공정 예정
          case 'SEC09-02': case 'SEC09-03': // ARS → 계좌안내 재활용
            return <BankTransferBlock key={idx} temple={temple} blockData={config} />
          case 'SEC09-04':
            return <CMSBlock key={idx} blockData={config} temple={temple} />
          case 'SEC09-05':
            return <TaxReceiptBlock key={idx} blockData={config} temple={temple} />

          // ── 제10전각: 자료관 ──────────────────────────────────────────────
          case 'SEC10-01': case 'SEC10-03': case 'SEC10-04': // 용어사전·제사안내 → FAQ 재활용
            return <QASlideBlock key={idx} config={config} />
          case 'SEC10-07':
            return <VisitBlock key={idx} blockData={config} temple={temple} />

          // ── 제11전각: 인포그래픽 ──────────────────────────────────────────
          case 'SEC11-04': case 'SEC11-05': // 봉사통계·방문객 → 기존 재활용
            return <InfoGraphicBlock key={idx} config={config} />

          // ── 제12전각: 실천 네트워크 ──────────────────────────────────────
          case 'SEC12-01':
            return <PrayerBlock key={idx} blockData={config} />
          case 'SEC12-04': case 'SEC12-07': // 장학재단·지역교류 → 범용카드
            return <EventCardBlock key={idx} temple={temple} blockData={config} />

          // ── 제13전각: 템플스테이 ──────────────────────────────────────────
          case 'SEC13-01':
            return <TemplestayMainBlock key={idx} temple={temple} blockData={config} />
          case 'SEC13-02': case 'SEC13-03': case 'SEC13-04': case 'SEC13-05':
            return <TemplestayProgramBlock key={idx} temple={temple} blockData={config} />
          case 'SEC13-06':
            return <TemplestayReviewBlock key={idx} temple={temple} blockData={config} />

          default:
            return null
        }
      })}
    </>
  )
}
