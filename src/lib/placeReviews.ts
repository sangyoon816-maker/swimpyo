import { supabase } from '@/lib/supabase';
import type { PlaceReview } from '@/types';

export async function fetchPlaceReviews(placeId: string): Promise<PlaceReview[]> {
  const { data, error } = await supabase
    .from('place_reviews')
    .select('*')
    .eq('place_id', placeId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as PlaceReview[];
}

export async function fetchMyReviews(userId: string): Promise<PlaceReview[]> {
  const { data, error } = await supabase
    .from('place_reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as PlaceReview[];
}

export async function fetchMyReviewsCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('place_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchMyReviewsCountInRange(
  userId: string,
  startISO: string,
  endISO: string
): Promise<number> {
  const { count, error } = await supabase
    .from('place_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startISO)
    .lt('created_at', endISO);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchMyReviewsCountBefore(userId: string, beforeISO: string): Promise<number> {
  const { count, error } = await supabase
    .from('place_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lt('created_at', beforeISO);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchMyReviewForPlace(
  userId: string,
  placeId: string
): Promise<PlaceReview | null> {
  const { data, error } = await supabase
    .from('place_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('place_id', placeId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as PlaceReview | null;
}

export async function insertPlaceReview(
  userId: string,
  placeId: string,
  content: string,
  liked: boolean
): Promise<PlaceReview> {
  const { data, error } = await supabase
    .from('place_reviews')
    .insert({ user_id: userId, place_id: placeId, content, liked })
    .select()
    .single();

  if (error) throw error;
  return data as PlaceReview;
}

export async function updatePlaceReview(
  userId: string,
  reviewId: string,
  content: string,
  liked: boolean
): Promise<PlaceReview> {
  const { data, error } = await supabase
    .from('place_reviews')
    .update({ content, liked, updated_at: new Date().toISOString() })
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as PlaceReview;
}

export async function deletePlaceReview(userId: string, reviewId: string): Promise<void> {
  // .select() forces matched rows back — without it, Supabase returns
  // error: null even when RLS silently blocks the delete (0 rows affected).
  const { data, error } = await supabase
    .from('place_reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select('id');

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('후기를 삭제하지 못했어요. 권한이 없거나 이미 삭제된 후기입니다.');
  }
}
