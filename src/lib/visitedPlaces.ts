import { supabase } from '@/lib/supabase';
import type { VisitedPlace } from '@/types';

export async function fetchVisitedPlaces(userId: string): Promise<VisitedPlace[]> {
  const { data, error } = await supabase
    .from('visited_places')
    .select('*')
    .eq('user_id', userId)
    .order('visited_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as VisitedPlace[];
}

export async function fetchVisitedPlacesCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('visited_places')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count ?? 0;
}

export async function addVisitedPlace(userId: string, placeId: string): Promise<void> {
  const { error } = await supabase
    .from('visited_places')
    .upsert(
      { user_id: userId, place_id: placeId },
      { onConflict: 'user_id,place_id', ignoreDuplicates: true }
    );

  if (error) throw error;
}

export async function removeVisitedPlace(userId: string, placeId: string): Promise<void> {
  const { error } = await supabase
    .from('visited_places')
    .delete()
    .eq('user_id', userId)
    .eq('place_id', placeId);

  if (error) throw error;
}

export async function fetchVisitedPlacesInRange(
  userId: string,
  startISO: string,
  endISO: string
): Promise<VisitedPlace[]> {
  const { data, error } = await supabase
    .from('visited_places')
    .select('*')
    .eq('user_id', userId)
    .gte('visited_at', startISO)
    .lt('visited_at', endISO)
    .order('visited_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as VisitedPlace[];
}

export async function fetchVisitedPlacesCountBefore(userId: string, beforeISO: string): Promise<number> {
  const { count, error } = await supabase
    .from('visited_places')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lt('visited_at', beforeISO);

  if (error) throw error;
  return count ?? 0;
}
