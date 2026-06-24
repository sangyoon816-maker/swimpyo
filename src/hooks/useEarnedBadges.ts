'use client';

import { useEffect, useRef } from 'react';
import { useUserScopedData } from '@/hooks/useUserScopedData';
import { useToastStore } from '@/store/useToastStore';
import { fetchEarnedBadges, checkAndAwardBadges } from '@/lib/badges';
import type { UserBadge } from '@/types';

const EMPTY: UserBadge[] = [];

/**
 * Fetches the user's earned badges, and — as a safety net for badge
 * conditions met before this page loaded (e.g. pre-existing activity, or a
 * threshold crossed on another page) — re-checks eligibility once per
 * mount and awards/toasts anything newly earned.
 */
export function useEarnedBadges(userId: string | undefined) {
  const { data: earnedBadges, loading, error, refresh, mutate } = useUserScopedData(
    userId,
    fetchEarnedBadges,
    EMPTY,
    '배지 정보를 불러오지 못했어요'
  );
  const addToast = useToastStore((s) => s.addToast);
  const checkedForRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!userId || loading || checkedForRef.current === userId) return;
    checkedForRef.current = userId;

    checkAndAwardBadges(userId).then((newlyAwarded) => {
      if (newlyAwarded.length === 0) return;

      mutate((current) => [
        ...current,
        ...newlyAwarded.map((badge) => ({
          id: `local-${badge.id}`,
          user_id: userId,
          badge_id: badge.id,
          earned_at: new Date().toISOString(),
        })),
      ]);

      newlyAwarded.forEach((badge) => {
        addToast({ emoji: badge.emoji, message: `"${badge.name}" 배지를 획득했어요!` });
      });
    });
  }, [userId, loading, mutate, addToast]);

  return { earnedBadges, loading, error, refresh };
}
