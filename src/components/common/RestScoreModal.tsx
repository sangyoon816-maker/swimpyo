'use client';

import { Trees, Volume1, Accessibility, Users, Moon, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import type { RestScoreDetail } from '@/types';

interface RestScoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  detail: RestScoreDetail;
  placeName: string;
}

const ITEMS: { key: keyof RestScoreDetail; label: string; icon: typeof Trees }[] = [
  { key: 'quiet', label: '조용함', icon: Volume1 },
  { key: 'nature', label: '녹지 비율', icon: Trees },
  { key: 'accessibility', label: '접근성', icon: Accessibility },
  { key: 'crowd', label: '혼잡도 (여유로움)', icon: Users },
  { key: 'nightView', label: '야경', icon: Moon },
  { key: 'satisfaction', label: '체류 만족도', icon: Smile },
];

export default function RestScoreModal({
  open,
  onOpenChange,
  score,
  detail,
  placeName,
}: RestScoreModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-[340px] p-5 border-none">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-bold text-[#1A1A1A]">
            {placeName}의 쉼 점수
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280]">
            쉼표 에디터가 6가지 기준을 직접 평가해 종합한 점수예요
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-end gap-1.5 -mt-1">
          <span className="text-[32px] font-bold text-[#5F8D4E] leading-none">
            {score.toFixed(1)}
          </span>
          <span className="text-sm text-[#6B7280] mb-1">/ 10 쉼 점수</span>
        </div>

        <p className="text-xs text-[#6B7280] leading-relaxed -mt-1">
          아래 항목은 각각 0~100점으로 평가되며, 점수가 높을수록 그 기준에서 머무르기 좋은 곳이에요.
        </p>

        <div className="space-y-4 mt-2">
          {ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const value = detail[item.key];
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: open ? 1 : 0, y: open ? 0 : 6 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} className="text-[#5F8D4E]" />
                    <span className="text-[13px] font-medium text-[#4B5563]">{item.label}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-[#5F8D4E]">{value}</span>
                </div>
                <Progress value={open ? value : 0} className="[&_[data-slot=progress-track]]:h-2" />
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
