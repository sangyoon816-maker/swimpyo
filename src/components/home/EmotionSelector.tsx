'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { EMOTIONS } from '@/data/emotions';
import { useAppStore } from '@/store/useAppStore';
import RestDiagnosisSheet from './RestDiagnosisSheet';
import type { DiagnosisAnswers, Emotion } from '@/types';

export default function EmotionSelector() {
  const router = useRouter();
  const { selectedEmotion, setSelectedEmotion } = useAppStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setSheetOpen(true);
  };

  const handleComplete = (answers: DiagnosisAnswers) => {
    setSheetOpen(false);
    if (!selectedEmotion) return;
    const params = new URLSearchParams({
      emotion: selectedEmotion,
      social: answers.social,
      walk: answers.walk,
      space: answers.space,
    });
    router.push(`/recommend?${params.toString()}`);
  };

  return (
    <section className="px-4 py-6">
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-[#1A1A1A]">
          지금 기분이 어때요?
        </h2>
        <p className="text-sm text-[#6B7280] mt-0.5">
          감정을 선택하면 쉼 진단으로 더 정확하게 추천해드려요
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {EMOTIONS.map((emotion, idx) => (
          <motion.button
            key={emotion.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.07, duration: 0.35 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(emotion.id)}
            className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 border-2 border-[#F0EDE8] shadow-sm hover:border-[#A4BE7B] transition-all duration-200 text-left"
            style={
              selectedEmotion === emotion.id
                ? { borderColor: '#5F8D4E', backgroundColor: emotion.bgColor }
                : {}
            }
          >
            <span className="text-2xl flex-shrink-0">{emotion.emoji}</span>
            <div className="min-w-0">
              <p
                className="text-[15px] font-semibold leading-tight"
                style={{
                  color: selectedEmotion === emotion.id ? emotion.color : '#1A1A1A',
                }}
              >
                {emotion.label}
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-tight">
                {emotion.description}
              </p>
            </div>
            <div className="ml-auto">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: emotion.color, opacity: 0.4 }}
              />
            </div>
          </motion.button>
        ))}
      </div>

      <RestDiagnosisSheet
        emotion={selectedEmotion}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onComplete={handleComplete}
      />
    </section>
  );
}
