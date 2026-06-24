-- recommendation_feedback: 추천 카드에 대한 사용자 평가(도움됨/별로) 저장 테이블
-- Supabase Dashboard > SQL Editor에서 실행하세요.

create extension if not exists pgcrypto;

create table if not exists public.recommendation_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  liked boolean not null,
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

create index if not exists recommendation_feedback_user_id_idx
  on public.recommendation_feedback (user_id);

alter table public.recommendation_feedback enable row level security;

create policy "recommendation_feedback_select_own"
  on public.recommendation_feedback for select
  using (auth.uid() = user_id);

create policy "recommendation_feedback_insert_own"
  on public.recommendation_feedback for insert
  with check (auth.uid() = user_id);

-- "평가 변경 가능" — re-rating a place upserts onto the same (user_id, place_id)
-- row, which requires update permission alongside insert.
create policy "recommendation_feedback_update_own"
  on public.recommendation_feedback for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- "평가 취소" — clicking the active 👍/👎 again removes the row
create policy "recommendation_feedback_delete_own"
  on public.recommendation_feedback for delete
  using (auth.uid() = user_id);
