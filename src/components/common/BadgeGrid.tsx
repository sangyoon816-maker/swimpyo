import { BADGE_DEFINITIONS } from '@/data/badges';
import { cn } from '@/lib/utils';

interface BadgeGridProps {
  earnedBadgeIds: Set<string>;
}

export default function BadgeGrid({ earnedBadgeIds }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {BADGE_DEFINITIONS.map((badge) => {
        const earned = earnedBadgeIds.has(badge.id);
        return (
          <div
            key={badge.id}
            title={badge.description}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-xl text-center',
              earned ? 'bg-[#EFF5EB]' : 'bg-[#F5F3EF] opacity-50'
            )}
          >
            <span className="text-2xl">{earned ? badge.emoji : '🔒'}</span>
            <span className="text-[10px] font-medium text-[#1A1A1A] leading-tight">
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
