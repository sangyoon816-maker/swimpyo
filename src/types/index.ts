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
  recommendActivities: RecommendActivity[];
  images: string[];
  thumbnail: string;
  tags: string[];
  description: string;
  recommendReason: string;
  openHours?: string;
  isFree: boolean;
  reviewCount: number;
  reviews: Review[];
  emotions: Emotion[];
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  emotion: Emotion;
  visitedAt: string;
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
  maxDistance?: number;
  isFree?: boolean;
  minRestScore?: number;
}
