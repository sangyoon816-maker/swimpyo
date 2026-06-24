# 배포 체크리스트

쉼표 프로젝트를 실제 사용자에게 공개하기 전 점검 항목. 코드로 처리된 항목과, 외부 대시보드에서 직접 확인해야 하는 항목을 구분합니다.

## 1. Vercel 배포

- [ ] GitHub 저장소(`sangyoon816-maker/swimpyo`)를 Vercel 프로젝트로 연결
- [ ] Framework Preset: Next.js (자동 감지됨), Build Command/Output 기본값 그대로 사용 가능
- [ ] 아래 "환경 변수" 섹션의 모든 값을 Vercel Project Settings > Environment Variables에 등록 (Production + Preview 모두)
- [ ] 첫 배포 후 `https://<project>.vercel.app`(또는 커스텀 도메인)으로 실제 접속 확인

## 2. 운영 환경 변수

`.env.example` 기준 필수 변수 3개:

| 변수 | 현재 로컬 상태 | 비고 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ 설정됨 | Vercel에도 동일 값 등록 필요 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ 설정됨 | Vercel에도 동일 값 등록 필요 |
| `NEXT_PUBLIC_KAKAO_MAP_KEY` | ❌ **미설정** | 로컬에도 없음 — `/map` 페이지가 "API 키가 설정되지 않았어요" 상태로 표시됨. 발급 후 로컬·Vercel 양쪽에 추가 필요 |

- [ ] Kakao Map JavaScript 키 발급 및 등록 (Kakao Developers > 내 애플리케이션 > 앱 키)
- [ ] Vercel에 위 3개 변수 등록 후 재배포
- [ ] `NEXT_PUBLIC_SITE_URL`은 커스텀 도메인을 쓸 경우에만 등록 (안 쓰면 Vercel이 자동 주입하는 배포 URL로 OG/sitemap이 정상 동작)
- [ ] Supabase anon key가 실제 프로젝트의 유효한 키인지 로그인 플로우로 직접 한 번 확인 (이 환경에서는 키 값 내용을 직접 검증할 수 없었음)

## 3. Google OAuth 운영 도메인

코드는 `redirectTo: ${window.location.origin}/mypage`로 현재 접속 도메인을 동적으로 사용하므로 코드 수정 없이 도메인만 등록하면 됩니다.

- [ ] Google Cloud Console > API 및 서비스 > OAuth 클라이언트 ID에 운영 도메인 추가
  - 승인된 JavaScript 출처: `https://<운영도메인>`
  - 승인된 리디렉션 URI: Supabase가 제공하는 `https://<project>.supabase.co/auth/v1/callback`
- [ ] Supabase Dashboard > Authentication > URL Configuration
  - Site URL을 운영 도메인으로 설정
  - Redirect URLs에 `https://<운영도메인>/mypage` 추가

## 4. Kakao Map 운영 도메인

- [ ] Kakao Developers > 내 애플리케이션 > 플랫폼 > Web에 운영 도메인 등록 (`https://<운영도메인>`)
- [ ] 로컬 테스트용으로 `http://localhost:3000`도 함께 등록해두면 개발 중 편리

## 5–6. Lighthouse / 모바일 성능 점검 (실측 완료)

로컬 프로덕션 빌드(`next build && next start`) + Lighthouse mobile preset으로 실측한 결과입니다. **Lighthouse mobile은 CPU를 4배 느리게 시뮬레이션하므로, 실제 사용자 체감 속도는 이 숫자보다 빠릅니다.**

| 항목 | 홈 | /places |
|---|---|---|
| Performance | 89 | 69 |
| Accessibility | 96 | 90 → 96 (수정 후 재확인 필요) |
| Best Practices | 96 | 100 |
| SEO | 100 | 100 |
| LCP | 3.7s | 5.1s |

**코드로 수정한 항목:**
- ✅ 색상 대비 부족 (`#9CA3AF` → `#6B7280`, 앱 전체 27개 파일 74곳 — WCAG AA 4.5:1 기준 통과)
- ✅ 홈 히어로 이미지 위 텍스트 대비 강화 (그래디언트 오버레이 진하게)
- ✅ 헤딩 순서 스킵 (`PlaceCard` h3→h2 — h1 다음 h2 없이 h3로 바로 가던 문제)
- ✅ 이름 없는 링크 (`/places` 지도 아이콘 링크에 aria-label 추가)

**의도적으로 그대로 둔 항목 (제안만):**
- ⚠️ `geolocation-on-start` (Best Practices) — 홈/지도 진입 시 사용자 동작 없이 바로 위치 권한을 요청합니다. "현재 위치 기반 추천" 기능이 요청한 의도된 동작이라 이번 점검에서는 변경하지 않았습니다. 사용자 신뢰도를 더 높이려면 첫 진입 시엔 권한을 요청하지 않고, "내 위치로 가까운 쉼터 보기" 버튼을 탭했을 때만 요청하도록 바꾸는 걸 다음 작업으로 제안합니다.
- ⚠️ LCP 3.7~5.1초는 모바일 CPU 스로틀링 기준입니다. 실사용 체감과 차이가 크면 홈 화면의 하단 섹션(코스 배너, 인기 장소)을 `next/dynamic`으로 지연 로드하는 걸 고려할 수 있습니다 — 이번 점검에서는 적용하지 않았습니다 (구조 변경 폭이 커서 별도 작업으로 분리 권장).

- [ ] 실제 배포 도메인에 대해 PageSpeed Insights(https://pagespeed.web.dev) 또는 Chrome DevTools Lighthouse로 재확인

## 7–8. SEO / Open Graph (코드 적용 완료)

- ✅ `metadataBase`, 페이지별 타이틀 템플릿(`%s | 쉼표`)
- ✅ `robots.ts` — `/mypage`, `/analytics`(로그인 전용 페이지) 크롤링 제외, sitemap 링크 포함
- ✅ `sitemap.ts` — 홈/장소/코스/지도/기록 + 모든 장소·코스 상세 페이지
- ✅ `opengraph-image.tsx`, Twitter 카드(`summary_large_image`) — 카카오톡/트위터 등에 공유 시 브랜드 미리보기 표시
- ✅ 장소/코스 상세 페이지 `generateMetadata` — 장소/코스별 제목·설명·썸네일로 공유 미리보기 표시

- [ ] 배포 후 https://search.google.com/test/rich-results 또는 카카오톡 링크 공유로 OG 미리보기 실제 확인

## 9. Favicon / 앱 아이콘 (코드 적용 완료)

기존 `favicon.ico`는 create-next-app 기본(미브랜드) 아이콘이었어서 제거하고, 브랜드 컬러(#5F8D4E) 기반 아이콘으로 교체했습니다.

- ✅ `icon.tsx` — 브라우저 탭 파비콘 (32×32)
- ✅ `apple-icon.tsx` — iOS 홈 화면/사파리 (180×180)
- ✅ `manifest.ts` — "홈 화면에 추가" 시 앱 이름/테마 컬러 적용

- [ ] 실제 기기에서 "홈 화면에 추가" 후 아이콘 표시 확인 (현재 아이콘은 임시 텍스트 기반 — 정식 로고가 준비되면 교체 권장)

## 10. 최종 체크리스트 요약

배포 직전 순서대로:

1. [ ] `npm run build` / `npm run lint` 로컬에서 통과 확인
2. [ ] Supabase `supabase/*.sql` 10개 파일 전부 운영 프로젝트에 실행됐는지 확인 (`course_progress`, `emotion_logs`, `emotion_logs_delete_policy`, `favorites`, `place_reviews`, `recommendation_feedback`, `recommendation_feedback_delete_policy`, `recommendation_feedback_stats_function`, `user_badges`, `visited_places`)
3. [ ] Kakao Map 키 발급 + Vercel 환경 변수 등록
4. [ ] Vercel에 Supabase 환경 변수 등록 후 배포
5. [ ] Google OAuth 운영 도메인 등록 (Google Cloud Console + Supabase URL Configuration)
6. [ ] Kakao Developers 플랫폼에 운영 도메인 등록
7. [ ] 배포된 도메인으로 Google 로그인 → 감정 기록 → 장소 방문 → 후기 작성 → 코스 완주 흐름 한 번 직접 실행해보기
8. [ ] 배포된 도메인으로 Lighthouse 재실행, 카카오톡 링크 공유 미리보기 확인
