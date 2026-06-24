'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import EmptyState from '@/components/common/EmptyState';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="px-4 pt-20">
      <EmptyState
        emoji="🌧️"
        title="문제가 발생했어요"
        desc={'잠시 후 다시 시도해주세요'}
      />
      <div className="flex items-center justify-center gap-4 -mt-10">
        <button onClick={() => reset()} className="text-sm font-semibold text-[#5F8D4E] underline">
          다시 시도
        </button>
        <Link href="/" className="text-sm font-semibold text-[#6B7280] underline">
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
