'use client';

import { useState } from 'react';
import { useUserScopedData } from '@/hooks/useUserScopedData';
import {
  fetchRecommendationFeedback,
  upsertRecommendationFeedback,
  deleteRecommendationFeedback,
} from '@/lib/recommendationFeedback';
import type { RecommendationFeedback } from '@/types';

const EMPTY: RecommendationFeedback[] = [];

export function useRecommendationFeedback(userId: string | undefined) {
  const { data: feedback, loading, error, refresh, mutate } = useUserScopedData(
    userId,
    fetchRecommendationFeedback,
    EMPTY,
    '추천 피드백을 불러오지 못했어요'
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const getFeedback = (placeId: string): boolean | null => {
    const entry = feedback.find((f) => f.place_id === placeId);
    return entry ? entry.liked : null;
  };

  const setFeedback = async (placeId: string, liked: boolean) => {
    if (!userId) return;
    setActionError(null);

    const previous = feedback.find((f) => f.place_id === placeId) ?? null;

    // clicking the already-active button cancels the evaluation instead of re-saving it
    if (previous && previous.liked === liked) {
      mutate((current) => current.filter((f) => f.place_id !== placeId));

      try {
        await deleteRecommendationFeedback(userId, placeId);
      } catch (err) {
        mutate((current) => [...current.filter((f) => f.place_id !== placeId), previous]);
        setActionError(err instanceof Error ? err.message : '평가 취소에 실패했어요');
      }
      return;
    }

    // optimistic update — one row per (user, place); replace it locally first
    mutate((current) => [
      ...current.filter((f) => f.place_id !== placeId),
      {
        id: previous?.id ?? placeId,
        user_id: userId,
        place_id: placeId,
        liked,
        created_at: previous?.created_at ?? new Date().toISOString(),
      },
    ]);

    try {
      await upsertRecommendationFeedback(userId, placeId, liked);
    } catch (err) {
      mutate((current) => [
        ...current.filter((f) => f.place_id !== placeId),
        ...(previous ? [previous] : []),
      ]);
      setActionError(err instanceof Error ? err.message : '평가 저장에 실패했어요');
    }
  };

  return { getFeedback, setFeedback, loading, error, actionError, refresh };
}
