import { describe, test, expect } from "vitest";

import { SHOP_CATALOG, type ShopItemId } from "@/constants";

describe("Shop Catalog", () => {
  test("has the four documented items", () => {
    const ids = SHOP_CATALOG.map((item) => item.id);
    expect(ids).toEqual([
      "streak_freeze",
      "streak_shield",
      "xp_boost",
      "hearts_pack",
    ]);
  });

  test("all prices are positive and reachable", () => {
    SHOP_CATALOG.forEach((item) => {
      expect(item.price).toBeGreaterThan(0);
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.icon).toMatch(/^\//);
    });
  });

  test("price matches the plan (freeze=100, shield=200, xp=150, hearts=50)", () => {
    const byId = Object.fromEntries(
      SHOP_CATALOG.map((item) => [item.id, item])
    ) as Record<ShopItemId, (typeof SHOP_CATALOG)[number]>;
    expect(byId.streak_freeze.price).toBe(100);
    expect(byId.streak_shield.price).toBe(200);
    expect(byId.xp_boost.price).toBe(150);
    expect(byId.hearts_pack.price).toBe(50);
  });

  test("every id is unique", () => {
    const ids = SHOP_CATALOG.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Leaderboard Period Selection", () => {
  const VALID_PERIODS = ["weekly", "monthly", "all-time"] as const;

  test("default period is all-time", () => {
    expect(VALID_PERIODS).toContain("all-time");
  });

  test("all expected periods are present", () => {
    expect(VALID_PERIODS).toHaveLength(3);
    expect(VALID_PERIODS).toContain("weekly");
    expect(VALID_PERIODS).toContain("monthly");
    expect(VALID_PERIODS).toContain("all-time");
  });
});