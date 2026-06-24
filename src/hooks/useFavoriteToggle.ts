'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { addFavorite, removeFavorite } from '@/lib/favorites';

export function useFavoriteToggle() {
  const { user } = useAuth();
  const { isSaved, savePlace, unsavePlace } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const toggleFavorite = async (placeId: string) => {
    const wasSaved = isSaved(placeId);
    setError(null);

    if (wasSaved) unsavePlace(placeId);
    else savePlace(placeId);

    if (!user) return;

    try {
      if (wasSaved) await removeFavorite(user.id, placeId);
      else await addFavorite(user.id, placeId);
    } catch (err) {
      if (wasSaved) savePlace(placeId);
      else unsavePlace(placeId);
      setError(err instanceof Error ? err.message : '찜 저장에 실패했어요');
    }
  };

  return { toggleFavorite, error };
}
