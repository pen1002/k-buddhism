'use client'
import { useEffect, useRef } from 'react'

// ── Lantern Types ─────────────────────────────────────────────────────────────
interface LanternPalette { body1:string; body2:string; glow:string; cap:string; stripe:string }
interface Lantern {
  w:number; h:number; x:number; y:number; vy:number
  phase:number; swayFreq:number; swayAmp:number
  alpha:number; maxAlpha:number; palette:LanternPalette
  glowPhase:number; glowFreq:number; rot:number
}
const PALETTES: LanternPalette[] = [
  {body1:'#B82200',body2:'#E04020',glow:'220,70,20',cap:'#8A1800',stripe:'#7A1400'},
  {body1:'#A86200',body2:'#D08818',glow:'200,130,20',cap:'#885000',stripe:'#6A3C00'},
  {body1:'#921818',body2:'#C03030',glow:'180,40,20',cap:'#701010',stripe:'#5A0808'},
  {body1:'#9E6C10',body2:'#C8962C',glow:'195,148,30',cap:'#7A5008',stripe:'#5C3A04'},
  {body1:'#7A1C00',body2:'#A83C22',glow:'160,50,20',cap:'#5A1200',stripe:'#480C00'},
]
function makeLantern(W:number,H:number,startOnScreen:boolean):Lantern {
  const w=Math.random()*38+18,h=w*(1.55+Math.random()*0.45)
  return {
    w,h,
    x:Math.random()*W,
    y:startOnScreen?(Math.random()*H*0.9+H*0.05):(H+h*2.5+Math.random()*80),
    vy:-(Math.random()*0.42+0.18),
    phase:Math.random()*Math.PI*2,swayFreq:Math.random()*0.014+0.007,swayAmp:Math.random()*0.9+0.25,
    alpha:startOnScreen?(Math.random()*0.55+0.1):0,maxAlpha:Math.random()*0.48+0.22,
    palette:PALETTES[Math.floor(Math.random()*PALETTES.length)],
    glowPhase:Math.random()*Math.PI*2,glowFreq:Math.random()*0.028+0.012,
    rot:(Math.random()-0.5)*0.06,
  }
}
function drawLantern(ctx:CanvasRenderingContext2D,l:Lantern,x:number,tick:number) {
  const p=l.palette
  const gBright=0.7+0.3*Math.sin(l.glowPhase+tick*l.glowFreq)
  ctx.save(); ctx.globalAlpha=l.alpha
  ctx.translate(x,l.y); ctx.rotate(l.rot*Math.sin(l.phase+tick*l.swayFreq*0.5))
  const grad=ctx.createRadialGradient(0,0,l.w*0.1,0,0,l.w*1.4)
  grad.addColorStop(0,`rgba(${l.palette.glow},${0.18*gBright})`); grad.addColorStop(1,'transparent')
  ctx.fillStyle=grad; ctx.beginPath(); ctx.ellipse(0,0,l.w*1.4,l.h*0.9,0,0,Math.PI*2); ctx.fill()
  const bg=ctx.createLinearGradient(-l.w/2,0,l.w/2,0)
  bg.addColorStop(0,p.body1); bg.addColorStop(0.4,p.body2); bg.addColorStop(1,p.body1)
  ctx.fillStyle=bg; ctx.beginPath(); ctx.ellipse(0,0,l.w/2,l.h/2,0,0,Math.PI*2); ctx.fill()
  ctx.strokeStyle=p.stripe; ctx.lineWidth=1.2; ctx.globalAlpha=l.alpha*0.35
  for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-l.w/2,i*l.h/5);ctx.lineTo(l.w/2,i*l.h/5);ctx.stroke()}
  ctx.globalAlpha=l.alpha
  ctx.fillStyle=p.cap
  ctx.beginPath();ctx.ellipse(0,-l.h/2,l.w*0.38,l.h*0.1,0,0,Math.PI*2);ctx.fill()
  ctx.beginPath();ctx.ellipse(0,l.h/2,l.w*0.28,l.h*0.08,0,0,Math.PI*2);ctx.fill()
  ctx.strokeStyle=p.stripe;ctx.lineWidth=1;ctx.globalAlpha=l.alpha*0.6
  ctx.beginPath();ctx.moveTo(0,l.h/2);ctx.lineTo(0,l.h/2+l.h*0.22);ctx.stroke()
  ctx.restore()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>
interface Props {
  config: Cfg
  temple: { name: string; primaryColor: string; secondaryColor: string }
}

export default function HeroLanternBlock({ config, temple }: Props) {
  const heroRef  = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const heroTitle = config.heroTitle || temple.name
  const heroHanja = config.heroHanja || ''
  const badge     = config.badge || ''
  const heroDesc  = config.heroDesc || ''

  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    if (!canvas || !hero) return

    const isMobile = window.innerWidth < 768
    const initCount = isMobile ? 15 : 30
    const maxCount  = isMobile ? 10 : 18

    let W=0,H=0,lanterns: Lantern[]=[],animId=0,tick=0
    const CTX = canvas.getContext('2d')!

    function resize() {
      W = canvas!.width  = hero!.offsetWidth
      H = canvas!.height = hero!.offsetHeight
    }
    resize()
    for(let i=0;i<initCount;i++) lanterns.push(makeLantern(W,H,true))

    function loop() {
      CTX.clearRect(0,0,W,H); tick++
      lanterns.forEach((l,i)=>{
        l.y+=l.vy; l.x+=l.swayAmp*Math.sin(l.phase+tick*l.swayFreq)
        l.alpha=Math.min(l.alpha+0.003,l.maxAlpha)
        if(l.y<-l.h*3) lanterns[i]=makeLantern(W,H,false)
        drawLantern(CTX,l,l.x,tick)
      })
      if(lanterns.length<initCount+maxCount && tick%90===0) lanterns.push(makeLantern(W,H,false))
      animId=requestAnimationFrame(loop)
    }
    animId=requestAnimationFrame(loop)

    const onResize=()=>resize()
    window.addEventListener('resize',onResize)
    return ()=>{ cancelAnimationFrame(animId); window.removeEventListener('resize',onResize) }
  }, [])

  return (
    <section
      ref={heroRef}
      id="hero"
      style={{ position:'relative',minHeight:'100svh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',
        background:'linear-gradient(180deg,#0d1f2d 0%,#1a3040 50%,#0a1520 100%)'
      }}
    >
      {/* 연등 캔버스 */}
      <canvas
        ref={canvasRef}
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',zIndex:1 }}
      />

      {/* 미묘한 배경 광채 */}
      <div style={{ position:'absolute',inset:0,zIndex:0,
        background:'radial-gradient(ellipse at 50% 40%, rgba(212,169,78,0.08) 0%, transparent 60%)'
      }} />

      {/* 콘텐츠 */}
      <div style={{ position:'relative',zIndex:2,textAlign:'center',color:'#fff',padding:'0 24px',maxWidth:'760px' }}>
        {badge && (
          <div style={{ display:'inline-block',padding:'6px 18px',border:`1px solid ${temple.secondaryColor}`,borderRadius:'24px',fontSize:'0.82rem',color:temple.secondaryColor,marginBottom:'24px',letterSpacing:'0.05em' }}>
            {badge}
          </div>
        )}
        <h1 style={{ fontFamily:'var(--font-serif,serif)',fontSize:'clamp(3rem,10vw,5.5rem)',fontWeight:900,letterSpacing:'0.1em',lineHeight:1.1,margin:'0 0 14px',textShadow:'0 0 40px rgba(212,169,78,0.4),0 2px 16px rgba(0,0,0,0.6)' }}>
          {heroTitle}
        </h1>
        {heroHanja && (
          <div style={{ fontFamily:'var(--font-serif,serif)',fontSize:'clamp(1rem,4vw,1.6rem)',letterSpacing:'0.3em',color:temple.secondaryColor,marginBottom:'16px',opacity:0.85 }}>
            {heroHanja}
          </div>
        )}
        {heroDesc && (
          <p style={{ fontSize:'clamp(0.9rem,2.5vw,1.1rem)',color:'rgba(255,255,255,0.72)',lineHeight:1.7,whiteSpace:'pre-line' }}>
            {heroDesc}
          </p>
        )}
      </div>

      {/* 하단 페이드 그라디언트 */}
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'120px',zIndex:1,
        background:'linear-gradient(to bottom,transparent,rgba(10,21,32,0.8))'
      }} />
    </section>
  )
}
