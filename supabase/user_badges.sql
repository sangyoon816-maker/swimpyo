-- user_badges: 실제 활동 데이터(방문/후기/코스완주)를 기준으로 판정해 획득한 배지 기록.
-- 자격 판정은 항상 그 시점의 실제 활동 수를 다시 계산해서 이루어지고, 이 테이블은
-- "언제 처음 그 조건을 달성했는지"만 영구 기록합니다 — 이후 활동이 줄어도
-- (예: 후기를 삭제해도) 이미 획득한 배지는 사라지지 않습니다.
-- Supabase Dashboard > SQL Editor에서 실행하세요.

create extension if not exists pgcrypto;

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create index if not exists user_badges_user_id_idx
  on public.user_badges (user_id);

alter table public.user_badges enable row level security;

create policy "user_badges_select_own"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "user_badges_insert_own"
  on public.user_badges for insert
  with check (auth.uid() = user_id);
