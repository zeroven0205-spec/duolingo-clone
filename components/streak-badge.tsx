import { Flame, AlertTriangle } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  /** When true, streak is at risk of breaking (last login > 24h but < 48h ago) */
  atRisk?: boolean;
}

/**
 * Displays the current streak with flame animation.
 * Milestone celebration animations live in `streak-celebration.tsx`.
 */
export function StreakBadge({ streak, atRisk = false }: StreakBadgeProps) {
  if (streak === 0) return null;

  if (atRisk) {
    return (
      <div className="flex items-center gap-1 text-rose-500">
        <AlertTriangle className="h-5 w-5" aria-label="Streak at risk" />
        <span className="font-bold">{streak}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-orange-500">
      <Flame className="h-5 w-5 animate-pulse" />
      <span className="font-bold">{streak}</span>
    </div>
  );
}