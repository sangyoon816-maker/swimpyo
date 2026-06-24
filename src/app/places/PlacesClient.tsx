'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PlaceCard from '@/components/common/PlaceCard';
import EmotionChip from '@/components/common/EmotionChip';
import CategoryTab from '@/components/common/CategoryTab';
import EmptyState from '@/components/common/EmptyState';
import { PLACES } from '@/data/places';
import { EMOTIONS } from '@/data/emotions';
import type { Emotion, PlaceCategory } from '@/types';

interface PlacesClientProps {
  initialEmotion?: string;
  initialQuery?: string;
}

export default function PlacesClient({ initialEmotion, initialQuery }: PlacesClientProps) {
  const [query, setQuery] = useState(initialQuery ?? '');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(
    (initialEmotion as Emotion) ?? null
  );
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);

  const filtered = useMemo(() => {
    let list = [...PLACES];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (selectedEmotion) {
      list = list.filter((p) => p.emotions.includes(selectedEmotion));
    }

    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }

    list.sort((a, b) => b.restScore - a.restScore);

    return list;
  }, [query, selectedEmotion, selectedCategory]);

  return (
    <div>
      {/* 검색창 */}
      <div className="px-4 py-3 sticky top-14 bg-[#FAF9F6]/95 backdrop-blur-md z-30 border-b border-[#E8E4DD]/50">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="장소, 동네 검색..."
            className="w-full bg-white border border-[#E8E4DD] rounded-xl pl-9 pr-4 py-2.5 text-[14px] text-[#1A1A1A] placeholder:text-[#C4BFB8] outline-none focus:border-[#5F8D4E] focus:ring-2 focus:ring-[#5F8D4E]/15 transition-all"
          />
        </div>
      </div>

      {/* 감정 필터 */}
      <div className="py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
          <button
            onClick={() => setSelectedEmotion(null)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
              !selectedEmotion
                ? 'bg-[#5F8D4E] border-[#5F8D4E] text-white'
                : 'bg-white border-[#E8E4DD] text-[#6B7280]'
            }`}
          >
            전체
          </button>
          {EMOTIONS.map((e) => (
            <EmotionChip
              key={e.id}
              emotion={e.id}
              selected={selectedEmotion === e.id}
              onClick={() =>
                setSelectedEmotion(selectedEmotion === e.id ? null : e.id)
              }
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* 카테고리 탭 */}
      <CategoryTab
        selected={selectedCategory}
        onChange={setSelectedCategory}
        className="pb-3"
      />

      {/* 결과 수 */}
      <div className="flex items-center justify-between px-4 pb-3">
        <span className="text-sm text-[#6B7280]">
          <span className="font-semibold text-[#1A1A1A]">{filtered.length}</span>개의 장소
        </span>
        <span className="text-xs px-3 py-1.5 rounded-full bg-[#1A1A1A] text-white">
          쉼 점수순
        </span>
      </div>

      {/* 장소 목록 */}
      <div className="px-4 flex flex-col gap-3 pb-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <EmptyState
              emoji="🌿"
              title="검색 결과가 없어요"
              desc={'다른 키워드나 감정으로\n다시 찾아보세요'}
            />
          ) : (
            filtered.map((place, idx) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: idx * 0.04 }}
              >
                <PlaceCard place={place} variant="horizontal" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
