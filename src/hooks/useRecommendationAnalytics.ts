'use client';

import { useUserScopedData } from '@/hooks/useUserScopedData';
import { getRecommendationAnalytics, type RecommendationAnalytics } from '@/lib/recommendationAnalytics';

const EMPTY: RecommendationAnalytics = {
  overall: { likes: 0, dislikes: 0, total: 0 },
  places: [],
  categories: [],
  topPlaces: [],
  bottomPlaces: [],
};

export function useRecommendationAnalytics(userId: string | undefined) {
  const { data, loading, error, refresh } = useUserScopedData(
    userId,
    () => getRecommendationAnalytics(),
    EMPTY,
    '추천 분석 데이터를 불러오지 못했어요'
  );

  return { analytics: data, loading, error, refresh };
}
