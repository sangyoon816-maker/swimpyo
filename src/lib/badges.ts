import { supabase } from '@/lib/supabase';
import { getPlaceById } from '@/data/places';
import { fetchVisitedPlaces } from '@/lib/visitedPlaces';
import { fetchMyReviewsCount } from '@/lib/placeReviews';
import { fetchCompletedCourseIds } from '@/lib/courseProgress';
import { fetchEmotionLogsCount } from '@/lib/emotionLogs';
import { useToastStore } from '@/store/useToastStore';
import { BADGE_DEFINITIONS, computeEligibleBadgeIds, type ActivityStats, type BadgeDefinition } from '@/data/badges';
import type { PlaceCategory, UserBadge } from '@/types';

export async function fetchEarnedBadges(userId: string): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as UserBadge[];
}

export async function fetchEarnedBadgesCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('user_badges')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count ?? 0;
}

async function fetchActivityStatsForBadges(userId: string): Promise<ActivityStats> {
  const [visited, reviewCount, completedCourseIds, emotionLogCount] = await Promise.all([
    fetchVisitedPlaces(userId),
    fetchMyReviewsCount(userId),
    fetchCompletedCourseIds(userId),
    fetchEmotionLogsCount(userId),
  ]);

  const categoryVisitCounts: Partial<Record<PlaceCategory, number>> = {};
  for (const v of visited) {
    const place = getPlaceById(v.place_id);
    if (!place) continue;
    categoryVisitCounts[place.category] = (categoryVisitCounts[place.category] ?? 0) + 1;
  }

  return {
    visitedCount: visited.length,
    categoryVisitCounts,
    reviewCount,
    completedCourseCount: completedCourseIds.length,
    emotionLogCount,
  };
}

/** Upserts with ignoreDuplicates — returns whether a row was actually inserted (vs. silently skipped). */
async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_badges')
    .upsert({ user_id: userId, badge_id: badgeId }, { onConflict: 'user_id,badge_id', ignoreDuplicates: true })
    .select('id');

  if (error) throw error;
  return !!data && data.length > 0;
}

/**
 * Recomputes badge eligibility from real activity data (visited places,
 * reviews, completed courses) and awards any newly-met badges. Returns only
 * the badges actually newly inserted this call — callers use this to show a
 * "배지를 획득했어요!" toast exactly once, at the moment the threshold is crossed.
 */
export async function checkAndAwardBadges(userId: string): Promise<BadgeDefinition[]> {
  const [stats, earned] = await Promise.all([
    fetchActivityStatsForBadges(userId),
    fetchEarnedBadges(userId),
  ]);

  const earnedIds = new Set(earned.map((b) => b.badge_id));
  const candidateIds = computeEligibleBadgeIds(stats).filter((id) => !earnedIds.has(id));

  if (candidateIds.length === 0) return [];

  const results = await Promise.all(candidateIds.map((id) => awardBadge(userId, id)));
  const newlyAwardedIds = candidateIds.filter((_, i) => results[i]);

  return BADGE_DEFINITIONS.filter((b) => newlyAwardedIds.includes(b.id));
}

/**
 * Fire-and-forget helper for activity actions (visit / review / course
 * completion) outside of a component that already renders the badge grid —
 * checks for newly-earned badges and toasts them, with no local cache to update.
 */
export async function awardBadgesAndNotify(userId: string): Promise<void> {
  const newlyAwarded = await checkAndAwardBadges(userId);
  if (newlyAwarded.length === 0) return;

  const { addToast } = useToastStore.getState();
  newlyAwarded.forEach((badge) => {
    addToast({ emoji: badge.emoji, message: `"${badge.name}" 배지를 획득했어요!` });
  });
}
