'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { DIAGNOSIS_QUESTIONS } from '@/lib/diagnosis';
import { EMOTION_MAP } from '@/data/emotions';
import { cn } from '@/lib/utils';
import type { DiagnosisAnswers, Emotion } from '@/types';

interface RestDiagnosisSheetProps {
  emotion: Emotion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (answers: DiagnosisAnswers) => void;
}

export default function RestDiagnosisSheet({
  emotion,
  open,
  onOpenChange,
  onComplete,
}: RestDiagnosisSheetProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosisAnswers>>({});

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setStepIndex(0);
      setAnswers({});
    }
  };

  if (!emotion) return null;
  const config = EMOTION_MAP[emotion];
  const question = DIAGNOSIS_QUESTIONS[stepIndex];

  const handleSelect = (value: string) => {
    const next = { ...answers, [question.id]: value } as Partial<DiagnosisAnswers>;
    setAnswers(next);

    if (stepIndex < DIAGNOSIS_QUESTIONS.length - 1) {
      setTimeout(() => setStepIndex((i) => i + 1), 200);
    } else {
      setTimeout(() => {
        onComplete(next as DiagnosisAnswers);
        setStepIndex(0);
        setAnswers({});
      }, 200);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-none px-5 pb-8 pt-3 gap-3">
        <div className="w-10 h-1.5 bg-[#E8E4DD] rounded-full mx-auto mb-1" />
        <SheetHeader className="p-0 items-center text-center gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{config.emoji}</span>
            <SheetTitle className="text-[15px]" style={{ color: config.color }}>
              쉼 진단 · {config.label}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-[#9CA3AF]">
            3개의 짧은 질문으로 더 정확하게 추천해드릴게요
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center justify-center gap-1.5 py-1.5">
          {DIAGNOSIS_QUESTIONS.map((q, idx) => (
            <span
              key={q.id}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                idx === stepIndex
                  ? 'w-6 bg-[#5F8D4E]'
                  : idx < stepIndex
                    ? 'w-1.5 bg-[#A4BE7B]'
                    : 'w-1.5 bg-[#E8E4DD]'
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-center text-[17px] font-bold text-[#1A1A1A] mb-5">
              <span className="mr-1.5">{question.emoji}</span>
              {question.question}
            </p>
            <div className="flex flex-col gap-2.5">
              {question.options.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(opt.value)}
                  className="w-full py-3.5 rounded-2xl border-2 border-[#E8E4DD] text-[15px] font-medium text-[#1A1A1A] transition-colors hover:border-[#5F8D4E] hover:bg-[#EFF5EB]"
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
