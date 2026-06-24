'use client';

import { useCallback } from 'react';
import { useUserScopedData } from '@/hooks/useUserScopedData';
import { buildMonthlyReport, getCurrentMonthKey, type MonthKey, type MonthlyReport } from '@/lib/monthlyReport';

const NO_REPORT: MonthlyReport | null = null;

/** Defaults to the current calendar month — used on 마이페이지. */
export function useMonthlyReport(userId: string | undefined, monthKey: MonthKey = getCurrentMonthKey()) {
  const { year, month } = monthKey;
  const fetcher = useCallback((uid: string) => buildMonthlyReport(uid, year, month), [year, month]);

  const { data: report, loading, error, refresh } = useUserScopedData(
    userId,
    fetcher,
    NO_REPORT,
    '월간 리포트를 불러오지 못했어요'
  );

  return { report, loading, error, refresh };
}
