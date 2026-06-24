import { supabase } from '@/lib/supabase';
import { getPlaceById } from '@/data/places';
import { CATEGORY_LABELS } from '@/lib/utils';
import type { Place, PlaceCategory } from '@/types';

export interface PlaceFeedbackStat {
  place_id: string;
  likes: number;
  dislikes: number;
}

export interface PlacePerformance {
  place: Place;
  likes: number;
  dislikes: number;
  total: number;
  successRate: number;
}

export interface CategoryPerformance {
  category: PlaceCategory;
  likes: number;
  dislikes: number;
  total: number;
  successRate: number;
}

export interface RecommendationAnalytics {
  overall: { likes: number; dislikes: number; total: number };
  places: PlacePerformance[];
  categories: CategoryPerformance[];
  topPlaces: PlacePerformance[];
  bottomPlaces: PlacePerformance[];
}

async function fetchPlaceFeedbackStats(): Promise<PlaceFeedbackStat[]> {
  const { data, error } = await supabase.rpc('recommendation_feedback_place_stats');
  if (error) throw error;
  return (data ?? []) as PlaceFeedbackStat[];
}

function successRateOf(likes: number, dislikes: number): number {
  const total = likes + dislikes;
  return total > 0 ? Math.round((likes / total) * 100) : 0;
}

function buildPlacePerformance(stats: PlaceFeedbackStat[]): PlacePerformance[] {
  return stats
    .map((s) => {
      const place = getPlaceById(s.place_id);
      if (!place) return null;
      return {
        place,
        likes: s.likes,
        dislikes: s.dislikes,
        total: s.likes + s.dislikes,
        successRate: successRateOf(s.likes, s.dislikes),
      };
    })
    .filter((p): p is PlacePerformance => p !== null)
    .sort((a, b) => b.total - a.total);
}

function buildCategoryPerformance(places: PlacePerformance[]): CategoryPerformance[] {
  const totals = new Map<PlaceCategory, { likes: number; dislikes: number }>();

  for (const p of places) {
    const entry = totals.get(p.place.category) ?? { likes: 0, dislikes: 0 };
    entry.likes += p.likes;
    entry.dislikes += p.dislikes;
    totals.set(p.place.category, entry);
  }

  return (Object.keys(CATEGORY_LABELS) as PlaceCategory[]).map((category) => {
    const entry = totals.get(category) ?? { likes: 0, dislikes: 0 };
    return {
      category,
      likes: entry.likes,
      dislikes: entry.dislikes,
      total: entry.likes + entry.dislikes,
      successRate: successRateOf(entry.likes, entry.dislikes),
    };
  });
}

/** Ranks places with at least one evaluation — there's nothing meaningful to rank otherwise. */
function rankByRate(
  places: PlacePerformance[],
  direction: 'top' | 'bottom',
  limit: number
): PlacePerformance[] {
  return [...places]
    .filter((p) => p.total > 0)
    .sort((a, b) =>
      direction === 'top'
        ? b.successRate - a.successRate || b.total - a.total
        : a.successRate - b.successRate || b.total - a.total
    )
    .slice(0, limit);
}

export async function getRecommendationAnalytics(): Promise<RecommendationAnalytics> {
  const stats = await fetchPlaceFeedbackStats();
  const places = buildPlacePerformance(stats);
  const categories = buildCategoryPerformance(places);
  const overall = places.reduce(
    (acc, p) => ({
      likes: acc.likes + p.likes,
      dislikes: acc.dislikes + p.dislikes,
      total: acc.total + p.total,
    }),
    { likes: 0, dislikes: 0, total: 0 }
  );

  return {
    overall,
    places,
    categories,
    topPlaces: rankByRate(places, 'top', 5),
    bottomPlaces: rankByRate(places, 'bottom', 5),
  };
}
