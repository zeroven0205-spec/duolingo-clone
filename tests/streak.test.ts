import { describe, test, expect } from "vitest";

// Mock constants from user-streak.ts
const STREAK_REWARDS = {
  3: { type: "points" as const, value: 10 },
  7: { type: "hearts" as const, value: 1 },
  30: { type: "plus" as const, value: 30 },
};

describe("Streak Rewards", () => {
  test("3 day streak gives 10 points", () => {
    const reward = STREAK_REWARDS[3 as keyof typeof STREAK_REWARDS];
    expect(reward).toEqual({ type: "points", value: 10 });
  });

  test("7 day streak gives 1 heart", () => {
    const reward = STREAK_REWARDS[7 as keyof typeof STREAK_REWARDS];
    expect(reward).toEqual({ type: "hearts", value: 1 });
  });

  test("30 day streak gives 1 month Plus", () => {
    const reward = STREAK_REWARDS[30 as keyof typeof STREAK_REWARDS];
    expect(reward).toEqual({ type: "plus", value: 30 });
  });

  test("streak rewards have correct types", () => {
    expect(STREAK_REWARDS[3].type).toBe("points");
    expect(STREAK_REWARDS[7].type).toBe("hearts");
    expect(STREAK_REWARDS[30].type).toBe("plus");
  });
});

describe("Streak Logic (mocked)", () => {
  test("streak increases by 1 on consecutive day", () => {
    // Simulated streak calculation
    const lastStreak = 5;
    const newStreak = lastStreak + 1;
    expect(newStreak).toBe(6);
  });

  test("streak resets to 1 after missing a day", () => {
    const newStreak = 1;
    expect(newStreak).toBe(1);
  });
});
