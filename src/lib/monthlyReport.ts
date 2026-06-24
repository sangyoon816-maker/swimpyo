import { getAreaForPlace, getPlaceById, type Area } from '@/data/places';
import { EMOTIONS } from '@/data/emotions';
import {
  BADGE_DEFINITIONS,
  computeXp,
  computeLevel,
  type BadgeDefinition,
  type LevelInfo,
} from '@/data/badges';
import {
  fetchEmotionLogsInRange,
  fetchEmotionLogsCountBefore,
} from '@/lib/emotionLogs';
import {
  fetchVisitedPlacesInRange,
  fetchVisitedPlacesCountBefore,
} from '@/lib/visitedPlaces';
import {
  fetchMyReviewsCountInRange,
  fetchMyReviewsCountBefore,
} from '@/lib/placeReviews';
import {
  fetchCompletedCoursesInRange,
  fetchCompletedCourseCountBefore,
} from '@/lib/courseProgress';
import { fetchEarnedBadges } from '@/lib/badges';
import type { Emotion, EmotionLog, PlaceCategory, VisitedPlace } from '@/types';

export interface MonthKey {
  year: number;
  month: number; // 1-12
}

export interface EmotionWeekBucket {
  weekLabel: string;
  counts: Record<Emotion, number>;
  dominant: Emotion | null;
}

export interface MonthlyReportActivity {
  emotionLogCount: number;
  visitedPlaceCount: number;
  reviewCount: number;
  completedCourseCount: number;
}

export interface MonthlyReportEmotionAnalysis {
  topEmotion: Emotion | null;
  emotionCounts: Record<Emotion, number>;
  weeklyTrend: EmotionWeekBucket[];
}

export interface MonthlyReportPlaceAnalysis {
  topCategory: PlaceCategory | null;
  categoryCounts: Partial<Record<PlaceCategory, number>>;
  topArea: Area | null;
  areaCounts: Partial<Record<Area, number>>;
}

export interface MonthlyReportGrowth {
  xpGained: number;
  levelBefore: LevelInfo;
  levelAfter: LevelInfo;
  leveledUp: boolean;
  newBadges: BadgeDefinition[];
}

/**
 * Plain serializable data — deliberately decoupled from any rendering so the
 * same object can later feed a PDF export, not just the mypage card.
 */
export interface MonthlyReport {
  monthKey: MonthKey;
  rangeStartISO: string;
  rangeEndISO: string;
  activity: MonthlyReportActivity;
  emotion: MonthlyReportEmotionAnalysis;
  place: MonthlyReportPlaceAnalysis;
  growth: MonthlyReportGrowth;
  isEmpty: boolean;
}

export function getCurrentMonthKey(): MonthKey {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function formatMonthLabel(monthKey: MonthKey): string {
  return `${monthKey.year}년 ${monthKey.month}월`;
}

function getMonthRangeISO(year: number, month: number): { startISO: string; endISO: string } {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}

function maxEntry<K extends string>(counts: Partial<Record<K, number>>): K | null {
  let best: K | null = null;
  let bestCount = 0;
  for (const key of Object.keys(counts) as K[]) {
    const value = counts[key] ?? 0;
    if (value > bestCount) {
      best = key;
      bestCount = value;
    }
  }
  return best;
}

function createEmptyEmotionCounts(): Record<Emotion, number> {
  return EMOTIONS.reduce(
    (acc, e) => ({ ...acc, [e.id]: 0 }),
    {} as Record<Emotion, number>
  );
}

function buildEmotionCounts(logs: EmotionLog[]): Record<Emotion, number> {
  const counts = createEmptyEmotionCounts();
  for (const log of logs) counts[log.emotion] += 1;
  return counts;
}

/** Buckets the month's emotion logs by calendar week so a trend (not just a single total) can be shown. */
function buildWeeklyEmotionTrend(logs: EmotionLog[], year: number, month: number): EmotionWeekBucket[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const weekCount = Math.ceil(daysInMonth / 7);
  const weeks: EmotionWeekBucket[] = Array.from({ length: weekCount }, (_, i) => ({
    weekLabel: `${i + 1}주차`,
    counts: createEmptyEmotionCounts(),
    dominant: null,
  }));

  for (const log of logs) {
    const day = new Date(log.created_at).getDate();
    const weekIdx = Math.min(Math.floor((day - 1) / 7), weekCount - 1);
    weeks[weekIdx].counts[log.emotion] += 1;
  }

  for (const week of weeks) {
    week.dominant = maxEntry(week.counts);
  }

  return weeks;
}

function buildCategoryAndAreaCounts(visited: VisitedPlace[]): {
  categoryCounts: Partial<Record<PlaceCategory, number>>;
  areaCounts: Partial<Record<Area, number>>;
} {
  const categoryCounts: Partial<Record<PlaceCategory, number>> = {};
  const areaCounts: Partial<Record<Area, number>> = {};

  for (const v of visited) {
    const place = getPlaceById(v.place_id);
    if (!place) continue;
    categoryCounts[place.category] = (categoryCounts[place.category] ?? 0) + 1;
    const area = getAreaForPlace(place);
    if (area) areaCounts[area] = (areaCounts[area] ?? 0) + 1;
  }

  return { categoryCounts, areaCounts };
}

function buildNewBadges(
  allEarned: { badge_id: string; earned_at: string }[],
  startISO: string,
  endISO: string
): BadgeDefinition[] {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  const earnedIdsInRange = allEarned
    .filter((b) => {
      const t = new Date(b.earned_at).getTime();
      return t >= start && t < end;
    })
    .map((b) => b.badge_id);

  return BADGE_DEFINITIONS.filter((b) => earnedIdsInRange.includes(b.id));
}

/**
 * Builds a monthly recap purely from existing tables (emotion_logs,
 * visited_places, place_reviews, course_progress, user_badges) — nothing is
 * stored separately, so this requires no new table or RLS policy.
 */
export async function buildMonthlyReport(userId: string, year: number, month: number): Promise<MonthlyReport> {
  const { startISO, endISO } = getMonthRangeISO(year, month);

  const [
    emotionLogsInRange,
    emotionLogCountBefore,
    visitedInRange,
    visitedCountBefore,
    reviewCountInRange,
    reviewCountBefore,
    completedCoursesInRange,
    completedCourseCountBefore,
    allEarnedBadges,
  ] = await Promise.all([
    fetchEmotionLogsInRange(userId, startISO, endISO),
    fetchEmotionLogsCountBefore(userId, startISO),
    fetchVisitedPlacesInRange(userId, startISO, endISO),
    fetchVisitedPlacesCountBefore(userId, startISO),
    fetchMyReviewsCountInRange(userId, startISO, endISO),
    fetchMyReviewsCountBefore(userId, startISO),
    fetchCompletedCoursesInRange(userId, startISO, endISO),
    fetchCompletedCourseCountBefore(userId, startISO),
    fetchEarnedBadges(userId),
  ]);

  const activity: MonthlyReportActivity = {
    emotionLogCount: emotionLogsInRange.length,
    visitedPlaceCount: visitedInRange.length,
    reviewCount: reviewCountInRange,
    completedCourseCount: completedCoursesInRange.length,
  };

  const emotionCounts = buildEmotionCounts(emotionLogsInRange);
  const emotion: MonthlyReportEmotionAnalysis = {
    topEmotion: maxEntry(emotionCounts),
    emotionCounts,
    weeklyTrend: buildWeeklyEmotionTrend(emotionLogsInRange, year, month),
  };

  const { categoryCounts, areaCounts } = buildCategoryAndAreaCounts(visitedInRange);
  const place: MonthlyReportPlaceAnalysis = {
    topCategory: maxEntry(categoryCounts),
    categoryCounts,
    topArea: maxEntry(areaCounts),
    areaCounts,
  };

  const xpGained = computeXp({
    visitedCount: activity.visitedPlaceCount,
    reviewCount: activity.reviewCount,
    completedCourseCount: activity.completedCourseCount,
    emotionLogCount: activity.emotionLogCount,
  });
  const xpBefore = computeXp({
    visitedCount: visitedCountBefore,
    reviewCount: reviewCountBefore,
    completedCourseCount: completedCourseCountBefore,
    emotionLogCount: emotionLogCountBefore,
  });
  const levelBefore = computeLevel(xpBefore);
  const levelAfter = computeLevel(xpBefore + xpGained);
  const growth: MonthlyReportGrowth = {
    xpGained,
    levelBefore,
    levelAfter,
    leveledUp: levelAfter.level > levelBefore.level,
    newBadges: buildNewBadges(allEarnedBadges, startISO, endISO),
  };

  const isEmpty =
    activity.emotionLogCount === 0 &&
    activity.visitedPlaceCount === 0 &&
    activity.reviewCount === 0 &&
    activity.completedCourseCount === 0 &&
    growth.newBadges.length === 0;

  return {
    monthKey: { year, month },
    rangeStartISO: startISO,
    rangeEndISO: endISO,
    activity,
    emotion,
    place,
    growth,
    isEmpty,
  };
}
