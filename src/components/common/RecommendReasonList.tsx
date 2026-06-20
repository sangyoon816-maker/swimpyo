'use client';

import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RecommendReasonListProps {
  reasons: string[];
  className?: string;
}

export default function RecommendReasonList({ reasons, className }: RecommendReasonListProps) {
  if (reasons.length === 0) return null;

  return (
    <div className={cn('bg-[#EFF5EB] rounded-2xl p-3.5', className)}>
      <p className="text-[12px] font-bold text-[#5F8D4E] mb-2">추천 이유</p>
      <div className="flex flex-col gap-1.5">
        {reasons.map((reason, idx) => (
          <motion.div
            key={reason}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.3 }}
            className="flex items-center gap-1.5"
          >
            <CheckCircle2 size={13} className="text-[#5F8D4E] flex-shrink-0" />
            <span className="text-[13px] text-[#4A7039] leading-snug">{reason}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
