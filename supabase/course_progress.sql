-- course_progress: 로그인 사용자가 실제로 진행 중이거나 완주한 코스 기록
-- 각 정거장(stop) 방문 완료는 기존 visited_places 테이블을 그대로 재사용합니다 —
-- 이 테이블은 "어느 코스를 몇 번째 정거장까지 진행했는지"만 추가로 추적합니다.
-- Supabase Dashboard > SQL Editor에서 실행하세요.

create extension if not exists pgcrypto;

create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  current_stop integer not null default 1,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

-- 완주 횟수를 기록으로 남기기 위해 행을 재사용/덮어쓰지 않고, 코스마다
-- "진행 중인 시도"는 한 번에 하나만 존재하도록 부분 유니크 인덱스로 제한합니다.
-- 완료된 행(completed_at not null)은 제한 없이 누적되어 완주 이력이 됩니다.
create unique index if not exists course_progress_one_active_idx
  on public.course_progress (user_id, course_id)
  where completed_at is null;

create index if not exists course_progress_user_id_idx
  on public.course_progress (user_id, updated_at desc);

alter table public.course_progress enable row level security;

create policy "course_progress_select_own"
  on public.course_progress for select
  using (auth.uid() = user_id);

create policy "course_progress_insert_own"
  on public.course_progress for insert
  with check (auth.uid() = user_id);

create policy "course_progress_update_own"
  on public.course_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "course_progress_delete_own"
  on public.course_progress for delete
  using (auth.uid() = user_id);
