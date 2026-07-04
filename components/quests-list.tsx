"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Confetti from "react-confetti";

import { Progress } from "@/components/ui/progress";
import { QUESTS } from "@/constants";

interface QuestsListProps {
  points: number;
}

/**
 * Renders the quest list and fires a one-shot confetti burst when the user
 * has completed any of the milestones (20 / 50 / 100 / 250 / 500 / 1000 XP).
 * Tracks which milestones have already been celebrated via sessionStorage so
 * the burst only fires once per milestone per browser.
 */
export function QuestsList({ points }: QuestsListProps) {
  const [activeBurst, setActiveBurst] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = "celebrated-quests";
    const raw = sessionStorage.getItem(storageKey);
    const celebrated = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);

    const newlyReached = QUESTS.find(
      (quest) => points >= quest.value && !celebrated.has(String(quest.value))
    );

    if (!newlyReached) return;

    celebrated.add(String(newlyReached.value));
    sessionStorage.setItem(storageKey, JSON.stringify([...celebrated]));
    setActiveBurst(true);
    const timer = setTimeout(() => setActiveBurst(false), 4000);
    return () => clearTimeout(timer);
  }, [points]);

  return (
    <>
      {activeBurst ? (
        <Confetti
          numberOfPieces={120}
          recycle={false}
          colors={["#22C55E", "#FBBF24", "#60A5FA", "#F472B6"]}
        />
      ) : null}

      <ul className="w-full">
        {QUESTS.map((quest) => {
          const progress = (points / quest.value) * 100;
          const completed = points >= quest.value;

          return (
            <div
              key={quest.title}
              className="flex w-full items-center gap-x-4 border-t-2 p-4"
            >
              <Image
                src="/points.svg"
                alt="Points"
                width={60}
                height={60}
                className={completed ? "" : "opacity-60"}
              />

              <div className="flex w-full flex-col gap-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-neutral-700">
                    {quest.title}
                  </p>
                  {completed ? (
                    <span className="text-xs font-bold text-green-500">
                      ✓ 完成
                    </span>
                  ) : null}
                </div>

                <Progress value={progress} className="h-3" />
              </div>
            </div>
          );
        })}
      </ul>
    </>
  );
}