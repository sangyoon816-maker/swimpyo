'use client';

import { useCallback } from 'react';
import { useUserScopedData } from '@/hooks/useUserScopedData';
import { fetchRecentEmotionLogs } from '@/lib/emotionLogs';
import type { EmotionLog } from '@/types';

const EMPTY: EmotionLog[] = [];

export function useRecentEmotionLogs(userId: string | undefined, limit = 7) {
  const fetcher = useCallback((uid: string) => fetchRecentEmotionLogs(uid, limit), [limit]);

  const { data: logs, loading, error, refresh, mutate } = useUserScopedData(
    userId,
    fetcher,
    EMPTY,
    '감정 기록을 불러오지 못했어요'
  );

  const removeLog = (logId: string) => {
    mutate((current) => current.filter((log) => log.id !== logId));
  };

  return { logs, loading, error, refresh, removeLog };
}
