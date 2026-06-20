import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  moreHref?: string;
  moreLabel?: string;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  moreHref,
  moreLabel = '더보기',
  className,
}: SectionTitleProps) {
  return (
    <div className={cn('flex items-end justify-between px-4', className)}>
      <div>
        <h2 className="text-[18px] font-bold text-[#1A1A1A] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#9CA3AF] mt-0.5">{subtitle}</p>
        )}
      </div>
      {moreHref && (
        <Link
          href={moreHref}
          className="text-sm text-[#5F8D4E] font-medium pb-0.5"
        >
          {moreLabel}
        </Link>
      )}
    </div>
  );
}
