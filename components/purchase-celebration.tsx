"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface PurchaseCelebrationProps {
  /** Toggles the burst — flip from false → true to fire. */
  trigger: boolean;
  /** Optional message rendered as a toast above the confetti. */
  message?: string;
}

/**
 * Single-shot confetti burst used after a successful shop purchase.
 * Mount once in the shop page; pass `trigger` to fire it.
 */
export function PurchaseCelebration({
  trigger,
  message,
}: PurchaseCelebrationProps) {
  const [active, setActive] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (!trigger || active) return;
    setActive(true);
    const timer = setTimeout(() => setActive(false), 3000);
    return () => clearTimeout(timer);
  }, [trigger, active]);

  if (!active) return null;

  return (
    <>
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={150}
        recycle={false}
        colors={["#22C55E", "#FBBF24", "#60A5FA", "#F472B6", "#A78BFA"]}
      />
      {message ? (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed left-1/2 top-12 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-top-4"
        >
          <div className="rounded-full bg-green-500 px-5 py-2 text-sm font-bold text-white shadow-lg">
            {message}
          </div>
        </div>
      ) : null}
    </>
  );
}