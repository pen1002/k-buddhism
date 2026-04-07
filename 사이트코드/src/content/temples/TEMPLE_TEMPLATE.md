---
# ════════════════════════════════════════════════════════════
#  TEMPLE HUB · 사찰 데이터 입력 템플릿 (v3)
#
#  사용법:
#  1. 이 파일을 복사: src/content/temples/[사찰영문명].md
#  2. ★ 필수 항목만 채워도 페이지 생성됨
#  3. 선택 항목은 채울수록 페이지가 풍부해짐
#  4. Cloudinary 이미지 업로드 후 public_id 입력
# ════════════════════════════════════════════════════════════

# ★ 필수 (이것만 채워도 배포 가능)
title: "사찰명 — 지역 사찰명"        # SEO 타이틀 (브라우저 탭)
name:  "사찰명"                       # 예: 천관사 (天冠寺)
sect:  "대한불교조계종 제X교구 X사 말사"
slogan: "한 줄 슬로건"               # 히어로에 표시

# ★ 강력 권장
description: |
  사찰 소개 문장. 여러 줄 가능.
  역사, 특징, 위치 등을 2~4문장으로.
monk: "주지 스님법명스님"
hero_image: "cloudinary_public_id"    # Cloudinary 업로드 후 ID 입력

# ── 이름 추가 정보 ──────────────────────────────────
name_hanja:  "漢字寺名"               # 예: 天冠寺 (선택)
name_en:     "Temple English Name"   # 선택
founded:     "XXX년 창건"             # 예: 759년 창건
main_buddha: "석가모니불"             # 주불 이름

# ── 이미지 (Cloudinary public IDs) ──────────────────
gallery_imgs:
  - "cloudinary_id_1"               # 갤러리 첫 번째 (대표 와이드 이미지)
  - "cloudinary_id_2"
  - "cloudinary_id_3"
  - "cloudinary_id_4"
  - "cloudinary_id_5"

# ── 연락처 ──────────────────────────────────────────
# 방법 A (단순 — 추천): 문자열로 입력
contact: "010-0000-0000, 0XX-000-0000"
# 방법 B (상세 — 더 많은 기능):
# contact:
#   mobile:  "010-0000-0000"
#   phone:   "0XX-000-0000"
#   email:   "temple@email.com"
#   kakao:   "kakao_channel_id"
#   website: "https://temple-website.com"

# ── 주소 ────────────────────────────────────────────
# 방법 A (단순):
address: "도 시군구 읍면동 번지 우)XXXXX (네이버 지도: https://naver.me/xxxxx)"
# 방법 B (상세):
# address:
#   full:    "도 시군구 읍면동 번지"
#   postal:  "XXXXX"
#   map_url: "https://naver.me/xxxxx"

# ── 외부 링크 ────────────────────────────────────────
blog_url:    "https://blog.naver.com/..."    # 네이버 블로그
youtube_url: "https://youtube.com/@..."      # 유튜브 채널

# ── 행사·법회 일정 ────────────────────────────────────
events:
  - name: "법회명"
    schedule: "매월 X일"           # 날짜/주기
    time: "오전 10시 30분"          # 시간 (선택)
    location: "대웅전"              # 장소 (선택)
    note: "추가 안내"               # 비고 (선택)
  - name: "또 다른 법회"
    schedule: "음력 X월 X일"

# ── 연혁 ────────────────────────────────────────────
history:
  - year: "XXX년 (신라/고려/조선)"
    event: "창건 또는 주요 사건"
  - year: "XX년"
    event: "중창 또는 사건"

# ── 전각 (한 줄, white-space:nowrap 으로 표시) ──────
buildings: "대웅전 · 지장전 · 삼성각 · 범종각 · 요사채"

# ── 인등불사 ────────────────────────────────────────
indung:
  title:    "인등불사 이름"
  subtitle: "부제 (선택)"
  types:
    - label: "연간등"
      amount: "100,000원"
      period: "1년"
    - label: "칠일등"
      amount: "10,000원"
      period: "7일"
  bank:    "농협"
  account: "XXX-XXXX-XXXX-XX"
  holder:  "사찰명"
  note: "입금 후 연락처로 성명·소원 문자 주시면 기도 올려드립니다."

# ── 인사말 ──────────────────────────────────────────
greeting: |
  환영 인사말 (2~4문장).
  주지스님 메시지.
greeting_sig: "주지 스님법명 합장"

# ── 분류 (Temple Hub 목록 필터링용) ─────────────────
region:    "전남"                    # 지역 (전남, 경북, 충남 등)
district:  "장흥군"                   # 시군구
order_num: 21                        # 교구 번호
tags:
  - "보물"
  - "템플스테이"
  - "문화재"
active: true                         # false면 미공개
updated: "2026-03-07"
---

<!-- 본문 마크다운 (선택) — 소개 상세 텍스트 -->

사찰에 대한 추가 설명을 여기에 마크다운으로 작성합니다.
**굵은 글씨**, 단락 구분 등 자유롭게 사용하세요.
