'use client';

import { useCallback } from 'react';
import { useUserScopedData } from '@/hooks/useUserScopedData';
import { recommendPlacesForUser, type PlaceRecommendation } from '@/lib/recommendEngine';
import type { Area } from '@/data/places';

const EMPTY: PlaceRecommendation[] = [];

export function useRecommendation(userId: string | undefined, area?: Area | null) {
  const fetcher = useCallback(
    (uid: string) => recommendPlacesForUser(uid, 3, area),
    [area]
  );

  const { data: recommendations, loading, error, refresh } = useUserScopedData(
    userId,
    fetcher,
    EMPTY,
    '추천을 불러오지 못했어요'
  );

  return { recommendations, loading, error, refresh };
}
