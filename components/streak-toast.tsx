"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface StreakResult {
  streak: number;
  rewardClaimed: string | null;
  isNewDay: boolean;
}

interface StreakToastProps {
  streakResult: StreakResult | null;
}

export function StreakToast({ streakResult }: StreakToastProps) {
  useEffect(() => {
    if (streakResult?.rewardClaimed) {
      toast(streakResult.rewardClaimed, { icon: "🎁" });
    }
  }, [streakResult]);

  return null;
}
