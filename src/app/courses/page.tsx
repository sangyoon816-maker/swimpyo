import Image from 'next/image';
import Link from 'next/link';
import { Navigation, Clock, Star } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { COURSES } from '@/data/courses';
import { formatDuration, DIFFICULTY_LABELS } from '@/lib/utils';
import RestScore from '@/components/common/RestScore';

export default function CoursesPage() {
  return (
    <div>
      <PageHeader title="산책 코스" showBack={false} />

      <div className="px-4 py-4">
        <p className="text-sm text-[#6B7280] mb-5">
          여러 장소를 연결한 힐링 산책 코스를 걸어보세요
        </p>

        <div className="flex flex-col gap-4">
          {COURSES.map((course, idx) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F0EDE8]">
                {/* 썸네일 */}
                <div className="relative h-[180px]">
                  <Image
                    src={course.thumbnail}
                    alt={course.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 430px) 100vw, 430px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* 배지들 */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-xs font-semibold text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {DIFFICULTY_LABELS[course.difficulty]}
                    </span>
                    <span className="text-xs font-semibold text-white bg-[#5F8D4E]/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      ✨ 코스 {idx + 1}
                    </span>
                  </div>

                  {/* 코스 이름 */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-[17px] font-bold text-white leading-tight">
                      {course.name}
                    </h3>
                  </div>
                </div>

                {/* 상세 정보 */}
                <div className="p-4">
                  <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2 mb-3">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5 text-[#6B7280]">
                      <Navigation size={14} />
                      <span className="text-sm">{course.totalDistance}km</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#6B7280]">
                      <Clock size={14} />
                      <span className="text-sm">{formatDuration(course.estimatedTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#6B7280]">
                      <Star size={14} />
                      <span className="text-sm">후기 {course.reviewCount}</span>
                    </div>
                    <div className="ml-auto">
                      <RestScore score={course.restScore} size="sm" />
                    </div>
                  </div>

                  {/* 코스 스탑 미리보기 */}
                  <div className="flex items-center gap-1.5 bg-[#F5F3EF] rounded-xl p-3">
                    {course.places.map((stop, i) => (
                      <div key={stop.order} className="flex items-center gap-1.5 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-5 h-5 bg-[#5F8D4E] rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">{i + 1}</span>
                        </div>
                        <span className="text-xs text-[#4B5563] font-medium truncate">
                          {stop.place.name}
                        </span>
                        {i < course.places.length - 1 && (
                          <span className="text-[#C4BFB8] text-xs flex-shrink-0">→</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 태그 */}
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {course.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-[#6B7280] bg-[#F5F3EF] px-2.5 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
