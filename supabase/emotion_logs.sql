-- emotion_logs: 로그인 사용자의 감정 기록 저장 테이블
-- Supabase Dashboard > SQL Editor에서 실행하세요.

create extension if not exists pgcrypto;

create table if not exists public.emotion_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  emotion text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists emotion_logs_user_id_created_at_idx
  on public.emotion_logs (user_id, created_at desc);

alter table public.emotion_logs enable row level security;

create policy "emotion_logs_select_own"
  on public.emotion_logs for select
  using (auth.uid() = user_id);

create policy "emotion_logs_insert_own"
  on public.emotion_logs for insert
  with check (auth.uid() = user_id);

create policy "emotion_logs_delete_own"
  on public.emotion_logs for delete
  using (auth.uid() = user_id);
