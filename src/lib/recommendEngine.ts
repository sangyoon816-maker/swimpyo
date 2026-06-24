import { PLACES, getPlaceById, getPlacesByArea, getAreaForPlace, type Area } from '@/data/places';
import { getCourseById } from '@/data/courses';
import { fetchEmotionLogsSince } from '@/lib/emotionLogs';
import { fetchFavorites } from '@/lib/favorites';
import { fetchVisitedPlaces } from '@/lib/visitedPlaces';
import { fetchCompletedCourseIds } from '@/lib/courseProgress';
import { CATEGORY_LABELS, getObjectParticle } from '@/lib/utils';
import { EMOTION_NOUN_LABELS, topByCount } from '@/lib/restInsight';
import type { Emotion, EmotionLog, Favorite, Place, PlaceCategory, VisitedPlace } from '@/types';

/**
 * 추천 엔진 V1 — rule-based, no LLM call. Every score/reason is derived from
 * the user's own emotion_logs / favorites / visited_places rows.
 */

export interface PlaceRecommendation {
  place: Place;
  reasons: string[];
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const VISITED_PENALTY = 4;
const EMOTION_MATCH_BOOST = 3;
const SPACE_CATEGORY_BOOST = 3;
const TAG_OVERLAP_WEIGHT = 1.5;
const TOP_TAG_COUNT = 3;
const MAX_REASONS = 2;
const COURSE_COMPLETION_AREA_BOOST = 1.5;
const COURSE_COMPLETION_AREA_BOOST_CAP = 2;

type SpacePreference = 'indoor' | 'outdoor';

/** emotion + space preference → categories to boost, e.g. 지침 + 야외 선호 → 공원/산책길 */
const EMOTION_SPACE_CATEGORY_BOOST: Record<Emotion, Record<SpacePreference, PlaceCategory[]>> = {
  tired: { outdoor: ['park', 'trail'], indoor: ['cafe'] },
  stressed: { outdoor: ['park', 'viewpoint'], indoor: ['cafe', 'library'] },
  depressed: { outdoor: ['viewpoint', 'park'], indoor: ['culture', 'library'] },
  'need-clarity': { outdoor: ['trail', 'park'], indoor: ['library'] },
  'just-rest': { outdoor: ['park'], indoor: ['cafe', 'library'] },
};

function resolvePlaces(placeIds: string[]): Place[] {
  return placeIds.map((id) => getPlaceById(id)).filter((p): p is Place => p != null);
}

function detectSpacePreference(signalPlaces: Place[]): SpacePreference | null {
  const outdoorCount = signalPlaces.filter((p) => p.tags.includes('야외')).length;
  const indoorCount = signalPlaces.filter((p) => p.tags.includes('실내')).length;
  if (outdoorCount === indoorCount) return null;
  return outdoorCount > indoorCount ? 'outdoor' : 'indoor';
}

function topPreferredTags(signalPlaces: Place[]): string[] {
  const counts = new Map<string, number>();
  for (const place of signalPlaces) {
    for (const tag of place.tags) {
      if (tag === '야외' || tag === '실내') continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_TAG_COUNT)
    .map(([tag]) => tag);
}

/**
 * 코스 완주 → 관련 지역 추천 가중치 증가. 코스 자체엔 단일 지역이 없으므로
 * (정거장이 여러 동에 걸칠 수 있음) 완주한 코스의 정거장들이 속한 지역을
 * 모두 집계해, 완주할수록 그 지역 장소들의 점수를 조금씩 더 올려줍니다.
 */
function computeCompletedCourseAreaBoosts(completedCourseIds: string[]): Map<Area, number> {
  const boosts = new Map<Area, number>();

  for (const courseId of completedCourseIds) {
    const course = getCourseById(courseId);
    if (!course) continue;

    const areasInCourse = new Set(
      course.places
        .map((stop) => getAreaForPlace(stop.place))
        .filter((a): a is Area => a !== null)
    );

    for (const area of areasInCourse) {
      boosts.set(area, (boosts.get(area) ?? 0) + 1);
    }
  }

  return boosts;
}

/** Pure scoring — no I/O, easy to unit test or swap for a smarter model later. */
export function scoreRecommendations(
  recentLogs: EmotionLog[],
  favorites: Favorite[],
  visited: VisitedPlace[],
  limit = 3,
  candidatePlaces: Place[] = PLACES,
  completedCourseAreaBoosts: Map<Area, number> = new Map()
): PlaceRecommendation[] {
  const favoritedPlaces = resolvePlaces(favorites.map((f) => f.place_id));
  const visitedPlaces = resolvePlaces(visited.map((v) => v.place_id));
  const visitedIds = new Set(visited.map((v) => v.place_id));

  const topEmotion = topByCount(recentLogs.map((log) => log.emotion))?.key ?? null;
  const signalPlaces = [...favoritedPlaces, ...visitedPlaces];
  const preferredSpace = detectSpacePreference(signalPlaces);
  const preferredTags = topPreferredTags(signalPlaces);

  const scored = candidatePlaces.map((place) => {
    let score = place.restScore;
    const reasons: string[] = [];

    if (topEmotion && place.emotions.includes(topEmotion)) {
      score += EMOTION_MATCH_BOOST;
      reasons.push(`최근 '${EMOTION_NOUN_LABELS[topEmotion]}'을 가장 많이 느끼셨어요.`);
    }

    if (topEmotion && preferredSpace) {
      const boostedCategories = EMOTION_SPACE_CATEGORY_BOOST[topEmotion][preferredSpace];
      if (boostedCategories.includes(place.category)) {
        score += SPACE_CATEGORY_BOOST;
        reasons.push(
          preferredSpace === 'outdoor'
            ? '최근 야외 공간에서 자주 휴식하셨어요.'
            : '최근 실내 공간에서 자주 휴식하셨어요.'
        );
      }
    }

    const overlappingTags = place.tags.filter((t) => preferredTags.includes(t));
    if (overlappingTags.length > 0) {
      score += overlappingTags.length * TAG_OVERLAP_WEIGHT;
      const label = CATEGORY_LABELS[place.category];
      reasons.push(`${label}${getObjectParticle(label)} 선호하는 경향이 있습니다.`);
    }

    if (visitedIds.has(place.id)) {
      score -= VISITED_PENALTY;
    }

    const placeArea = getAreaForPlace(place);
    const completions = placeArea ? completedCourseAreaBoosts.get(placeArea) : undefined;
    if (placeArea && completions) {
      score += Math.min(completions, COURSE_COMPLETION_AREA_BOOST_CAP) * COURSE_COMPLETION_AREA_BOOST;
      reasons.push(`완주한 코스와 같은 '${placeArea}' 지역의 장소예요.`);
    }

    return { place, score, reasons: Array.from(new Set(reasons)) };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ place, reasons }) => ({
    place,
    reasons:
      reasons.length > 0
        ? reasons.slice(0, MAX_REASONS)
        : [`쉼 점수가 높은 ${CATEGORY_LABELS[place.category]}예요.`],
  }));
}

export async function recommendPlacesForUser(
  userId: string,
  limit = 3,
  area?: Area | null
): Promise<PlaceRecommendation[]> {
  const sinceISO = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();
  const [recentLogs, favorites, visited, completedCourseIds] = await Promise.all([
    fetchEmotionLogsSince(userId, sinceISO),
    fetchFavorites(userId),
    fetchVisitedPlaces(userId),
    fetchCompletedCourseIds(userId),
  ]);
  const candidatePlaces = area ? getPlacesByArea(area) : PLACES;
  const completedCourseAreaBoosts = computeCompletedCourseAreaBoosts(completedCourseIds);
  return scoreRecommendations(
    recentLogs,
    favorites,
    visited,
    limit,
    candidatePlaces,
    completedCourseAreaBoosts
  );
}
