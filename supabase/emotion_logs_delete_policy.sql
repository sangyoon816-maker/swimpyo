-- emotion_logs.sql originally only granted select/insert — the new
-- "감정 기록 삭제" feature needs a delete policy too.
-- Supabase Dashboard > SQL Editor에서 실행하세요.

create policy "emotion_logs_delete_own"
  on public.emotion_logs for delete
  using (auth.uid() = user_id);
