import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RestScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function RestScore({
  score,
  size = 'md',
  showLabel = true,
  className,
  onClick,
}: RestScoreProps) {
  const getColor = (s: number) => {
    if (s >= 9) return '#5F8D4E';
    if (s >= 7.5) return '#A4BE7B';
    return '#FFB84C';
  };

  const sizeClasses = {
    sm: 'text-xs gap-0.5',
    md: 'text-sm gap-1',
    lg: 'text-base gap-1',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const content = (
    <>
      <span
        className={cn('rounded-full', dotSizes[size])}
        style={{ backgroundColor: getColor(score) }}
      />
      <span className="font-semibold" style={{ color: getColor(score) }}>
        {score.toFixed(1)}
      </span>
      {showLabel && (
        <span className="text-[#6B7280] font-normal">쉼 점수</span>
      )}
      {onClick && <Info size={size === 'sm' ? 11 : 12} className="text-[#C4BFB8]" />}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn('flex items-center', sizeClasses[size], className)}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cn('flex items-center', sizeClasses[size], className)}>
      {content}
    </div>
  );
}
