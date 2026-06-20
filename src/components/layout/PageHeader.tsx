'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title?: string;
  transparent?: boolean;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  transparent = false,
  showBack = true,
  rightElement,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center h-14 px-4 gap-3',
        transparent
          ? 'bg-transparent'
          : 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E4DD]/60',
        className
      )}
    >
      {showBack && (
        <button
          onClick={() => router.back()}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full transition-colors',
            transparent
              ? 'bg-white/80 backdrop-blur-sm text-[#1A1A1A]'
              : 'hover:bg-[#F0EDE8] text-[#1A1A1A]'
          )}
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
      )}
      {title && (
        <h1
          className={cn(
            'flex-1 text-[17px] font-semibold',
            transparent ? 'text-white' : 'text-[#1A1A1A]',
            !showBack && 'ml-0'
          )}
        >
          {title}
        </h1>
      )}
      {rightElement && <div className="ml-auto">{rightElement}</div>}
    </header>
  );
}
