'use client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>
interface Props {
  config: Cfg
  temple: { name: string; primaryColor: string; secondaryColor: string }
}

export default function HeroLampBlock({ config, temple }: Props) {
  const heroTitle = config.heroTitle || temple.name
  const heroHanja = config.heroHanja || ''
  const badge     = config.badge || ''
  const heroDesc  = config.heroDesc || ''
  const gold      = temple.secondaryColor || '#D4AF37'

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0A0F1E',
      }}
    >
      <style>{`
        @keyframes lamp-fadein   { from { opacity:0; transform:translateX(-50%) scaleY(0); } to { opacity:1; transform:translateX(-50%) scaleY(1); } }
        @keyframes lamp-glow-in  { from { opacity:0; } to { opacity:0.7; } }
        @keyframes lamp-dot      { from { opacity:0; transform:translateX(-50%) scale(0); } to { opacity:1; transform:translateX(-50%) scale(1); } }
        @keyframes lamp-line     { from { opacity:0; } to { opacity:0.35; } }
        @keyframes lamp-floor    { from { opacity:0; } to { opacity:0.6; } }
        @keyframes lamp-content  { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes lamp-badge    { from { opacity:0; } to { opacity:1; } }
        @keyframes lamp-pulse    { 0%,100% { opacity:0.3; transform:translateX(-50%) scale(0.98); } 50% { opacity:0.7; transform:translateX(-50%) scale(1.02); } }
      `}</style>

      {/* ── 상단 빛줄기 ── */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'60%', zIndex:1, pointerEvents:'none' }}>

        {/* 메인 원뿔 광선 */}
        <div style={{
          position:'absolute', top:0, left:'50%',
          transformOrigin:'top center',
          width:'120%', height:'100%',
          background:`conic-gradient(
            from 270deg at 50% 0%,
            transparent 0deg, transparent 155deg,
            ${gold}08 160deg, ${gold}22 168deg,
            #E8F4FF33 172deg,
            ${gold}22 176deg, ${gold}08 184deg,
            transparent 190deg, transparent 360deg
          )`,
          animation: 'lamp-fadein 1.4s cubic-bezier(0.22,1,0.36,1) forwards',
        }} />

        {/* 내부 강한 빛줄기 */}
        <div style={{
          position:'absolute', top:0, left:'50%',
          transform:'translateX(-50%)',
          width:'80%', height:'100%',
          background:`conic-gradient(
            from 270deg at 50% 0%,
            transparent 0deg, transparent 162deg,
            ${gold}11 166deg, #E8F4FF44 170deg,
            ${gold}18 174deg,
            transparent 178deg, transparent 360deg
          )`,
          filter:'blur(2px)',
          opacity: 0,
          animation: 'lamp-glow-in 2s ease-out 0.2s forwards',
        }} />

        {/* 광원 포인트 */}
        <div style={{
          position:'absolute', top:'-6px', left:'50%',
          width:'12px', height:'12px',
          borderRadius:'50%',
          background: gold,
          boxShadow:`0 0 24px 8px ${gold}88, 0 0 60px 20px ${gold}44`,
          opacity: 0,
          animation: 'lamp-dot 0.8s ease-out 0.3s forwards',
        }} />

        {/* 광선 테두리 선 (좌) */}
        <div style={{
          position:'absolute', top:0, left:'50%',
          width:'1px', height:'100%',
          transformOrigin:'top center',
          transform:'translateX(-50%) rotate(-10deg)',
          background:`linear-gradient(to bottom, ${gold}, transparent)`,
          opacity: 0,
          animation: 'lamp-line 1s ease-out 0.5s forwards',
        }} />
        {/* 광선 테두리 선 (우) */}
        <div style={{
          position:'absolute', top:0, left:'50%',
          width:'1px', height:'100%',
          transformOrigin:'top center',
          transform:'translateX(-50%) rotate(10deg)',
          background:`linear-gradient(to bottom, ${gold}, transparent)`,
          opacity: 0,
          animation: 'lamp-line 1s ease-out 0.5s forwards',
        }} />
      </div>

      {/* 미세 파티클 배경 */}
      <div style={{
        position:'absolute', inset:0, zIndex:0, opacity:0.4,
        backgroundImage:'radial-gradient(circle, rgba(212,175,55,0.15) 1px, transparent 1px)',
        backgroundSize:'32px 32px',
      }} />

      {/* 바닥 빛 번짐 */}
      <div style={{
        position:'absolute', bottom:'15%', left:'50%',
        transform:'translateX(-50%)',
        width:'60%', height:'200px',
        background:`radial-gradient(ellipse, ${gold}18 0%, transparent 70%)`,
        filter:'blur(20px)',
        zIndex:1,
        opacity: 0,
        animation: 'lamp-floor 1.5s ease-out 1.2s forwards',
      }} />

      {/* ── 콘텐츠 ── */}
      <div style={{
        position:'relative', zIndex:2,
        textAlign:'center', color:'#fff',
        padding:'0 24px', maxWidth:'700px',
        opacity: 0,
        animation: 'lamp-content 1s ease-out 0.8s forwards',
      }}>
        {badge && (
          <div style={{
            display:'inline-block', padding:'6px 20px',
            border:`1px solid ${gold}88`, borderRadius:'24px',
            fontSize:'0.78rem', color:gold,
            marginBottom:'28px', letterSpacing:'0.12em',
            opacity: 0,
            animation: 'lamp-badge 0.6s ease-out 1.2s forwards',
          }}>
            {badge}
          </div>
        )}

        <h1 style={{
          fontFamily:'var(--font-serif,serif)',
          fontSize:'clamp(3.2rem,10vw,6.5rem)',
          fontWeight:900,
          letterSpacing:'0.1em',
          lineHeight:1,
          margin:'0 0 16px',
          textShadow:`0 0 60px ${gold}55, 0 2px 20px rgba(0,0,0,0.5)`,
          color:'#fff',
        }}>
          {heroTitle}
        </h1>

        {heroHanja && (
          <div style={{
            fontFamily:'var(--font-serif,serif)',
            fontSize:'clamp(1.1rem,4vw,1.8rem)',
            letterSpacing:'0.35em',
            color:gold,
            marginBottom:'20px',
            opacity:0.85,
          }}>
            {heroHanja}
          </div>
        )}

        {heroDesc && (
          <p style={{
            fontSize:'clamp(0.9rem,2.5vw,1.1rem)',
            color:'rgba(255,255,255,0.65)',
            lineHeight:1.75,
            whiteSpace:'pre-line',
          }}>
            {heroDesc}
          </p>
        )}
      </div>

      {/* 펄싱 광명 (반복) */}
      <div style={{
        position:'absolute', top:'5%', left:'50%',
        width:'2px', height:'2px',
        borderRadius:'50%',
        boxShadow:`0 0 80px 40px ${gold}22`,
        zIndex:1, pointerEvents:'none',
        animation: 'lamp-pulse 4s ease-in-out 2s infinite',
      }} />
    </section>
  )
}
