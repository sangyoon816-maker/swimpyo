'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const MAX_LENGTH = 100;

interface ReviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeName: string;
  initialContent?: string;
  initialLiked?: boolean | null;
  submitting?: boolean;
  error?: string | null;
  onSubmit: (content: string, liked: boolean) => void;
}

export default function ReviewFormDialog({
  open,
  onOpenChange,
  placeName,
  initialContent = '',
  initialLiked = null,
  submitting = false,
  error,
  onSubmit,
}: ReviewFormDialogProps) {
  const [content, setContent] = useState(initialContent);
  const [liked, setLiked] = useState<boolean | null>(initialLiked);
  const [prevOpen, setPrevOpen] = useState(open);

  // Reset the form fields whenever the dialog transitions to open, without an
  // effect — adjusting state during render avoids the extra commit a
  // useEffect-based reset would cause (see "Adjusting state on prop change").
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setContent(initialContent);
      setLiked(initialLiked);
    }
  }

  const canSubmit = content.trim().length > 0 && liked !== null && !submitting;

  const handleSubmit = () => {
    if (!canSubmit || liked === null) return;
    onSubmit(content.trim(), liked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-[340px]">
        <DialogHeader>
          <DialogTitle>{placeName} 후기</DialogTitle>
          <DialogDescription>방문하신 경험을 한 줄로 남겨주세요</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLiked(true)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors',
              liked === true
                ? 'bg-[#EFF5EB] border-[#5F8D4E] text-[#5F8D4E]'
                : 'bg-white border-[#E8E4DD] text-[#6B7280]'
            )}
          >
            👍 좋아요
          </button>
          <button
            type="button"
            onClick={() => setLiked(false)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors',
              liked === false
                ? 'bg-[#FDF0ED] border-[#E07A5F] text-[#E07A5F]'
                : 'bg-white border-[#E8E4DD] text-[#6B7280]'
            )}
          >
            👎 별로예요
          </button>
        </div>

        <div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="이곳에서의 경험을 짧게 남겨주세요"
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-[#6B7280] text-right mt-1">
            {content.length}/{MAX_LENGTH}
          </p>
        </div>

        {error && <p className="text-xs text-[#E07A5F]">{error}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
