'use client';

import { useUserScopedData } from '@/hooks/useUserScopedData';
import { fetchEmotionLogsSince } from '@/lib/emotionLogs';
import { fetchFavorites } from '@/lib/favorites';
import { fetchVisitedPlaces } from '@/lib/visitedPlaces';
import { buildRestInsight, type RestInsight } from '@/lib/restInsight';

const EMPTY: RestInsight = { sentences: [] };
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

async function fetchInsightData(userId: string): Promise<RestInsight> {
  const sinceISO = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();
  const [recentLogs, visited, favorites] = await Promise.all([
    fetchEmotionLogsSince(userId, sinceISO),
    fetchVisitedPlaces(userId),
    fetchFavorites(userId),
  ]);
  return buildRestInsight(recentLogs, visited, favorites);
}

export function useRestInsight(userId: string | undefined) {
  const { data: insight, loading, error, refresh } = useUserScopedData(
    userId,
    fetchInsightData,
    EMPTY,
    '쉼 인사이트를 불러오지 못했어요'
  );

  return { insight, loading, error, refresh };
}
