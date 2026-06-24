'use client';

import { useUserScopedData } from '@/hooks/useUserScopedData';
import { fetchPlaceReviews } from '@/lib/placeReviews';
import type { PlaceReview } from '@/types';

const EMPTY: PlaceReview[] = [];

/** Public reviews for a single place — visible to guests too, so this is keyed by placeId, not userId. */
export function usePlaceReviews(placeId: string) {
  const { data: reviews, loading, error, refresh, mutate } = useUserScopedData(
    placeId,
    fetchPlaceReviews,
    EMPTY,
    '후기를 불러오지 못했어요'
  );

  return { reviews, loading, error, refresh, mutate };
}
