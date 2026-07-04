"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getBoxLabel, type CardBox } from "@/lib/spaced-repetition";

export interface ReviewWord {
  id: number;
  word: string;
  translation: string;
  box: number;
  isNew: boolean;
}

interface ReviewSessionProps {
  initialQueue: ReviewWord[];
  dueCount: number;
  newCount: number;
}

/**
 * Interactive review session — shows the queue one card at a time, lets the
 * user mark each word correct / incorrect, and POSTs the result to
 * /api/review-queue which mutates the spaced-repetition state.
 */
export function ReviewSession({
  initialQueue,
  dueCount,
  newCount,
}: ReviewSessionProps) {
  const [queue, setQueue] = useState<ReviewWord[]>(initialQueue);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [pending, startTransition] = useTransition();

  const current = queue[index];
  const finished = !current;

  const onReveal = () => setRevealed(true);

  const onAnswer = (correct: boolean) => {
    if (!current) return;
    const wordId = current.id;

    startTransition(async () => {
      const res = await fetch("/api/review-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId, correct }),
      });
      if (!res.ok) {
        toast.error("提交失败，请稍后再试");
        return;
      }
      setRevealed(false);
      setIndex((i) => i + 1);
    });
  };

  if (finished) {
    return (
      <div className="rounded-xl border-2 bg-white p-8 text-center">
        <p className="text-xl font-bold text-green-600">本轮复习完成！</p>
        <p className="mt-2 text-sm text-muted-foreground">
          本次共完成 {queue.length} 个单词（到期 {dueCount}，新增 {newCount}）。
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border-2 bg-white p-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {index + 1} / {queue.length}
        </span>
        <span className="text-xs text-muted-foreground">
          {current.isNew ? "新词" : getBoxLabel(current.box as CardBox)}
        </span>
      </div>

      <div className="my-8 text-center">
        <p className="text-3xl font-bold text-neutral-800">{current.word}</p>
        {revealed ? (
          <p className="mt-4 text-xl text-muted-foreground">
            {current.translation}
          </p>
        ) : null}
      </div>

      {revealed ? (
        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={() => onAnswer(false)}
            disabled={pending}
            className="flex-1"
          >
            忘记了
          </Button>
          <Button
            variant="secondary"
            onClick={() => onAnswer(true)}
            disabled={pending}
            className="flex-1"
          >
            记得
          </Button>
        </div>
      ) : (
        <Button onClick={onReveal} className="w-full" disabled={pending}>
          显示释义
        </Button>
      )}
    </div>
  );
}