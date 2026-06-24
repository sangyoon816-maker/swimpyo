'use client';

import { useCallback } from 'react';
import { useUserScopedData } from '@/hooks/useUserScopedData';
import { fetchMyReviews, fetchMyReviewForPlace } from '@/lib/placeReviews';
import type { PlaceReview } from '@/types';

const EMPTY: PlaceReview[] = [];
const NO_REVIEW: PlaceReview | null = null;

/** All reviews the current user has written — used on 마이페이지. */
export function useMyReviews(userId: string | undefined) {
  const { data: reviews, loading, error, refresh, mutate } = useUserScopedData(
    userId,
    fetchMyReviews,
    EMPTY,
    '내 후기를 불러오지 못했어요'
  );

  return { reviews, loading, error, refresh, mutate };
}

/** The current user's own review for one specific place — used on the place detail page. */
export function useMyReviewForPlace(userId: string | undefined, placeId: string) {
  const fetcher = useCallback((uid: string) => fetchMyReviewForPlace(uid, placeId), [placeId]);

  const { data: myReview, loading, error, refresh, mutate } = useUserScopedData(
    userId,
    fetcher,
    NO_REVIEW,
    '내 후기를 불러오지 못했어요'
  );

  return { myReview, loading, error, refresh, mutate };
}
