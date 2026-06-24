-- /analytics 대시보드는 모든 사용자의 추천 피드백을 집계해서 보여줘야 하지만,
-- recommendation_feedback의 select RLS는 본인 행만 조회하도록 막아 둔 상태입니다.
-- 이 함수는 security definer로 실행되어 RLS를 우회하지만, 원본 행이 아니라
-- place_id별 좋아요/싫어요 합계만 반환하므로 개별 사용자 데이터는 노출되지 않습니다.
-- authenticated 역할에만 실행 권한을 부여해 로그인한 사용자만 호출할 수 있습니다.
-- Supabase Dashboard > SQL Editor에서 실행하세요.

create or replace function public.recommendation_feedback_place_stats()
returns table (place_id text, likes integer, dislikes integer)
language sql
security definer
set search_path = public
as $$
  select
    place_id,
    count(*) filter (where liked)::int as likes,
    count(*) filter (where not liked)::int as dislikes
  from public.recommendation_feedback
  group by place_id;
$$;

revoke all on function public.recommendation_feedback_place_stats() from public;
grant execute on function public.recommendation_feedback_place_stats() to authenticated;
