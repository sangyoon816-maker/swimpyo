import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CATEGORY_EMOJIS, CATEGORY_LABELS } from '@/lib/utils';
import RestScore from './RestScore';
import type { PlaceRecommendation } from '@/lib/recommendEngine';

interface RecommendationCardProps {
  recommendation: PlaceRecommendation;
  liked: boolean | null;
  onFeedback: (liked: boolean) => void;
}

export default function RecommendationCard({
  recommendation,
  liked,
  onFeedback,
}: RecommendationCardProps) {
  const { place, reasons } = recommendation;

  return (
    <div className="w-[200px] flex-shrink-0">
      <Link href={`/places/${place.id}`} className="block">
        <div className="bg-white rounded-t-2xl overflow-hidden shadow-sm border border-[#F0EDE8] border-b-0">
          <div className="relative h-[120px]">
            <Image
              src={place.thumbnail}
              alt={place.name}
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] text-[#5F8D4E] font-medium">
                {CATEGORY_EMOJIS[place.category]} {CATEGORY_LABELS[place.category]}
              </span>
              <RestScore score={place.restScore} size="sm" showLabel={false} />
            </div>
            <h3 className="text-[14px] font-semibold text-[#1A1A1A] leading-tight line-clamp-1 mb-1.5">
              {place.name}
            </h3>
            <div className="space-y-0.5">
              {reasons.map((reason) => (
                <p key={reason} className="text-[11px] text-[#5F8D4E] leading-snug line-clamp-2">
                  💡 {reason}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Link>

      <div className="flex gap-1.5 bg-white border border-t-0 border-[#F0EDE8] rounded-b-2xl p-2">
        <button
          onClick={() => onFeedback(true)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[11px] font-medium border transition-colors',
            liked === true
              ? 'bg-[#EFF5EB] border-[#5F8D4E] text-[#5F8D4E]'
              : 'bg-white border-[#E8E4DD] text-[#6B7280]'
          )}
        >
          👍 도움이 됐어요
        </button>
        <button
          onClick={() => onFeedback(false)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-1.5 rounded-full text-[11px] font-medium border transition-colors',
            liked === false
              ? 'bg-[#FDF0ED] border-[#E07A5F] text-[#E07A5F]'
              : 'bg-white border-[#E8E4DD] text-[#6B7280]'
          )}
        >
          👎 별로였어요
        </button>
      </div>
    </div>
  );
}
