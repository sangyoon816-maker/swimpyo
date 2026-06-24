'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { PLACES, getPlacesByArea, type Area } from '@/data/places';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppStore } from '@/store/useAppStore';
import { attachDistance } from '@/lib/geo';
import type { PlaceCategory } from '@/types';
import AreaFilter from '@/components/map/AreaFilter';
import KakaoMap from '@/components/map/KakaoMap';
import CategoryTab from '@/components/common/CategoryTab';
import PlaceCard from '@/components/common/PlaceCard';
import EmptyState from '@/components/common/EmptyState';

export default function MapClient() {
  // seeds from the home screen's region selection on first mount; the
  // map's own filter row is then independently controllable from here on.
  const [selectedArea, setSelectedArea] = useState<Area | null>(
    () => useAppStore.getState().selectedArea
  );
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { coords, request } = useGeolocation();

  useEffect(() => {
    request();
  }, [request]);

  const filtered = useMemo(() => {
    let list = selectedArea ? getPlacesByArea(selectedArea) : PLACES;

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    return list;
  }, [selectedArea, selectedCategory]);

  const displayPlaces = useMemo(
    () => (coords ? attachDistance(filtered, coords) : filtered),
    [filtered, coords]
  );

  const handleMarkerClick = useCallback((placeId: string) => {
    setActivePlaceId(placeId);
    cardRefs.current[placeId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  return (
    <div>
      <AreaFilter selected={selectedArea} onChange={setSelectedArea} className="py-3" />
      <CategoryTab selected={selectedCategory} onChange={setSelectedCategory} className="pb-3" />

      <div className="px-4">
        <KakaoMap
          places={filtered}
          currentLocation={coords}
          onMarkerClick={handleMarkerClick}
          className="h-[320px]"
        />
      </div>

      <div className="px-4 pt-4 pb-2">
        <span className="text-sm text-[#6B7280]">
          <span className="font-semibold text-[#1A1A1A]">{filtered.length}</span>개의 장소
        </span>
      </div>

      <div className="px-4 flex flex-col gap-3 pb-4">
        {displayPlaces.length === 0 ? (
          <EmptyState
            emoji="🗺️"
            title="조건에 맞는 장소가 없어요"
            desc={'다른 지역이나 카테고리로\n다시 찾아보세요'}
          />
        ) : (
          displayPlaces.map((place) => (
            <div
              key={place.id}
              ref={(el) => {
                cardRefs.current[place.id] = el;
              }}
              className={cn(
                'rounded-2xl transition-shadow',
                activePlaceId === place.id && 'ring-2 ring-[#5F8D4E]'
              )}
            >
              <PlaceCard place={place} variant="horizontal" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
