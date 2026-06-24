'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { CATEGORY_EMOJIS, CATEGORY_LABELS } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/common/EmptyState';
import GoogleIcon from '@/components/common/GoogleIcon';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import type { Course } from '@/types';

interface CourseProgressClientProps {
  course: Course;
}

export default function CourseProgressClient({ course }: CourseProgressClientProps) {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const {
    progress,
    loading,
    error,
    refresh,
    actionLoading,
    actionError,
    start,
    completeCurrentStop,
    abandon,
  } = useCourseProgress(user?.id, course);
  const [abandonOpen, setAbandonOpen] = useState(false);

  if (!authLoading && !user) {
    return (
      <div className="px-4 py-10 flex flex-col gap-4">
        <EmptyState
          emoji="🔒"
          title="로그인하고 코스를 시작해보세요"
          desc={'Google로 로그인하면\n진행 상태가 안전하게 저장돼요'}
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
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-[280px] w-full rounded-3xl mt-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-[#E07A5F]">{error}</p>
        <button onClick={() => refresh()} className="text-sm font-semibold text-[#5F8D4E] underline">
          다시 시도
        </button>
      </div>
    );
  }

  const totalStops = course.places.length;

  // 코스 완주 화면
  if (progress?.completed_at) {
    return (
      <div className="px-4 py-12 flex flex-col items-center text-center gap-2">
        <div className="text-6xl mb-2">🎉</div>
        <h1 className="text-[22px] font-bold text-[#1A1A1A]">코스 완주!</h1>
        <p className="text-sm text-[#6B7280] mb-6">{course.name}을 모두 완주했어요</p>
        <div className="flex gap-2 w-full">
          <Link
            href="/courses"
            className="flex-1 text-center py-3 rounded-2xl border border-[#E8E4DD] text-sm font-semibold text-[#1A1A1A]"
          >
            다른 코스 보기
          </Link>
          <Link
            href="/mypage"
            className="flex-1 text-center py-3 rounded-2xl bg-[#5F8D4E] text-white text-sm font-semibold"
          >
            완주 기록 보기
          </Link>
        </div>
      </div>
    );
  }

  // 시작 전
  if (!progress) {
    return (
      <div className="px-4 py-10 flex flex-col items-center text-center gap-3">
        <div className="relative w-full h-[160px] rounded-3xl overflow-hidden">
          <Image src={course.thumbnail} alt={course.name} fill className="object-cover" />
        </div>
        <h1 className="text-[18px] font-bold text-[#1A1A1A] mt-2">{course.name}</h1>
        <p className="text-sm text-[#6B7280]">{totalStops}개 정거장으로 이루어진 코스예요</p>
        {actionError && <p className="text-xs text-[#E07A5F]">{actionError}</p>}
        <button
          onClick={() => start()}
          disabled={actionLoading}
          className="w-full bg-[#5F8D4E] text-white py-3.5 rounded-2xl font-semibold text-[15px] shadow-md shadow-[#5F8D4E]/20 disabled:opacity-60"
        >
          {actionLoading ? '시작하는 중...' : '코스 시작하기'}
        </button>
      </div>
    );
  }

  // 진행 중
  const currentStop = course.places.find((p) => p.order === progress.current_stop);
  const progressPercent = ((progress.current_stop - 1) / totalStops) * 100;

  if (!currentStop) {
    return null;
  }

  return (
    <div className="pb-10">
      <div className="px-4 pt-4">
        <p className="text-sm font-bold text-[#5F8D4E]">
          [{progress.current_stop}/{totalStops}]
        </p>
        <Progress
          value={progressPercent}
          className="mt-2 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-[#5F8D4E]"
        />
      </div>

      <div className="px-4 mt-4">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#F0EDE8]">
          <div className="relative h-[180px]">
            <Image
              src={currentStop.place.thumbnail}
              alt={currentStop.place.name}
              fill
              className="object-cover"
              sizes="430px"
            />
          </div>
          <div className="p-4">
            <span className="text-xs text-[#5F8D4E] font-medium">
              {CATEGORY_EMOJIS[currentStop.place.category]} {CATEGORY_LABELS[currentStop.place.category]}
            </span>
            <h2 className="text-[20px] font-bold text-[#1A1A1A] mt-1">{currentStop.place.name}</h2>
            <p className="text-xs text-[#6B7280] mt-1">현재 방문 장소</p>
            {currentStop.memo && (
              <p className="text-sm text-[#6B7280] leading-relaxed mt-2">{currentStop.memo}</p>
            )}
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[#6B7280]">
              <Clock size={12} />
              약 {currentStop.stayDuration}분 머무르기 좋아요
            </div>
          </div>
        </div>

        {actionError && <p className="text-xs text-[#E07A5F] mt-2">{actionError}</p>}

        <button
          onClick={() => completeCurrentStop()}
          disabled={actionLoading}
          className="w-full mt-4 bg-[#5F8D4E] text-white py-3.5 rounded-2xl font-semibold text-[15px] shadow-md shadow-[#5F8D4E]/20 disabled:opacity-60"
        >
          {actionLoading ? '저장하는 중...' : '방문 완료'}
        </button>
      </div>

      <div className="px-4 mt-7">
        <h3 className="text-[14px] font-bold text-[#1A1A1A] mb-3">전체 경로</h3>
        <div className="space-y-3">
          {course.places.map((stop) => {
            const state =
              stop.order < progress.current_stop
                ? 'done'
                : stop.order === progress.current_stop
                  ? 'current'
                  : 'upcoming';
            return (
              <div key={stop.order} className="flex items-center gap-2.5">
                {state === 'done' ? (
                  <CheckCircle2 size={18} className="text-[#5F8D4E] flex-shrink-0" />
                ) : state === 'current' ? (
                  <span className="w-[18px] h-[18px] rounded-full bg-[#5F8D4E] flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-[#E8E4DD] flex-shrink-0" />
                )}
                <span
                  className={
                    state === 'upcoming'
                      ? 'text-sm text-[#C4BFB8]'
                      : 'text-sm font-medium text-[#1A1A1A]'
                  }
                >
                  {stop.place.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 mt-7 text-center">
        <button
          onClick={() => setAbandonOpen(true)}
          className="text-xs text-[#C4BFB8] underline"
        >
          코스 중단하기
        </button>
      </div>

      <ConfirmDialog
        open={abandonOpen}
        onOpenChange={setAbandonOpen}
        title="코스를 중단할까요?"
        description="진행 상태가 삭제돼요. 나중에 다시 시작할 수 있어요."
        confirmLabel="중단하기"
        loading={actionLoading}
        onConfirm={async () => {
          await abandon();
          setAbandonOpen(false);
        }}
      />
    </div>
  );
}
