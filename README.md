# 쉼표 (Shimtae)

감정 기반 동네 힐링 장소 추천 플랫폼. 지금 내 상태에 맞는 쉼 공간(공원·카페·산책길·전망 명소)을 추천하고, 방문·후기·코스 완주·배지/레벨로 활동을 누적합니다.

Next.js 16 (App Router, Turbopack) + Supabase + Kakao Map.

## 시작하기

```bash
npm install
cp .env.example .env.local   # 값 채우기 — 아래 "환경 변수" 참고
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 환경 변수

`.env.example` 참고. 필수:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase 프로젝트 API 키
- `NEXT_PUBLIC_KAKAO_MAP_KEY` — `/map` 페이지 지도 표시에 필요 (Kakao Developers 앱 키)

선택:

- `NEXT_PUBLIC_SITE_URL` — 커스텀 도메인 사용 시에만 설정 (OG 이미지 · sitemap · robots.txt에 사용, 비워두면 Vercel 배포 URL로 자동 대체)

## Supabase 마이그레이션

`supabase/*.sql` 파일을 Supabase Dashboard > SQL Editor에서 순서대로 실행합니다. 각 파일은 테이블 생성 + RLS 정책을 함께 포함합니다.

## 배포

배포 전 점검 항목은 [DEPLOYMENT.md](./DEPLOYMENT.md) 참고.

```bash
npm run build
npm run lint
```
