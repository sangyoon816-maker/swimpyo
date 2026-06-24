'use client';

import { useCallback, useState } from 'react';
import { useUserScopedData } from '@/hooks/useUserScopedData';
import { useAppStore } from '@/store/useAppStore';
import {
  fetchActiveCourseProgress,
  fetchCourseProgressList,
  startCourseProgress,
  advanceCourseProgress,
  abandonCourseProgress,
} from '@/lib/courseProgress';
import { addVisitedPlace } from '@/lib/visitedPlaces';
import { awardBadgesAndNotify } from '@/lib/badges';
import type { Course, CourseProgress } from '@/types';

const EMPTY: CourseProgress[] = [];
const NO_PROGRESS: CourseProgress | null = null;

/** Drives a single course's step-through flow (start / complete current stop / abandon). */
export function useCourseProgress(userId: string | undefined, course: Course) {
  const fetcher = useCallback(
    (uid: string) => fetchActiveCourseProgress(uid, course.id),
    [course.id]
  );
  const { data: progress, loading, error, refresh, mutate } = useUserScopedData(
    userId,
    fetcher,
    NO_PROGRESS,
    '코스 진행 상태를 불러오지 못했어요'
  );
  const { markVisited } = useAppStore();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const start = async () => {
    if (!userId) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const created = await startCourseProgress(userId, course.id);
      mutate(() => created);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '코스를 시작하지 못했어요');
    } finally {
      setActionLoading(false);
    }
  };

  const completeCurrentStop = async () => {
    if (!userId || !progress) return;
    const stop = course.places.find((p) => p.order === progress.current_stop);
    if (!stop) return;

    setActionLoading(true);
    setActionError(null);
    try {
      await addVisitedPlace(userId, stop.place.id);
      markVisited(stop.place.id);

      const isLast = progress.current_stop >= course.places.length;
      const updated = await advanceCourseProgress(
        userId,
        progress.id,
        progress.current_stop + 1,
        isLast
      );
      mutate(() => updated);
      awardBadgesAndNotify(userId).catch(() => {});
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '진행 상태를 저장하지 못했어요');
    } finally {
      setActionLoading(false);
    }
  };

  const abandon = async () => {
    if (!userId || !progress) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await abandonCourseProgress(userId, progress.id);
      mutate(() => null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '코스를 중단하지 못했어요');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    progress,
    loading,
    error,
    refresh,
    actionLoading,
    actionError,
    start,
    completeCurrentStop,
    abandon,
  };
}

/** All of the user's course attempts — used on 마이페이지 for stats + 완주한 코스 목록. */
export function useCourseProgressList(userId: string | undefined) {
  const { data: progressList, loading, error, refresh, mutate } = useUserScopedData(
    userId,
    fetchCourseProgressList,
    EMPTY,
    '코스 기록을 불러오지 못했어요'
  );

  const completed = progressList.filter((p) => p.completed_at !== null);
  const inProgress = progressList.filter((p) => p.completed_at === null);

  return { progressList, completed, inProgress, loading, error, refresh, mutate };
}
