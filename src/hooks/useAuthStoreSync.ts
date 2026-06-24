'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { fetchFavorites } from '@/lib/favorites';
import { fetchVisitedPlaces } from '@/lib/visitedPlaces';

/**
 * Keeps the local Zustand store in sync with auth state. On every login/
 * logout/account-switch it wipes local-only data first, then — if a user
 * is present — replaces (never merges) it with the server's data. This is
 * the single source of truth all heart/visited UI reads from, so it must
 * never be allowed to hold a previous user's data.
 */
export function useAuthStoreSync() {
  const { user, loading } = useAuth();
  const userId = user?.id;
  const resetUserData = useAppStore((s) => s.resetUserData);
  const hydrateSavedPlaceIds = useAppStore((s) => s.hydrateSavedPlaceIds);
  const hydrateVisitedPlaceIds = useAppStore((s) => s.hydrateVisitedPlaceIds);

  useEffect(() => {
    if (loading) return;

    resetUserData();
    if (!userId) return;

    let active = true;
    Promise.all([fetchFavorites(userId), fetchVisitedPlaces(userId)])
      .then(([favorites, visited]) => {
        if (!active) return;
        hydrateSavedPlaceIds(favorites.map((f) => f.place_id));
        hydrateVisitedPlaceIds(visited.map((v) => v.place_id));
      })
      .catch(() => {
        // store is already reset; per-place toggles still work even if
        // this bulk hydration fails, just without the initial heart state
      });

    return () => {
      active = false;
    };
  }, [userId, loading, resetUserData, hydrateSavedPlaceIds, hydrateVisitedPlaceIds]);
}
