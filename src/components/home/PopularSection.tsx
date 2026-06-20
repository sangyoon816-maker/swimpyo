'use client';

import SectionTitle from '@/components/common/SectionTitle';
import PlaceCard from '@/components/common/PlaceCard';
import { PLACES } from '@/data/places';

export default function PopularSection() {
  const popular = [...PLACES]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 6);

  return (
    <section className="py-6">
      <SectionTitle
        title="요즘 핫한 쉼터"
        subtitle="리뷰 많은 순"
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
