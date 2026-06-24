'use client';

import { useEffect, useMemo, useState } from 'react';
import SectionTitle from '@/components/common/SectionTitle';
import PlaceCard from '@/components/common/PlaceCard';
import { PLACES, getPlacesByArea } from '@/data/places';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppStore } from '@/store/useAppStore';
import { attachDistance } from '@/lib/geo';
import { cn } from '@/lib/utils';

type SortBy = 'distance' | 'score';

export default function NearbySection() {
  const { status, coords, request } = useGeolocation();
  const selectedArea = useAppStore((s) => s.selectedArea);
  const [sortOverride, setSortOverride] = useState<SortBy | null>(null);
  const sortBy: SortBy = sortOverride ?? (status === 'success' ? 'distance' : 'score');

  useEffect(() => {
    request();
  }, [request]);

  const nearbyPlaces = useMemo(() => {
    const pool = selectedArea ? getPlacesByArea(selectedArea) : PLACES;

    if (sortBy === 'distance' && coords) {
      return attachDistance(pool, coords)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4);
    }
    return [...pool].sort((a, b) => b.restScore - a.restScore).slice(0, 4);
  }, [sortBy, coords, selectedArea]);

  const subtitle = [
    selectedArea,
    sortBy === 'distance' ? '현재 위치 기준 · 가까운 순' : '쉼 점수 높은 순',
  ]
    .filter(Boolean)
    .join(' · ');
  const canRetryLocation = status === 'denied' || status === 'error' || status === 'unsupported';

  return (
    <section className="py-6">
      <SectionTitle title="가까운 쉼터" subtitle={subtitle} moreHref="/places" className="mb-3" />

      <div className="flex items-center gap-2 px-4 mb-3">
        <button
          onClick={() => setSortOverride('distance')}
          disabled={status !== 'success'}
          className={cn(
            'text-xs px-3 py-1.5 rounded-full border transition-all',
            sortBy === 'distance'
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'bg-white text-[#6B7280] border-[#E8E4DD]',
            status !== 'success' && 'opacity-40 cursor-not-allowed'
          )}
        >
          📍 가까운 순
        </button>
        <button
          onClick={() => setSortOverride('score')}
          className={cn(
            'text-xs px-3 py-1.5 rounded-full border transition-all',
            sortBy === 'score'
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'bg-white text-[#6B7280] border-[#E8E4DD]'
          )}
        >
          🌿 쉼 점수순
        </button>
        {canRetryLocation && (
          <button onClick={() => request()} className="ml-auto text-xs text-[#5F8D4E] underline">
            위치 허용하기
          </button>
        )}
      </div>

      <div className="px-4 flex flex-col gap-3">
        {nearbyPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}
