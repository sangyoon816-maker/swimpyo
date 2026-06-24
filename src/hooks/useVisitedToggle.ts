'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { addVisitedPlace, removeVisitedPlace } from '@/lib/visitedPlaces';
import { awardBadgesAndNotify } from '@/lib/badges';

export function useVisitedToggle() {
  const { user } = useAuth();
  const { isVisited, markVisited, unmarkVisited } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const toggleVisited = async (placeId: string) => {
    const wasVisited = isVisited(placeId);
    setError(null);

    if (wasVisited) unmarkVisited(placeId);
    else markVisited(placeId);

    if (!user) return;

    try {
      if (wasVisited) {
        await removeVisitedPlace(user.id, placeId);
      } else {
        await addVisitedPlace(user.id, placeId);
        awardBadgesAndNotify(user.id).catch(() => {});
      }
    } catch (err) {
      if (wasVisited) markVisited(placeId);
      else unmarkVisited(placeId);
      setError(err instanceof Error ? err.message : '방문 기록 저장에 실패했어요');
    }
  };

  return { toggleVisited, error };
}
