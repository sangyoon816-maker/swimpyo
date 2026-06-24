'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, MapPin } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import RestScore from '@/components/common/RestScore';
import RestScoreModal from '@/components/common/RestScoreModal';
import RecommendReasonList from '@/components/common/RecommendReasonList';
import EmptyState from '@/components/common/EmptyState';
import HeartButton from '@/components/common/HeartButton';
import { EMOTION_MAP } from '@/data/emotions';
import { getPlacesByEmotion } from '@/data/places';
import { recommendFromDiagnosis } from '@/lib/diagnosis';
import { getEmotionInsight, getRecommendReasonBullets } from '@/lib/insight';
import { CATEGORY_LABELS, CATEGORY_EMOJIS, getObjectParticle } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useFavoriteToggle } from '@/hooks/useFavoriteToggle';
import type { DiagnosisAnswers, Emotion, Place } from '@/types';

interface RecommendClientProps {
  emotion: Emotion;
  answers?: DiagnosisAnswers;
}

export default function RecommendClient({ emotion, answers }: RecommendClientProps) {
  const [scoreModalPlace, setScoreModalPlace] = useState<Place | null>(null);
  const { isSaved } = useAppStore();
  const { toggleFavorite } = useFavoriteToggle();
  const config = EMOTION_MAP[emotion];
  const insight = getEmotionInsight(emotion);

  const places = answers
    ? recommendFromDiagnosis(emotion, answers, 5)
    : getPlacesByEmotion(emotion).slice(0, 5);

  const [top, ...rest] = places;

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <PageHeader title="쉼 추천 결과" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-4 pt-2 pb-7"
        style={{ background: `linear-gradient(to bottom, ${config.bgColor}, #FAF9F6)` }}
      >
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={13} style={{ color: config.color }} />
          <span className="text-xs font-bold tracking-wide" style={{ color: config.color }}>
            쉼표가 읽은 지금 당신의 마음
          </span>
        </div>
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-3xl">{config.emoji}</span>
          <span className="text-[15px] font-semibold" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
        <h1 className="text-[21px] font-bold text-[#1A1A1A] leading-snug mb-1.5">
          {insight.title}
        </h1>
        <p className="text-[14px] text-[#6B7280] leading-relaxed">{insight.description}</p>
      </motion.div>

      {places.length === 0 || !top ? (
        <EmptyState
          emoji="🌿"
          title="딱 맞는 장소를 아직 찾지 못했어요"
          desc={'다른 감정을 선택하거나\n장소를 직접 둘러보세요'}
          href="/places"
          linkLabel="장소 둘러보기"
        />
      ) : (
        <div className="px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6"
          >
            <div className="relative rounded-3xl overflow-hidden h-[280px] shadow-md">
              <Link href={`/places/${top.id}?emotion=${emotion}`}>
                <Image
                  src={top.thumbnail}
                  alt={top.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 430px) 100vw, 430px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              </Link>

              <div className="absolute top-3 left-3">
                <span className="text-[11px] font-bold text-white bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  베스트 매칭
                </span>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <RestScore
                  score={top.restScore}
                  size="sm"
                  showLabel={false}
                  onClick={(e) => {
                    e.preventDefault();
                    setScoreModalPlace(top);
                  }}
                  className="bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full"
                />
                <HeartButton
                  saved={isSaved(top.id)}
                  onClick={() => toggleFavorite(top.id)}
                  size={15}
                  unsavedClassName="text-[#6B7280]"
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"
                />
              </div>

              <Link href={`/places/${top.id}?emotion=${emotion}`}>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-medium text-white/85 mb-1">
                    {config.emoji} {config.adjective} 당신에게
                  </p>
                  <h2 className="text-[22px] font-bold text-white leading-tight">
                    {top.name}{getObjectParticle(top.name)} 추천해요
                  </h2>
                  <div className="flex items-center gap-1 mt-1.5 text-white/75">
                    <MapPin size={12} />
                    <span className="text-xs">
                      {top.neighborhood} · {CATEGORY_EMOJIS[top.category]} {CATEGORY_LABELS[top.category]}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            <RecommendReasonList reasons={getRecommendReasonBullets(top)} className="mt-3" />
          </motion.div>

          {rest.length > 0 && (
            <>
              <p className="text-[15px] font-bold text-[#1A1A1A] mb-3">이런 곳도 좋아요</p>
              <div className="flex flex-col gap-3">
                {rest.map((place, idx) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.08, duration: 0.35 }}
                  >
                    <Link href={`/places/${place.id}?emotion=${emotion}`}>
                      <div className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-[#F0EDE8]">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={place.thumbnail}
                            alt={place.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-[15px] font-semibold text-[#1A1A1A] truncate">
                              {place.name}
                            </h3>
                            <RestScore
                              score={place.restScore}
                              size="sm"
                              showLabel={false}
                              onClick={(e) => {
                                e.preventDefault();
                                setScoreModalPlace(place);
                              }}
                            />
                          </div>
                          <p className="text-xs text-[#6B7280] mt-0.5">{place.neighborhood}</p>
                          <p className="text-xs text-[#5F8D4E] font-medium mt-1.5 leading-snug line-clamp-1">
                            {getRecommendReasonBullets(place).slice(0, 2).join(' · ')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {scoreModalPlace && (
        <RestScoreModal
          open={!!scoreModalPlace}
          onOpenChange={(o) => !o && setScoreModalPlace(null)}
          score={scoreModalPlace.restScore}
          detail={scoreModalPlace.restScoreDetail}
          placeName={scoreModalPlace.name}
        />
      )}
    </div>
  );
}
