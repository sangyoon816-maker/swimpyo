'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Share2, MapPin, Clock, Star,
  CheckCircle2, Sparkles, Navigation as NavigationIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/lib/utils';
import { EMOTION_MAP } from '@/data/emotions';
import { useAppStore } from '@/store/useAppStore';
import RestScoreModal from '@/components/common/RestScoreModal';
import HeartButton from '@/components/common/HeartButton';
import RecommendReasonList from '@/components/common/RecommendReasonList';
import ActivityChips from '@/components/common/ActivityChips';
import { getEmotionInsight, getRecommendReasonBullets } from '@/lib/insight';
import type { Emotion, Place } from '@/types';

interface PlaceDetailClientProps {
  place: Place;
  contextEmotion?: Emotion;
}

export default function PlaceDetailClient({ place, contextEmotion }: PlaceDetailClientProps) {
  const router = useRouter();
  const { isSaved, savePlace, unsavePlace, markVisited, isVisited } = useAppStore();
  const saved = isSaved(place.id);
  const visited = isVisited(place.id);
  const [activeImage, setActiveImage] = useState(0);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);

  const handleSave = () => saved ? unsavePlace(place.id) : savePlace(place.id);
  const handleVisit = () => markVisited(place.id);

  const emotion = contextEmotion ?? place.emotions[0];
  const emotionConfig = EMOTION_MAP[emotion];
  const insight = getEmotionInsight(emotion);
  const reasons = getRecommendReasonBullets(place);
  const mapQuery = encodeURIComponent(`${place.name} ${place.address}`);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* 1. 상단 이미지 */}
      <div className="relative h-[300px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={place.images[activeImage]}
              alt={place.name}
              fill
              className="object-cover"
              sizes="(max-width: 430px) 100vw, 430px"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-safe">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {}}
              className="w-9 h-9 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
            >
              <Share2 size={16} />
            </button>
            <HeartButton
              saved={saved}
              onClick={handleSave}
              size={18}
              unsavedClassName="text-[#6B7280]"
              className="w-9 h-9 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
            />
          </div>
        </div>

        {place.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {place.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  'rounded-full transition-all',
                  idx === activeImage ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* 장소 기본 정보 */}
      <div className="bg-white rounded-t-3xl -mt-5 relative z-10 px-4 pt-5 pb-5">
        <div className="flex items-start justify-between mb-1">
          <span className="text-sm text-[#5F8D4E] font-semibold">
            {CATEGORY_EMOJIS[place.category]} {CATEGORY_LABELS[place.category]}
          </span>
          {place.isFree && (
            <span className="text-xs font-semibold text-[#5F8D4E] bg-[#EFF5EB] px-2.5 py-1 rounded-full">
              무료입장
            </span>
          )}
        </div>
        <h1 className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
          {place.name}
        </h1>

        <div className="flex items-center gap-1.5 mt-2">
          <MapPin size={14} className="text-[#9CA3AF]" />
          <span className="text-sm text-[#6B7280]">{place.address}</span>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          {place.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[#6B7280] bg-[#F5F3EF] px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 space-y-7 bg-[#FAF9F6]">
        {/* 2. 감정 기반 추천 이유 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="rounded-2xl p-4"
            style={{ background: `linear-gradient(135deg, ${emotionConfig.bgColor}, #FFFFFF)` }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={13} style={{ color: emotionConfig.color }} />
              <span className="text-xs font-bold tracking-wide" style={{ color: emotionConfig.color }}>
                {emotionConfig.emoji} {emotionConfig.adjective} 당신에게
              </span>
            </div>
            <h2 className="text-[16px] font-bold text-[#1A1A1A] leading-snug mb-1">
              {insight.title}
            </h2>
            <p className="text-[13px] text-[#6B7280] leading-relaxed mb-3">
              {place.recommendReason}
            </p>
            <RecommendReasonList reasons={reasons} />
          </div>
        </motion.section>

        {/* 3. 쉼 점수 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-3">쉼 점수</h3>
          <button
            onClick={() => setScoreModalOpen(true)}
            className="w-full flex items-center justify-between bg-white border border-[#F0EDE8] rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-[28px] font-bold text-[#5F8D4E] leading-none">
                {place.restScore.toFixed(1)}
              </span>
              <div className="text-left">
                <p className="text-[13px] font-semibold text-[#1A1A1A]">쉼표가 매긴 점수</p>
                <p className="text-xs text-[#9CA3AF]">탭해서 자세히 보기</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#C4BFB8]" />
          </button>
        </motion.section>

        {/* 4. 추천 활동 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-3">이곳에서 할 수 있는 것</h3>
          <ActivityChips activities={place.recommendActivities} />
        </motion.section>

        {/* 5. 방문 후기 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-[#1A1A1A]">방문 후기</h3>
            <span className="text-xs text-[#9CA3AF]">{place.reviewCount}개</span>
          </div>
          <div className="space-y-3">
            {place.reviews.map((review) => {
              const emoConf = EMOTION_MAP[review.emotion];
              return (
                <div key={review.id} className="bg-white border border-[#F0EDE8] rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#EFF5EB] flex items-center justify-center text-lg">
                      {emoConf?.emoji ?? '🙂'}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#1A1A1A]">{review.userName}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={i < review.rating ? 'fill-[#FFB84C] text-[#FFB84C]' : 'text-[#E8E4DD]'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#9CA3AF]">{review.visitedAt}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[14px] text-[#4B5563] leading-relaxed">{review.content}</p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* 6. 지도 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-3">오시는 길</h3>
          <div className="bg-white border border-[#F0EDE8] rounded-2xl p-4">
            <div className="relative h-[120px] rounded-xl bg-[#EFF5EB] overflow-hidden mb-3 flex items-center justify-center">
              <MapPin size={28} className="text-[#5F8D4E]" />
            </div>
            {place.openHours && (
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-[#9CA3AF]" />
                <span className="text-[13px] text-[#4B5563]">{place.openHours}</span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-[#9CA3AF]" />
              <span className="text-[13px] text-[#4B5563]">{place.address}</span>
            </div>
            <a
              href={`https://map.kakao.com/?q=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#E8E4DD] text-[13px] font-semibold text-[#5F8D4E]"
            >
              <NavigationIcon size={13} />
              지도에서 길찾기
            </a>
          </div>
        </motion.section>
      </div>

      {/* 하단 CTA */}
      <div className="sticky bottom-20 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E8E4DD] px-4 py-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleVisit}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-[15px] transition-all',
            visited
              ? 'bg-[#EFF5EB] text-[#5F8D4E]'
              : 'bg-[#5F8D4E] text-white shadow-md shadow-[#5F8D4E]/20'
          )}
        >
          {visited ? (
            <>
              <CheckCircle2 size={18} />
              방문했어요
            </>
          ) : (
            <>
              <MapPin size={18} />
              여기서 쉬기
            </>
          )}
        </motion.button>
      </div>

      <RestScoreModal
        open={scoreModalOpen}
        onOpenChange={setScoreModalOpen}
        score={place.restScore}
        detail={place.restScoreDetail}
        placeName={place.name}
      />
    </div>
  );
}
