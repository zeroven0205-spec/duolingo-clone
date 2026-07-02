import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-1 text-orange-500">
      <Flame className="w-5 h-5" />
      <span className="font-bold">{streak}</span>
    </div>
  );
}
