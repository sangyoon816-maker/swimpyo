'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Navigation, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { COURSES } from '@/data/courses';
import { formatDuration } from '@/lib/utils';

export default function CourseBanner() {
  const featured = COURSES[0];

  return (
    <section className="px-4 py-6">
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-[#1A1A1A]">추천 산책 코스</h2>
        <p className="text-sm text-[#9CA3AF] mt-0.5">오늘 이 코스 어때요?</p>
      </div>

      <Link href={`/courses/${featured.id}`}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="relative rounded-3xl overflow-hidden h-[180px] shadow-md"
        >
          <Image
            src={featured.thumbnail}
            alt={featured.name}
            fill
            className="object-cover"
            sizes="(max-width: 430px) 100vw, 430px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex gap-2 mb-2">
              {featured.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-[17px] font-bold text-white leading-tight">
              {featured.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1 text-white/80">
                <Navigation size={12} />
                <span className="text-xs">{featured.totalDistance}km</span>
              </div>
              <div className="flex items-center gap-1 text-white/80">
                <Clock size={12} />
                <span className="text-xs">{formatDuration(featured.estimatedTime)}</span>
              </div>
              <div className="ml-auto flex items-center gap-1 text-white">
                <span className="text-xs font-medium">코스 보기</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
