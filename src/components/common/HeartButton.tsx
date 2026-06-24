'use client';

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeartButtonProps {
  saved: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: number;
  unsavedClassName?: string;
  className?: string;
}

export default function HeartButton({
  saved,
  onClick,
  size = 18,
  unsavedClassName = 'text-[#D1CFC9]',
  className,
}: HeartButtonProps) {
  return (
    <button onClick={onClick} aria-label={saved ? '찜 해제하기' : '찜하기'} className={className}>
      <motion.span
        key={saved ? 'saved' : 'unsaved'}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className="inline-flex"
      >
        <Heart
          size={size}
          className={cn('transition-colors', saved ? 'fill-rose-500 text-rose-500' : unsavedClassName)}
        />
      </motion.span>
    </button>
  );
}
