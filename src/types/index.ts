import type { PlaceTag } from '@/data/tags';

export type Emotion =
  | 'tired'
  | 'stressed'
  | 'depressed'
  | 'need-clarity'
  | 'just-rest';

export type PlaceCategory =
  | 'park'
  | 'trail'
  | 'viewpoint'
  | 'cafe'
  | 'library'
  | 'culture';

export interface EmotionConfig {
  id: Emotion;
  label: string;
  adjective: string;
  emoji: string;
  description: string;
  color: string;
  bgColor: string;
}

export interface RestScoreDetail {
  quiet: number;
  nature: number;
  accessibility: number;
  crowd: number;
  nightView: number;
  satisfaction: number;
}

export type RecommendActivity =
  | 'walk'
  | 'read'
  | 'daydream'
  | 'sunset'
  | 'photo'
  | 'picnic';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  neighborhood: string;
  district: string;
  latitude: number;
  longitude: number;
  distance?: number;
  restScore: number;
  restScoreDetail: RestScoreDetail;
  estimatedStayMinutes: number;
  recommendActivities: RecommendActivity[];
  images: string[];
  thumbnail: string;
  tags: PlaceTag[];
  description: string;
  recommendReason: string;
  openHours?: string;
  isFree: boolean;
  emotions: Emotion[];
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  totalDistance: number;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  restScore: number;
  tags: string[];
  places: CoursePlaceStop[];
  emotions: Emotion[];
  reviewCount: number;
}

export interface CoursePlaceStop {
  order: number;
  place: Place;
  stayDuration: number;
  memo?: string;
}

export interface EmotionRecord {
  id: string;
  emotion: Emotion;
  note?: string;
  stressScore: number;
  fatigueScore: number;
  recommendedPlaces: Place[];
  createdAt: string;
}

export interface EmotionLog {
  id: string;
  user_id: string;
  emotion: Emotion;
  note: string | null;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
}

export interface VisitedPlace {
  id: string;
  user_id: string;
  place_id: string;
  visited_at: string;
}

export interface RecommendationFeedback {
  id: string;
  user_id: string;
  place_id: string;
  liked: boolean;
  created_at: string;
}

export interface PlaceReview {
  id: string;
  user_id: string;
  place_id: string;
  content: string;
  liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  current_stop: number;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface EmotionInsight {
  title: string;
  description: string;
}

export type SocialPreference = 'with' | 'alone';
export type WalkPreference = 'long' | 'short';
export type SpacePreference = 'indoor' | 'outdoor';

export interface DiagnosisAnswers {
  social: SocialPreference;
  walk: WalkPreference;
  space: SpacePreference;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  savedPlaces: string[];
  visitedPlaces: VisitRecord[];
  emotionRecords: EmotionRecord[];
}

export interface VisitRecord {
  placeId: string;
  visitedAt: string;
  rating?: number;
}

export interface FilterOptions {
  category?: PlaceCategory;
  emotion?: Emotion;
  district?: string;
  tags?: PlaceTag[];
  maxDistance?: number;
  isFree?: boolean;
  minRestScore?: number;
}
