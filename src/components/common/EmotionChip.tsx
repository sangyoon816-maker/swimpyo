'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EMOTION_MAP } from '@/data/emotions';
import type { Emotion } from '@/types';

interface EmotionChipProps {
  emotion: Emotion;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function EmotionChip({
  emotion,
  selected = false,
  onClick,
  size = 'md',
  className,
}: EmotionChipProps) {
  const config = EMOTION_MAP[emotion];
  if (!config) return null;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-[15px] gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'flex items-center rounded-full border-2 font-medium transition-all duration-200 cursor-pointer select-none',
        sizeClasses[size],
        selected
          ? 'border-[#5F8D4E] text-[#5F8D4E] shadow-sm'
          : 'border-[#E8E4DD] text-[#6B7280] hover:border-[#A4BE7B]',
        className
      )}
      style={
        selected
          ? { backgroundColor: config.bgColor }
          : { backgroundColor: 'white' }
      }
    >
      <span className="text-base leading-none">{config.emoji}</span>
      <span className="leading-none whitespace-nowrap">{config.label}</span>
    </motion.button>
  );
}
