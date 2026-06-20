'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Emotion, EmotionRecord, Place } from '@/types';

interface AppState {
  savedPlaceIds: string[];
  visitedPlaceIds: string[];
  emotionRecords: EmotionRecord[];
  selectedEmotion: Emotion | null;

  savePlace: (id: string) => void;
  unsavePlace: (id: string) => void;
  isSaved: (id: string) => boolean;

  markVisited: (id: string) => void;
  isVisited: (id: string) => boolean;

  setSelectedEmotion: (emotion: Emotion | null) => void;
  addEmotionRecord: (record: EmotionRecord) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedPlaceIds: [],
      visitedPlaceIds: [],
      emotionRecords: [],
      selectedEmotion: null,

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

      isVisited: (id) => get().visitedPlaceIds.includes(id),

      setSelectedEmotion: (emotion) => set({ selectedEmotion: emotion }),

      addEmotionRecord: (record) =>
        set((s) => ({ emotionRecords: [record, ...s.emotionRecords] })),
    }),
    { name: 'shimtae-store' }
  )
);
