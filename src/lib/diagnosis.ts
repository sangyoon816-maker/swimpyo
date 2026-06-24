import { getPlacesByEmotion } from '@/data/places';
import { SOLO_FRIENDLY_TAGS, type PlaceTag } from '@/data/tags';
import type { DiagnosisAnswers, Emotion, Place, PlaceCategory } from '@/types';

export interface DiagnosisOption {
  value: string;
  label: string;
}

export interface DiagnosisQuestion {
  id: keyof DiagnosisAnswers;
  emoji: string;
  question: string;
  options: [DiagnosisOption, DiagnosisOption];
}

export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: 'social',
    emoji: '🧑‍🤝‍🧑',
    question: '사람을 만나고 싶나요?',
    options: [
      { value: 'with', label: '네, 함께 있고 싶어요' },
      { value: 'alone', label: '아니요, 혼자가 좋아요' },
    ],
  },
  {
    id: 'walk',
    emoji: '🚶',
    question: '30분 이상 걸을 수 있나요?',
    options: [
      { value: 'long', label: '네, 충분히 걸을 수 있어요' },
      { value: 'short', label: '짧게 머물고 싶어요' },
    ],
  },
  {
    id: 'space',
    emoji: '🏡',
    question: '실내와 실외 중 어디가 좋나요?',
    options: [
      { value: 'outdoor', label: '실외, 바람을 쐬고 싶어요' },
      { value: 'indoor', label: '실내, 아늑한 곳이 좋아요' },
    ],
  },
];

export const INDOOR_CATEGORIES: PlaceCategory[] = ['cafe', 'library', 'culture'];
export const OUTDOOR_CATEGORIES: PlaceCategory[] = ['park', 'trail', 'viewpoint'];
const LONG_WALK_CATEGORIES: PlaceCategory[] = ['park', 'trail'];
const WITH_TAGS: PlaceTag[] = ['피크닉', '한강뷰', '분수쇼', '반려동물'];

/** Simple conditional scoring — no AI involved, easy to swap for a real model later. */
export function recommendFromDiagnosis(
  emotion: Emotion,
  answers: DiagnosisAnswers,
  limit = 3
): Place[] {
  const candidates = getPlacesByEmotion(emotion);
  const pool = candidates.length > 0 ? candidates : getPlacesByEmotion(emotion);

  const scored = pool.map((place) => {
    let score = place.restScore;

    if (answers.space === 'indoor' && INDOOR_CATEGORIES.includes(place.category)) score += 3;
    if (answers.space === 'outdoor' && OUTDOOR_CATEGORIES.includes(place.category)) score += 3;

    if (answers.walk === 'long' && LONG_WALK_CATEGORIES.includes(place.category)) score += 2;
    if (answers.walk === 'short' && !LONG_WALK_CATEGORIES.includes(place.category)) score += 2;

    if (answers.social === 'alone' && place.tags.some((t) => SOLO_FRIENDLY_TAGS.includes(t))) score += 2;
    if (answers.social === 'with' && place.tags.some((t) => WITH_TAGS.includes(t))) score += 2;

    return { place, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.place);
}
