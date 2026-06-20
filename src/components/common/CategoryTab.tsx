'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/lib/utils';
import type { PlaceCategory } from '@/types';

const CATEGORIES: PlaceCategory[] = [
  'park',
  'trail',
  'viewpoint',
  'cafe',
  'library',
  'culture',
];

interface CategoryTabProps {
  selected: PlaceCategory | null;
  onChange: (cat: PlaceCategory | null) => void;
  className?: string;
}

export default function CategoryTab({
  selected,
  onChange,
  className,
}: CategoryTabProps) {
  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto no-scrollbar px-4',
        className
      )}
    >
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
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat === selected ? null : cat)}
          className={cn(
            'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200',
            selected === cat
              ? 'bg-[#5F8D4E] border-[#5F8D4E] text-white'
              : 'bg-white border-[#E8E4DD] text-[#6B7280]'
          )}
        >
          <span>{CATEGORY_EMOJIS[cat]}</span>
          <span>{CATEGORY_LABELS[cat]}</span>
        </button>
      ))}
    </div>
  );
}
