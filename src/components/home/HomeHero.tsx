'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Search, ChevronDown, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AREAS } from '@/data/places';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export default function HomeHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [areaMenuOpen, setAreaMenuOpen] = useState(false);
  const selectedArea = useAppStore((s) => s.selectedArea);
  const setSelectedArea = useAppStore((s) => s.setSelectedArea);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/places?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative isolate px-4 pt-14 pb-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#FAF9F6]" />
      </div>

      <div className="flex items-center justify-between mb-10 relative">
        <div>
          <p className="text-xs text-white/80 font-semibold tracking-wider uppercase mb-1">
            나만의 동네 힐링
          </p>
          <h1 className="text-[28px] font-black text-white tracking-tight">
            쉼표<span className="text-[#A4BE7B]">,</span>
          </h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setAreaMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm"
          >
            <MapPin size={14} className="text-[#5F8D4E]" />
            <span className="text-sm font-medium text-[#1A1A1A]">{selectedArea ?? '전체 지역'}</span>
            <ChevronDown
              size={14}
              className={cn('text-[#6B7280] transition-transform', areaMenuOpen && 'rotate-180')}
            />
          </button>

          <AnimatePresence>
            {areaMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAreaMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-50 w-36 bg-white rounded-2xl shadow-lg border border-[#F0EDE8] py-1.5 max-h-64 overflow-y-auto"
                >
                  <button
                    onClick={() => {
                      setSelectedArea(null);
                      setAreaMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-left text-[#1A1A1A] hover:bg-[#F5F3EF]"
                  >
                    전체 지역
                    {selectedArea === null && <Check size={14} className="text-[#5F8D4E]" />}
                  </button>
                  {AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        setSelectedArea(area);
                        setAreaMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-left text-[#1A1A1A] hover:bg-[#F5F3EF]"
                    >
                      {area}
                      {selectedArea === area && <Check size={14} className="text-[#5F8D4E]" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 relative"
      >
        <h2 className="text-[23px] font-bold text-white leading-snug drop-shadow-sm">
          오늘도 수고했어요.
          <br />
          멀리 떠나지 않아도 괜찮아요.
        </h2>
        <p className="text-[15px] text-white/90 mt-2 leading-relaxed">
          당신의 동네에도 쉼은 있습니다.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSearch}
        className="relative mb-3"
      >
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="동네, 장소 검색..."
            className="w-full bg-white border border-[#E8E4DD] rounded-2xl pl-11 pr-4 py-3.5 text-[15px] text-[#1A1A1A] placeholder:text-[#C4BFB8] shadow-sm outline-none focus:border-[#5F8D4E] focus:ring-2 focus:ring-[#5F8D4E]/20 transition-all"
          />
        </div>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link
          href="/record"
          className="relative flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-white/15 backdrop-blur-sm border border-white/30 rounded-full py-2.5 transition-colors hover:bg-white/25"
        >
          <Sparkles size={14} />
          지금 내 감정을 기록하고 쉼 추천받기
        </Link>
      </motion.div>
    </section>
  );
}
