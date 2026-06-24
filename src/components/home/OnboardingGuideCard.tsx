'use client';

import Link from 'next/link';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function OnboardingGuideCard() {
  const { user, loading: authLoading } = useAuth();
  const { progress, loading, error } = useOnboardingProgress(user?.id);

  if (authLoading || !user) return null;

  if (loading) {
    return (
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-[#F0EDE8] shadow-sm p-4">
        <Skeleton className="h-5 w-32 rounded mb-3" />
        <Skeleton className="h-2 w-full rounded-full mb-3" />
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-9 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return null;

  if (progress.isComplete) {
    return (
      <div className="mx-4 mt-4 flex items-center gap-2 bg-[#EFF5EB] rounded-2xl px-4 py-3">
        <span className="text-lg">🎉</span>
        <p className="text-sm font-semibold text-[#5F8D4E]">
          첫 쉼 완료 · 쉼표의 모든 핵심 기능을 경험했어요
        </p>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-4 bg-white rounded-2xl border border-[#F0EDE8] shadow-sm p-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🌱</span>
          <h3 className="text-[15px] font-bold text-[#1A1A1A]">첫 쉼 시작하기</h3>
        </div>
        <span className="text-xs font-semibold text-[#5F8D4E]">
          {progress.completedCount}/{progress.totalCount} 완료
        </span>
      </div>

      <Progress
        value={progress.percent}
        className="mb-3 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-[#5F8D4E]"
      />

      <div className="space-y-1">
        {progress.steps.map((step) =>
          step.done ? (
            <div key={step.id} className="flex items-center gap-2.5 px-1 py-1.5">
              <CheckCircle2 size={18} className="text-[#5F8D4E] flex-shrink-0" />
              <span className="text-sm text-[#6B7280] line-through">{step.label}</span>
            </div>
          ) : (
            <Link
              key={step.id}
              href={step.href}
              className="flex items-center gap-2.5 px-1 py-1.5 -mx-1 rounded-xl hover:bg-[#F5F3EF] transition-colors"
            >
              <span className="w-[18px] h-[18px] rounded-full border-2 border-[#E8E4DD] flex-shrink-0" />
              <span className="text-sm font-medium text-[#1A1A1A] flex-1">{step.label}</span>
              <ChevronRight size={15} className="text-[#C4BFB8]" />
            </Link>
          )
        )}
      </div>
    </div>
  );
}
