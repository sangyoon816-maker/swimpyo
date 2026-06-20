'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart, MapPin, BookHeart, Settings, Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { getPlaceById, PLACES } from '@/data/places';
import { EMOTION_MAP } from '@/data/emotions';
import PlaceCard from '@/components/common/PlaceCard';
import RestScore from '@/components/common/RestScore';
import EmptyState from '@/components/common/EmptyState';

type Tab = 'saved' | 'visited' | 'emotions';

export default function MypageClient() {
  const { savedPlaceIds, visitedPlaceIds, emotionRecords } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('saved');

  const savedPlaces = savedPlaceIds.map((id) => getPlaceById(id)).filter(Boolean) as typeof PLACES;
  const visitedPlaces = visitedPlaceIds.map((id) => getPlaceById(id)).filter(Boolean) as typeof PLACES;

  const TABS = [
    { id: 'saved' as Tab, label: '찜 목록', icon: Heart, count: savedPlaces.length },
    { id: 'visited' as Tab, label: '방문 기록', icon: MapPin, count: visitedPlaces.length },
    { id: 'emotions' as Tab, label: '감정 기록', icon: BookHeart, count: emotionRecords.length },
  ];

  return (
    <div>
      {/* 프로필 섹션 */}
      <div className="bg-gradient-to-b from-[#EFF5EB] to-[#FAF9F6] px-4 pt-4 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#5F8D4E] flex items-center justify-center">
            <Leaf size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-[18px] font-bold text-[#1A1A1A]">나의 쉼표</h2>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {savedPlaces.length}곳 찜 · {visitedPlaces.length}곳 방문
            </p>
          </div>
          <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center border border-[#E8E4DD]">
            <Settings size={16} className="text-[#6B7280]" />
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: '찜한 곳', value: savedPlaces.length, color: '#E07A5F' },
            { label: '방문한 곳', value: visitedPlaces.length, color: '#5F8D4E' },
            { label: '감정 기록', value: emotionRecords.length, color: '#7B7FBF' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#F0EDE8]">
              <p className="text-[22px] font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 탭 */}
      <div className="bg-white border-b border-[#E8E4DD] sticky top-0 z-20">
        <div className="flex">
          {TABS.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium relative transition-colors ${
                activeTab === id ? 'text-[#1A1A1A]' : 'text-[#9CA3AF]'
              }`}
            >
              <Icon
                size={18}
                className={activeTab === id ? 'text-[#5F8D4E]' : 'text-[#C4BFB8]'}
              />
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={`absolute top-2 right-[calc(50%-18px)] text-[9px] font-bold px-1 rounded-full ${
                    activeTab === id
                      ? 'bg-[#5F8D4E] text-white'
                      : 'bg-[#E8E4DD] text-[#9CA3AF]'
                  }`}
                >
                  {count}
                </span>
              )}
              {activeTab === id && (
                <motion.div
                  layoutId="mypage-tab"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#5F8D4E] rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="px-4 py-4">
        {activeTab === 'saved' && (
          <div>
            {savedPlaces.length === 0 ? (
              <EmptyState
                emoji="💚"
                title="아직 저장한 쉼이 없어요"
                desc={'마음에 드는 장소를 저장해보세요'}
                href="/places"
                linkLabel="쉼 찾으러 가기"
              />
            ) : (
              <div className="flex flex-col gap-3">
                {savedPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} variant="horizontal" />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'visited' && (
          <div>
            {visitedPlaces.length === 0 ? (
              <EmptyState
                emoji="🗺️"
                title="아직 방문한 장소가 없어요"
                desc="장소를 방문하고 '여기서 쉬기'를 눌러보세요"
                href="/places"
                linkLabel="장소 탐색하기"
              />
            ) : (
              <div className="flex flex-col gap-3">
                {visitedPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} variant="horizontal" />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'emotions' && (
          <div>
            {emotionRecords.length === 0 ? (
              <EmptyState
                emoji="💭"
                title="아직 감정 기록이 없어요"
                desc="오늘의 감정을 기록하면 AI가 장소를 추천해줘요"
                href="/record"
                linkLabel="감정 기록하기"
              />
            ) : (
              <div className="space-y-3">
                {emotionRecords.map((record) => {
                  const conf = EMOTION_MAP[record.emotion];
                  return (
                    <div
                      key={record.id}
                      className="bg-white rounded-2xl border border-[#F0EDE8] p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                          style={{ backgroundColor: conf?.bgColor }}
                        >
                          {conf?.emoji}
                        </div>
                        <div className="flex-1">
                          <p className="text-[14px] font-semibold" style={{ color: conf?.color }}>
                            {conf?.label}
                          </p>
                          <p className="text-xs text-[#9CA3AF]">
                            {new Date(record.createdAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {record.note && (
                        <p className="text-sm text-[#4B5563] leading-relaxed mb-3 bg-[#F5F3EF] rounded-xl px-3 py-2.5">
                          {record.note}
                        </p>
                      )}

                      {record.stressScore != null && record.fatigueScore != null && (
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs text-[#E07A5F] font-medium">
                            스트레스 {record.stressScore}%
                          </span>
                          <span className="text-xs text-[#7B7FBF] font-medium">
                            피로도 {record.fatigueScore}%
                          </span>
                        </div>
                      )}

                      {record.recommendedPlaces.length > 0 && (
                        <div>
                          <p className="text-xs text-[#9CA3AF] mb-2">추천받은 장소</p>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {record.recommendedPlaces.map((place) => (
                              <Link
                                key={place.id}
                                href={`/places/${place.id}?emotion=${record.emotion}`}
                                className="flex-shrink-0 flex items-center gap-2 bg-[#F5F3EF] rounded-xl px-3 py-2 min-w-0"
                              >
                                <span className="text-sm font-medium text-[#1A1A1A] whitespace-nowrap">
                                  {place.name}
                                </span>
                                <RestScore score={place.restScore} size="sm" showLabel={false} />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
