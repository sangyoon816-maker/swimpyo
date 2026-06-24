'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Navigation, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORY_EMOJIS, CATEGORY_LABELS, formatDuration, DIFFICULTY_LABELS } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import RestScore from '@/components/common/RestScore';
import EmotionChip from '@/components/common/EmotionChip';
import type { Course } from '@/types';

interface CourseDetailClientProps {
  course: Course;
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { progress } = useCourseProgress(user?.id, course);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* 헤더 이미지 */}
      <div className="relative h-[280px]">
        <Image
          src={course.thumbnail}
          alt={course.name}
          fill
          className="object-cover"
          sizes="430px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

        <button
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="absolute top-4 left-4 w-9 h-9 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 mb-2">
            <span className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
              {DIFFICULTY_LABELS[course.difficulty]}
            </span>
          </div>
          <h1 className="text-[22px] font-bold text-white leading-tight">
            {course.name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-white/80">
              <Navigation size={13} />
              <span className="text-sm">{course.totalDistance}km</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Clock size={13} />
              <span className="text-sm">{formatDuration(course.estimatedTime)}</span>
            </div>
            <RestScore score={course.restScore} size="sm" className="ml-auto [&_span]:text-white [&_.rounded-full]:!bg-white" />
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="bg-white rounded-t-3xl -mt-4 relative z-10">
        <div className="px-4 pt-5 pb-6 space-y-6">
          {/* 코스 소개 */}
          <div>
            <p className="text-[15px] text-[#4B5563] leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* 추천 감정 */}
          <div>
            <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-3">이럴 때 추천해요</h2>
            <div className="flex flex-wrap gap-2">
              {course.emotions.map((emo) => (
                <EmotionChip key={emo} emotion={emo} size="sm" />
              ))}
            </div>
          </div>

          {/* 코스 경로 */}
          <div>
            <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-4">코스 경로</h2>
            <div className="relative">
              {/* 수직선 */}
              <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-[#E8E4DD]" />

              <div className="space-y-4">
                {course.places.map((stop, idx) => (
                  <motion.div
                    key={stop.order}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex gap-4"
                  >
                    {/* 스탑 번호 */}
                    <div className="flex-shrink-0 w-10 h-10 bg-[#5F8D4E] rounded-full flex items-center justify-center z-10 shadow-sm">
                      <span className="text-white font-bold text-sm">{stop.order}</span>
                    </div>

                    {/* 장소 카드 */}
                    <Link href={`/places/${stop.place.id}`} className="flex-1">
                      <div className="bg-[#F5F3EF] rounded-2xl p-3 flex gap-3 hover:bg-[#EFF5EB] transition-colors">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={stop.place.thumbnail}
                            alt={stop.place.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-[#5F8D4E] font-medium">
                            {CATEGORY_EMOJIS[stop.place.category]} {CATEGORY_LABELS[stop.place.category]}
                          </span>
                          <h3 className="text-[14px] font-semibold text-[#1A1A1A] leading-tight mt-0.5">
                            {stop.place.name}
                          </h3>
                          {stop.memo && (
                            <p className="text-xs text-[#6B7280] mt-0.5">{stop.memo}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock size={11} className="text-[#6B7280]" />
                            <span className="text-xs text-[#6B7280]">
                              약 {stop.stayDuration}분
                            </span>
                            <RestScore score={stop.place.restScore} size="sm" showLabel={false} />
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-[#C4BFB8] self-center flex-shrink-0" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* 태그 */}
          <div>
            <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-3">태그</h2>
            <div className="flex gap-2 flex-wrap">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-[#6B7280] bg-[#F5F3EF] px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="sticky bottom-20 bg-white/95 backdrop-blur-md border-t border-[#E8E4DD] px-4 py-3">
        <Link
          href={`/courses/${course.id}/progress`}
          className="w-full bg-[#5F8D4E] text-white py-3.5 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#5F8D4E]/20"
        >
          <Navigation size={18} />
          {progress ? '이어서 진행하기' : '코스 시작하기'}
        </Link>
      </div>
    </div>
  );
}
