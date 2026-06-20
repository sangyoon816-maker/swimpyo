'use client';

import { motion } from 'framer-motion';
import { ACTIVITY_EMOJIS, ACTIVITY_LABELS, cn } from '@/lib/utils';
import type { RecommendActivity } from '@/types';

interface ActivityChipsProps {
  activities: RecommendActivity[];
  className?: string;
}

export default function ActivityChips({ activities, className }: ActivityChipsProps) {
  if (activities.length === 0) return null;

  return (
    <div className={cn('flex gap-2 flex-wrap', className)}>
      {activities.map((activity, idx) => (
        <motion.div
          key={activity}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05, duration: 0.25 }}
          className="flex items-center gap-1.5 bg-white border border-[#E8E4DD] rounded-full px-3.5 py-2"
        >
          <span className="text-base leading-none">{ACTIVITY_EMOJIS[activity]}</span>
          <span className="text-[13px] font-medium text-[#4B5563]">
            {ACTIVITY_LABELS[activity]}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
