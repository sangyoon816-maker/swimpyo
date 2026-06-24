import type { PlaceCategory } from '@/types';

export interface BadgeDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'first-rest', name: '첫 쉼', emoji: '🌱', description: '첫 장소를 방문했어요' },
  { id: 'park-explorer', name: '공원 탐험가', emoji: '🌳', description: '공원 5곳을 방문했어요' },
  { id: 'library-lover', name: '도서관 마니아', emoji: '📚', description: '도서관 5곳을 방문했어요' },
  { id: 'trail-lover', name: '산책길 애호가', emoji: '🥾', description: '산책길 5곳을 방문했어요' },
  { id: 'reviewer', name: '후기 작성자', emoji: '✍️', description: '후기 10개를 작성했어요' },
  { id: 'course-finisher', name: '코스 완주자', emoji: '🏁', description: '코스 1개를 완주했어요' },
  { id: 'course-master', name: '코스 마스터', emoji: '🏆', description: '코스 5개를 완주했어요' },
  {
    id: 'rest-master',
    name: '쉼 마스터',
    emoji: '👑',
    description: '방문 20회 + 후기 10개 + 코스 5개를 달성했어요',
  },
];

export interface XpStats {
  visitedCount: number;
  reviewCount: number;
  completedCourseCount: number;
  emotionLogCount: number;
}

export interface ActivityStats extends XpStats {
  categoryVisitCounts: Partial<Record<PlaceCategory, number>>;
}

const XP_PER_VISIT = 10;
const XP_PER_REVIEW = 15;
const XP_PER_COURSE_COMPLETION = 50;
const XP_PER_EMOTION_LOG = 5;

export function computeXp(stats: XpStats): number {
  return (
    stats.visitedCount * XP_PER_VISIT +
    stats.reviewCount * XP_PER_REVIEW +
    stats.completedCourseCount * XP_PER_COURSE_COMPLETION +
    stats.emotionLogCount * XP_PER_EMOTION_LOG
  );
}

interface LevelDefinition {
  level: number;
  name: string;
  minXp: number;
}

const LEVELS: LevelDefinition[] = [
  { level: 1, name: '새싹', minXp: 0 },
  { level: 2, name: '쉼 입문자', minXp: 100 },
  { level: 3, name: '쉼 탐험가', minXp: 250 },
  { level: 4, name: '쉼 수집가', minXp: 500 },
  { level: 5, name: '쉼 마스터', minXp: 900 },
];

export interface LevelInfo {
  level: number;
  name: string;
  currentMinXp: number;
  nextMinXp: number | null;
}

export function computeLevel(xp: number): LevelInfo {
  let currentIdx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) currentIdx = i;
  }

  const current = LEVELS[currentIdx];
  const next = LEVELS[currentIdx + 1] ?? null;

  return {
    level: current.level,
    name: current.name,
    currentMinXp: current.minXp,
    nextMinXp: next ? next.minXp : null,
  };
}

/** Rule-based badge eligibility — every condition maps directly to real activity counts. */
export function computeEligibleBadgeIds(stats: ActivityStats): string[] {
  const ids: string[] = [];

  if (stats.visitedCount >= 1) ids.push('first-rest');
  if ((stats.categoryVisitCounts.park ?? 0) >= 5) ids.push('park-explorer');
  if ((stats.categoryVisitCounts.library ?? 0) >= 5) ids.push('library-lover');
  if ((stats.categoryVisitCounts.trail ?? 0) >= 5) ids.push('trail-lover');
  if (stats.reviewCount >= 10) ids.push('reviewer');
  if (stats.completedCourseCount >= 1) ids.push('course-finisher');
  if (stats.completedCourseCount >= 5) ids.push('course-master');
  if (stats.visitedCount >= 20 && stats.reviewCount >= 10 && stats.completedCourseCount >= 5) {
    ids.push('rest-master');
  }

  return ids;
}
