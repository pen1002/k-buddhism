/**
 * ParticleTextEffect.tsx
 * 📁 파일 위치: src/components/particle-text-effect.tsx
 * ⚠️ Astro: client:only="react" 필수
 */

import React, { useRef, useEffect } from 'react';

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

interface Particle {
  x: number; y: number; tx: number; ty: number;
  vx: number; vy: number; size: number; alpha: number;
  settled: boolean; bri: number;
}

const ParticleTextEffect: React.FC<ParticleTextEffectProps> = ({
  text = '보림사',
  particleColor = '#D4AF37',
  shimmerColor = '#FFF8DC',
  height = '280px',
  fontSize = 80,
  maxParticles = 7000,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let running = true;

    const run = () => {
      if (!running) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (animRef.current) cancelAnimationFrame(animRef.current);

      const rect = container.getBoundingClientRect();
      const W = Math.floor(rect.width);
      const H = Math.floor(rect.height);

      if (W < 10 || H < 10) {
        setTimeout(run, 300);
        return;
      }

      // ★ DPR 다시 적용 — 레티나에서 선명하게
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = W < 640;
      const fSize = isMobile ? Math.round(fontSize * 0.55) : fontSize;
      // ★ 선명도 핵심: step을 1(데스크톱) / 2(모바일)로 줄임
      const step = isMobile ? 2 : 1;

      // ── 오프스크린에서 텍스트 픽셀 추출 ──
      const fonts = [
        'bold ' + fSize + 'px "Noto Serif KR", serif',
        'bold ' + fSize + 'px serif',
        'bold ' + fSize + 'px sans-serif',
      ];

      let pixels: Array<{ x: number; y: number }> = [];

      for (const fontStr of fonts) {
        const off = document.createElement('canvas');
        off.width = W;
        off.height = H;
        const oc = off.getContext('2d');
        if (!oc) continue;

        oc.clearRect(0, 0, W, H);
        oc.fillStyle = '#ffffff';
        oc.font = fontStr;
        oc.textAlign = 'center';
        oc.textBaseline = 'middle';
        oc.fillText(text, W / 2, H / 2);

        const imgData = oc.getImageData(0, 0, W, H).data;
        const found: Array<{ x: number; y: number }> = [];

        for (let y = 0; y < H; y += step) {
          for (let x = 0; x < W; x += step) {
            const idx = (y * W + x) * 4;
            if (imgData[idx + 3] > 50 || imgData[idx] > 50) {
              found.push({ x, y });
            }
          }
        }

        if (found.length > pixels.length) {
          pixels = found;
        }
        if (pixels.length > 10) break;
      }

      // ── 최종 폴백: 메인 캔버스에 직접 추출 ──
      if (pixels.length < 10) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${fSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, W / 2, H / 2);

        const mainData = ctx.getImageData(0, 0, W * dpr, H * dpr).data;
        const cw = W * dpr;
        pixels = [];
        const mainStep = isMobile ? 3 : 2;
        for (let y = 0; y < H * dpr; y += mainStep) {
          for (let x = 0; x < W * dpr; x += mainStep) {
            const idx = (y * cw + x) * 4;
            if (mainData[idx + 3] > 50 || mainData[idx] > 50) {
              pixels.push({ x: x / dpr, y: y / dpr });
            }
          }
        }
        ctx.clearRect(0, 0, W, H);
      }

      // 완전 실패 시 텍스트 직접 표시
      if (pixels.length < 1) {
        ctx.fillStyle = '#D4AF37';
        ctx.font = `bold ${fSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, W / 2, H / 2);
        return;
      }

      // ── 파티클 수 제한 (최대 7000) ──
      const limit = Math.min(maxParticles, 7000);
      if (pixels.length > limit) {
        const ratio = limit / pixels.length;
        pixels = pixels.filter(() => Math.random() < ratio);
      }

      // ── 파티클 생성 ──
      const particles: Particle[] = pixels.map((p) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.max(W, H) * 0.6 + Math.random() * 100;
        return {
          x: W / 2 + Math.cos(angle) * radius,
          y: H / 2 + Math.sin(angle) * radius,
          tx: p.x, ty: p.y, vx: 0, vy: 0,
          // ★ 파티클 크기 축소: 1.0~1.8px (고운 모래알)
          size: 1.0 + Math.random() * 0.8,
          alpha: 0, settled: false,
          bri: 0.9 + Math.random() * 0.2,
        };
      });

      const baseRgb = hexToRgb(particleColor);
      const shimRgb = hexToRgb(shimmerColor);
      let allSettled = false;
      let chk = 0;

      // ★ 물리 상수: 느리고 장엄하게 (~5~6초 조립)
      const MAX_SPEED = 2.0;
      const MAX_FORCE = 0.18;
      const ARRIVE_RADIUS = 70;

      // ── 애니메이션 루프 ──
      const animate = () => {
        if (!running) return;
        ctx.clearRect(0, 0, W, H);
        const now = Date.now();
        let unsettled = 0;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!p.settled) {
            const dx = p.tx - p.x, dy = p.ty - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.8) {
              p.x = p.tx; p.y = p.ty; p.vx = 0; p.vy = 0;
              p.settled = true; p.alpha = 1;
            } else {
              const nx = dx / dist, ny = dy / dist;
              const ds = dist < ARRIVE_RADIUS ? MAX_SPEED * (dist / ARRIVE_RADIUS) : MAX_SPEED;
              let sx = nx * ds - p.vx, sy = ny * ds - p.vy;
              const sm = Math.sqrt(sx * sx + sy * sy);
              if (sm > MAX_FORCE) { sx = (sx / sm) * MAX_FORCE; sy = (sy / sm) * MAX_FORCE; }
              p.vx += sx; p.vy += sy;
              const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
              if (spd > MAX_SPEED) { p.vx = (p.vx / spd) * MAX_SPEED; p.vy = (p.vy / spd) * MAX_SPEED; }
              p.x += p.vx; p.y += p.vy;
              p.alpha = Math.min(1, p.alpha + 0.008);
              unsettled++;
            }
          }

          let r: number, g: number, b: number;
          if (p.settled && allSettled) {
            // ★ 금빛 물결 Shimmer
            const wave = Math.sin(now * 0.0008 + p.tx * 0.012);
            const t = ((wave + 1) / 2) * 0.7;
            const bl = lerpColor(baseRgb, shimRgb, t);
            r = Math.min(255, Math.round(bl.r * p.bri));
            g = Math.min(255, Math.round(bl.g * p.bri));
            b = Math.min(255, Math.round(bl.b * p.bri));
          } else {
            r = Math.min(255, Math.round(baseRgb.r * p.bri));
            g = Math.min(255, Math.round(baseRgb.g * p.bri));
            b = Math.min(255, Math.round(baseRgb.b * p.bri));
          }

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        chk++;
        if (!allSettled && chk % 30 === 0 && unsettled === 0) allSettled = true;
        animRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    // ── 폰트 로드 후 실행 ──
    const start = async () => {
      try {
        if (document.fonts?.load) {
          await Promise.race([
            document.fonts.load(`bold ${fontSize}px "Noto Serif KR"`),
            new Promise(r => setTimeout(r, 2000))
          ]);
        }
      } catch (e) { /* 무시 */ }
      setTimeout(run, 300);
    };

    start();

    const onResize = () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setTimeout(run, 300);
    };
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      window.removeEventListener('resize', onResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [text, particleColor, shimmerColor, fontSize, maxParticles, height]);

  return (
    <div ref={containerRef} className={className}
      style={{ position: 'relative', width: '100%', height, overflow: 'hidden', pointerEvents: 'none' }}>
      <canvas ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
    </div>
  );
};

export default ParticleTextEffect;
