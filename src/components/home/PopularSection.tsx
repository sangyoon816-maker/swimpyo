'use client';

import SectionTitle from '@/components/common/SectionTitle';
import PlaceCard from '@/components/common/PlaceCard';
import { PLACES } from '@/data/places';

export default function PopularSection() {
  const popular = [...PLACES]
    .sort((a, b) => b.restScore - a.restScore)
    .slice(0, 6);

  return (
    <section className="py-6">
      <SectionTitle
        title="쉼 점수 높은 쉼터"
        subtitle="쉼표가 매긴 점수 기준"
        moreHref="/places"
        className="mb-4"
      />
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
        {popular.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            variant="compact"
          />
        ))}
      </div>
    </section>
  );
}
