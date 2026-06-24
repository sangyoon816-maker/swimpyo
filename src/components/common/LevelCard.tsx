import { computeLevel } from '@/data/badges';
import { Progress } from '@/components/ui/progress';

interface LevelCardProps {
  xp: number;
}

export default function LevelCard({ xp }: LevelCardProps) {
  const { level, name, currentMinXp, nextMinXp } = computeLevel(xp);
  const progressInLevel = nextMinXp
    ? ((xp - currentMinXp) / (nextMinXp - currentMinXp)) * 100
    : 100;
  const remainingXp = nextMinXp ? nextMinXp - xp : 0;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#F0EDE8]">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <p className="text-xs text-[#6B7280]">LV{level}</p>
          <p className="text-[16px] font-bold text-[#1A1A1A]">{name}</p>
        </div>
        <p className="text-sm font-semibold text-[#5F8D4E]">{xp} XP</p>
      </div>
      <Progress
        value={progressInLevel}
        className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-[#5F8D4E]"
      />
      <p className="text-xs text-[#6B7280] mt-1.5">
        {nextMinXp ? `다음 레벨까지 ${remainingXp} XP` : '최고 레벨에 도달했어요!'}
      </p>
    </div>
  );
}
