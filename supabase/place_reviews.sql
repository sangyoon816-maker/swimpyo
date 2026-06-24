-- place_reviews: 실제 방문자가 남기는 한줄 후기 (좋아요/별로예요 + 텍스트)
-- Supabase Dashboard > SQL Editor에서 실행하세요.

create extension if not exists pgcrypto;

create table if not exists public.place_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null,
  content text not null,
  liked boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, place_id),
  constraint place_reviews_content_length check (char_length(content) <= 100)
);

create index if not exists place_reviews_place_id_idx
  on public.place_reviews (place_id, created_at desc);

alter table public.place_reviews enable row level security;

-- 후기는 장소 상세 페이지에서 누구나(비로그인 포함) 볼 수 있는 공개 콘텐츠입니다.
create policy "place_reviews_select_all"
  on public.place_reviews for select
  using (true);

-- "방문한 장소만 후기 작성 가능" — 클라이언트 체크만으로는 우회 가능하므로
-- visited_places에 동일 user_id/place_id 행이 있는지 DB에서도 검증합니다.
create policy "place_reviews_insert_own_visited"
  on public.place_reviews for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.visited_places vp
      where vp.user_id = auth.uid() and vp.place_id = place_reviews.place_id
    )
  );

create policy "place_reviews_update_own"
  on public.place_reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "place_reviews_delete_own"
  on public.place_reviews for delete
  using (auth.uid() = user_id);
