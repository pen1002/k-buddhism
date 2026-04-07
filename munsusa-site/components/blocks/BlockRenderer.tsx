// 블록 자동 조립 엔진
// H-* 히어로 블록은 page.tsx에서 별도 처리 (제외)
import { TempleData } from './types'
import EventBlock from './EventBlock'
import PrayerBlock from './PrayerBlock'
import WelfareBlock from './WelfareBlock'
import DonationBlock from './DonationBlock'
import VisitBlock from './VisitBlock'
import NoticeBlock from './NoticeBlock'
import DharmaBlock from './DharmaBlock'
import GalleryBlock from './GalleryBlock'
import QASlideBlock from '@/components/QASlideBlock'
import InfoGraphicBlock from '@/components/InfoGraphicBlock'

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
        // H-* 히어로 블록은 page.tsx 담당
        if (blockType.startsWith('H-')) return null
        if (only && !only.includes(blockType)) return null
        if (except && except.includes(blockType)) return null

        switch (blockType) {
          case 'I-01':
            return <NoticeBlock key={idx} templeCode={temple.code} />
          case 'D-01':
            return <DharmaBlock key={idx} templeCode={temple.code} />
          case 'G-01':
            return <GalleryBlock key={idx} templeCode={temple.code} templeName={temple.name} />
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
          default:
            return null
        }
      })}
    </>
  )
}
