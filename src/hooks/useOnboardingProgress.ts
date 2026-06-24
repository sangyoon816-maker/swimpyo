'use client';

import { useUserScopedData } from '@/hooks/useUserScopedData';
import { fetchOnboardingProgress, type OnboardingProgress } from '@/lib/onboarding';

const EMPTY: OnboardingProgress = {
  steps: [],
  completedCount: 0,
  totalCount: 0,
  percent: 0,
  isComplete: false,
};

export function useOnboardingProgress(userId: string | undefined) {
  const { data: progress, loading, error, refresh } = useUserScopedData(
    userId,
    fetchOnboardingProgress,
    EMPTY,
    '온보딩 진행 상태를 불러오지 못했어요'
  );

  return { progress, loading, error, refresh };
}
