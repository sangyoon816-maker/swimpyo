import { SOLO_FRIENDLY_TAGS } from '@/data/tags';
import type { Emotion, EmotionInsight, Place, RestScoreDetail } from '@/types';

/**
 * Rule-based "AI-style" copy & scoring. No LLM call — swap the body of each
 * function for a real API request later without touching call sites.
 */

const EMOTION_INSIGHTS: Record<Emotion, EmotionInsight> = {
  tired: {
    title: '오늘은 몸과 마음이 모두 지쳐있네요.',
    description: '30분 정도의 가벼운 산책이 도움이 될 수 있어요.',
  },
  stressed: {
    title: '답답하고 스트레스가 쌓인 하루였군요.',
    description: '조용하고 자연이 많은 공간에서 잠시 숨을 돌려보세요.',
  },
  depressed: {
    title: '기분이 조금 가라앉아 보이네요.',
    description: '햇빛과 트인 풍경이 마음을 한결 가볍게 해줄 거예요.',
  },
  'need-clarity': {
    title: '머릿속이 복잡하게 얽혀있는 것 같아요.',
    description: '천천히 걸을 수 있는 길이 생각을 자연스레 정리해줄 거예요.',
  },
  'just-rest': {
    title: '그저 아무 생각 없이 쉬고 싶은 순간이에요.',
    description: '아무것도 하지 않아도 괜찮은 공간을 추천해드릴게요.',
  },
};

export function getEmotionInsight(emotion: Emotion): EmotionInsight {
  return EMOTION_INSIGHTS[emotion];
}

const DIMENSION_LABELS: Record<keyof RestScoreDetail, string> = {
  quiet: '조용한 산책 가능',
  nature: '녹지 비율 높음',
  accessibility: '접근성 좋음',
  crowd: '혼잡도 낮음',
  nightView: '야경이 아름다움',
  satisfaction: '체류 만족도 높음',
};

const REASON_SCORE_THRESHOLD = 75;

export function getRecommendReasonBullets(place: Place): string[] {
  const detail = place.restScoreDetail;
  const ranked = (Object.keys(DIMENSION_LABELS) as (keyof RestScoreDetail)[])
    .map((key) => ({ label: DIMENSION_LABELS[key], value: detail[key] }))
    .sort((a, b) => b.value - a.value);

  const bullets = ranked
    .filter((r) => r.value >= REASON_SCORE_THRESHOLD)
    .map((r) => r.label);

  if (place.tags.some((t) => SOLO_FRIENDLY_TAGS.includes(t))) {
    bullets.push('혼자 방문 적합');
  }

  if (bullets.length < 3) {
    for (const r of ranked) {
      if (bullets.length >= 3) break;
      if (!bullets.includes(r.label)) bullets.push(r.label);
    }
  }

  return bullets.slice(0, 4);
}

interface MoodBaseline {
  stress: number;
  fatigue: number;
}

const MOOD_BASELINES: Record<Emotion, MoodBaseline> = {
  tired: { stress: 40, fatigue: 90 },
  stressed: { stress: 85, fatigue: 60 },
  depressed: { stress: 65, fatigue: 72 },
  'need-clarity': { stress: 70, fatigue: 50 },
  'just-rest': { stress: 30, fatigue: 55 },
};

export interface MoodAnalysis {
  stressScore: number;
  fatigueScore: number;
}

export function generateMoodAnalysis(emotion: Emotion, note?: string): MoodAnalysis {
  const base = MOOD_BASELINES[emotion];
  const noteBoost = note ? Math.min(10, Math.floor(note.trim().length / 8)) : 0;

  return {
    stressScore: Math.min(99, base.stress + noteBoost),
    fatigueScore: Math.min(99, base.fatigue + Math.floor(noteBoost / 2)),
  };
}
