import { supabase } from '@/lib/supabase';
import type { RecommendationFeedback } from '@/types';

export async function fetchRecommendationFeedback(
  userId: string
): Promise<RecommendationFeedback[]> {
  const { data, error } = await supabase
    .from('recommendation_feedback')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []) as RecommendationFeedback[];
}

export async function upsertRecommendationFeedback(
  userId: string,
  placeId: string,
  liked: boolean
): Promise<RecommendationFeedback> {
  // .select().single() forces a row back from the upsert — if RLS denies
  // the insert/update, this throws instead of silently no-op'ing.
  const { data, error } = await supabase
    .from('recommendation_feedback')
    .upsert(
      { user_id: userId, place_id: placeId, liked },
      { onConflict: 'user_id,place_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data as RecommendationFeedback;
}

export async function deleteRecommendationFeedback(
  userId: string,
  placeId: string
): Promise<void> {
  // .select() forces matched rows back — Supabase returns error: null even
  // when 0 rows match (RLS denial or already-deleted), so this is the only
  // way to tell a real delete from a silent no-op.
  const { data, error } = await supabase
    .from('recommendation_feedback')
    .delete()
    .eq('user_id', userId)
    .eq('place_id', placeId)
    .select('id');

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('평가를 취소하지 못했어요. 권한이 없거나 이미 취소된 평가입니다.');
  }
}
