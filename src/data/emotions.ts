import type { EmotionConfig } from '@/types';

export const EMOTIONS: EmotionConfig[] = [
  {
    id: 'tired',
    label: '지쳤어요',
    adjective: '지친',
    emoji: '😮‍💨',
    description: '몸도 마음도 지쳤을 때',
    color: '#5F8D4E',
    bgColor: '#EFF5EB',
  },
  {
    id: 'stressed',
    label: '스트레스 받아요',
    adjective: '스트레스 받은',
    emoji: '😤',
    description: '답답하고 스트레스가 쌓였을 때',
    color: '#E07A5F',
    bgColor: '#FDF0ED',
  },
  {
    id: 'depressed',
    label: '우울해요',
    adjective: '우울한',
    emoji: '🌧️',
    description: '기분이 가라앉고 우울할 때',
    color: '#6B8CAE',
    bgColor: '#EDF2F7',
  },
  {
    id: 'need-clarity',
    label: '생각 정리가 필요해요',
    adjective: '생각이 많은',
    emoji: '🌀',
    description: '복잡한 생각을 정리하고 싶을 때',
    color: '#A67C5B',
    bgColor: '#F5EFE8',
  },
  {
    id: 'just-rest',
    label: '그냥 쉬고 싶어요',
    adjective: '쉬고 싶은',
    emoji: '☁️',
    description: '아무 생각 없이 쉬고 싶을 때',
    color: '#7B7FBF',
    bgColor: '#F0F0FA',
  },
];

export const EMOTION_MAP: Record<string, EmotionConfig> = Object.fromEntries(
  EMOTIONS.map((e) => [e.id, e])
);
