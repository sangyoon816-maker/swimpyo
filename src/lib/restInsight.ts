import { getPlaceById } from '@/data/places';
import { CATEGORY_LABELS, getObjectParticle } from '@/lib/utils';
import { INDOOR_CATEGORIES, OUTDOOR_CATEGORIES } from '@/lib/diagnosis';
import type { Emotion, EmotionLog, Favorite, PlaceCategory, VisitedPlace } from '@/types';

/**
 * Rule-based "쉼 인사이트" copy generation. No LLM call — every sentence is
 * derived from simple counts over the user's own emotion_logs / favorites /
 * visited_places rows.
 */

export const EMOTION_NOUN_LABELS: Record<Emotion, string> = {
  tired: '지침',
  stressed: '스트레스',
  depressed: '우울함',
  'need-clarity': '생각 과잉',
  'just-rest': '무기력',
};

export function topByCount<K extends string>(items: K[]): { key: K; count: number } | null {
  if (items.length === 0) return null;
  const counts = new Map<K, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);

  let topKey = items[0];
  let topCount = 0;
  for (const [key, count] of counts) {
    if (count > topCount) {
      topKey = key;
      topCount = count;
    }
  }
  return { key: topKey, count: topCount };
}

export function buildTopEmotionSentence(recentLogs: EmotionLog[]): string | null {
  const top = topByCount(recentLogs.map((log) => log.emotion));
  if (!top) return null;
  return `최근 7일간 가장 많이 느낀 감정은 '${EMOTION_NOUN_LABELS[top.key]}'입니다.`;
}

export function buildTopVisitedCategorySentence(visited: VisitedPlace[]): string | null {
  const categories = visited
    .map((v) => getPlaceById(v.place_id)?.category)
    .filter((c): c is PlaceCategory => c != null);

  const top = topByCount(categories);
  if (!top) return null;

  const percentage = Math.round((top.count / categories.length) * 100);
  return `최근 방문 장소의 ${percentage}%가 ${CATEGORY_LABELS[top.key]}입니다.`;
}

export function buildSpacePreferenceSentence(favorites: Favorite[]): string | null {
  const categories = favorites
    .map((f) => getPlaceById(f.place_id)?.category)
    .filter((c): c is PlaceCategory => c != null);
  if (categories.length === 0) return null;

  const indoor = categories.filter((c) => INDOOR_CATEGORIES.includes(c));
  const outdoor = categories.filter((c) => OUTDOOR_CATEGORIES.includes(c));
  if (indoor.length === outdoor.length) return null;

  if (outdoor.length > indoor.length) {
    const topIndoor = topByCount(indoor);
    const label = topIndoor ? CATEGORY_LABELS[topIndoor.key] : '실내 공간';
    return `${label}보다 야외 공간을 선호하는 경향이 있습니다.`;
  }

  const topOutdoor = topByCount(outdoor);
  const label = topOutdoor ? CATEGORY_LABELS[topOutdoor.key] : '야외 공간';
  return `야외 공간보다 ${label}${getObjectParticle(label)} 선호하는 경향이 있습니다.`;
}

export interface RestInsight {
  sentences: string[];
}

export function buildRestInsight(
  recentLogs: EmotionLog[],
  visited: VisitedPlace[],
  favorites: Favorite[]
): RestInsight {
  const sentences = [
    buildTopEmotionSentence(recentLogs),
    buildTopVisitedCategorySentence(visited),
    buildSpacePreferenceSentence(favorites),
  ].filter((s): s is string => s != null);

  return { sentences };
}
