'use client';

import { useEffect, useState } from 'react';

interface ScopedState<T> {
  userId: string | undefined;
  data: T;
}

/**
 * Fetches data for the given userId and guarantees stale data from a
 * previous userId (e.g. after logout, or switching accounts) is never
 * exposed — `data` falls back to `emptyValue` until a fetch resolves
 * for the *current* userId.
 */
export function useUserScopedData<T>(
  userId: string | undefined,
  fetcher: (userId: string) => Promise<T>,
  emptyValue: T,
  errorMessage: string
) {
  const [state, setState] = useState<ScopedState<T>>({ userId: undefined, data: emptyValue });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!userId) return;

    let active = true;
    fetcher(userId)
      .then((data) => {
        if (!active) return;
        setState({ userId, data });
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : errorMessage);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId, fetcher, errorMessage, retryKey]);

  const refresh = () => {
    setLoading(true);
    setError(null);
    setRetryKey((k) => k + 1);
  };

  /** Locally update already-fetched data (e.g. after a delete) without refetching. */
  const mutate = (updater: (data: T) => T) => {
    setState((prev) => (prev.userId === userId ? { userId, data: updater(prev.data) } : prev));
  };

  const isCurrent = state.userId === userId;

  return {
    data: isCurrent ? state.data : emptyValue,
    loading: !isCurrent || loading,
    error: isCurrent ? error : null,
    refresh,
    mutate,
  };
}
