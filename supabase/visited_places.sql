-- visited_places: 로그인 사용자의 방문 기록 저장 테이블
-- Supabase Dashboard > SQL Editor에서 실행하세요.

create extension if not exists pgcrypto;

create table if not exists public.visited_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  visited_at timestamptz not null default now(),
  unique (user_id, place_id)
);

create index if not exists visited_places_user_id_visited_at_idx
  on public.visited_places (user_id, visited_at desc);

alter table public.visited_places enable row level security;

create policy "visited_places_select_own"
  on public.visited_places for select
  using (auth.uid() = user_id);

create policy "visited_places_insert_own"
  on public.visited_places for insert
  with check (auth.uid() = user_id);

create policy "visited_places_delete_own"
  on public.visited_places for delete
  using (auth.uid() = user_id);
