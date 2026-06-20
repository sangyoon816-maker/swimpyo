'use client';

import SectionTitle from '@/components/common/SectionTitle';
import PlaceCard from '@/components/common/PlaceCard';
import { PLACES } from '@/data/places';

export default function NearbySection() {
  const nearbyPlaces = PLACES.slice(0, 4);

  return (
    <section className="py-6">
      <SectionTitle
        title="가까운 쉼터"
        subtitle="성수동 기준 · 도보 거리"
        moreHref="/places"
        className="mb-4"
      />
      <div className="px-4 flex flex-col gap-3">
        {nearbyPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}
