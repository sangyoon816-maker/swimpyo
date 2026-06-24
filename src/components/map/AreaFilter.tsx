'use client';

import { cn } from '@/lib/utils';
import { AREAS, type Area } from '@/data/places';

interface AreaFilterProps {
  selected: Area | null;
  onChange: (area: Area | null) => void;
  className?: string;
}

export default function AreaFilter({ selected, onChange, className }: AreaFilterProps) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto no-scrollbar px-4', className)}>
      <button
        onClick={() => onChange(null)}
        className={cn(
          'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200',
          selected === null
            ? 'bg-[#5F8D4E] border-[#5F8D4E] text-white'
            : 'bg-white border-[#E8E4DD] text-[#6B7280]'
        )}
      >
        전체
      </button>
      {AREAS.map((area) => (
        <button
          key={area}
          onClick={() => onChange(area === selected ? null : area)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200',
            selected === area
              ? 'bg-[#5F8D4E] border-[#5F8D4E] text-white'
              : 'bg-white border-[#E8E4DD] text-[#6B7280]'
          )}
        >
          {area}
        </button>
      ))}
    </div>
  );
}
