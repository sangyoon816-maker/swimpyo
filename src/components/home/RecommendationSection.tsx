'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRecommendation } from '@/hooks/useRecommendation';
import { useRecommendationFeedback } from '@/hooks/useRecommendationFeedback';
import { useAppStore } from '@/store/useAppStore';
import SectionTitle from '@/components/common/SectionTitle';
import RecommendationCard from '@/components/common/RecommendationCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendationSection() {
  const { user } = useAuth();
  const selectedArea = useAppStore((s) => s.selectedArea);
  const { recommendations, loading, error, refresh } = useRecommendation(user?.id, selectedArea);
  const { getFeedback, setFeedback, actionError } = useRecommendationFeedback(user?.id);

  if (!user) return null;

  return (
    <section className="py-6">
      <SectionTitle
        title="당신을 위한 추천"
        subtitle={selectedArea ? `${selectedArea} 기준 · 최근 기록 기반` : '최근 기록 기반'}
        className="mb-4"
      />

      {loading ? (
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="w-[200px] h-[250px] rounded-2xl flex-shrink-0" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-between gap-3 px-4">
          <p className="text-xs text-[#E07A5F]">{error}</p>
          <button
            onClick={() => refresh()}
            className="flex-shrink-0 text-xs font-semibold text-[#5F8D4E] underline"
          >
            다시 시도
          </button>
        </div>
      ) : recommendations.length === 0 ? (
        <p className="text-sm text-[#6B7280] px-4">아직 추천할 만한 데이터가 부족해요.</p>
      ) : (
        <>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.place.id}
                recommendation={rec}
                liked={getFeedback(rec.place.id)}
                onFeedback={(liked) => setFeedback(rec.place.id, liked)}
              />
            ))}
          </div>
          {actionError && (
            <p className="text-xs text-[#E07A5F] px-4 mt-1">{actionError}</p>
          )}
        </>
      )}
    </section>
  );
}
