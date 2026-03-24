'use client'
import { useEffect } from 'react'

/* ── Particle Types ── */
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
  const dx = p.tx - p.x, dy = p.ty - p.y
  const dist = Math.sqrt(dx*dx + dy*dy)
  const prox = dist < 80 ? dist/80 : 1
  const mag = Math.sqrt(dx*dx + dy*dy) || 1
  const sx = (dx/mag)*p.maxSpd*prox - p.vx
  const sy = (dy/mag)*p.maxSpd*prox - p.vy
  const sm = Math.sqrt(sx*sx + sy*sy) || 1
  p.vx += (sx/sm)*p.maxForce; p.vy += (sy/sm)*p.maxForce
  p.x += p.vx; p.y += p.vy
  if(p.cw < 1) p.cw = Math.min(p.cw+0.02, 1)
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const r = Math.round(p.cr + (p.tcr - p.cr)*p.cw)
  const g = Math.round(p.cg + (p.tcg - p.cg)*p.cw)
  const b = Math.round(p.cb + (p.tcb - p.cb)*p.cw)
  ctx.fillStyle = `rgb(${r},${g},${b})`
  ctx.fillRect(p.x, p.y, p.size, p.size)
}

function killParticle(p: Particle, w: number, h: number) {
  if(!p.dead) {
    const angle = Math.random()*Math.PI*2, mag = (w+h)/2
    p.tx = w/2 + Math.cos(angle)*mag; p.ty = h/2 + Math.sin(angle)*mag
    p.tcr=0; p.tcg=0; p.tcb=0
    p.cr += (p.tcr-p.cr)*p.cw; p.cg += (p.tcg-p.cg)*p.cw; p.cb += (p.tcb-p.cb)*p.cw
    p.cw=0; p.dead=true
  }
}

function spawnWord(word: string, canvas: HTMLCanvasElement, particles: Particle[]) {
  const off = document.createElement('canvas')
  off.width = canvas.width; off.height = canvas.height
  const oc = off.getContext('2d')!
  const fontSize = Math.min(canvas.width*0.18, 180)
  oc.fillStyle = '#fff'
  oc.font = `900 ${fontSize}px "Noto Serif KR",serif`
  oc.textAlign = 'center'; oc.textBaseline = 'middle'
  oc.fillText(word, canvas.width/2, canvas.height*0.38)
  const imgData = oc.getImageData(0,0,canvas.width,canvas.height).data
  const step = 4
  const colors = [
    {r:212,g:169,b:78},{r:184,g:137,b:62},{r:61,g:146,b:168},
    {r:43,g:107,b:127},{r:240,g:210,b:140}
  ]
  const clr = colors[Math.floor(Math.random()*colors.length)]
  const coords: number[] = []
  for(let i=0; i<imgData.length; i+=step*4) if(imgData[i+3]>0) coords.push(i)
  for(let i=coords.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [coords[i],coords[j]] = [coords[j],coords[i]]
  }
  let pi = 0
  for(const ci of coords) {
    const px = (ci/4) % canvas.width
    const py = Math.floor(ci/4/canvas.width)
    let p: Particle
    if(pi < particles.length) { p=particles[pi]; p.dead=false; pi++ }
    else {
      p = makeParticle()
      const angle = Math.random()*Math.PI*2, mag = (canvas.width+canvas.height)/2
      p.x = canvas.width/2 + Math.cos(angle)*mag
      p.y = canvas.height/2 + Math.sin(angle)*mag
      p.maxSpd = Math.random()*8+8; p.maxForce = p.maxSpd*0.06
      p.size = Math.random()*2.5+1.5
      particles.push(p)
    }
    p.cr += (p.tcr-p.cr)*p.cw; p.cg += (p.tcg-p.cg)*p.cw; p.cb += (p.tcb-p.cb)*p.cw
    p.tcr=clr.r; p.tcg=clr.g; p.tcb=clr.b; p.cw=0; p.tx=px; p.ty=py
  }
  for(let i=pi; i<particles.length; i++) killParticle(particles[i], canvas.width, canvas.height)
}

/* ── Lantern Types ── */
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
function makeLantern(W: number, H: number, startOnScreen: boolean): Lantern {
  const w = Math.random()*38+18, h = w*(1.55+Math.random()*0.45)
  return {
    w, h,
    x: Math.random()*W,
    y: startOnScreen ? (Math.random()*H*0.9+H*0.05) : (H+h*2.5+Math.random()*80),
    vy: -(Math.random()*0.42+0.18),
    phase: Math.random()*Math.PI*2, swayFreq: Math.random()*0.014+0.007, swayAmp: Math.random()*0.9+0.25,
    alpha: startOnScreen ? (Math.random()*0.55+0.1) : 0, maxAlpha: Math.random()*0.48+0.22,
    palette: PALETTES[Math.floor(Math.random()*PALETTES.length)],
    glowPhase: Math.random()*Math.PI*2, glowFreq: Math.random()*0.028+0.012,
    rot: (Math.random()-0.5)*0.06,
  }
}
function drawLantern(ctx: CanvasRenderingContext2D, l: Lantern, x: number, tick: number) {
  const p = l.palette
  const gBright = 0.7 + 0.3*Math.sin(l.glowPhase + tick*l.glowFreq)
  ctx.save(); ctx.globalAlpha = l.alpha
  ctx.translate(x, l.y); ctx.rotate(l.rot*Math.sin(l.phase + tick*l.swayFreq*0.5))
  // glow
  const grad = ctx.createRadialGradient(0,0,l.w*0.1,0,0,l.w*1.4)
  grad.addColorStop(0,`rgba(${l.palette.glow},${0.18*gBright})`)
  grad.addColorStop(1,'transparent')
  ctx.fillStyle=grad; ctx.beginPath(); ctx.ellipse(0,0,l.w*1.4,l.h*0.9,0,0,Math.PI*2); ctx.fill()
  // body
  const bg = ctx.createLinearGradient(-l.w/2,0,l.w/2,0)
  bg.addColorStop(0,p.body1); bg.addColorStop(0.4,p.body2); bg.addColorStop(1,p.body1)
  ctx.fillStyle=bg; ctx.beginPath(); ctx.ellipse(0,0,l.w/2,l.h/2,0,0,Math.PI*2); ctx.fill()
  // stripes
  ctx.strokeStyle=p.stripe; ctx.lineWidth=1.2; ctx.globalAlpha=l.alpha*0.35
  for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-l.w/2,i*l.h/5);ctx.lineTo(l.w/2,i*l.h/5);ctx.stroke()}
  ctx.globalAlpha=l.alpha
  // cap/base
  ctx.fillStyle=p.cap
  ctx.beginPath();ctx.ellipse(0,-l.h/2,l.w*0.38,l.h*0.1,0,0,Math.PI*2);ctx.fill()
  ctx.beginPath();ctx.ellipse(0,l.h/2,l.w*0.28,l.h*0.08,0,0,Math.PI*2);ctx.fill()
  // tassel
  ctx.strokeStyle=p.stripe;ctx.lineWidth=1;ctx.globalAlpha=l.alpha*0.6
  ctx.beginPath();ctx.moveTo(0,l.h/2);ctx.lineTo(0,l.h/2+l.h*0.22);ctx.stroke()
  ctx.restore()
}

export default function HeroCanvas({ words }: { words?: string[] }) {
  useEffect(() => {
    const hero = document.getElementById('hero')
    const particleCanvas = document.getElementById('particleCanvas') as HTMLCanvasElement|null
    const lanternCanvas = document.getElementById('lanternCanvas') as HTMLCanvasElement|null
    if(!particleCanvas || !lanternCanvas || !hero) return

    // ── Lantern engine ──
    let W = 0, H = 0, lanterns: Lantern[] = [], lanternAnimId = 0, tick = 0
    const CTX = lanternCanvas.getContext('2d')!

    function resizeLantern() {
      W = lanternCanvas!.width = hero!.offsetWidth
      H = lanternCanvas!.height = hero!.offsetHeight
    }
    resizeLantern()
    for(let i=0; i<14; i++) lanterns.push(makeLantern(W, H, true))

    function lanternLoop() {
      CTX.clearRect(0,0,W,H)
      tick++
      lanterns.forEach((l,i) => {
        l.y += l.vy; l.x += l.swayAmp*Math.sin(l.phase + tick*l.swayFreq)
        l.alpha = Math.min(l.alpha+0.003, l.maxAlpha)
        if(l.y < -l.h*3) lanterns[i] = makeLantern(W, H, false)
        drawLantern(CTX, l, l.x, tick)
      })
      if(lanterns.length < 18 && tick % 90 === 0) lanterns.push(makeLantern(W, H, false))
      lanternAnimId = requestAnimationFrame(lanternLoop)
    }
    lanternAnimId = requestAnimationFrame(lanternLoop)

    // ── Particle engine ──
    const PCTX = particleCanvas.getContext('2d')!
    let particles: Particle[] = [], particleActive = false
    let particleAnimId2 = 0, particleFrameCount = 0, particleWordIdx = 0
    const particleWords = (words && words.length > 0) ? words : ['☸']

    function initParticleCanvas() {
      const dpr = window.devicePixelRatio > 1 ? 1.5 : 1
      particleCanvas!.width = hero!.offsetWidth * dpr
      particleCanvas!.height = hero!.offsetHeight * dpr
      particleCanvas!.style.width = '100%'
      particleCanvas!.style.height = '100%'
    }

    function particleLoop() {
      if(!particleActive) return
      PCTX.fillStyle = 'rgba(0,0,0,0.12)'
      PCTX.fillRect(0,0,particleCanvas!.width,particleCanvas!.height)
      for(let i=particles.length-1; i>=0; i--) {
        moveParticle(particles[i])
        drawParticle(PCTX, particles[i])
        if(particles[i].dead) {
          const p = particles[i]
          if(p.x < -50 || p.x > particleCanvas!.width+50 || p.y < -50 || p.y > particleCanvas!.height+50)
            particles.splice(i,1)
        }
      }
      particleFrameCount++
      const stopFrame = 300*particleWords.length + 180
      if(particleFrameCount % 300 === 0 && particleWordIdx < particleWords.length-1) {
        particleWordIdx++
        spawnWord(particleWords[particleWordIdx], particleCanvas!, particles)
      }
      if(particleFrameCount >= stopFrame) {
        stopParticleHero(); return
      }
      particleAnimId2 = requestAnimationFrame(particleLoop)
    }

    function stopParticleHero() {
      particleActive = false
      hero?.classList.remove('particle-mode')
      if(particleAnimId2) cancelAnimationFrame(particleAnimId2)
      let fadeFrame = 0
      function fadeOut() {
        PCTX.fillStyle = 'rgba(0,0,0,0.08)'
        PCTX.fillRect(0,0,particleCanvas!.width,particleCanvas!.height)
        fadeFrame++
        if(fadeFrame < 60) requestAnimationFrame(fadeOut)
        else PCTX.clearRect(0,0,particleCanvas!.width,particleCanvas!.height)
      }
      fadeOut()
    }

    function startParticleHero() {
      particleActive = true
      hero?.classList.add('particle-mode')
      initParticleCanvas()
      particles = []; particleFrameCount = 0; particleWordIdx = 0
      spawnWord(particleWords[0], particleCanvas!, particles)
      particleLoop()
    }

    const timer = setTimeout(startParticleHero, 600)

    const handleResize = () => {
      resizeLantern()
      if(particleActive) { initParticleCanvas(); spawnWord(particleWords[particleWordIdx], particleCanvas!, particles) }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(lanternAnimId)
      if(particleAnimId2) cancelAnimationFrame(particleAnimId2)
      window.removeEventListener('resize', handleResize)
    }
  }, [words])

  return null  // canvas elements are in the server-rendered HTML
}
