"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/utils";

export type LeaderboardPeriod = "weekly" | "monthly" | "all-time";

const TABS: { value: LeaderboardPeriod; label: string }[] = [
  { value: "weekly", label: "本周" },
  { value: "monthly", label: "本月" },
  { value: "all-time", label: "总榜" },
];

interface PeriodTabsProps {
  current: LeaderboardPeriod;
}

export function PeriodTabs({ current }: PeriodTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const onSelect = (value: LeaderboardPeriod) => {
    if (value === current) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);
    startTransition(() => {
      router.push(`/leaderboard?${params.toString()}`);
    });
  };

  return (
    <div
      role="tablist"
      aria-label="Leaderboard period"
      className="mb-4 flex w-full rounded-full border-2 bg-white p-1"
    >
      {TABS.map((tab) => {
        const isActive = tab.value === current;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            aria-disabled={pending}
            disabled={pending}
            onClick={() => onSelect(tab.value)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors",
              isActive
                ? "bg-green-500 text-white shadow"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}