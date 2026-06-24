'use client';

import { useUserScopedData } from '@/hooks/useUserScopedData';
import { fetchFavorites } from '@/lib/favorites';
import { getPlaceById } from '@/data/places';
import type { Favorite, Place } from '@/types';

const EMPTY: Favorite[] = [];

export function useFavoritePlaces(userId: string | undefined) {
  const { data: favorites, loading, error, refresh } = useUserScopedData(
    userId,
    fetchFavorites,
    EMPTY,
    '찜 목록을 불러오지 못했어요'
  );

  const places = favorites
    .map((f) => getPlaceById(f.place_id))
    .filter((place): place is Place => place != null);

  return { places, loading, error, refresh };
}
