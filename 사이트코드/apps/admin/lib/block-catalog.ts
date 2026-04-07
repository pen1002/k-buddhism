/**
 * lib/block-catalog.ts
 * 125개 블록 전체 메타데이터 — 13대 전각 표준
 *
 * 원칙:
 * - 이 파일은 관리앱과 메인사이트 양쪽에서 참조한다
 * - 카탈로그는 데이터만 정의; 실제 컴포넌트는 별도 파일
 * - 1개 컴포넌트 = N개 블록 가능 (데이터만 다른 경우)
 * - priority: 1=1차구축, 2=2차, 3=3차
 */

export interface BlockMeta {
  code: string;       // 고유 코드 (H-01, SEC02-01 등)
  section: number;    // 전각 번호 (1~13)
  name: string;       // 블록 이름
  desc: string;       // 설명 (관리앱 표시용)
  required: boolean;  // 필수 여부 (true면 삭제 불가)
  component: string;  // 실제 렌더링할 컴포넌트 이름
  defaultOn: boolean; // 사찰 생성 시 기본 활성화 여부
  priority: number;   // 1차(1), 2차(2), 3차(3) 구축 우선순위
  dataKey?: string;   // DB에서 읽을 데이터 필드명 (옵션)
}

export const BLOCK_CATALOG: BlockMeta[] = [

  // ═══ 제1전각: 히어로 (10개) ═══════════════════════════════════════════════
  { code:'H-01', section:1, name:'연등 애니메이션 장엄',    desc:'연등이 부유하는 기본 히어로',              required:true,  component:'HeroLanternBlock',     defaultOn:true,  priority:1 },
  { code:'H-02', section:1, name:'사찰 전경 드론 영상',     desc:'MP4/유튜브 자동재생 배경',                required:false, component:'HeroVideoBlock',       defaultOn:false, priority:1 },
  { code:'H-03', section:1, name:'사계절 자동 테마 전환',   desc:'봄/여름/가을/겨울 자동 배경 교체',         required:false, component:'HeroSeasonBlock',      defaultOn:false, priority:1 },
  { code:'H-04', section:1, name:'큰스님 휘호 타이포',      desc:'한자 서예풍 타이포그래피 히어로',           required:false, component:'HeroCalligraphyBlock', defaultOn:false, priority:1 },
  { code:'H-05', section:1, name:'긴급 행사 팝업 덮개',     desc:'초파일 등 대형 행사 전체 화면 팝업',        required:false, component:'HeroEventOverlay',     defaultOn:false, priority:1 },
  { code:'H-06', section:1, name:'주야간 시간 연동 배경',   desc:'낮/밤 자동 전환 히어로',                  required:false, component:'HeroDayNightBlock',    defaultOn:false, priority:1 },
  { code:'H-07', section:1, name:'3D 사찰 VR 투어',        desc:'Sketchfab 3D 모델 또는 VR 진입점',        required:false, component:'Hero3DBlock',          defaultOn:false, priority:1 },
  { code:'H-08', section:1, name:'전각 일러스트 슬라이드',  desc:'대웅전 등 일러스트 슬라이드쇼',            required:false, component:'HeroSlideBlock',       defaultOn:false, priority:1 },
  { code:'H-09', section:1, name:'명상 미니멀 타이포',      desc:'선어록 중심 미니멀 히어로',                required:false, component:'HeroMinimalBlock',     defaultOn:false, priority:1 },
  { code:'H-10', section:1, name:'신도 소원 실시간 롤링',   desc:'신도들의 한 줄 소원 롤링 표시',            required:false, component:'HeroWishRolling',      defaultOn:false, priority:1 },

  // ═══ 제2전각: 공지사항 (8개) ══════════════════════════════════════════════
  { code:'SEC02-01', section:2, name:'통합 공지사항',        desc:'어드민 연동 공지 리스트',                 required:true,  component:'NoticeBlock',              defaultOn:true,  priority:1 },
  { code:'SEC02-02', section:2, name:'애경사/부음 알림',     desc:'스님 입적, 애경사 특별 알림',              required:false, component:'SpecialNoticeBlock',       defaultOn:false, priority:2 },
  { code:'SEC02-03', section:2, name:'사보/월간지 다운로드', desc:'PDF 사보 다운로드 링크',                  required:false, component:'PublicationBlock',         defaultOn:false, priority:3 },
  { code:'SEC02-04', section:2, name:'언론 보도 링크',       desc:'불교 뉴스 외부 링크 모음',                required:false, component:'PressBlock',               defaultOn:false, priority:3 },
  { code:'SEC02-05', section:2, name:'종단 공문 게시판',     desc:'조계종 본사 하달 공문',                   required:false, component:'OfficialNoticeBlock',      defaultOn:false, priority:3 },
  { code:'SEC02-06', section:2, name:'종무소 운영 변경',     desc:'운영시간 변경 등 행정 안내',              required:false, component:'AdminNoticeBlock',         defaultOn:false, priority:3 },
  { code:'SEC02-07', section:2, name:'봉사자 모집 공지',     desc:'자원봉사 긴급 모집',                     required:false, component:'VolunteerNoticeBlock',     defaultOn:false, priority:3 },
  { code:'SEC02-08', section:2, name:'경내 불사/통제 안내',  desc:'공사 구역 및 통제 안내',                  required:false, component:'ConstructionNoticeBlock',  defaultOn:false, priority:3 },

  // ═══ 제3전각: 법회·기도·행사 (20개) ══════════════════════════════════════
  { code:'SEC03-01', section:3, name:'정기법회 일정',        desc:'초하루/보름/지장/관음재일',               required:true,  component:'RegularServiceBlock',   defaultOn:true,  priority:1 },
  { code:'SEC03-02', section:3, name:'봉축 법요식',          desc:'부처님오신날 봉축행사',                   required:false, component:'EventCardBlock',        defaultOn:false, priority:2, dataKey:'event_buddha_birthday' },
  { code:'SEC03-03', section:3, name:'백중 49일 천도 기도',  desc:'영가 천도 특별 기도',                    required:false, component:'EventCardBlock',        defaultOn:false, priority:2, dataKey:'event_baekjung' },
  { code:'SEC03-04', section:3, name:'동지 기도',            desc:'동지 팥죽/달력 나눔',                    required:false, component:'EventCardBlock',        defaultOn:false, priority:2, dataKey:'event_dongji' },
  { code:'SEC03-05', section:3, name:'수능 합격 기도',       desc:'100일 합격 발원 기도',                   required:false, component:'EventCardBlock',        defaultOn:false, priority:2, dataKey:'event_csat' },
  { code:'SEC03-06', section:3, name:'성도재일 용맹정진',    desc:'성도절/출가절 철야 정진',                 required:false, component:'EventCardBlock',        defaultOn:false, priority:2 },
  { code:'SEC03-07', section:3, name:'산신재/칠성재',        desc:'산신/칠성/용왕 기도',                    required:false, component:'EventCardBlock',        defaultOn:false, priority:3 },
  { code:'SEC03-08', section:3, name:'명절 합동 다례재',     desc:'설/추석 합동 제사',                      required:false, component:'EventCardBlock',        defaultOn:false, priority:2 },
  { code:'SEC03-09', section:3, name:'연등축제 동참',        desc:'연등회 제등행렬 참여',                   required:false, component:'EventCardBlock',        defaultOn:false, priority:2 },
  { code:'SEC03-10', section:3, name:'산사음악회',           desc:'가을 문화 축제',                         required:false, component:'EventCardBlock',        defaultOn:false, priority:2 },
  { code:'SEC03-11', section:3, name:'생전예수재',           desc:'미리 닦는 사후 공덕',                    required:false, component:'EventCardBlock',        defaultOn:false, priority:3 },
  { code:'SEC03-12', section:3, name:'방생 법회',            desc:'생명 존중 방생 행사',                    required:false, component:'EventCardBlock',        defaultOn:false, priority:3 },
  { code:'SEC03-13', section:3, name:'1080배/3000배 참회',   desc:'참회 철야 기도',                         required:false, component:'EventCardBlock',        defaultOn:false, priority:3 },
  { code:'SEC03-14', section:3, name:'진신사리 친견',        desc:'가사불사 특별 법회',                     required:false, component:'EventCardBlock',        defaultOn:false, priority:3 },
  { code:'SEC03-15', section:3, name:'어린이/청년 법회',     desc:'주말 어린이/청년회',                     required:false, component:'EventCardBlock',        defaultOn:false, priority:2 },
  { code:'SEC03-16', section:3, name:'다도/사찰음식 강좌',   desc:'차 교실 및 음식 강좌',                   required:false, component:'EventCardBlock',        defaultOn:false, priority:3 },
  { code:'SEC03-17', section:3, name:'합창단 연주회',        desc:'정기 연주회/단원 모집',                  required:false, component:'EventCardBlock',        defaultOn:false, priority:3 },
  { code:'SEC03-18', section:3, name:'불교대학 개강',        desc:'경전반/교리반 안내',                     required:false, component:'EventCardBlock',        defaultOn:false, priority:2 },
  { code:'SEC03-19', section:3, name:'수계식 안내',          desc:'수계법회 접수',                          required:false, component:'EventCardBlock',        defaultOn:false, priority:3 },
  { code:'SEC03-20', section:3, name:'연간 법회 달력',       desc:'캘린더형 연간 일정표',                   required:false, component:'AnnualCalendarBlock',   defaultOn:false, priority:2 },

  // ═══ 제4전각: 오늘의 법문 (7개) ══════════════════════════════════════════
  { code:'SEC04-01', section:4, name:'오늘의 법문',          desc:'텍스트형 자동/수동 법문',                 required:true,  component:'DharmaBlock',            defaultOn:true,  priority:1 },
  { code:'SEC04-02', section:4, name:'큰스님 영상 법문',     desc:'유튜브 숏폼 연동',                       required:false, component:'DharmaVideoBlock',       defaultOn:false, priority:2 },
  { code:'SEC04-03', section:4, name:'365 선어록',           desc:'일일 명상 팝업',                         required:false, component:'DharmaPopupBlock',       defaultOn:false, priority:2 },
  { code:'SEC04-04', section:4, name:'경전 읽기',            desc:'반야심경/천수경/금강경',                  required:false, component:'SutraReaderBlock',       defaultOn:false, priority:3 },
  { code:'SEC04-05', section:4, name:'오디오 법문',          desc:'독경/ASMR 소리 재생',                    required:false, component:'DharmaAudioBlock',       defaultOn:false, priority:3 },
  { code:'SEC04-06', section:4, name:'다국어 법문',          desc:'영문 등 외국인 포교용',                  required:false, component:'DharmaMultiLangBlock',   defaultOn:false, priority:3 },
  { code:'SEC04-07', section:4, name:'불교 카드뉴스',        desc:'젊은 층 카드뉴스/웹툰',                  required:false, component:'DharmaCardNewsBlock',    defaultOn:false, priority:3 },

  // ═══ 제5전각: 사찰소개 (25개) — 19개 전각 해설은 HallEncyclopediaBlock 데이터로 통합 ═══
  { code:'SEC05-01', section:5, name:'사찰 연혁 및 창건 설화', desc:'역사와 창건 이야기',                   required:true,  component:'TempleHistoryBlock',       defaultOn:true,  priority:1 },
  { code:'SEC05-02', section:5, name:'전각 도감',             desc:'사찰 내 모든 전각 해설 통합 (체크형)',   required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:1 },
  { code:'SEC05-03', section:5, name:'인터랙티브 도량 배치도', desc:'클릭형 경내 지도',                     required:false, component:'InteractiveMapBlock',      defaultOn:false, priority:2 },
  { code:'SEC05-04', section:5, name:'성보박물관',            desc:'불교 문화재/보물 전시',                 required:false, component:'MuseumBlock',              defaultOn:false, priority:2 },
  { code:'SEC05-05', section:5, name:'둘레길/명상 숲길',      desc:'산책 코스 안내',                        required:false, component:'TrailBlock',               defaultOn:false, priority:3 },
  { code:'SEC05-06', section:5, name:'성지순례 스탬프',       desc:'도장 찍기 투어 안내',                   required:false, component:'StampTourBlock',           defaultOn:false, priority:3 },
  // 개별 전각 19개 — HallEncyclopediaBlock 데이터 항목으로 통합
  { code:'SEC05-07', section:5, name:'대웅전',                desc:'주법당 해설 (HallEncyclopedia)',         required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:2, dataKey:'hall_daewoongjeon' },
  { code:'SEC05-08', section:5, name:'극락전',                desc:'아미타불 법당 해설',                    required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:2, dataKey:'hall_geungnakjeon' },
  { code:'SEC05-09', section:5, name:'관음전',                desc:'관세음보살 법당 해설',                  required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:2, dataKey:'hall_gwaneum' },
  { code:'SEC05-10', section:5, name:'지장전',                desc:'지장보살 법당 해설',                    required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:2, dataKey:'hall_jijang' },
  { code:'SEC05-11', section:5, name:'미륵전',                desc:'미래불 미륵보살 법당 해설',             required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_mireuk' },
  { code:'SEC05-12', section:5, name:'비로전',                desc:'비로자나불 법당 해설',                  required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_biro' },
  { code:'SEC05-13', section:5, name:'삼성각',                desc:'산신/칠성/독성 전각 해설',              required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:2, dataKey:'hall_samseong' },
  { code:'SEC05-14', section:5, name:'나한전',                desc:'16나한 전각 해설',                      required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_nahan' },
  { code:'SEC05-15', section:5, name:'팔상전',                desc:'부처님 생애 8장면 전각',                required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_palsang' },
  { code:'SEC05-16', section:5, name:'약사전',                desc:'약사여래 법당 해설',                    required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_yaksa' },
  { code:'SEC05-17', section:5, name:'적멸보궁',              desc:'진신사리 봉안 성소',                    required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_jeokmeol' },
  { code:'SEC05-18', section:5, name:'장경각',                desc:'팔만대장경 보관 건물',                  required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_janggyeong' },
  { code:'SEC05-19', section:5, name:'범종각',                desc:'범종/법고/목어/운판',                   required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:2, dataKey:'hall_beomjong' },
  { code:'SEC05-20', section:5, name:'요사채',                desc:'스님 생활 공간 해설',                   required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_yosa' },
  { code:'SEC05-21', section:5, name:'공양간',                desc:'사찰 부엌/발우공양',                    required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_gongyang' },
  { code:'SEC05-22', section:5, name:'부도탑',                desc:'고승 사리탑 안내',                      required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_budo' },
  { code:'SEC05-23', section:5, name:'보호수',                desc:'수백 년 된 보호수 소개',                required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_tree' },
  { code:'SEC05-24', section:5, name:'마애불',                desc:'바위에 새긴 불상 해설',                 required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:3, dataKey:'hall_maaebul' },
  { code:'SEC05-25', section:5, name:'종무소',                desc:'종무소 위치 및 연락처',                 required:false, component:'HallEncyclopediaBlock',    defaultOn:false, priority:2, dataKey:'hall_office' },

  // ═══ 제6전각: 주지스님 인사말 (5개) ══════════════════════════════════════
  { code:'SEC06-01', section:6, name:'주지스님 인사말',       desc:'사진 + 인사 메시지',                    required:true,  component:'AbbotGreetingBlock',   defaultOn:true,  priority:1 },
  { code:'SEC06-02', section:6, name:'조실/방장 스님 법어',   desc:'총림급 최고 어른 법어',                 required:false, component:'SeniorMonkBlock',      defaultOn:false, priority:3 },
  { code:'SEC06-03', section:6, name:'역대 주지 계보',        desc:'조사 스님 영정/계보',                   required:false, component:'AbbotLineageBlock',    defaultOn:false, priority:3 },
  { code:'SEC06-04', section:6, name:'스님과 차담 예약',      desc:'고민 상담 예약 폼',                     required:false, component:'TeaChatBookingBlock',  defaultOn:false, priority:3 },
  { code:'SEC06-05', section:6, name:'주지스님 저서',         desc:'출판물 소개',                          required:false, component:'AbbotBooksBlock',      defaultOn:false, priority:3 },

  // ═══ 제7전각: 갤러리 (6개) ════════════════════════════════════════════════
  { code:'SEC07-01', section:7, name:'최신 갤러리',           desc:'10장 순환 자동삭제',                    required:true,  component:'GalleryBlock',         defaultOn:true,  priority:1 },
  { code:'SEC07-02', section:7, name:'행사별 앨범 아카이브',  desc:'폴더형 사진 분류',                      required:false, component:'AlbumArchiveBlock',    defaultOn:false, priority:2 },
  { code:'SEC07-03', section:7, name:'봉사단 활동 사진첩',    desc:'신도회/봉사단 전용',                    required:false, component:'ActivityPhotoBlock',   defaultOn:false, priority:3 },
  { code:'SEC07-04', section:7, name:'사계절 풍경 갤러리',    desc:'계절별 도량 풍경',                      required:false, component:'SeasonGalleryBlock',   defaultOn:false, priority:3 },
  { code:'SEC07-05', section:7, name:'비디오 갤러리',         desc:'숏폼/유튜브 릴스',                      required:false, component:'VideoGalleryBlock',    defaultOn:false, priority:2 },
  { code:'SEC07-06', section:7, name:'신도 참여형 게시판',    desc:'신도들이 올리는 사진',                  required:false, component:'CommunityPhotoBlock',  defaultOn:false, priority:3 },

  // ═══ 제8전각: 기도·불사동참 (12개) ═══════════════════════════════════════
  { code:'SEC08-01', section:8, name:'연등 접수',             desc:'가족 축원 상시 연등',                   required:true,  component:'OfferingBlock', defaultOn:true,  priority:1, dataKey:'offering_lantern' },
  { code:'SEC08-02', section:8, name:'인등/원불 접수',        desc:'영구 점등 및 불상 모시기',              required:false, component:'OfferingBlock', defaultOn:false, priority:2, dataKey:'offering_permanent' },
  { code:'SEC08-03', section:8, name:'위패/영구위패',         desc:'영가 모시기 접수',                      required:false, component:'OfferingBlock', defaultOn:false, priority:2, dataKey:'offering_tablet' },
  { code:'SEC08-04', section:8, name:'기와 불사',             desc:'지붕 올리기 공덕',                      required:false, component:'OfferingBlock', defaultOn:false, priority:2, dataKey:'offering_roof' },
  { code:'SEC08-05', section:8, name:'삼재 소멸 기도',        desc:'삼재 부적 및 기도',                     required:false, component:'OfferingBlock', defaultOn:false, priority:2 },
  { code:'SEC08-06', section:8, name:'단청/개금 불사',        desc:'전각 보수/불상 금입히기',               required:false, component:'OfferingBlock', defaultOn:false, priority:3 },
  { code:'SEC08-07', section:8, name:'땅 한 평 사기',         desc:'도량 확장 불사금',                      required:false, component:'OfferingBlock', defaultOn:false, priority:2, dataKey:'offering_land' },
  { code:'SEC08-08', section:8, name:'가사 불사',             desc:'스님 옷 공양',                          required:false, component:'OfferingBlock', defaultOn:false, priority:3 },
  { code:'SEC08-09', section:8, name:'물품 보시',             desc:'향/초/꽃/공양미 올리기',                required:false, component:'OfferingBlock', defaultOn:false, priority:3 },
  { code:'SEC08-10', section:8, name:'결사 대기도',           desc:'1000일/3000일 결사',                    required:false, component:'OfferingBlock', defaultOn:false, priority:3 },
  { code:'SEC08-11', section:8, name:'장학금/후원',           desc:'소외계층 지정 후원',                    required:false, component:'OfferingBlock', defaultOn:false, priority:2 },
  { code:'SEC08-12', section:8, name:'모바일 소원지',         desc:'온라인 소원나무',                       required:false, component:'WishTreeBlock', defaultOn:false, priority:2 },

  // ═══ 제9전각: 결제·보시 (5개) ═════════════════════════════════════════════
  { code:'SEC09-01', section:9, name:'온라인 간편결제',       desc:'PG사 연동 결제',                        required:true,  component:'PaymentBlock',     defaultOn:true,  priority:1 },
  { code:'SEC09-02', section:9, name:'무통장 입금 안내',      desc:'계좌번호 복사 기능',                    required:false, component:'BankTransferBlock', defaultOn:true, priority:1 },
  { code:'SEC09-03', section:9, name:'ARS 전화 후원',         desc:'전화 후원 연결',                        required:false, component:'ARSDonationBlock',  defaultOn:false, priority:3 },
  { code:'SEC09-04', section:9, name:'CMS 정기 자동이체',     desc:'월정기 후원 신청',                      required:false, component:'CMSBlock',          defaultOn:false, priority:2 },
  { code:'SEC09-05', section:9, name:'기부금 영수증',         desc:'연말정산 자동 발급',                    required:false, component:'TaxReceiptBlock',   defaultOn:false, priority:2 },

  // ═══ 제10전각: 자료관 (8개) ════════════════════════════════════════════════
  { code:'SEC10-01', section:10, name:'사찰 FAQ',             desc:'주차/운영시간 등 안내',                 required:true,  component:'QASlideBlock',        defaultOn:true,  priority:1 },
  { code:'SEC10-02', section:10, name:'사찰 예절 해설',       desc:'복장/차수/절하는 법',                   required:false, component:'EtiquetteBlock',      defaultOn:false, priority:2 },
  { code:'SEC10-03', section:10, name:'불교 용어 사전',       desc:'기초 교리/용어 해설',                   required:false, component:'GlossaryBlock',       defaultOn:false, priority:3 },
  { code:'SEC10-04', section:10, name:'불교식 제사 안내',     desc:'가정 차례 상차림',                      required:false, component:'RitualGuideBlock',    defaultOn:false, priority:3 },
  { code:'SEC10-05', section:10, name:'다라니/독송 다운로드', desc:'진언 텍스트 PDF',                       required:false, component:'ChantDownloadBlock',  defaultOn:false, priority:3 },
  { code:'SEC10-06', section:10, name:'스님의 하루',          desc:'일과표 인포그래픽',                     required:false, component:'MonkDayBlock',        defaultOn:false, priority:3 },
  { code:'SEC10-07', section:10, name:'오시는 길',            desc:'카카오/네이버 지도 연동',               required:true,  component:'VisitBlock',          defaultOn:true,  priority:1 },
  { code:'SEC10-08', section:10, name:'주차장/셔틀버스',      desc:'교통편 상세 안내',                      required:false, component:'TransportBlock',      defaultOn:false, priority:2 },

  // ═══ 제11전각: 인포그래픽 (5개) ═══════════════════════════════════════════
  { code:'SEC11-01', section:11, name:'창건 누적 타이머',     desc:'창건 후 경과 시간',                     required:false, component:'FoundedTimerBlock',   defaultOn:false, priority:2 },
  { code:'SEC11-02', section:11, name:'연등 카운터',          desc:'점등된 전체 연등 수',                   required:false, component:'LanternCounterBlock', defaultOn:false, priority:2 },
  { code:'SEC11-03', section:11, name:'문화재 시각화',        desc:'소장 보물 개수 표시',                   required:false, component:'HeritageCountBlock',  defaultOn:false, priority:2 },
  { code:'SEC11-04', section:11, name:'봉사 누적 시간',       desc:'자비 나눔 활동 통계',                   required:false, component:'VolunteerStatsBlock', defaultOn:false, priority:3 },
  { code:'SEC11-05', section:11, name:'방문객 카운터',        desc:'누적 템플스테이/방문객',                required:false, component:'VisitorCountBlock',   defaultOn:false, priority:3 },

  // ═══ 제12전각: 실천 네트워크 (7개) ═══════════════════════════════════════
  { code:'SEC12-01', section:12, name:'3대 실천망 바로가기',  desc:'부설 기관 링크',                        required:true,  component:'PillarBlock',         defaultOn:true,  priority:1 },
  { code:'SEC12-02', section:12, name:'무료 급식소',          desc:'자비 나눔 활동 소개',                   required:false, component:'CharityBlock',        defaultOn:false, priority:2 },
  { code:'SEC12-03', section:12, name:'복지 시설 연동',       desc:'노인/아동 요양 시설',                   required:false, component:'WelfareBlock',        defaultOn:false, priority:2 },
  { code:'SEC12-04', section:12, name:'장학재단 후원',        desc:'장학금 안내',                           required:false, component:'ScholarshipBlock',    defaultOn:false, priority:3 },
  { code:'SEC12-05', section:12, name:'봉사단 가입',          desc:'보현봉사단 신청',                       required:false, component:'VolunteerFormBlock',  defaultOn:false, priority:2 },
  { code:'SEC12-06', section:12, name:'불교굿즈 쇼핑몰',     desc:'불교용품 판매 연동',                    required:false, component:'ShopBlock',           defaultOn:false, priority:2 },
  { code:'SEC12-07', section:12, name:'지역사회 교류',        desc:'타 종교/지역 화합 연혁',                required:false, component:'CommunityBlock',      defaultOn:false, priority:3 },

  // ═══ 제13전각: 템플스테이 (6개) — 1차 전량 구축 ═══════════════════════════
  { code:'SEC13-01', section:13, name:'템플스테이 종합 안내', desc:'공식 예약 연동',                        required:true,  component:'TemplestayMainBlock',    defaultOn:true,  priority:1 },
  { code:'SEC13-02', section:13, name:'휴식형 프로그램',      desc:'자유 산사 체험',                        required:false, component:'TemplestayProgramBlock', defaultOn:false, priority:1, dataKey:'program_rest' },
  { code:'SEC13-03', section:13, name:'체험형 프로그램',      desc:'108배/연등만들기/사찰음식',             required:false, component:'TemplestayProgramBlock', defaultOn:false, priority:1, dataKey:'program_experience' },
  { code:'SEC13-04', section:13, name:'선명상형 프로그램',    desc:'참선/묵언 수행 집중',                   required:false, component:'TemplestayProgramBlock', defaultOn:false, priority:1, dataKey:'program_meditation' },
  { code:'SEC13-05', section:13, name:'당일형 프로그램',      desc:'템플라이프/외국인 2시간',               required:false, component:'TemplestayProgramBlock', defaultOn:false, priority:1, dataKey:'program_daytrip' },
  { code:'SEC13-06', section:13, name:'참가자 후기',          desc:'수기 및 사진 갤러리',                   required:false, component:'TemplestayReviewBlock',  defaultOn:false, priority:1 },
]

// ── 유틸리티 ──────────────────────────────────────────────────────────────────

/** 1차 구축 대상 (priority === 1) — 약 29개 */
export const PHASE1_BLOCKS = BLOCK_CATALOG.filter(b => b.priority === 1)

/** 필수 블록 (required === true) — 13개 */
export const REQUIRED_BLOCKS = BLOCK_CATALOG.filter(b => b.required)

/** 고유 컴포넌트 목록 (중복 제거) */
export const UNIQUE_COMPONENTS = Array.from(new Set(BLOCK_CATALOG.map(b => b.component)))

/** 코드로 블록 메타 조회 */
export function getBlockMeta(code: string): BlockMeta | undefined {
  return BLOCK_CATALOG.find(b => b.code === code)
}

/** 코드로 블록 이름 조회 */
export function getBlockName(code: string): string {
  return getBlockMeta(code)?.name ?? code
}

/** 섹션 번호로 블록 목록 조회 */
export function getBlocksBySection(section: number): BlockMeta[] {
  return BLOCK_CATALOG.filter(b => b.section === section)
}
