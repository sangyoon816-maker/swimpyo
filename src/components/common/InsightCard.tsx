'use client';

import { Sparkles } from 'lucide-react';
import { useRestInsight } from '@/hooks/useRestInsight';
import { Skeleton } from '@/components/ui/skeleton';

interface InsightCardProps {
  userId: string | undefined;
}

export default function InsightCard({ userId }: InsightCardProps) {
  const { insight, loading, error, refresh } = useRestInsight(userId);

  if (!userId) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#F0EDE8] shadow-sm p-4 mx-4 mt-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles size={14} className="text-[#5F8D4E]" />
        <h3 className="text-[15px] font-bold text-[#1A1A1A]">쉼 인사이트</h3>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
          <Skeleton className="h-4 w-3/5 rounded" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#E07A5F]">{error}</p>
          <button
            onClick={() => refresh()}
            className="flex-shrink-0 text-xs font-semibold text-[#5F8D4E] underline"
          >
            다시 시도
          </button>
        </div>
      ) : insight.sentences.length === 0 ? (
        <p className="text-sm text-[#6B7280] leading-relaxed">
          아직 분석할 데이터가 부족해요. 감정을 기록하고 장소를 찜하거나 방문해보세요.
        </p>
      ) : (
        <ul className="space-y-2">
          {insight.sentences.map((sentence) => (
            <li key={sentence} className="flex items-start gap-2 text-[13px] text-[#4B5563] leading-relaxed">
              <span className="text-[#5F8D4E] mt-0.5">•</span>
              <span>{sentence}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
