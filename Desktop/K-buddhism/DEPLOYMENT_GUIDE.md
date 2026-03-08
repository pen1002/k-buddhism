# Temple Hub · 1080 사찰 배포 운영 가이드

> **1인 운영자를 위한 완전 자동화 워크플로우**  
> 새 사찰 추가 → 커밋 한 번 → Vercel 자동 배포

---

## 📐 프로젝트 아키텍처

```
temple-hub/
├── src/
│   ├── content/
│   │   ├── config.ts              ← Zod 스키마 (한 번만 수정)
│   │   └── temples/
│   │       ├── cheongwansa.md     ← 사찰 1
│   │       ├── haeinsa.md         ← 사찰 2
│   │       └── ...                ← 사찰 N (파일만 추가)
│   ├── components/
│   │   └── temple/
│   │       ├── HeroSection.astro      ← 섹션 1: 히어로
│   │       ├── TickerBar.astro        ← 섹션 2: 행사 티커
│   │       ├── IntroSection.astro     ← 섹션 3: 도량 소개
│   │       ├── GallerySection.astro   ← 섹션 4: 갤러리
│   │       ├── ScheduleSection.astro  ← 섹션 5: 법회 일정
│   │       ├── IndungSection.astro    ← 섹션 6: 인등불사
│   │       ├── DirectionsSection.astro← 섹션 7: 오시는 길
│   │       └── TempleFooter.astro     ← 섹션 8: 푸터
│   ├── lib/
│   │   └── cloudinary.ts          ← 이미지 URL 생성 + 데이터 파싱
│   ├── pages/
│   │   ├── [slug].astro           ← 사찰 개별 페이지 (조립만)
│   │   └── index.astro            ← 사찰 목록 허브
│   └── styles/
│       └── temple.css             ← 공통 CSS 변수 + 토큰
└── docs/
    ├── TEMPLE_TEMPLATE.md         ← 새 사찰 입력 템플릿
    ├── DEPLOYMENT_GUIDE.md        ← 이 파일
    └── create-temple.sh           ← 자동 생성 스크립트
```

---

## 🚀 새 사찰 추가 — 4단계

### Step 1: 파일 생성
```bash
# 스크립트 사용 (추천)
chmod +x docs/create-temple.sh
./docs/create-temple.sh haeinsa "해인사" "12"

# 또는 수동
cp docs/TEMPLE_TEMPLATE.md src/content/temples/haeinsa.md
```

### Step 2: 데이터 입력
`src/content/temples/haeinsa.md` 열어서 채우기:

| 필드 | 설명 | 필수? |
|------|------|-------|
| `title` | SEO 타이틀 | ★ 필수 |
| `name` | 사찰명 | ★ 필수 |
| `sect` | 종단·교구 | ★ 필수 |
| `slogan` | 한 줄 슬로건 | ★ 필수 |
| `description` | 소개 본문 | 권장 |
| `hero_image` | Cloudinary ID | 권장 |
| `contact` | 연락처 | 권장 |
| `address` | 주소 | 권장 |
| `events` | 법회 일정 | 선택 |
| `gallery_imgs` | 갤러리 이미지 IDs | 선택 |
| `indung` | 인등불사 정보 | 선택 |
| `history` | 사찰 연혁 | 선택 |

### Step 3: 이미지 업로드 (Cloudinary)
```
1. https://cloudinary.com 로그인 (db3izttcy)
2. Media Library → Upload
3. 업로드 후 public_id 복사
4. cheongwansa.md 의 gallery_imgs 에 입력
```

### Step 4: 배포
```bash
git add src/content/temples/haeinsa.md
git commit -m "feat: 해인사 추가"
git push origin main
# ✅ Vercel 자동 배포 → https://temple-hub.vercel.app/haeinsa
```

---

## 🔧 Vercel 환경 설정

Vercel Dashboard → Settings → Environment Variables:

```
# Cloudinary (환경변수 불필요 — 하드코딩됨)
# API가 필요한 기능 추가 시:
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 📋 데이터 입력 체크리스트 (사찰당)

최소 소요 시간: **10~15분**

```
□ title — SEO 타이틀
□ name, sect, slogan — 기본 정보
□ description — 2~4문장 소개
□ monk — 주지스님
□ hero_image — 대표 이미지 Cloudinary ID
□ gallery_imgs — 갤러리 5~6장
□ contact — 전화번호
□ address — 주소 + 네이버지도 URL
□ events — 주요 법회 3~5개
□ indung — 인등불사 정보 (있으면)
□ history — 연혁 5~10개 (있으면)
```

---

## 📊 1080 사찰 진행 현황 추적

```bash
# 완료된 사찰 수 확인
ls src/content/temples/*.md | wc -l

# 데이터 부족한 사찰 찾기 (hero_image 없는 것)
grep -rL "hero_image" src/content/temples/

# active:false 인 사찰 확인
grep -rl "active: false" src/content/temples/
```

---

## 🎯 교구별 우선순위 배포 전략

| 단계 | 교구 | 사찰 수 | 기간 |
|------|------|---------|------|
| 1단계 | 21교구 (전남 남부) | 약 50개 | 1개월 |
| 2단계 | 주요 대교구 (조계사·해인사) | 약 100개 | 1개월 |
| 3단계 | 나머지 22개 교구 | 930개 | 6개월 |

**하루 8개 사찰 × 135일 = 1080개 완성**

---

## 🐛 자주 발생하는 오류

### 빌드 오류: "schema validation failed"
```
원인: .md frontmatter 필드명 오타
해결: config.ts 의 스키마와 .md 필드명 비교
```

### 이미지 안 보임 (백화 현상)
```
원인: hero_image 값이 잘못된 Cloudinary public_id
해결: Cloudinary Dashboard에서 실제 ID 확인
     브라우저 콘솔에서 네트워크 탭으로 이미지 URL 직접 테스트
```

### 주소/연락처 표시 안됨
```
원인: contact/address 값이 비어 있음
해결: 단순 문자열로라도 입력
     예: contact: "010-1234-5678"
```

---

## 💡 팁: 대량 데이터 수집 자동화

```javascript
// 사찰 정보를 JSON으로 수집 후 MD 자동 변환
// scripts/json-to-md.js (별도 구현)

const temples = require('./data/temples.json');
temples.forEach(t => {
  const md = generateMd(t);  // 템플릿 기반 생성
  fs.writeFileSync(`src/content/temples/${t.slug}.md`, md);
});
```
