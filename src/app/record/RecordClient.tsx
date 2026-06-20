'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Flame, BatteryLow } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EMOTIONS } from '@/data/emotions';
import { getPlacesByEmotion } from '@/data/places';
import { generateMoodAnalysis, getRecommendReasonBullets, type MoodAnalysis } from '@/lib/insight';
import { useAppStore } from '@/store/useAppStore';
import PlaceCard from '@/components/common/PlaceCard';
import { Progress } from '@/components/ui/progress';
import type { Emotion, Place } from '@/types';
import { EMOTION_MAP } from '@/data/emotions';

export default function RecordClient() {
  const router = useRouter();
  const { emotionRecords, addEmotionRecord } = useAppStore();
  const [step, setStep] = useState<'select' | 'write' | 'result'>('select');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [note, setNote] = useState('');
  const [recommendedPlaces, setRecommendedPlaces] = useState<Place[]>([]);
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setStep('write');
  };

  const handleSubmit = () => {
    if (!selectedEmotion) return;
    const places = getPlacesByEmotion(selectedEmotion).slice(0, 3);
    const analysis = generateMoodAnalysis(selectedEmotion, note);
    setRecommendedPlaces(places);
    setMoodAnalysis(analysis);

    const record = {
      id: Date.now().toString(),
      emotion: selectedEmotion,
      note: note || undefined,
      stressScore: analysis.stressScore,
      fatigueScore: analysis.fatigueScore,
      recommendedPlaces: places,
      createdAt: new Date().toISOString(),
    };
    addEmotionRecord(record);
    setStep('result');
  };

  const handleReset = () => {
    setStep('select');
    setSelectedEmotion(null);
    setNote('');
    setRecommendedPlaces([]);
    setMoodAnalysis(null);
  };

  const selectedConf = selectedEmotion ? EMOTION_MAP[selectedEmotion] : null;

  return (
    <div className="px-4 py-4">
      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-6">
              <h2 className="text-[20px] font-bold text-[#1A1A1A] leading-tight">
                오늘 어떤 감정을
                <br />
                느끼고 있나요?
              </h2>
              <p className="text-sm text-[#9CA3AF] mt-1.5">
                솔직하게 선택해보세요. AI가 맞는 장소를 추천해줄게요.
              </p>
            </div>

            <div className="space-y-2.5">
              {EMOTIONS.map((emotion, idx) => (
                <motion.button
                  key={emotion.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleEmotionSelect(emotion.id)}
                  className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border-2 border-[#F0EDE8] shadow-sm hover:border-[#A4BE7B] transition-all text-left"
                >
                  <span className="text-3xl">{emotion.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[16px] font-semibold text-[#1A1A1A]">{emotion.label}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{emotion.description}</p>
                  </div>
                  <ChevronRight size={18} className="text-[#C4BFB8]" />
                </motion.button>
              ))}
            </div>

            {/* 과거 기록 */}
            {emotionRecords.length > 0 && (
              <div className="mt-8">
                <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-3">최근 감정 기록</h3>
                <div className="space-y-2">
                  {emotionRecords.slice(0, 3).map((record) => {
                    const conf = EMOTION_MAP[record.emotion];
                    return (
                      <div
                        key={record.id}
                        className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#F0EDE8]"
                      >
                        <span className="text-xl">{conf?.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1A1A1A]">{conf?.label}</p>
                          {record.note && (
                            <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{record.note}</p>
                          )}
                        </div>
                        <span className="text-xs text-[#C4BFB8] flex-shrink-0">
                          {new Date(record.createdAt).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 'write' && selectedConf && (
          <motion.div
            key="write"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* 선택된 감정 표시 */}
            <div
              className="rounded-2xl p-4 mb-6 flex items-center gap-3"
              style={{ backgroundColor: selectedConf.bgColor }}
            >
              <span className="text-3xl">{selectedConf.emoji}</span>
              <div>
                <p
                  className="text-[17px] font-bold"
                  style={{ color: selectedConf.color }}
                >
                  {selectedConf.label}
                </p>
                <p className="text-sm mt-0.5" style={{ color: selectedConf.color, opacity: 0.7 }}>
                  {selectedConf.description}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[15px] font-semibold text-[#1A1A1A] block mb-3">
                지금 어떤 마음인지 조금 더 얘기해줄래요? <span className="text-[#C4BFB8] font-normal">(선택)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="오늘 있었던 일, 지금 느끼는 감정을 자유롭게 적어보세요..."
                rows={5}
                className="w-full bg-white border-2 border-[#E8E4DD] rounded-2xl p-4 text-[14px] text-[#1A1A1A] placeholder:text-[#C4BFB8] resize-none outline-none focus:border-[#5F8D4E] focus:ring-2 focus:ring-[#5F8D4E]/15 transition-all leading-relaxed"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('select')}
                className="flex-1 py-3.5 rounded-2xl border-2 border-[#E8E4DD] text-[#6B7280] font-semibold"
              >
                다시 선택
              </button>
              <button
                onClick={handleSubmit}
                className="flex-[2] py-3.5 rounded-2xl bg-[#5F8D4E] text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#5F8D4E]/20"
              >
                <Sparkles size={18} />
                장소 추천받기
              </button>
            </div>
          </motion.div>
        )}

        {step === 'result' && selectedConf && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* 결과 헤더 */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-4xl mb-3"
                style={{ backgroundColor: selectedConf.bgColor }}
              >
                {selectedConf.emoji}
              </div>
              <h2 className="text-[20px] font-bold text-[#1A1A1A]">
                <span style={{ color: selectedConf.color }}>{selectedConf.label}</span>
                {' '}당신을 위한 추천
              </h2>
              <p className="text-sm text-[#9CA3AF] mt-1">
                지금 상태에 딱 맞는 쉼터를 찾았어요
              </p>
            </div>

            {/* AI 분석 결과 */}
            {moodAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-[#F0EDE8] p-4 mb-6"
              >
                <div className="flex items-center gap-1.5 mb-4">
                  <Sparkles size={13} className="text-[#5F8D4E]" />
                  <span className="text-xs font-bold text-[#5F8D4E] tracking-wide">
                    AI가 분석한 현재 상태
                  </span>
                </div>
                <div className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Flame size={13} className="text-[#E07A5F]" />
                        <span className="text-[13px] font-medium text-[#4B5563]">스트레스</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#E07A5F]">
                        {moodAnalysis.stressScore}%
                      </span>
                    </div>
                    <Progress
                      value={moodAnalysis.stressScore}
                      className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-[#E07A5F]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <BatteryLow size={13} className="text-[#7B7FBF]" />
                        <span className="text-[13px] font-medium text-[#4B5563]">피로도</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#7B7FBF]">
                        {moodAnalysis.fatigueScore}%
                      </span>
                    </div>
                    <Progress
                      value={moodAnalysis.fatigueScore}
                      className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-[#7B7FBF]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 추천 장소 */}
            <div className="space-y-3 mb-6">
              <p className="text-[13px] font-bold text-[#1A1A1A]">이런 쉼을 추천해요</p>
              {recommendedPlaces.map((place, idx) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="space-y-1.5"
                >
                  <PlaceCard place={place} variant="horizontal" contextEmotion={selectedEmotion ?? undefined} />
                  <p className="text-xs text-[#5F8D4E] font-medium pl-1 line-clamp-1">
                    💡 {getRecommendReasonBullets(place).slice(0, 2).join(' · ')}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3.5 rounded-2xl border-2 border-[#E8E4DD] text-[#6B7280] font-semibold"
              >
                다시 기록
              </button>
              <button
                onClick={() => router.push('/places')}
                className="flex-[2] py-3.5 rounded-2xl bg-[#5F8D4E] text-white font-semibold flex items-center justify-center gap-1"
              >
                더 많은 장소 보기
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
