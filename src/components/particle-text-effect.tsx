/**
 * ParticleTextEffect.tsx
 * 📁 파일 위치: src/components/particle-text-effect.tsx
 *
 * ⚠️ Astro에서 반드시 client:only="react" 로 호출
 */

import React, { useRef, useEffect, useCallback } from 'react';

export interface ParticleTextEffectProps {
  text?: string;
  particleColor?: string;
  shimmerColor?: string;
  height?: string;
  fontSize?: number;
  maxParticles?: number;
  className?: string;
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function lerpColor(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number
) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function extractTextPixels(
  text: string,
  fontSize: number,
  canvasW: number,
  canvasH: number,
  step: number,
  fontFamily: string
): Array<{ x: number; y: number }> {
  const off = document.createElement('canvas');
  off.width = canvasW;
  off.height = canvasH;
  const c = off.getContext('2d');
  if (!c) return [];
  c.fillStyle = '#fff';
  c.font = `900 ${fontSize}px ${fontFamily}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, canvasW / 2, canvasH / 2);
  const img = c.getImageData(0, 0, canvasW, canvasH);
  const pixels: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < canvasH; y += step) {
    for (let x = 0; x < canvasW; x += step) {
      if (img.data[(y * canvasW + x) * 4 + 3] > 128) {
        pixels.push({ x, y });
      }
    }
  }
  return pixels;
}

interface Particle {
  x: number; y: number; tx: number; ty: number;
  vx: number; vy: number; size: number; alpha: number;
  settled: boolean; brightnessOffset: number;
}

function createParticle(tx: number, ty: number, cw: number, ch: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.max(cw, ch) * 0.6 + Math.random() * 100;
  return {
    x: cw / 2 + Math.cos(angle) * radius,
    y: ch / 2 + Math.sin(angle) * radius,
    tx, ty, vx: 0, vy: 0,
    size: 1.5 + Math.random() * 1.0,
    alpha: 0, settled: false,
    brightnessOffset: 0.9 + Math.random() * 0.2,
  };
}

const ParticleTextEffect: React.FC<ParticleTextEffectProps> = ({
  text = '보림사',
  particleColor = '#D4AF37',
  shimmerColor = '#FFF8DC',
  height = '280px',
  fontSize = 80,
  maxParticles = 6000,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    // 컨테이너가 아직 레이아웃되지 않았으면 재시도
    if (W < 10 || H < 10) {
      setTimeout(() => init(), 200);
      return;
    }

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isMobile = W < 640;
    const scaledFont = isMobile ? fontSize * 0.5 : fontSize;
    const pixelStep = isMobile ? 3 : 2;

    // ★ 폰트 패밀리: Noto Serif KR 우선, 실패 시 시스템 폰트 사용
    const fontFamily = '"Noto Serif KR", "Batang", "Georgia", serif';

    let pixels = extractTextPixels(text, scaledFont, W, H, pixelStep, fontFamily);

    // ★ 픽셀이 너무 적으면 폰트 미로드 — 시스템 폰트로 재시도
    if (pixels.length < 50) {
      pixels = extractTextPixels(text, scaledFont, W, H, pixelStep, '"Batang", "Georgia", serif');
    }

    // 그래도 없으면 sans-serif 최종 폴백
    if (pixels.length < 50) {
      pixels = extractTextPixels(text, scaledFont, W, H, pixelStep, 'sans-serif');
    }

    const limit = Math.min(maxParticles, 7000);
    if (pixels.length > limit) {
      const ratio = limit / pixels.length;
      pixels = pixels.filter(() => Math.random() < ratio);
    }

    const particles: Particle[] = pixels.map((p) => createParticle(p.x, p.y, W, H));
    const baseRgb = hexToRgb(particleColor);
    const shimRgb = hexToRgb(shimmerColor);

    const MAX_SPEED = 3.5;
    const MAX_FORCE = 0.35;
    const ARRIVE_RADIUS = 60;
    let allSettled = false;
    let checkCounter = 0;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const now = Date.now();
      let unsettledCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.settled) {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1.0) {
            p.x = p.tx; p.y = p.ty; p.vx = 0; p.vy = 0;
            p.settled = true; p.alpha = 1;
          } else {
            const nx = dx / dist;
            const ny = dy / dist;
            const ds = dist < ARRIVE_RADIUS ? MAX_SPEED * (dist / ARRIVE_RADIUS) : MAX_SPEED;
            let sx = nx * ds - p.vx;
            let sy = ny * ds - p.vy;
            const sm = Math.sqrt(sx * sx + sy * sy);
            if (sm > MAX_FORCE) { sx = (sx / sm) * MAX_FORCE; sy = (sy / sm) * MAX_FORCE; }
            p.vx += sx; p.vy += sy;
            const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (spd > MAX_SPEED) { p.vx = (p.vx / spd) * MAX_SPEED; p.vy = (p.vy / spd) * MAX_SPEED; }
            p.x += p.vx; p.y += p.vy;
            p.alpha = Math.min(1, p.alpha + 0.012);
            unsettledCount++;
          }
        }

        let r: number, g: number, b: number;
        if (p.settled && allSettled) {
          const wave = Math.sin(now * 0.0008 + p.tx * 0.012);
          const shimmerT = ((wave + 1) / 2) * 0.7;
          const blended = lerpColor(baseRgb, shimRgb, shimmerT);
          r = Math.min(255, Math.round(blended.r * p.brightnessOffset));
          g = Math.min(255, Math.round(blended.g * p.brightnessOffset));
          b = Math.min(255, Math.round(blended.b * p.brightnessOffset));
        } else {
          r = Math.min(255, Math.round(baseRgb.r * p.brightnessOffset));
          g = Math.min(255, Math.round(baseRgb.g * p.brightnessOffset));
          b = Math.min(255, Math.round(baseRgb.b * p.brightnessOffset));
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      checkCounter++;
      if (!allSettled && checkCounter % 30 === 0 && unsettledCount === 0) allSettled = true;
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
  }, [text, particleColor, shimmerColor, fontSize, maxParticles]);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    // ★ 핵심 수정: 명시적으로 폰트 로드 완료를 기다린 후 init
    const loadFontAndInit = async () => {
      try {
        // 1차: 명시적 폰트 로드 요청 (최대 3초 대기)
        if (document.fonts && document.fonts.load) {
          await Promise.race([
            document.fonts.load('900 80px "Noto Serif KR"'),
            new Promise(resolve => setTimeout(resolve, 3000))
          ]);
        }
      } catch (e) {
        // 폰트 로드 실패해도 시스템 폰트 폴백으로 진행
      }
      // 레이아웃 안정화 대기 후 init
      setTimeout(init, 100);
    };

    loadFontAndInit();

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(timer); timer = setTimeout(init, 250); };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [init]);

  return (
    <div ref={containerRef} className={className}
      style={{ position: 'relative', width: '100%', height, overflow: 'hidden', pointerEvents: 'none' }}>
      <canvas ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
    </div>
  );
};

export default ParticleTextEffect;
