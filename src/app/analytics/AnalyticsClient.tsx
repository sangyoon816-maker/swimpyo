'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRecommendationAnalytics } from '@/hooks/useRecommendationAnalytics';
import { CATEGORY_EMOJIS, CATEGORY_LABELS } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/common/EmptyState';
import GoogleIcon from '@/components/common/GoogleIcon';
import type { PlacePerformance } from '@/lib/recommendationAnalytics';

function PlaceRow({ rank, perf }: { rank?: number; perf: PlacePerformance }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#F0EDE8]">
      {rank !== undefined && (
        <span className="w-6 h-6 flex-shrink-0 rounded-full bg-[#EFF5EB] text-[#5F8D4E] text-xs font-bold flex items-center justify-center">
          {rank}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{CATEGORY_EMOJIS[perf.place.category]}</span>
          <h3 className="text-[14px] font-semibold text-[#1A1A1A] truncate">{perf.place.name}</h3>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-[#6B7280]">
          <span>👍 {perf.likes}</span>
          <span>👎 {perf.dislikes}</span>
          <span className="font-semibold text-[#5F8D4E]">성공률 {perf.successRate}%</span>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsClient() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { analytics, loading, error, refresh } = useRecommendationAnalytics(user?.id);

  if (!authLoading && !user) {
    return (
      <div className="px-4 py-8 flex flex-col gap-4">
        <EmptyState
          emoji="🔒"
          title="로그인하면 추천 분석을 볼 수 있어요"
          desc={'Google로 로그인하면\n추천 피드백 통계를 확인할 수 있어요'}
        />
        <button
          onClick={() => signInWithGoogle()}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#E8E4DD] rounded-2xl py-3 text-[15px] font-semibold text-[#1A1A1A] shadow-sm hover:border-[#5F8D4E] transition-colors"
        >
          <GoogleIcon size={18} />
          Google로 로그인
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 py-4 flex flex-col gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-[#E07A5F]">{error}</p>
        <button onClick={() => refresh()} className="text-sm font-semibold text-[#5F8D4E] underline">
          다시 시도
        </button>
      </div>
    );
  }

  if (analytics.overall.total === 0) {
    return (
      <div className="px-4 py-8">
        <EmptyState
          emoji="📊"
          title="아직 추천 피드백이 없어요"
          desc={'사용자들이 추천 카드에 평가를 남기면\n여기에 통계가 표시돼요'}
        />
      </div>
    );
  }

  return (
    <div className="pb-8">
      <section className="px-4 pt-4">
        <h2 className="text-[15px] font-semibold text-[#1A1A1A] mb-2">전체 피드백 통계</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#F0EDE8]">
            <p className="text-[22px] font-bold text-[#5F8D4E]">{analytics.overall.likes}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">👍 좋아요</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#F0EDE8]">
            <p className="text-[22px] font-bold text-[#E07A5F]">{analytics.overall.dislikes}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">👎 싫어요</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#F0EDE8]">
            <p className="text-[22px] font-bold text-[#1A1A1A]">{analytics.overall.total}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">총 평가</p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-[15px] font-semibold text-[#1A1A1A] mb-2">카테고리별 성과</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0EDE8] overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] text-[#6B7280] text-xs">
                <th className="text-left font-medium px-3 py-2">카테고리</th>
                <th className="text-right font-medium px-3 py-2">👍</th>
                <th className="text-right font-medium px-3 py-2">👎</th>
                <th className="text-right font-medium px-3 py-2 w-20">성공률</th>
              </tr>
            </thead>
            <tbody>
              {analytics.categories.map((c) => (
                <tr key={c.category} className="border-t border-[#F0EDE8]">
                  <td className="px-3 py-2.5 text-[#1A1A1A] font-medium whitespace-nowrap">
                    {CATEGORY_EMOJIS[c.category]} {CATEGORY_LABELS[c.category]}
                  </td>
                  <td className="px-3 py-2.5 text-right text-[#6B7280]">{c.likes}</td>
                  <td className="px-3 py-2.5 text-right text-[#6B7280]">{c.dislikes}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs font-semibold text-[#1A1A1A] w-9 text-right">
                        {c.successRate}%
                      </span>
                      <Progress
                        value={c.successRate}
                        className="w-10 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-indicator]]:bg-[#5F8D4E]"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-[15px] font-semibold text-[#1A1A1A] mb-2">상위 추천 장소 TOP 5</h2>
        {analytics.topPlaces.length === 0 ? (
          <p className="text-sm text-[#6B7280]">아직 데이터가 충분하지 않아요</p>
        ) : (
          <div className="flex flex-col gap-2">
            {analytics.topPlaces.map((p, i) => (
              <PlaceRow key={p.place.id} rank={i + 1} perf={p} />
            ))}
          </div>
        )}
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-[15px] font-semibold text-[#1A1A1A] mb-2">하위 추천 장소 TOP 5</h2>
        {analytics.bottomPlaces.length === 0 ? (
          <p className="text-sm text-[#6B7280]">아직 데이터가 충분하지 않아요</p>
        ) : (
          <div className="flex flex-col gap-2">
            {analytics.bottomPlaces.map((p, i) => (
              <PlaceRow key={p.place.id} rank={i + 1} perf={p} />
            ))}
          </div>
        )}
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-[15px] font-semibold text-[#1A1A1A] mb-2">장소별 추천 성과</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0EDE8] overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] text-[#6B7280] text-xs">
                <th className="text-left font-medium px-3 py-2">장소</th>
                <th className="text-right font-medium px-3 py-2">👍</th>
                <th className="text-right font-medium px-3 py-2">👎</th>
                <th className="text-right font-medium px-3 py-2">성공률</th>
              </tr>
            </thead>
            <tbody>
              {analytics.places.map((p) => (
                <tr key={p.place.id} className="border-t border-[#F0EDE8]">
                  <td className="px-3 py-2.5 text-[#1A1A1A] font-medium truncate max-w-[120px]">
                    {CATEGORY_EMOJIS[p.place.category]} {p.place.name}
                  </td>
                  <td className="px-3 py-2.5 text-right text-[#6B7280]">{p.likes}</td>
                  <td className="px-3 py-2.5 text-right text-[#6B7280]">{p.dislikes}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-[#5F8D4E]">
                    {p.successRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
