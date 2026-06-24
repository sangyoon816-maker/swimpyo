'use client';

import { Calendar, TrendingUp } from 'lucide-react';
import { useMonthlyReport } from '@/hooks/useMonthlyReport';
import { formatMonthLabel, getCurrentMonthKey } from '@/lib/monthlyReport';
import { EMOTION_MAP } from '@/data/emotions';
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MonthlyReportCardProps {
  userId: string | undefined;
}

export default function MonthlyReportCard({ userId }: MonthlyReportCardProps) {
  const { report, loading, error, refresh } = useMonthlyReport(userId);

  if (!userId) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#F0EDE8] shadow-sm p-4 mx-4 mt-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Calendar size={14} className="text-[#5F8D4E]" />
        <h3 className="text-[15px] font-bold text-[#1A1A1A]">
          {formatMonthLabel(report?.monthKey ?? getCurrentMonthKey())} 쉼 리포트
        </h3>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#E07A5F]">{error}</p>
          <button onClick={() => refresh()} className="flex-shrink-0 text-xs font-semibold text-[#5F8D4E] underline">
            다시 시도
          </button>
        </div>
      ) : !report || report.isEmpty ? (
        <p className="text-sm text-[#6B7280] leading-relaxed">
          아직 이번 달 활동이 없어요. 감정을 기록하거나 장소를 방문해보세요.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '감정 기록', value: report.activity.emotionLogCount, color: '#7B7FBF' },
              { label: '방문 장소', value: report.activity.visitedPlaceCount, color: '#5F8D4E' },
              { label: '작성 후기', value: report.activity.reviewCount, color: '#E07A5F' },
              { label: '완주 코스', value: report.activity.completedCourseCount, color: '#A4BE7B' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#FAF9F6] rounded-xl p-2.5 text-center">
                <p className="text-[18px] font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-[#6B7280] mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>

          {report.emotion.topEmotion && (
            <div>
              <p className="text-xs font-semibold text-[#6B7280] mb-1.5">가장 많이 느낀 감정</p>
              <div className="flex items-center gap-2 bg-[#FAF9F6] rounded-xl px-3 py-2">
                <span className="text-xl">{EMOTION_MAP[report.emotion.topEmotion].emoji}</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">
                  {EMOTION_MAP[report.emotion.topEmotion].label}
                </span>
                <span className="text-xs text-[#6B7280]">
                  {report.emotion.emotionCounts[report.emotion.topEmotion]}회
                </span>
              </div>
              <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                {report.emotion.weeklyTrend.map((week) => (
                  <div
                    key={week.weekLabel}
                    className="flex-shrink-0 flex flex-col items-center gap-1 bg-[#FAF9F6] rounded-lg px-2.5 py-1.5 min-w-[52px]"
                  >
                    <span className="text-base">{week.dominant ? EMOTION_MAP[week.dominant].emoji : '–'}</span>
                    <span className="text-[10px] text-[#6B7280]">{week.weekLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(report.place.topCategory || report.place.topArea) && (
            <div className="grid grid-cols-2 gap-2">
              {report.place.topCategory && (
                <div className="bg-[#FAF9F6] rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-[#6B7280]">많이 방문한 카테고리</p>
                  <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">
                    {CATEGORY_EMOJIS[report.place.topCategory]} {CATEGORY_LABELS[report.place.topCategory]}
                  </p>
                </div>
              )}
              {report.place.topArea && (
                <div className="bg-[#FAF9F6] rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-[#6B7280]">많이 방문한 지역</p>
                  <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">📍 {report.place.topArea}</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-[#EFF5EB] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp size={13} className="text-[#5F8D4E]" />
              <p className="text-xs font-bold text-[#5F8D4E]">이번 달 성장</p>
            </div>
            <p className="text-sm text-[#1A1A1A] font-semibold">+{report.growth.xpGained} XP</p>
            {report.growth.leveledUp ? (
              <p className="text-xs text-[#5F8D4E] mt-1">
                🎉 LV{report.growth.levelBefore.level} {report.growth.levelBefore.name} → LV
                {report.growth.levelAfter.level} {report.growth.levelAfter.name}
              </p>
            ) : (
              <p className="text-xs text-[#6B7280] mt-1">
                LV{report.growth.levelAfter.level} {report.growth.levelAfter.name} 유지 중
              </p>
            )}
            {report.growth.newBadges.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {report.growth.newBadges.map((badge) => (
                  <span
                    key={badge.id}
                    className="flex items-center gap-1 bg-white rounded-full px-2 py-1 text-xs font-medium text-[#1A1A1A]"
                  >
                    {badge.emoji} {badge.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6B7280] mt-2">새로 획득한 배지가 없어요</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
