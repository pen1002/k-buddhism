import { useState, useEffect, useRef } from "react";
import { ChevronRight, Sparkles, MapPin, ShoppingBag, Star, Moon, Volume2, Smartphone, Calendar, Heart, ExternalLink, Play, Pause } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "temple",
    label: "사찰 네트워크",
    icon: MapPin,
    tagline: "1080 사찰의 문을 열다",
    desc: "산속 깊은 곳, 대중과의 소통을 위해 1080개 사찰의 디지털 인연을 잇습니다.",
    accent: "from-amber-400 to-yellow-200",
    accentSolid: "#fbbf24",
    links: [
      { name: "부산 문수사", url: "https://pen1002.github.io/munsu/", live: true },
      { name: "장흥 천관사", url: "https://k-buddhism.vercel.app/chunkwansa", live: true },
      { name: "장흥 보림사", url: "https://k-buddhism.vercel.app/borimsa", live: true },
      { name: "더 많은 사찰 →", url: "#", live: false },
    ],
  },
  {
    id: "goods",
    label: "불교굿즈",
    icon: ShoppingBag,
    tagline: "마음을 담은 공양물",
    desc: "엄선된 불교 용품과 굿즈를 합리적인 가격에 만나보세요. 안전한 결제를 지원합니다.",
    accent: "from-emerald-400 to-teal-200",
    accentSolid: "#34d399",
    links: [
      { name: "불교굿즈 쇼핑몰", url: "#", live: false },
      { name: "네이버페이 결제", url: "#", live: false },
      { name: "카카오페이 결제", url: "#", live: false },
      { name: "토스페이 결제", url: "#", live: false },
    ],
  },
  {
    id: "apps",
    label: "운명 분석 앱",
    icon: Sparkles,
    tagline: "AI가 읽는 당신의 운명",
    desc: "사주·타로·별자리 분석부터 건강관리까지, 실생활에 유용한 앱 컬렉션입니다.",
    accent: "from-violet-400 to-purple-200",
    accentSolid: "#a78bfa",
    features: ["월령(月令) 분석", "TTS 음성 읽어주기", "모바일 UI 최적화"],
    links: [
      { name: "사주 분석 앱", url: "https://saju-cyan.vercel.app", live: true },
      { name: "별자리 운명의 그물", url: "https://star-fate.vercel.app", live: true },
      { name: "타로 앱", url: "#", live: false },
      { name: "당뇨퇴치 앱", url: "https://diabetes108.vercel.app", live: true },
    ],
  },
];

const PAYMENT_METHODS = [
  { name: "계좌이체", icon: "🏦" },
  { name: "네이버페이", icon: "💚" },
  { name: "카카오페이", icon: "💛" },
  { name: "토스페이", icon: "💙" },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Spotlight Effect ────────────────────────────────────────────────────────
function Spotlight({ activeService }) {
  const colors = {
    temple: "rgba(251, 191, 36, 0.08)",
    goods: "rgba(52, 211, 153, 0.08)",
    apps: "rgba(167, 139, 250, 0.08)",
  };
  return (
    <div
      className="spotlight-glow"
      style={{
        background: `radial-gradient(ellipse 800px 600px at 30% 20%, ${colors[activeService]}, transparent 70%)`,
        transition: "background 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    />
  );
}

// ─── Moon Phase SVG ──────────────────────────────────────────────────────────
function MoonPhase({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="moon-svg">
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="moonBlur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#moonGlow)" />
      <circle cx="60" cy="60" r="40" fill="rgba(255,255,255,0.06)" filter="url(#moonBlur)" />
      <circle cx="60" cy="60" r="28" fill="rgba(255,255,255,0.04)" />
      <text x="60" y="64" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="serif">
        月
      </text>
    </svg>
  );
}

// ─── Floating Particles ──────────────────────────────────────────────────────
function Particles({ color }) {
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6,
    }))
  ).current;

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Service Tab Navigation ──────────────────────────────────────────────────
function ServiceNav({ active, onChange }) {
  return (
    <div className="service-nav">
      {SERVICES.map((s) => {
        const Icon = s.icon;
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={cn("service-nav-btn", isActive && "active")}
            style={isActive ? { borderColor: s.accentSolid + "60" } : {}}
          >
            <Icon size={16} style={isActive ? { color: s.accentSolid } : {}} />
            <span>{s.label}</span>
            {isActive && (
              <div className="nav-indicator" style={{ backgroundColor: s.accentSolid }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Link Card ───────────────────────────────────────────────────────────────
function LinkCard({ link, accentColor }) {
  return (
    <a
      href={link.url}
      target={link.live ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={cn("link-card", !link.live && "coming-soon")}
      style={{ "--card-accent": accentColor }}
    >
      <span className="link-name">{link.name}</span>
      {link.live ? (
        <span className="link-badge live">
          <span className="live-dot" /> LIVE
        </span>
      ) : (
        <span className="link-badge soon">준비중</span>
      )}
      <ExternalLink size={12} className="link-arrow" />
    </a>
  );
}

// ─── Feature Chips ───────────────────────────────────────────────────────────
function FeatureChips({ features, color }) {
  const icons = {
    "월령(月令) 분석": <Calendar size={13} />,
    "TTS 음성 읽어주기": <Volume2 size={13} />,
    "모바일 UI 최적화": <Smartphone size={13} />,
  };
  return (
    <div className="feature-chips">
      {features.map((f) => (
        <div key={f} className="feature-chip" style={{ borderColor: color + "40" }}>
          <span style={{ color }}>{icons[f]}</span>
          <span>{f}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stats Bar ───────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-number"><AnimatedNumber target={1080} suffix="+" /></span>
        <span className="stat-label">목표 사찰</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-number"><AnimatedNumber target={4} suffix="개" /></span>
        <span className="stat-label">운영 중 앱</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-number">24/7</span>
        <span className="stat-label">AI 상담</span>
      </div>
    </div>
  );
}

// ─── 3D Model with Mouse-Follow Tilt ─────────────────────────────────────────
function Model3D({ onLoad, loaded }) {
  const containerRef = useRef(null);
  const tiltRef = useRef(null);
  const rafRef = useRef(null);
  const currentTilt = useRef({ x: 0, y: 0 });
  const targetTilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Normalize to -1 ~ 1 range, then scale to degrees
      const maxTilt = 12;
      targetTilt.current = {
        x: -(mouseY / (rect.height / 2)) * maxTilt,
        y: (mouseX / (rect.width / 2)) * maxTilt,
      };
    };

    const handleMouseLeave = () => {
      targetTilt.current = { x: 0, y: 0 };
    };

    // Smooth animation loop
    const animate = () => {
      const lerp = 0.08;
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * lerp;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * lerp;

      if (tiltRef.current) {
        tiltRef.current.style.transform = `perspective(1000px) rotateX(${currentTilt.current.x}deg) rotateY(${currentTilt.current.y}deg)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="right-panel" ref={containerRef}>
      {/* Glow effect that follows tilt */}
      <div className="model-glow" />
      <div className="model-tilt-wrapper" ref={tiltRef}>
        <div className="model-wrapper">
          <iframe
            title="금동미륵보살반가사유상 - 국보 제83호"
            src="https://sketchfab.com/models/2d37bf970e5143d59f0cdfad2c7fd691/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_controls=1&ui_stop=0&ui_watermark=0&ui_watermark_link=0"
            className="model-iframe"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            onLoad={onLoad}
          />
          <div className={cn("model-loader", loaded && "hidden")}>
            <div className="loader-ring" />
            <div className="loader-text">반가사유상 로딩 중...</div>
          </div>
        </div>
      </div>
      {/* Reflection line */}
      <div className="model-reflection" />
    </div>
  );
}

// ─── Main Hero Component ─────────────────────────────────────────────────────
export default function KBuddhismHero() {
  const [activeService, setActiveService] = useState("temple");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const currentService = SERVICES.find((s) => s.id === activeService);

  return (
    <div className="hero-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&family=Nanum+Myeongjo:wght@400;700;800&family=IBM+Plex+Sans+KR:wght@300;400;500;600&display=swap');

        :root {
          --font-display: 'Nanum Myeongjo', serif;
          --font-body: 'IBM Plex Sans KR', sans-serif;
          --font-accent: 'Noto Serif KR', serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .hero-root {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #000;
          overflow: hidden;
          font-family: var(--font-body);
          color: #fff;
        }

        .bg-grid {
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .bg-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%);
          pointer-events: none;
        }

        .spotlight-glow {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 1;
        }

        .particles-container {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 1;
        }

        .particle {
          position: absolute; border-radius: 50%; opacity: 0;
          animation: particleFloat linear infinite;
        }

        @keyframes particleFloat {
          0% { opacity: 0; transform: translateY(0) scale(0); }
          20% { opacity: 0.6; transform: translateY(-20px) scale(1); }
          80% { opacity: 0.3; transform: translateY(-80px) scale(0.5); }
          100% { opacity: 0; transform: translateY(-120px) scale(0); }
        }

        .moon-svg {
          position: absolute; top: 30px; right: 60px;
          opacity: 0.4; z-index: 2;
          animation: moonPulse 6s ease-in-out infinite;
        }

        @keyframes moonPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        .hero-content {
          position: relative; z-index: 10;
          display: flex; flex-direction: column;
          min-height: 100vh; padding: 20px;
        }

        /* ── Top Bar ── */
        .top-bar {
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 16px 0; margin-bottom: 8px;
        }
        .brand { display: flex; align-items: center; gap: 10px; }
        .brand-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }
        .brand-text {
          font-family: var(--font-display);
          font-size: 20px; font-weight: 800; letter-spacing: -0.5px;
        }
        .brand-sub {
          font-size: 10px; color: rgba(255,255,255,0.4);
          font-family: var(--font-body); font-weight: 300;
          letter-spacing: 2px; text-transform: uppercase;
        }

        /* ── Service Nav ── */
        .service-nav {
          display: flex; gap: 4px; padding: 4px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);
          margin: 0 auto 24px; width: fit-content;
        }
        .service-nav-btn {
          position: relative; display: flex; align-items: center; gap: 6px;
          padding: 10px 18px; border-radius: 12px;
          border: 1px solid transparent; background: transparent;
          color: rgba(255,255,255,0.45); font-family: var(--font-body);
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap;
        }
        .service-nav-btn:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.04); }
        .service-nav-btn.active { color: #fff; background: rgba(255,255,255,0.08); }
        .nav-indicator {
          position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
          width: 16px; height: 2px; border-radius: 1px; transition: all 0.3s ease;
        }

        /* ── Main Grid ── */
        .main-area {
          flex: 1; display: grid; grid-template-columns: 1fr;
          gap: 24px; align-items: center;
        }
        @media (min-width: 768px) {
          .main-area { grid-template-columns: 1fr 1fr; gap: 40px; }
        }

        /* ── Left Panel ── */
        .left-panel { display: flex; flex-direction: column; gap: 24px; }
        .hero-tagline {
          font-family: var(--font-display);
          font-size: clamp(28px, 5vw, 52px); font-weight: 900;
          line-height: 1.2; letter-spacing: -1px;
          animation: fadeSlideUp 0.8s ease-out;
        }
        .gradient-text {
          background-clip: text; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          font-size: 15px; line-height: 1.75; color: rgba(255,255,255,0.55);
          max-width: 480px; animation: fadeSlideUp 0.8s ease-out 0.1s both;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Feature Chips ── */
        .feature-chips {
          display: flex; flex-wrap: wrap; gap: 8px;
          animation: fadeSlideUp 0.8s ease-out 0.15s both;
        }
        .feature-chip {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 20px; border: 1px solid;
          background: rgba(255,255,255,0.03); font-size: 12px;
          color: rgba(255,255,255,0.7); backdrop-filter: blur(8px);
        }

        /* ── Links Grid ── */
        .links-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
          animation: fadeSlideUp 0.8s ease-out 0.2s both;
        }
        .link-card {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 14px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03); text-decoration: none;
          color: rgba(255,255,255,0.75); font-size: 13px;
          transition: all 0.3s ease; cursor: pointer;
        }
        .link-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: var(--card-accent, rgba(255,255,255,0.15));
          transform: translateY(-1px);
        }
        .link-card.coming-soon { opacity: 0.5; cursor: default; }
        .link-name { flex: 1; font-weight: 500; }
        .link-badge {
          font-size: 9px; font-weight: 600; padding: 2px 6px;
          border-radius: 4px; letter-spacing: 0.5px;
        }
        .link-badge.live {
          background: rgba(52, 211, 153, 0.15); color: #34d399;
          display: flex; align-items: center; gap: 4px;
        }
        .live-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #34d399;
          animation: blink 1.5s infinite;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .link-badge.soon { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); }
        .link-arrow { opacity: 0.3; transition: opacity 0.3s; }
        .link-card:hover .link-arrow { opacity: 0.8; }

        /* ── Right Panel: 3D Model with Mouse-Follow ── */
        .right-panel {
          position: relative; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 450px; cursor: grab;
        }
        @media (min-width: 768px) {
          .right-panel { min-height: 600px; }
        }

        .model-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 80%; height: 70%;
          background: radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
          animation: glowPulse 4s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
        }

        .model-tilt-wrapper {
          position: relative; width: 100%; height: 100%;
          min-height: 450px; z-index: 1;
          transition: transform 0.05s linear;
          transform-style: preserve-3d;
          will-change: transform;
        }
        @media (min-width: 768px) {
          .model-tilt-wrapper { min-height: 600px; }
        }

        .model-wrapper {
          position: relative; width: 100%; height: 100%;
          min-height: 450px; border-radius: 20px; overflow: hidden;
          box-shadow: 0 0 60px rgba(251,191,36,0.05), 0 0 120px rgba(251,191,36,0.02);
        }
        @media (min-width: 768px) {
          .model-wrapper { min-height: 600px; }
        }

        .model-iframe {
          width: 100%; height: 100%; min-height: 450px;
          border: none; border-radius: 20px;
        }
        @media (min-width: 768px) {
          .model-iframe { min-height: 600px; }
        }

        .model-loader {
          position: absolute; inset: 0; display: flex;
          flex-direction: column; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
          border-radius: 20px; gap: 12px; transition: opacity 0.5s ease;
        }
        .model-loader.hidden { opacity: 0; pointer-events: none; }
        .loader-ring {
          width: 40px; height: 40px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: rgba(255,255,255,0.6);
          border-radius: 50%; animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loader-text { font-size: 12px; color: rgba(255,255,255,0.4); letter-spacing: 1px; }

        .model-reflection {
          width: 60%; height: 1px; margin-top: 12px;
          background: linear-gradient(90deg, transparent, rgba(251,191,36,0.2), transparent);
          z-index: 1;
        }

        /* ── Stats ── */
        .stats-bar {
          display: flex; align-items: center; justify-content: center;
          gap: 24px; padding: 20px 0; margin-top: auto;
          animation: fadeSlideUp 0.8s ease-out 0.3s both;
        }
        .stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .stat-number {
          font-family: var(--font-display); font-size: 22px;
          font-weight: 800; color: rgba(255,255,255,0.9);
        }
        .stat-label { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1px; }
        .stat-divider { width: 1px; height: 30px; background: rgba(255,255,255,0.08); }

        .credit-line {
          text-align: center; font-size: 10px;
          color: rgba(255,255,255,0.2); padding: 4px 0;
        }

        .payment-strip {
          display: flex; align-items: center; justify-content: center;
          gap: 16px; padding: 16px 0;
          border-top: 1px solid rgba(255,255,255,0.04);
          animation: fadeSlideUp 0.8s ease-out 0.35s both;
        }
        .payment-label { font-size: 11px; color: rgba(255,255,255,0.25); letter-spacing: 1px; }
        .payment-icons { display: flex; gap: 10px; }
        .payment-icon {
          display: flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 6px;
          background: rgba(255,255,255,0.04); font-size: 11px;
          color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.04);
        }

        .deco-hanzi {
          position: absolute; font-family: var(--font-accent);
          font-size: 200px; font-weight: 900; color: rgba(255,255,255,0.015);
          pointer-events: none; user-select: none; z-index: 0; line-height: 1;
        }
        .deco-hanzi.left { bottom: 5%; left: -2%; }
        .deco-hanzi.right { top: 10%; right: -3%; }

        /* ── Mobile ── */
        @media (max-width: 767px) {
          .hero-content { padding: 12px; }
          .service-nav { gap: 2px; padding: 3px; }
          .service-nav-btn { padding: 8px 12px; font-size: 11px; }
          .links-grid { grid-template-columns: 1fr; }
          .moon-svg { top: 10px; right: 20px; width: 60px; height: 60px; }
          .stats-bar { gap: 16px; }
          .stat-number { font-size: 18px; }
          .payment-icons { flex-wrap: wrap; justify-content: center; }
          .deco-hanzi { font-size: 120px; }
          .brand-text { font-size: 17px; }
          .right-panel { order: -1; min-height: 320px; }
          .model-tilt-wrapper { min-height: 320px; }
          .model-wrapper { min-height: 320px; }
          .model-iframe { min-height: 320px; }
        }
      `}</style>

      {/* Background layers */}
      <div className="bg-grid" />
      <div className="bg-vignette" />
      <Spotlight activeService={activeService} />
      <Particles color={currentService.accentSolid} />
      <div className="deco-hanzi left">禪</div>
      <div className="deco-hanzi right">佛</div>
      {!isMobile && <MoonPhase />}

      <div className="hero-content">
        <header className="top-bar">
          <div className="brand">
            <div className="brand-icon">☸</div>
            <div>
              <div className="brand-text">K-Buddhism</div>
              <div className="brand-sub">한국 사찰 통합 플랫폼</div>
            </div>
          </div>
        </header>

        <ServiceNav active={activeService} onChange={setActiveService} />

        <div className="main-area">
          <div className="left-panel" key={activeService}>
            <h1 className="hero-tagline">
              <span
                className="gradient-text"
                style={{ backgroundImage: `linear-gradient(135deg, ${currentService.accentSolid}, #fff)` }}
              >
                {currentService.tagline}
              </span>
            </h1>
            <p className="hero-desc">{currentService.desc}</p>
            {currentService.features && (
              <FeatureChips features={currentService.features} color={currentService.accentSolid} />
            )}
            <div className="links-grid">
              {currentService.links.map((link) => (
                <LinkCard key={link.name} link={link} accentColor={currentService.accentSolid} />
              ))}
            </div>
          </div>

          <Model3D onLoad={() => setModelLoaded(true)} loaded={modelLoaded} />
        </div>

        <StatsBar />
        <div className="credit-line">
          3D 모델 출처: 국립중앙박물관 | 국보 제83호 금동미륵보살반가사유상
        </div>
        <div className="payment-strip">
          <span className="payment-label">결제수단</span>
          <div className="payment-icons">
            {PAYMENT_METHODS.map((pm) => (
              <div key={pm.name} className="payment-icon">
                <span>{pm.icon}</span>
                <span>{pm.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
