import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

export function formatRestScore(score: number): string {
  return score.toFixed(1);
}

export function getObjectParticle(word: string): '을' | '를' {
  const lastChar = word.trim().at(-1);
  if (!lastChar) return '를';
  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return '를';
  const finalConsonant = (code - 0xac00) % 28;
  return finalConsonant === 0 ? '를' : '을';
}

export const CATEGORY_LABELS: Record<string, string> = {
  park: '공원',
  trail: '산책길',
  viewpoint: '전망 명소',
  cafe: '카페',
  library: '도서관',
  culture: '문화공간',
};

export const CATEGORY_EMOJIS: Record<string, string> = {
  park: '🌿',
  trail: '🚶',
  viewpoint: '🌅',
  cafe: '☕',
  library: '📚',
  culture: '🎨',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
};

export const ACTIVITY_LABELS: Record<string, string> = {
  walk: '산책',
  read: '독서',
  daydream: '멍때리기',
  sunset: '노을 감상',
  photo: '사진 촬영',
  picnic: '피크닉',
};

export const ACTIVITY_EMOJIS: Record<string, string> = {
  walk: '🚶',
  read: '📖',
  daydream: '☁️',
  sunset: '🌇',
  photo: '📸',
  picnic: '🧺',
};
