'use client';

import { useUserScopedData } from '@/hooks/useUserScopedData';
import { fetchEmotionLogsCount } from '@/lib/emotionLogs';

export function useEmotionLogsCount(userId: string | undefined) {
  const { data: count, loading, error, refresh, mutate } = useUserScopedData(
    userId,
    fetchEmotionLogsCount,
    0,
    '감정 기록 수를 불러오지 못했어요'
  );

  const decrement = () => {
    mutate((current) => Math.max(0, current - 1));
  };

  return { count, loading, error, refresh, decrement };
}
