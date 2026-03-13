# K-Buddhism · 한국 사찰 홈페이지 허브

> 전국 1080 사찰 온라인 서비스 플랫폼 — Astro 기반 멀티 사찰 웹사이트

🌐 **라이브**: [k-buddhism.vercel.app](https://k-buddhism.vercel.app)

---

## 📌 프로젝트 개요

한국 불교 사찰을 위한 홈페이지 제작 및 온라인 서비스 플랫폼입니다.  
각 사찰의 특성에 맞는 UI 템플릿을 제공하고, 인등불사·템플스테이·법회안내 등  
실질적인 온라인 서비스를 통합 제공합니다.

---

## 🏯 현재 등록 사찰

| 사찰 | 종단 | 유형 | URL |
|------|------|------|-----|
| 천관사 (天冠寺) | 조계종 | T1 (직접 HTML) | /chunkwansa |
| 선운사 (禪雲寺) | 조계종 | T2 | /seonunsa |
| 불국사 (佛國寺) | 조계종 | T3 | /bulguksa |
| 해인사 (海印寺) | 조계종 | T4 | /haeinsa |
| 조계사 (曹溪寺) | 조계종 | T5 | /jogyesa |
| 보림사 (寶林寺) | 조계종 | T4 | /borimsa |
| 문수사 (文殊寺) | 조계종 | T5 | /munsusa |
| 선암사 (仙巖寺) | 태고종 | 커스텀 | /seonamsa |

---

## 🛠 기술 스택

- **Framework**: [Astro](https://astro.build) v4
- **배포**: [Vercel](https://vercel.com)
- **스타일**: 단청(丹靑) 컬러 시스템 · Noto Serif KR
- **이미지**: Cloudinary CDN
- **결제**: 카카오페이 · 네이버페이 · 토스 (예정)

---

## 📁 프로젝트 구조
```
k-buddhism/
├── src/
│   ├── pages/
│   │   ├── index.astro          # 메인 허브
│   │   ├── [slug].astro         # 템플릿 라우터
│   │   └── chunkwansa.html      # 천관사 독립 페이지
│   ├── layouts/
│   │   ├── TemplateLayout.astro # 공통 템플릿
│   │   └── CustomLayout.astro   # 커스텀 레이아웃
│   └── content/
│       └── temples/             # 각 사찰 데이터 (.md)
├── public/
└── astro.config.mjs
```

---

## 🚀 로컬 개발
```bash
npm install
npm run dev
```

---

## 📦 배포
```bash
git add .
git commit -m "feat: 수정내용"
git push origin main
```
→ Vercel 자동 배포

---

## 📞 문의

- 개발: K-Buddhism Hub
- © 2025 K-Buddhism. All rights reserved.