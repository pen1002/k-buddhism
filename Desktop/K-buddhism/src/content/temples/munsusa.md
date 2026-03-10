'use client'

import React, { useState, useEffect } from "react"
import { SplineScene } from "@/components/ui/splite" // 사용자님의 경로 유지
import { Spotlight } from "@/components/ui/spotlight"

export default function MunsusaPage() {
  const [isMobOpen, setIsMobOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('welfare')
  const [scrolled, setScrolled] = useState(false)

  // 스크롤 시 네비게이션 바 그림자 효과
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-[#FAFAF8] text-[#1A1712] font-serif antialiased overflow-x-hidden selection:bg-[#2D5A3D] selection:text-white">
      
      {/* --- 커스텀 CSS (티커 애니메이션 및 특정 효과 유지용) --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        .font-kor { font-family: 'Noto Serif KR', serif; }
        .font-eng { font-family: 'Cormorant Garamond', serif; }
        @keyframes tick { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-tick { animation: tick 24s linear infinite; }
        @keyframes scrl { 0% { top: -100%; } 100% { top: 100%; } }
        .animate-scrl { animation: scrl 1.8s ease-in-out infinite; }
      `}} />

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 bg-[#FAFAF8]/95 backdrop-blur-md transition-shadow duration-300 border-b border-[#5C5549]/10 ${scrolled ? 'shadow-[0_2px_24px_rgba(0,0,0,0.09)]' : ''}`}>
        <a href="#hero" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2D5A3D] flex items-center justify-center text-white text-base">
            🪷
          </div>
          <div>
            <div className="font-kor text-base font-bold tracking-[0.08em] text-[#1A1712]">문수사</div>
            <div className="font-eng text-[10px] tracking-[0.35em] text-[#2D5A3D] mt-[1px]">MUNSU SA</div>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {['events:공지·행사', 'intro:사찰소개', 'gallery:갤러리', 'welfare:자비나눔', 'indung:인등불사', 'visit:오시는길'].map((item) => {
            const [id, label] = item.split(':')
            return (
              <a key={id} href={`#${id}`} className="font-kor text-[11px] tracking-[0.12em] text-[#5C5549] px-4 py-2 border-b-2 border-transparent hover:text-[#2D5A3D] hover:border-[#2D5A3D] transition-all whitespace-nowrap">
                {label}
              </a>
            )
          })}
        </div>

        <a href="tel:051-621-0700" className="hidden md:block font-kor text-[11px] tracking-[0.1em] px-5 py-2 border border-[#2D5A3D] text-[#2D5A3D] hover:bg-[#2D5A3D] hover:text-white transition-colors">
          📞 문의
        </a>

        {/* Mobile Hamburger */}
        <button className="md:hidden flex flex-col gap-[5px] p-2" onClick={() => setIsMobOpen(true)}>
          <span className="block w-6 h-[1.5px] bg-[#1A1712]"></span>
          <span className="block w-6 h-[1.5px] bg-[#1A1712]"></span>
          <span className="block w-6 h-[1.5px] bg-[#1A1712]"></span>
        </button>
      </nav>

      {/* 모바일 메뉴 */}
      {isMobOpen && (
        <div className="fixed inset-0 z-[99] bg-[#FAFAF8] flex flex-col pt-24 px-8 pb-8 overflow-y-auto">
          <button className="fixed top-5 right-6 text-2xl text-[#1A1712]" onClick={() => setIsMobOpen(false)}>✕</button>
          {[
            { id: 'events', icon: '🎏', label: '공지·행사' },
            { id: 'intro', icon: '🏯', label: '사찰소개' },
            { id: 'gallery', icon: '🖼', label: '갤러리' },
            { id: 'welfare', icon: '🤝', label: '자비나눔' },
            { id: 'indung', icon: '🕯', label: '인등불사' },
            { id: 'visit', icon: '🗺', label: '오시는길' }
          ].map((m) => (
            <a key={m.id} href={`#${m.id}`} onClick={() => setIsMobOpen(false)} className="font-kor text-xl font-bold tracking-wide text-[#1A1712] py-4 border-b border-[#5C5549]/10">
              {m.icon} {m.label}
            </a>
          ))}
        </div>
      )}

      {/* ── HERO (3D Spline & Spotlight 적용) ── */}
      <section id="hero" className="relative w-full h-screen min-h-[600px] mt-16 bg-[#1A2018] overflow-hidden flex items-center">
        {/* 요청하신 Spotlight (단청/황금색 느낌의 빛) */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(200, 149, 58, 0.4)" />
        
        {/* 원본 배경 텍스처 (오설록 스타일) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A2018] via-[#2D3D2A] to-[#1C2E22] opacity-90 z-0"></div>
        <div className="absolute inset-0 z-0 mix-blend-screen opacity-50" style={{ backgroundImage: 'radial-gradient(ellipse 60% 80% at 70% 40%, rgba(45,90,61,.35) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(200,149,58,.12) 0%, transparent 60%)' }}></div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full h-full flex flex-col md:flex-row items-center relative z-10 pt-10 pb-20 md:py-0">
          
          {/* 왼쪽: 기존 텍스트 디자인 유지 */}
          <div className="flex-1 w-full mt-10 md:mt-0">
            <div className="inline-block font-eng text-[11px] tracking-[0.3em] text-[#C8953A] border border-[#C8953A]/30 px-4 py-1.5 mb-6 uppercase bg-[#C8953A]/10">
              Busan · Namgu · Daeyeon-dong
            </div>
            <h1 className="font-kor font-black text-5xl md:text-7xl leading-[1.1] text-white tracking-tight mb-4">
              문수사<br/>文殊寺
            </h1>
            <p className="font-eng italic text-lg md:text-xl text-white/60 tracking-wider mb-8">
              Sanctuary of Wisdom in the City
            </p>
            <p className="font-kor text-[13px] text-white/75 leading-[1.8] tracking-wide max-w-md border-l-2 border-[#C8953A] pl-4 mb-10">
              부산 남구 도심 속 문수보살의 지혜가 머무는 도량<br/>
              지원 주지스님의 원력으로 지역사회와 함께하는<br/>
              자비의 실천, 30년 나눔의 역사
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#events" className="font-kor text-[12px] tracking-[0.12em] px-7 py-3 bg-[#C8953A] text-[#1A1712] hover:opacity-85 transition-opacity font-semibold">
                행사 일정 보기
              </a>
              <a href="#welfare" className="font-kor text-[12px] tracking-[0.12em] px-7 py-3 border border-white/40 text-white/90 hover:border-white hover:text-white transition-colors">
                자비나눔 알아보기
              </a>
            </div>
          </div>

          {/* 오른쪽: 요청하신 3D Spline Scene */}
          <div className="flex-1 relative w-full h-[40vh] md:h-[80vh] mt-10 md:mt-0">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(200,149,58,0.2)]"
            />
          </div>

        </div>

        {/* 스크롤 인디케이터 (데스크탑 전용) */}
        <div className="hidden md:flex absolute right-10 bottom-10 z-10 flex-col items-center gap-2">
          <span className="font-eng text-[10px] tracking-[0.25em] text-white/40 uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <div className="absolute top-[-100%] left-0 w-full h-full bg-white/60 animate-scrl"></div>
          </div>
        </div>
      </section>

      {/* ── 티커 ── */}
      <div className="bg-[#2D5A3D] py-2.5 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap w-max animate-tick">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="font-kor text-[11px] tracking-[0.15em] text-white/90">🪷 문수사</span>
              <span className="text-[#C8953A]/70">✦</span>
              <span className="font-kor text-[11px] tracking-[0.15em] text-white/90">부산 남구 대연동</span>
              <span className="text-[#C8953A]/70">✦</span>
              <span className="font-kor text-[11px] tracking-[0.15em] text-white/90">범어사 말사</span>
              <span className="text-[#C8953A]/70">✦</span>
              <span className="font-kor text-[11px] tracking-[0.15em] text-white/90">문수복지재단</span>
              <span className="text-[#C8953A]/70">✦</span>
              <span className="font-kor text-[11px] tracking-[0.15em] text-white/90">위드아시아</span>
              <span className="text-[#C8953A]/70">✦</span>
              <span className="font-kor text-[11px] tracking-[0.15em] text-white/90">인등불사 365일</span>
              <span className="text-[#C8953A]/70">✦</span>
              <span className="font-kor text-[11px] tracking-[0.15em] text-white/90">템플스테이</span>
              <span className="text-[#C8953A]/70">✦</span>
              <span className="font-kor text-[11px] tracking-[0.15em] text-white/90">지원 주지스님</span>
              <span className="text-[#C8953A]/70">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── 주요 행사 (Events) ── */}
      <section id="events" className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
          <div>
            <p className="font-eng text-[11px] tracking-[0.3em] text-[#2D5A3D] uppercase mb-2">Events & Programs</p>
            <h2 className="font-kor text-2xl md:text-3xl font-bold text-[#1A1712] mb-2 tracking-tight">주요 행사 · 법회</h2>
            <p className="font-kor text-sm text-[#5C5549]">문수보살의 지혜로 일상에 스며드는 불교 프로그램</p>
          </div>
          <a href="#" className="font-eng text-[11px] tracking-[0.2em] text-[#2D5A3D] uppercase border-b border-[#2D5A3D] pb-0.5 hover:opacity-70 transition-opacity">
            전체 보기 →
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { tag: 'Monthly', title: '초하루·보름 법회', desc: '매월 음력 1일·15일 오전 10시\n지장보살 공덕 기도 및 법문', price: '정기법회', icon: '🌕', bg: 'from-[#1C3520] to-[#2D5A3D]' },
            { tag: 'Annual', title: '부처님 오신 날 행사', desc: '음력 4월 8일 연등 점등식\n거리 행진 및 공양 나눔', price: '2025.5.5 (월)', icon: '🪔', bg: 'from-[#3A2010] to-[#6B3A1A]' },
            { tag: 'Temple Stay', title: '부산 도심 템플스테이', desc: '바다와 산사의 조화\n1박 2일 도심 힐링 프로그램', price: '₩ 80,000 / 1박', icon: '🌊', bg: 'from-[#0D1F2D] to-[#1A3A55]' },
            { tag: 'Weekly', title: '일요 법회 · 명상 강좌', desc: '매주 일요일 오전 11시\n불교 기초 교리 및 명상 수련', price: '매주 진행', icon: '📿', bg: 'from-[#1F1F30] to-[#2D2D50]' },
          ].map((ev, i) => (
            <div key={i} className="bg-white border border-[#5C5549]/10 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group">
              <div className={`h-40 bg-gradient-to-br ${ev.bg} flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500`}>
                {ev.icon}
              </div>
              <div className="p-5">
                <span className="inline-block font-eng text-[10px] tracking-[0.2em] text-[#2D5A3D] uppercase mb-2">{ev.tag}</span>
                <h3 className="font-kor text-sm font-bold mb-1.5">{ev.title}</h3>
                <p className="font-kor text-xs text-[#9B9286] leading-relaxed whitespace-pre-line">{ev.desc}</p>
                <div className="font-kor text-[13px] font-bold text-[#C8953A] mt-3">{ev.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 특별 배너 (오설록 스타일) ── */}
      <div className="bg-[#F4F2ED] grid grid-cols-1 md:grid-cols-2 min-h-[420px] max-w-7xl mx-auto md:my-10">
        <div className="bg-gradient-to-br from-[#1F3524] to-[#2D5A3D] p-10 md:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* 점선 패턴 배경 */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='2' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E\")" }}></div>
          <div className="relative z-10">
            <div className="text-5xl mb-5">🙏</div>
            <h3 className="font-kor text-2xl font-bold text-white mb-3">지원스님과<br/>함께하는 법회</h3>
            <p className="font-kor text-[13px] text-white/65 leading-[1.9] mb-6">
              30년 원력으로 이어온<br/>문수사의 자비 나눔 정신<br/>지역사회와 함께 성장합니다
            </p>
            <a href="tel:051-621-0700" className="inline-block font-kor text-[12px] tracking-[0.12em] px-6 py-2.5 border border-[#C8953A]/60 text-[#C8953A] hover:bg-[#C8953A] hover:text-[#1A1712] hover:border-[#C8953A] transition-all">
              법회 문의 →
            </a>
          </div>
        </div>
        <div className="p-10 md:p-12 flex flex-col justify-center gap-6 bg-white md:bg-transparent">
          {[
            { icon: '🏥', name: '문수복지재단 의료 봉사', sub: '부산 남구 취약계층 무료 건강검진\n매월 첫째 주 토요일', price: '무료 참여 가능' },
            { icon: '🌏', name: '위드아시아 해외 구호 모금', sub: '캄보디아·동남아 소외계층 지원\n매주 일요일 법회 후 모금', price: '현재 모금 중' },
            { icon: '👴', name: '용호·남구 노인복지 봉사', sub: '부산광역시남구노인복지관 연계\n어르신 밑반찬 나눔 봉사', price: '봉사자 모집 중' }
          ].map((item, i) => (
            <div key={i} className={`flex gap-5 items-start pb-5 ${i !== 2 ? 'border-b border-[#5C5549]/10' : ''}`}>
              <div className="w-14 h-14 shrink-0 bg-[#FAFAF8] flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div>
                <h4 className="font-kor text-sm font-bold mb-1">{item.name}</h4>
                <p className="font-kor text-[12px] text-[#9B9286] leading-relaxed whitespace-pre-line">{item.sub}</p>
                <div className="font-kor text-[13px] font-bold text-[#C8953A] mt-1">{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 사찰소개 ── */}
      <section id="intro" className="py-24 px-6 md:px-10 bg-[#F4F2ED]">
        <div className="max-w-4xl mx-auto">
          <p className="font-eng text-[11px] tracking-[0.3em] text-[#2D5A3D] uppercase mb-2">About Temple</p>
          <h2 className="font-kor text-2xl md:text-3xl font-bold text-[#1A1712] mb-10 leading-[1.3]">
            문수보살의 지혜가 머무는<br/>부산 도심 속 청정 도량
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-5 text-[14px] text-[#5C5549] leading-loose font-kor">
              <p>
                문수사(文殊寺)는 부산광역시 남구 대연동에 위치한 대한불교조계종 제14교구
                범어사의 말사입니다. 문수보살의 지혜와 자비를 근본으로 삼아,
                지원 주지스님의 원력 아래 지역사회와 깊이 연결된 불교 공동체를 이루고 있습니다.
              </p>
              <p>
                단순한 기도 도량을 넘어, 사회복지법인 문수복지재단과
                사단법인 위드아시아를 통해 노인 복지, 국제 구호, 지역 포교의
                핵심 허브로 자리매김하고 있습니다.
              </p>
            </div>
            <div>
              <ul className="flex flex-col gap-4">
                {[
                  { icon: '⛩️', label: '종단', val: '대한불교조계종 제14교구 범어사 말사' },
                  { icon: '🧘', label: '주지', val: '지원 스님' },
                  { icon: '🙏', label: '주불', val: '문수보살' },
                  { icon: '📍', label: '위치', val: '부산광역시 남구 대연동' },
                  { icon: '🏛️', label: '산하 기관', val: '문수복지재단 · 위드아시아' }
                ].map((li, i) => (
                  <li key={i} className="flex gap-4 items-center">
                    <span className="text-xl">{li.icon}</span>
                    <div>
                      <div className="font-kor text-[13px] font-bold">{li.label}</div>
                      <div className="font-kor text-[12px] text-[#9B9286]">{li.val}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 자비나눔 (탭 UI 적용) ── */}
      <section id="welfare" className="py-24 px-6 md:px-10 bg-white">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="font-eng text-[11px] tracking-[0.3em] text-[#2D5A3D] uppercase mb-2">Community & Welfare</p>
          <h2 className="font-kor text-2xl md:text-3xl font-bold text-[#1A1712] mb-4">자비 나눔 · 산하기관</h2>
          <p className="font-kor text-sm text-[#5C5549] leading-relaxed">
            지원 주지스님의 원력으로 운영되는 복지 기관들입니다.<br/>
            불교의 자비 정신을 지역사회와 세계 속에서 실천합니다.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border border-[#5C5549]/10 max-w-sm mx-auto mb-10 overflow-hidden">
          <button 
            className={`flex-1 text-center font-kor text-[12px] tracking-[0.08em] py-3 transition-colors ${activeTab === 'welfare' ? 'bg-[#2D5A3D] text-white' : 'text-[#9B9286] hover:bg-[#FAFAF8]'}`}
            onClick={() => setActiveTab('welfare')}
          >
            🏠 문수복지재단
          </button>
          <button 
            className={`flex-1 text-center font-kor text-[12px] tracking-[0.08em] py-3 transition-colors ${activeTab === 'withasia' ? 'bg-[#2D5A3D] text-white' : 'text-[#9B9286] hover:bg-[#FAFAF8]'}`}
            onClick={() => setActiveTab('withasia')}
          >
            🌏 위드아시아
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'welfare' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-500">
              {[
                { icon: '🏛️', cat: 'Foundation HQ', name: '문수복지재단 본부', desc: '사회복지법인 문수복지재단 법인 본부. 부산 남구 지역 복지 사업의 핵심 거점.', url: 'munsu.or.kr' },
                { icon: '👴', cat: 'Senior Welfare', name: '부산광역시 남구 노인복지관', desc: '남구 지역 어르신을 위한 종합 복지관. 건강 증진, 여가, 사회 참여 프로그램 운영.', url: 'bsnamgu.or.kr' },
                { icon: '🏡', cat: 'Senior Center', name: '용호노인복지관', desc: '용호동 지역 어르신 전담 복지관. 재가복지, 주간 보호, 생활 지원 서비스 제공.', url: 'ygsenior.or.kr' },
                { icon: '🏥', cat: 'Care Facility', name: '문수실버케어요양원', desc: '전문 요양 서비스를 제공하는 노인 요양 시설. 불교 정신으로 운영하는 어르신 케어.', url: '블로그 방문' },
                { icon: '🤝', cat: 'Home Care', name: '문수노인복지센터', desc: '재가복지 및 주간보호 서비스. 가정에서 어르신을 돌보는 전문 케어 서비스.', url: 'munsucare.or.kr' },
                { icon: '💼', cat: 'Senior Jobs', name: '문수시니어클럽', desc: '어르신 일자리 창출 및 사회 참여 지원. 노인 맞춤형 취업 연계 프로그램 운영.', url: 'munsuseniors.or.kr' },
              ].map((w, i) => (
                <div key={i} className="border border-[#5C5549]/10 p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:border-[#2D5A3D] transition-all cursor-pointer">
                  <div className="text-3xl mb-3">{w.icon}</div>
                  <div className="font-eng text-[10px] tracking-[0.25em] text-[#2D5A3D] uppercase mb-1">{w.cat}</div>
                  <div className="font-kor text-[14px] font-bold mb-2">{w.name}</div>
                  <div className="font-kor text-[12px] text-[#9B9286] leading-relaxed mb-4">{w.desc}</div>
                  <div className="font-eng text-[11px] tracking-[0.15em] text-[#2D5A3D] uppercase inline-flex items-center gap-1 border-b border-[#2D5A3D]">
                    {w.url} <span>↗</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'withasia' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-500">
               {[
                { icon: '🌏', cat: 'NGO HQ', name: '사단법인 위드아시아', desc: '국내외 소외계층 지원 및 인도주의 사업 수행 국제구호 NGO 법인 본부.', url: 'withasia.or.kr' },
                { icon: '📰', cat: 'News & Activities', name: '위드아시아 공식 블로그', desc: '현장 활동 소식, 구호 활동 사진, 후원 안내 등 최신 활동 공유.', url: '블로그 방문' },
                { icon: '🏙️', cat: 'Regional Branch', name: '위드아시아 대구경북지부', desc: '대구·경북 지역 소외계층 지원 및 봉사 활동 지역 거점.', url: '카페 방문' },
              ].map((w, i) => (
                <div key={i} className="border border-[#5C5549]/10 p-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:border-[#2D5A3D] transition-all cursor-pointer">
                  <div className="text-3xl mb-3">{w.icon}</div>
                  <div className="font-eng text-[10px] tracking-[0.25em] text-[#2D5A3D] uppercase mb-1">{w.cat}</div>
                  <div className="font-kor text-[14px] font-bold mb-2">{w.name}</div>
                  <div className="font-kor text-[12px] text-[#9B9286] leading-relaxed mb-4">{w.desc}</div>
                  <div className="font-eng text-[11px] tracking-[0.15em] text-[#2D5A3D] uppercase inline-flex items-center gap-1 border-b border-[#2D5A3D]">
                    {w.url} <span>↗</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <div className="relative h-[420px] bg-gradient-to-b from-[#0D1F14] via-[#1C3520] to-[#2D5A3D] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.015) 2px, rgba(255,255,255,.015) 4px)' }}></div>
        <div className="relative z-10 text-center">
          <div className="font-eng text-4xl md:text-6xl font-light tracking-[0.15em] text-white/85 uppercase mb-3">
            Wisdom & Compassion<br/>from Busan
          </div>
          <div className="font-kor text-[14px] text-white/45 tracking-[0.2em]">
            지혜와 자비 · 부산 남구 문수사
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1A1712] pt-14 px-6 md:px-10 pb-8 text-white/55">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 pb-10 border-b border-white/10">
          <div>
            <div className="font-kor text-lg font-bold text-white tracking-[0.08em]">🪷 문수사</div>
            <div className="font-eng text-[10px] tracking-[0.3em] text-[#C8953A]/75 mt-1">MUNSU SA · 文殊寺</div>
            <div className="font-kor text-[12px] text-white/35 mt-3 leading-relaxed">부산 남구 도심 속<br/>자비의 도량</div>
          </div>
          <div>
            <h4 className="font-eng text-[10px] tracking-[0.25em] text-white/40 uppercase mb-4">사찰 안내</h4>
            <ul className="space-y-2 font-kor text-[12px]">
              <li><a href="#intro" className="hover:text-[#C8953A] transition">사찰 소개</a></li>
              <li><a href="#events" className="hover:text-[#C8953A] transition">행사·법회</a></li>
              <li><a href="#gallery" className="hover:text-[#C8953A] transition">갤러리</a></li>
              <li><a href="#visit" className="hover:text-[#C8953A] transition">오시는 길</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-eng text-[10px] tracking-[0.25em] text-white/40 uppercase mb-4">자비 나눔</h4>
            <ul className="space-y-2 font-kor text-[12px]">
              <li><a href="#" className="hover:text-[#C8953A] transition">문수복지재단</a></li>
              <li><a href="#" className="hover:text-[#C8953A] transition">위드아시아</a></li>
              <li><a href="#" className="hover:text-[#C8953A] transition">남구노인복지관</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-eng text-[10px] tracking-[0.25em] text-white/40 uppercase mb-4">연락처</h4>
            <ul className="space-y-2 font-kor text-[12px]">
              <li><a href="tel:051-621-0700" className="hover:text-[#C8953A] transition">📞 051-621-0700</a></li>
              <li>부산광역시 남구 대연동</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-kor text-[11px] text-white/25">© 2025 문수사(文殊寺) · 대한불교조계종 제14교구 범어사 말사</p>
          <p className="font-eng text-[10px] tracking-[0.2em] text-white/20">WISDOM · COMPASSION · COMMUNITY</p>
        </div>
      </footer>
    </div>
  )
}