'use client';

import { useState } from 'react';
import { deleteEmotionLog } from '@/lib/emotionLogs';

export function useDeleteEmotionLog() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (userId: string, logId: string): Promise<boolean> => {
    setDeleting(true);
    setError(null);
    try {
      await deleteEmotionLog(userId, logId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '기록 삭제에 실패했어요');
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const clearError = () => setError(null);

  return { remove, deleting, error, clearError };
}
