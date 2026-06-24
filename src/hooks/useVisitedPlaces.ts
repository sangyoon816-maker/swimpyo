'use client';

import { useUserScopedData } from '@/hooks/useUserScopedData';
import { fetchVisitedPlaces } from '@/lib/visitedPlaces';
import { getPlaceById } from '@/data/places';
import type { Place, VisitedPlace } from '@/types';

const EMPTY: VisitedPlace[] = [];

export function useVisitedPlaces(userId: string | undefined) {
  const { data: visited, loading, error, refresh } = useUserScopedData(
    userId,
    fetchVisitedPlaces,
    EMPTY,
    '방문 기록을 불러오지 못했어요'
  );

  const places = visited
    .map((v) => getPlaceById(v.place_id))
    .filter((place): place is Place => place != null);

  return { places, loading, error, refresh };
}
