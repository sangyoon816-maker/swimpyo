'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatDistance } from '@/lib/utils';
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/lib/utils';
import { estimateWalkMinutes } from '@/lib/geo';
import RestScore from './RestScore';
import HeartButton from './HeartButton';
import { useAppStore } from '@/store/useAppStore';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import type { Emotion, Place } from '@/types';

interface PlaceCardProps {
  place: Place;
  variant?: 'default' | 'compact' | 'horizontal';
  className?: string;
  contextEmotion?: Emotion;
}

export default function PlaceCard({
  place,
  variant = 'default',
  className,
  contextEmotion,
}: PlaceCardProps) {
  const { isSaved } = useAppStore();
  const { toggleFavorite } = useFavoriteToggle();
  const saved = isSaved(place.id);
  const href = contextEmotion ? `/places/${place.id}?emotion=${contextEmotion}` : `/places/${place.id}`;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(place.id);
  };

  if (variant === 'horizontal') {
    return (
      <Link href={href}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-[#F0EDE8]',
            className
          )}
        >
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={place.thumbnail}
              alt={place.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="flex-1 min-w-0 py-0.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs text-[#5F8D4E] font-medium">
                  {CATEGORY_EMOJIS[place.category]} {CATEGORY_LABELS[place.category]}
                </span>
                <h2 className="text-[15px] font-semibold text-[#1A1A1A] mt-0.5 leading-tight">
                  {place.name}
                </h2>
              </div>
              <HeartButton saved={saved} onClick={handleSave} size={18} className="p-1 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MapPin size={12} className="text-[#6B7280]" />
              {place.distance !== undefined ? (
                <span className="text-xs text-[#6B7280]">
                  {formatDistance(place.distance)} · 🚶 도보 {estimateWalkMinutes(place.distance)}분
                </span>
              ) : (
                <span className="text-xs text-[#6B7280]">{place.neighborhood}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <RestScore score={place.restScore} size="sm" />
              {place.isFree && (
                <span className="text-[10px] font-medium text-[#5F8D4E] bg-[#EFF5EB] px-2 py-0.5 rounded-full">
                  무료
                </span>
              )}
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {place.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-[#6B7280] bg-[#F5F3EF] px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={href}>
        <motion.div
          whileTap={{ scale: 0.97 }}
          className={cn(
            'bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F0EDE8] w-[160px] flex-shrink-0',
            className
          )}
        >
          <div className="relative h-[110px]">
            <Image
              src={place.thumbnail}
              alt={place.name}
              fill
              className="object-cover"
              sizes="160px"
            />
            <HeartButton
              saved={saved}
              onClick={handleSave}
              size={14}
              className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center"
            />
          </div>
          <div className="p-2.5">
            <span className="text-[10px] text-[#5F8D4E] font-medium">
              {CATEGORY_EMOJIS[place.category]} {CATEGORY_LABELS[place.category]}
            </span>
            <h2 className="text-[13px] font-semibold text-[#1A1A1A] mt-0.5 leading-tight line-clamp-2">
              {place.name}
            </h2>
            <RestScore score={place.restScore} size="sm" showLabel={false} className="mt-1.5" />
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={href}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={cn(
          'bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F0EDE8]',
          className
        )}
      >
        <div className="relative h-[200px]">
          <Image
            src={place.thumbnail}
            alt={place.name}
            fill
            className="object-cover"
            sizes="(max-width: 430px) 100vw, 430px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <HeartButton
            saved={saved}
            onClick={handleSave}
            size={18}
            unsavedClassName="text-[#6B7280]"
            className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
          />
          {place.isFree && (
            <span className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-[#5F8D4E] px-2.5 py-1 rounded-full">
              무료
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#5F8D4E] font-medium">
                {CATEGORY_EMOJIS[place.category]} {CATEGORY_LABELS[place.category]}
              </span>
              <h2 className="text-[17px] font-semibold text-[#1A1A1A] mt-0.5">
                {place.name}
              </h2>
            </div>
            <RestScore score={place.restScore} size="sm" />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <MapPin size={13} className="text-[#6B7280]" />
            <span className="text-xs text-[#6B7280]">
              {place.neighborhood} · {place.district}
            </span>
          </div>
          <p className="text-sm text-[#6B7280] mt-2 line-clamp-2 leading-relaxed">
            {place.description}
          </p>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {place.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs text-[#6B7280] bg-[#F5F3EF] px-2.5 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
