import { describe, test, expect, beforeEach, afterEach } from "vitest";

import { isEnabled } from "@/lib/feature-flag";

describe("Feature flag", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    // Reset relevant env vars before each test so cross-test leakage is impossible.
    process.env = { ...ORIGINAL_ENV };
    delete process.env.FLAG_XP_BOOST;
    delete process.env.FLAG_SHOP_V2;
    delete process.env.FLAG_REVIEW_QUEUE;
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  test("defaults to OFF when env var is unset", () => {
    expect(isEnabled("xp_boost")).toBe(false);
    expect(isEnabled("shop_v2")).toBe(false);
    expect(isEnabled("review_queue")).toBe(false);
  });

  test("only `on` (case-sensitive) enables the flag", () => {
    process.env.FLAG_XP_BOOST = "on";
    expect(isEnabled("xp_boost")).toBe(true);

    process.env.FLAG_SHOP_V2 = "ON";
    expect(isEnabled("shop_v2")).toBe(false); // case-sensitive

    process.env.FLAG_REVIEW_QUEUE = "true";
    expect(isEnabled("review_queue")).toBe(false);

    process.env.FLAG_XP_BOOST = "1";
    expect(isEnabled("xp_boost")).toBe(false);
  });
});