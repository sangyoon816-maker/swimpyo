'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Area } from '@/data/places';
import type { Emotion } from '@/types';

interface AppState {
  savedPlaceIds: string[];
  visitedPlaceIds: string[];
  selectedEmotion: Emotion | null;
  selectedArea: Area | null;

  savePlace: (id: string) => void;
  unsavePlace: (id: string) => void;
  isSaved: (id: string) => boolean;

  markVisited: (id: string) => void;
  unmarkVisited: (id: string) => void;
  isVisited: (id: string) => boolean;

  setSelectedEmotion: (emotion: Emotion | null) => void;
  setSelectedArea: (area: Area | null) => void;

  hydrateSavedPlaceIds: (ids: string[]) => void;
  hydrateVisitedPlaceIds: (ids: string[]) => void;
  resetUserData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedPlaceIds: [],
      visitedPlaceIds: [],
      selectedEmotion: null,
      selectedArea: null,

      savePlace: (id) =>
        set((s) => ({
          savedPlaceIds: s.savedPlaceIds.includes(id)
            ? s.savedPlaceIds
            : [...s.savedPlaceIds, id],
        })),

      unsavePlace: (id) =>
        set((s) => ({ savedPlaceIds: s.savedPlaceIds.filter((x) => x !== id) })),

      isSaved: (id) => get().savedPlaceIds.includes(id),

      markVisited: (id) =>
        set((s) => ({
          visitedPlaceIds: s.visitedPlaceIds.includes(id)
            ? s.visitedPlaceIds
            : [...s.visitedPlaceIds, id],
        })),

      unmarkVisited: (id) =>
        set((s) => ({ visitedPlaceIds: s.visitedPlaceIds.filter((x) => x !== id) })),

      isVisited: (id) => get().visitedPlaceIds.includes(id),

      setSelectedEmotion: (emotion) => set({ selectedEmotion: emotion }),
      setSelectedArea: (area) => set({ selectedArea: area }),

      hydrateSavedPlaceIds: (ids) => set({ savedPlaceIds: ids }),
      hydrateVisitedPlaceIds: (ids) => set({ visitedPlaceIds: ids }),

      resetUserData: () => set({ savedPlaceIds: [], visitedPlaceIds: [] }),
    }),
    {
      name: 'shimtae-store',
      // savedPlaceIds / visitedPlaceIds are Supabase-backed — AuthStoreSync
      // hydrates them from the server on every auth transition. Only
      // UI-only state is persisted locally.
      partialize: (state) => ({
        selectedEmotion: state.selectedEmotion,
        selectedArea: state.selectedArea,
      }),
    }
  )
);
