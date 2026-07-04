"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import Confetti from "react-confetti";

interface StreakCelebrationProps {
  streak: number;
}

const MILESTONES = [3, 7, 30, 100, 365] as const;
type Milestone = (typeof MILESTONES)[number];

const MILESTONE_LABELS: Record<Milestone, string> = {
  3: "3 天连击!",
  7: "1 周连击! 🔥",
  30: "1 个月连击! 🔥🔥",
  100: "100 天! 💯",
  365: "1 年! 🎉",
};

function getMilestone(streak: number): Milestone | null {
  return (MILESTONES.find((m) => m === streak) as Milestone) ?? null;
}

/**
 * Fires confetti + a milestone badge toast when the streak hits
 * 3 / 7 / 30 / 100 / 365 days. Mount once near the streak display.
 */
export function StreakCelebration({ streak }: StreakCelebrationProps) {
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    const milestone = getMilestone(streak);
    if (milestone && activeMilestone !== milestone) {
      setActiveMilestone(milestone);
      const timer = setTimeout(() => setActiveMilestone(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [streak, activeMilestone]);

  if (!activeMilestone) return null;

  return (
    <>
      <Confetti
        numberOfPieces={120}
        recycle={false}
        colors={["#FF6B6B", "#FFE66D", "#4ECDC4", "#FF8E53"]}
      />
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed left-1/2 top-12 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-top-4"
      >
        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 text-sm font-bold text-white shadow-lg">
          <Flame className="h-5 w-5" />
          {MILESTONE_LABELS[activeMilestone]}
        </div>
      </div>
    </>
  );
}