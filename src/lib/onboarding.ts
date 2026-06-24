import { fetchEmotionLogsCount } from '@/lib/emotionLogs';
import { fetchFavoritesCount } from '@/lib/favorites';
import { fetchVisitedPlacesCount } from '@/lib/visitedPlaces';
import { fetchMyReviewsCount } from '@/lib/placeReviews';
import { fetchEarnedBadgesCount } from '@/lib/badges';

export type OnboardingStepId = 'emotion' | 'favorite' | 'visit' | 'review' | 'badge';

export interface OnboardingStep {
  id: OnboardingStepId;
  label: string;
  href: string;
  done: boolean;
}

export interface OnboardingProgress {
  steps: OnboardingStep[];
  completedCount: number;
  totalCount: number;
  percent: number;
  isComplete: boolean;
}

/**
 * Every step is checked live against existing tables (emotion_logs,
 * favorites, visited_places, place_reviews, user_badges) — nothing is
 * stored for onboarding itself, so a user's prior activity is reflected
 * the moment this loads, with no backfill step.
 */
export async function fetchOnboardingProgress(userId: string): Promise<OnboardingProgress> {
  const [emotionCount, favoriteCount, visitedCount, reviewCount, badgeCount] = await Promise.all([
    fetchEmotionLogsCount(userId),
    fetchFavoritesCount(userId),
    fetchVisitedPlacesCount(userId),
    fetchMyReviewsCount(userId),
    fetchEarnedBadgesCount(userId),
  ]);

  const steps: OnboardingStep[] = [
    { id: 'emotion', label: '감정 기록하기', href: '/record', done: emotionCount > 0 },
    { id: 'favorite', label: '장소 찜하기', href: '/places', done: favoriteCount > 0 },
    { id: 'visit', label: '장소 방문하기', href: '/places', done: visitedCount > 0 },
    { id: 'review', label: '후기 작성하기', href: '/places', done: reviewCount > 0 },
    { id: 'badge', label: '첫 배지 획득하기', href: '/mypage', done: badgeCount > 0 },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const totalCount = steps.length;

  return {
    steps,
    completedCount,
    totalCount,
    percent: Math.round((completedCount / totalCount) * 100),
    isComplete: completedCount === totalCount,
  };
}
