-- recommendation_feedback.sql originally only granted select/insert/update —
-- the "평가 취소" (toggle off) feature needs a delete policy too.
-- Supabase Dashboard > SQL Editor에서 실행하세요.

create policy "recommendation_feedback_delete_own"
  on public.recommendation_feedback for delete
  using (auth.uid() = user_id);
