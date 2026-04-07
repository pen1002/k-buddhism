'use client'
import { useEffect, useRef } from 'react'

// ── Particle Types ────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number
  tx: number; ty: number
  size: number; maxSpd: number; maxForce: number
  cr: number; cg: number; cb: number
  tcr: number; tcg: number; tcb: number
  cw: number; dead: boolean
}
function makeParticle(): Particle {
  return { x:0,y:0,vx:0,vy:0,tx:0,ty:0,size:2,maxSpd:12,maxForce:0.6,
    cr:212,cg:169,cb:78,tcr:212,tcg:169,tcb:78,cw:0,dead:false }
}
function moveParticle(p: Particle) {
  const dx=p.tx-p.x,dy=p.ty-p.y,dist=Math.sqrt(dx*dx+dy*dy)
  const prox=dist<80?dist/80:1,mag=Math.sqrt(dx*dx+dy*dy)||1
  const sx=(dx/mag)*p.maxSpd*prox-p.vx,sy=(dy/mag)*p.maxSpd*prox-p.vy
  const sm=Math.sqrt(sx*sx+sy*sy)||1
  p.vx+=(sx/sm)*p.maxForce; p.vy+=(sy/sm)*p.maxForce
  p.x+=p.vx; p.y+=p.vy
  if(p.cw<1) p.cw=Math.min(p.cw+0.02,1)
}
function drawParticle(ctx: CanvasRenderingContext2D,p: Particle) {
  const r=Math.round(p.cr+(p.tcr-p.cr)*p.cw)
  const g=Math.round(p.cg+(p.tcg-p.cg)*p.cw)
  const b=Math.round(p.cb+(p.tcb-p.cb)*p.cw)
  ctx.fillStyle=`rgb(${r},${g},${b})`
  ctx.fillRect(p.x,p.y,p.size,p.size)
}
function killParticle(p: Particle,w: number,h: number) {
  if(!p.dead){
    const angle=Math.random()*Math.PI*2,mag=(w+h)/2
    p.tx=w/2+Math.cos(angle)*mag; p.ty=h/2+Math.sin(angle)*mag
    p.tcr=0;p.tcg=0;p.tcb=0
    p.cr+=(p.tcr-p.cr)*p.cw;p.cg+=(p.tcg-p.cg)*p.cw;p.cb+=(p.tcb-p.cb)*p.cw
    p.cw=0;p.dead=true
  }
}
function spawnWord(word: string,canvas: HTMLCanvasElement,particles: Particle[],step: number) {
  const off=document.createElement('canvas')
  off.width=canvas.width; off.height=canvas.height
  const oc=off.getContext('2d')!
  const fontSize=Math.min(canvas.width*0.18,180)
  oc.fillStyle='#fff'
  oc.font=`900 ${fontSize}px "Noto Serif KR",serif`
  oc.textAlign='center'; oc.textBaseline='middle'
  oc.fillText(word,canvas.width/2,canvas.height*0.38)
  const imgData=oc.getImageData(0,0,canvas.width,canvas.height).data
  const colors=[
    {r:212,g:169,b:78},{r:184,g:137,b:62},{r:61,g:146,b:168},
    {r:43,g:107,b:127},{r:240,g:210,b:140}
  ]
  const clr=colors[Math.floor(Math.random()*colors.length)]
  const coords: number[]=[]
  for(let i=0;i<imgData.length;i+=step*4) if(imgData[i+3]>0) coords.push(i)
  for(let i=coords.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [coords[i],coords[j]]=[coords[j],coords[i]]
  }
  let pi=0
  for(const ci of coords){
    const px=(ci/4)%canvas.width,py=Math.floor(ci/4/canvas.width)
    let p: Particle
    if(pi<particles.length){p=particles[pi];p.dead=false;pi++}
    else{
      p=makeParticle()
      const angle=Math.random()*Math.PI*2,mag=(canvas.width+canvas.height)/2
      p.x=canvas.width/2+Math.cos(angle)*mag
      p.y=canvas.height/2+Math.sin(angle)*mag
      p.maxSpd=Math.random()*8+8;p.maxForce=p.maxSpd*0.06
      p.size=Math.random()*2.5+1.5
      particles.push(p)
    }
    p.cr+=(p.tcr-p.cr)*p.cw;p.cg+=(p.tcg-p.cg)*p.cw;p.cb+=(p.tcb-p.cb)*p.cw
    p.tcr=clr.r;p.tcg=clr.g;p.tcb=clr.b;p.cw=0;p.tx=px;p.ty=py
  }
  for(let i=pi;i<particles.length;i++) killParticle(particles[i],canvas.width,canvas.height)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Cfg = Record<string, any>
interface Props {
  config: Cfg
  temple: { name: string; primaryColor: string; secondaryColor: string }
}

export default function HeroParticleBlock({ config, temple }: Props) {
  const heroRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const heroTitle = config.heroTitle || temple.name
  const heroHanja = config.heroHanja || ''
  const badge     = config.badge || ''
  const heroDesc  = config.heroDesc || ''
  const words: string[] = Array.isArray(config.particleWords) ? config.particleWords : [temple.name]

  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    if (!canvas || !hero) return

    // 모바일 감지: 파티클 step 조정
    const isMobile = window.innerWidth < 768
    const step = isMobile ? 8 : 4   // mobile: step=8 (50% reduction), desktop: step=4

    const PCTX = canvas.getContext('2d')!
    let particles: Particle[] = [], active = false
    let animId = 0, frameCount = 0, wordIdx = 0

    function initCanvas() {
      const dpr = window.devicePixelRatio > 1 ? 1.5 : 1
      canvas!.width = hero!.offsetWidth * dpr
      canvas!.height = hero!.offsetHeight * dpr
      canvas!.style.width = '100%'
      canvas!.style.height = '100%'
    }

    function particleLoop() {
      if (!active) return
      PCTX.fillStyle = 'rgba(0,0,0,0.12)'
      PCTX.fillRect(0,0,canvas!.width,canvas!.height)
      for (let i=particles.length-1;i>=0;i--) {
        moveParticle(particles[i])
        drawParticle(PCTX,particles[i])
        if(particles[i].dead){
          const p=particles[i]
          if(p.x<-50||p.x>canvas!.width+50||p.y<-50||p.y>canvas!.height+50) particles.splice(i,1)
        }
      }
      frameCount++
      const stopFrame=300*words.length+180
      if(frameCount%300===0 && wordIdx<words.length-1){
        wordIdx++;spawnWord(words[wordIdx],canvas!,particles,step)
      }
      if(frameCount>=stopFrame){stopLoop();return}
      animId=requestAnimationFrame(particleLoop)
    }

    function stopLoop() {
      active=false; hero?.classList.remove('particle-mode')
      if(animId) cancelAnimationFrame(animId)
      let f=0
      function fadeOut(){
        PCTX.fillStyle='rgba(0,0,0,0.08)'
        PCTX.fillRect(0,0,canvas!.width,canvas!.height)
        if(++f<60) requestAnimationFrame(fadeOut)
        else PCTX.clearRect(0,0,canvas!.width,canvas!.height)
      }
      fadeOut()
    }

    function startLoop() {
      active=true; hero?.classList.add('particle-mode')
      initCanvas(); particles=[]; frameCount=0; wordIdx=0
      spawnWord(words[0],canvas!,particles,step)
      particleLoop()
    }

    const timer = setTimeout(startLoop, 600)
    const onResize = () => { if(active){initCanvas();spawnWord(words[wordIdx],canvas!,particles,step)} }
    window.addEventListener('resize',onResize)
    return () => { clearTimeout(timer);cancelAnimationFrame(animId);window.removeEventListener('resize',onResize) }
  }, [words, temple.name])

  return (
    <section
      ref={heroRef}
      id="hero"
      style={{ position:'relative', minHeight:'100svh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#1a1208' }}
    >
      {/* 배경 그라디언트 */}
      <div style={{ position:'absolute',inset:0, background:`radial-gradient(ellipse at 40% 50%, ${temple.primaryColor}22, #0a0804 70%)` }} />

      {/* 파티클 캔버스 */}
      <canvas
        ref={canvasRef}
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',zIndex:1 }}
      />

      {/* 히어로 콘텐츠 */}
      <div style={{ position:'relative',zIndex:2,textAlign:'center',color:'#fff',padding:'0 24px',maxWidth:'800px' }}>
        {badge && (
          <div style={{ display:'inline-block',padding:'6px 18px',border:`1px solid ${temple.secondaryColor}`,borderRadius:'24px',fontSize:'0.82rem',color:temple.secondaryColor,marginBottom:'24px',letterSpacing:'0.05em' }}>
            {badge}
          </div>
        )}
        <h1 style={{ fontFamily:'var(--font-serif,serif)',fontSize:'clamp(3rem,10vw,6rem)',fontWeight:900,letterSpacing:'0.08em',lineHeight:1.1,margin:'0 0 12px',textShadow:'0 2px 20px rgba(0,0,0,0.6)' }}>
          {heroTitle}
        </h1>
        {heroHanja && (
          <div style={{ fontFamily:'var(--font-serif,serif)',fontSize:'clamp(1rem,4vw,1.6rem)',letterSpacing:'0.3em',color:temple.secondaryColor,marginBottom:'16px',opacity:0.85 }}>
            {heroHanja}
          </div>
        )}
        {heroDesc && (
          <p style={{ fontSize:'clamp(0.9rem,2.5vw,1.1rem)',color:'rgba(255,255,255,0.75)',lineHeight:1.7,whiteSpace:'pre-line' }}>
            {heroDesc}
          </p>
        )}
      </div>
    </section>
  )
}
