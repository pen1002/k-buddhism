'use client'
// SEC04-04 경전 읽기 — 반야심경·천수경·금강경 3대 경전 탭
import { useState, useEffect, useRef } from 'react'

type TabKey = 'heart' | 'cheonsu' | 'diamond'
type ViewMode = 'hanja' | 'reading' | 'translation'

interface SutraData {
  name: string
  hanja: string
  original: string
  reading: string
  translation: string
}

const SUTRAS: Record<TabKey, SutraData> = {
  heart: {
    name: '반야심경',
    hanja: '般若心經',
    original: `마하반야바라밀다심경(摩訶般若波羅蜜多心經)

관자재보살(觀自在菩薩)이 깊은 반야바라밀다(般若波羅蜜多)를 행할 때
오온(五蘊)이 공(空)함을 비추어 보고 모든 고통과 재앙을 건너느니라.

사리자(舍利子)여,
색(色)이 공(空)과 다르지 않고 공이 색과 다르지 않으며
색이 곧 공이요 공이 곧 색이니
수(受)·상(想)·행(行)·식(識)도 또한 그러하니라.

사리자여, 이 모든 법의 공한 모양은
생기지도 않고 사라지지도 않으며
더럽지도 않고 깨끗하지도 않으며
늘지도 않고 줄지도 않느니라.

그러므로 공 가운데는 색(色)이 없고
수(受)·상(想)·행(行)·식(識)도 없으며
눈·귀·코·혀·몸·뜻도 없고
색·성·향·미·촉·법도 없으며
눈의 세계도 없고 내지 의식의 세계도 없느니라.

무명(無明)도 없고 또한 무명이 다함도 없으며
내지 늙고 죽음도 없고 늙고 죽음이 다함도 없느니라.
고(苦)·집(集)·멸(滅)·도(道)도 없고
지혜도 없고 또한 얻음도 없느니라.

얻을 것이 없으므로 보살은
반야바라밀다를 의지하여
마음에 걸림이 없고
걸림이 없으므로 두려움이 없어
뒤바뀐 헛된 생각을 멀리 떠나 완전한 열반에 들어가며

과거·현재·미래의 모든 부처님도
반야바라밀다를 의지하므로
최상의 깨달음을 얻느니라.

반야바라밀다는 가장 신비하고 밝은 주문이며
위없는 주문이며 무엇과도 견줄 수 없는 주문이니
모든 고통을 없애고 진실하여 허망하지 않느니라.

고(故) 설반야바라밀다주(說般若波羅蜜多呪)하노니
즉설주왈(卽說呪曰)

아제 아제 바라아제 바라승아제 모지 사바하 (3번)`,
    reading: `마하반야바라밀다심경

관자재보살이 깊은 반야바라밀다를 행할 때
오온이 공함을 비추어 보고 모든 고통과 재앙을 건너느니라.

사리자여,
색이 공과 다르지 않고 공이 색과 다르지 않으며
색이 곧 공이요 공이 곧 색이니
수 상 행 식도 또한 그러하니라.

사리자여, 이 모든 법의 공한 모양은
생기지도 않고 사라지지도 않으며
더럽지도 않고 깨끗하지도 않으며
늘지도 않고 줄지도 않느니라.

그러므로 공 가운데는 색이 없고
수 상 행 식도 없으며
눈 귀 코 혀 몸 뜻도 없고
색 성 향 미 촉 법도 없으며
눈의 세계도 없고 내지 의식의 세계도 없느니라.

무명도 없고 또한 무명이 다함도 없으며
내지 늙고 죽음도 없고 늙고 죽음이 다함도 없느니라.
고 집 멸 도도 없고 지혜도 없고 또한 얻음도 없느니라.

얻을 것이 없으므로 보살은 반야바라밀다를 의지하여
마음에 걸림이 없고, 걸림이 없으므로 두려움이 없어
뒤바뀐 헛된 생각을 멀리 떠나 완전한 열반에 들어가며

과거·현재·미래의 모든 부처님도
반야바라밀다를 의지하므로 최상의 깨달음을 얻느니라.

아제 아제 바라아제 바라승아제 모지 사바하 (3번)`,
    translation: `지혜의 완성에 관한 심오한 경전

관세음보살께서 깊은 명상에 드시어
모든 존재는 다섯 가지 집합(몸·감각·인식·의지·의식)으로 이루어지며
그것이 모두 본래 텅 비어 있음을 깨달으셔서
모든 고통과 불행으로부터 해방되셨습니다.

사리불 존자여,
물질 현상은 빔(空)과 다르지 않고
빔은 물질 현상과 다르지 않습니다.
물질 현상 그것이 곧 빔이고, 빔 그것이 곧 물질 현상입니다.
감각·인식·의지·의식도 마찬가지입니다.

사리불 존자여,
이 모든 현상들은 텅 빈 것이어서
생겨나지도 않고 사라지지도 않으며
더러운 것도 아니고 깨끗한 것도 아니며
늘어나지도 않고 줄어들지도 않습니다.

그러므로 텅 빔 속에는 물질 현상도 없고
감각·인식·의지·의식도 없으며
눈·귀·코·혀·몸·마음도 없고
형색·소리·냄새·맛·촉감·마음의 대상도 없습니다.

무지도 없고 무지의 소멸도 없으며
늙음과 죽음도 없고 늙음과 죽음의 소멸도 없습니다.
고통·집착·소멸·해탈의 길도 없고
지혜도 없으며 얻음도 없습니다.

얻음이 없기 때문에
보살은 반야 바라밀다를 의지하여 살기에
마음에 거리낌이 없고
거리낌이 없기에 두려움도 없어서
뒤바뀐 생각에서 멀리 벗어나
완전한 열반에 이릅니다.

아제 아제 바라아제 바라승아제 모지 사바하
(가자, 가자, 피안으로 가자, 피안으로 완전히 가자, 깨달음이여!)`,
  },
  cheonsu: {
    name: '천수경',
    hanja: '千手經',
    original: `천수천안관자재보살광대원만무애대비심대다라니경
(千手千眼觀自在菩薩廣大圓滿無礙大悲心大陀羅尼經)

정구업진언(淨口業眞言)
수리수리 마하수리 수수리 사바하 (3번)

개경게(開經偈)
무상심심미묘법(無上甚深微妙法)
백천만겁난조우(百千萬劫難遭遇)
아금문견득수지(我今聞見得受持)
원해여래진실의(願解如來眞實義)

나무대비관세음(南無大悲觀世音)
원아속지일체법(願我速知一切法)
나무대비관세음
원아조득지혜안(願我早得智慧眼)
나무대비관세음
원아속도일체중(願我速度一切衆)
나무대비관세음
원아조득선방편(願我早得善方便)
나무대비관세음
원아속승반야선(願我速乘般若船)
나무대비관세음
원아조득월고해(願我早得越苦海)
나무대비관세음
원아속득계정도(願我速得戒定道)
나무대비관세음
원아조등열반산(願我早登涅槃山)

신묘장구대다라니(神妙章句大陀羅尼)
나무 알야 바로기제 새바라야 모지 사다바야
마하 사다바야 마하 가로니가야 옴 살바 바예수
다라나 가라야 다사명 나막가리다바 이맘 알야
바로기제 새바라 다바 니라간타 나막 하리나야
마발다 이사미 살발타 사다남 수반 아예염
살바 보다남 바바말아 미수다감 다냐타 옴
아로계 아로가 마지로가 지가란제 혜혜하례
마하모지 사다바 사마라 사마라 하리나야
구로구로 갈마 사다야 사다야 도로도로
미연제 마하 미연제 다라 다라 다린 나례 새바라
자라자라 마라 미마라 아마라 몰제 예혜혜 로계
새바라 라아 미사미 나사야 나베 사미 사미
나사야 모하자라 미사미 나사야 호로호로
마라호로 하례 바나마 나바 사라사라 시리시리
소로소로 못쟈못쟈 모다야 모다야
매다라야 니라 간타 가마사 날사남 바라하라나야
마낙 사바하 싯다야 사바하 마하싯다야 사바하
싯다유예 새바라야 사바하 니라간타야 사바하
바라하 목카 싱하 목카야 사바하 바나마 하따야 사바하
자가라 욕다야 사바하 상카섭나녜 모다나야 사바하
마하라 구타 다라야 사바하 바마 사간타 이사시체다
가린나 이나야 사바하 먀가라 잘마 이바 사나야 사바하

나무 알야 바로기제 새바라야 사바하 (3번)`,
    reading: `천수천안관자재보살광대원만무애대비심대다라니경

정구업진언: 수리수리 마하수리 수수리 사바하 (3번)

개경게:
더 없이 깊고 오묘한 법은
백천만겁에도 만나기 어렵거늘
내가 이제 듣고 보아 받아 지니오니
여래의 진실한 뜻을 알아지이다.

관세음보살 대비진언:
자비로운 관세음보살께 귀의합니다.
저로 하여금 일체 법을 빨리 알게 하소서.
관세음보살께 귀의합니다.
저로 하여금 지혜의 눈을 빨리 얻게 하소서.
관세음보살께 귀의합니다.
저로 하여금 일체 중생을 빨리 제도하게 하소서.
관세음보살께 귀의합니다.
저로 하여금 훌륭한 방편을 빨리 얻게 하소서.
관세음보살께 귀의합니다.
저로 하여금 반야의 배에 빨리 오르게 하소서.
관세음보살께 귀의합니다.
저로 하여금 고통의 바다를 빨리 건너게 하소서.

신묘장구대다라니 (관세음보살 본심미묘 육자대명왕진언):
나무 알야 바로기제 새바라야...
(한 자 한 자가 무량한 공덕과 지혜를 담은 신묘한 진언)

나무 알야 바로기제 새바라야 사바하 (3번)`,
    translation: `천 개의 손과 천 개의 눈을 가진 관세음보살의 경전

이 경전은 관세음보살의 대비신주(大悲神呪)를 담은 것으로
모든 중생의 고통을 없애고 소원을 이루어 주는 큰 자비의 다라니입니다.

개경게 해설:
이처럼 깊고 오묘한 부처님의 가르침은
수없이 많은 생애를 살아도 만나기 어렵습니다.
제가 이제 이 가르침을 듣고 받아 지니게 되었으니
부처님의 참된 뜻을 깨달아 알 수 있기를 원합니다.

관세음보살 십대원(十大願):
1. 일체의 법을 빨리 알게 하소서
2. 지혜의 눈을 빨리 얻게 하소서
3. 일체 중생을 빨리 제도하게 하소서
4. 훌륭한 방편을 빨리 얻게 하소서
5. 반야의 배에 빨리 오르게 하소서
6. 고통의 바다를 빨리 건너게 하소서
7. 계정혜 삼학의 길을 빨리 얻게 하소서
8. 열반의 산에 빨리 오르게 하소서
9. 무위의 집에 빨리 들어가게 하소서
10. 법성의 몸과 함께 빨리 이루게 하소서

신묘장구대다라니는 관세음보살의 본원력이 담긴 신묘한 주문으로
지성으로 독송하면 모든 소원이 이루어진다고 전해집니다.`,
  },
  diamond: {
    name: '금강경',
    hanja: '金剛經',
    original: `금강반야바라밀경(金剛般若波羅蜜經)

제1분 법회인유분(法會因由分)
이와 같이 나는 들었노라.
어느 때 부처님께서 사위국 기수급고독원에 계실 때
비구 1250명과 함께 계셨다.
부처님께서는 이른 아침에 가사를 입고 발우를 드시고
사위성 안으로 들어가 걸식하셨다.
차례로 밥을 빌어 본처로 돌아오시어 공양을 마치시고
가사와 발우를 거두시고 발을 씻으신 뒤
자리를 펴고 앉으셨다.

제4분 묘행무주분(妙行無住分)
또한 수보리여, 보살은 법에 머무름 없이 보시를 행할지니
이른바 형색에 머무름 없이 보시하며
소리·냄새·맛·감촉·마음의 대상에 머무름 없이 보시할지니라.
수보리여, 보살은 이와 같이 보시하되 모습에 머무름이 없어야 하느니라.
어째서냐 하면, 보살이 모습에 머무름 없이 보시하면
그 복덕은 헤아릴 수 없기 때문이니라.

제10분 장엄정토분(莊嚴淨土分)
부처님께서 말씀하셨다.
수보리여, 어떻게 생각하느냐?
여래가 옛날 연등불 처소에서 법을 얻은 바 있느냐?
아닙니다, 세존이시여.
여래께서 연등불 처소에서는 실로 얻은 법이 없습니다.
수보리여, 어떻게 생각하느냐?
보살이 불국토를 장엄하느냐?
아닙니다, 세존이시여.
어째서냐 하면 불국토를 장엄한다는 것은 곧 장엄이 아니라 그 이름이 장엄이기 때문입니다.

제14분 이상적멸분(離相寂滅分)
그 때 수보리가 이 경을 설함을 듣고 깊이 그 뜻을 이해하여
눈물을 흘리며 부처님께 사뢰었다.
희유하온 세존이시여,
부처님께서 이처럼 매우 깊은 경전을 설하시니
저는 옛날부터 혜안을 얻은 이래로
이와 같은 경전을 일찍이 들어보지 못했나이다.

제17분 구경무아분(究竟無我分)
수보리여, 어떻게 생각하느냐?
나는 아뇩다라삼먁삼보리를 얻었다고 말할 만한 법이 있느냐?
또 여래가 설한 법이 있느냐?
수보리가 사뢰었다.
제가 부처님 말씀의 뜻을 이해하기로는
아뇩다라삼먁삼보리라 이름할 일정한 법이 없고
또 여래께서 설하신 일정한 법도 없나이다.

제32분 응화비진분(應化非眞分)
수보리여, 어떤 사람이 항하의 모래 수만큼 많은 세계에
가득찬 칠보로써 보시하여도
어떤 선남자 선여인이 이 경 가운데서 사구게 한 수라도
받아 지녀 남을 위하여 말한다면
그 복덕이 저 복덕보다 훨씬 뛰어나니라.

일체유위법(一切有爲法)
여몽환포영(如夢幻泡影)
여로역여전(如露亦如電)
응작여시관(應作如是觀)

모든 만들어진 것들은
꿈이요 환상이요 물거품이요 그림자 같고
이슬 같고 번개와도 같으니
모름지기 이와 같이 볼지니라.`,
    reading: `금강반야바라밀경 — 주요 분(分) 요약

1분: 법회 인연 — 부처님께서 기원정사에 머무시며 탁발 후 설법 준비
2분: 선현기청 — 수보리 존자가 최상의 깨달음을 묻다
3분: 대승정종 — 모든 중생을 제도하되 제도받은 중생이 없다고 알아야
4분: 묘행무주 — 머무는 바 없이 보시하라
5분: 여리실견 — 몸의 모습으로 여래를 볼 수 없다
6분: 정신희유 — 법마저 버릴 줄 알아야 한다
7분: 무득무설 — 얻을 것도 없고 설할 법도 없다
8분: 의법출생 — 모든 부처님은 이 경으로부터 나오셨다
9분: 일상무상 — 수다원·사다함·아나함·아라한 4과의 참뜻
10분: 장엄정토 — 불국토 장엄은 장엄이 아니다
...
32분: 응화비진 — 모든 것은 꿈·환상·거품·그림자·이슬·번개 같다

핵심 게송:
일체유위법 — 여몽환포영 — 여로역여전 — 응작여시관
모든 만들어진 것은 꿈·환상·거품·그림자 같고
이슬과 번개 같으니 이와 같이 보아라.`,
    translation: `금강경 해설 — 핵심 가르침

금강경은 '다이아몬드처럼 단단한 지혜로 피안(彼岸)에 도달하는 경전'입니다.

핵심 가르침:
1. 집착 없는 보시 — 주는 사람도, 받는 사람도, 주는 물건도 없다는 마음으로 보시하라
2. 무아(無我) — '나'라는 고정된 실체가 없다
3. 공(空) — 모든 현상은 실체가 없다
4. 여래의 본질 — 형상으로 여래를 보려 하지 말라

32분의 구성:
• 1~7분: 깨달음이란 무엇인가? 보시의 올바른 자세
• 8~14분: 법을 취하지도 버리지도 말라. 신심의 공덕
• 15~22분: 자아·타인·중생·장수에 집착하지 말라
• 23~32분: 선법(善法)을 닦되 법에 집착 말라

마지막 게송 해설:
일체유위법(一切有爲法) — 모든 조건 지어진 것들은
여몽환포영(如夢幻泡影) — 꿈과 같고, 환상 같고, 물거품 같고, 그림자 같으며
여로역여전(如露亦如電) — 이슬 같고 또한 번개 같으니
응작여시관(應作如是觀) — 마땅히 이와 같이 볼지어다

이 게송은 모든 현상의 무상함을 일깨우며
집착에서 벗어나 자유로운 경지를 가리킵니다.`,
  },
}

const TAB_LABELS: Record<TabKey, string> = { heart: '반야심경', cheonsu: '천수경', diamond: '금강경' }
const VIEW_LABELS: Record<ViewMode, string> = { hanja: '원문', reading: '독음', translation: '해설' }

export default function SutraReaderBlock() {
  const [tab, setTab] = useState<TabKey>('heart')
  const [view, setView] = useState<ViewMode>('reading')
  const [fontSize, setFontSize] = useState(16)
  const [autoScroll, setAutoScroll] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(1)
  const textRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!autoScroll || !textRef.current) return
    const el = textRef.current
    const step = () => {
      el.scrollTop += scrollSpeed * 0.5
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        el.scrollTop = 0
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [autoScroll, scrollSpeed])

  const sutra = SUTRAS[tab]
  const text = sutra[view === 'hanja' ? 'original' : view === 'reading' ? 'reading' : 'translation']

  return (
    <section className="section" id="sutra-reader" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="section-inner">
        <p className="section-label">Scripture Reading</p>
        <h2 className="section-title">경전 읽기</h2>

        {/* 경전 탭 */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {(Object.keys(TAB_LABELS) as TabKey[]).map(k => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: '8px 20px',
              background: tab === k ? 'var(--color-accent)' : 'var(--color-card)',
              color: tab === k ? '#fff' : 'var(--color-text)',
              border: `1px solid ${tab === k ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius)', fontFamily: 'var(--font-serif)',
              fontWeight: 700, fontSize: '.9rem', cursor: 'pointer',
            }}>
              {TAB_LABELS[k]}
              <span style={{ fontSize: '.75rem', opacity: .7, marginLeft: '6px' }}>{sutra === SUTRAS[k] ? SUTRAS[k].hanja : SUTRAS[k].hanja}</span>
            </button>
          ))}
        </div>

        {/* 보기 모드 + 설정 */}
        <div style={{
          display: 'flex', gap: '12px', marginTop: '1rem',
          alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(Object.keys(VIEW_LABELS) as ViewMode[]).map(m => (
              <button key={m} onClick={() => setView(m)} style={{
                padding: '5px 14px',
                background: view === m ? 'var(--color-gold)' : 'var(--color-card)',
                color: view === m ? '#fff' : 'var(--color-text)',
                border: `1px solid ${view === m ? 'var(--color-gold)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
                fontSize: '.82rem', fontWeight: 600, cursor: 'pointer',
              }}>{VIEW_LABELS[m]}</button>
            ))}
          </div>

          {/* 글자 크기 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)' }}>글자 크기</span>
            <button onClick={() => setFontSize(s => Math.max(12, s - 2))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', fontWeight: 700 }}>A−</button>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '.82rem', minWidth: '32px', textAlign: 'center' }}>{fontSize}px</span>
            <button onClick={() => setFontSize(s => Math.min(28, s + 2))} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'var(--color-card)', cursor: 'pointer', fontWeight: 700 }}>A+</button>
          </div>
        </div>

        {/* 경전 텍스트 */}
        <div
          ref={textRef}
          style={{
            marginTop: '1rem',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxHeight: '480px',
            overflowY: 'auto',
            fontSize: `${fontSize}px`,
            fontFamily: 'var(--font-serif)',
            lineHeight: 2.2,
            color: 'var(--color-text)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'keep-all',
          }}
        >
          {text}
        </div>

        {/* 자동 스크롤 독경 모드 */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setAutoScroll(v => !v)}
            style={{
              padding: '8px 20px',
              background: autoScroll ? 'var(--color-accent)' : 'var(--color-card)',
              color: autoScroll ? '#fff' : 'var(--color-text)',
              border: `1px solid ${autoScroll ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)',
              fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {autoScroll ? '⏹ 독경 정지' : '▶ 자동 독경 모드'}
          </button>
          {autoScroll && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)' }}>속도</span>
              <input type="range" min={0.5} max={4} step={0.5} value={scrollSpeed}
                onChange={e => setScrollSpeed(Number(e.target.value))}
                style={{ width: '100px' }} />
              <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)' }}>{scrollSpeed}x</span>
            </div>
          )}
          <span style={{ fontSize: '.78rem', color: 'var(--color-text-light)', fontFamily: 'var(--font-sans)' }}>
            ☸ {sutra.name} {sutra.hanja}
          </span>
        </div>
      </div>
    </section>
  )
}
