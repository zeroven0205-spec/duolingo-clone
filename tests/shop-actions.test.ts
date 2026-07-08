import { describe, test, expect, vi, beforeEach } from "vitest";

/**
 * Integration-style tests for `chargeAndApply`. We mock the boundary
 * collaborators (auth, db, revalidatePath, posthog, feature flag) so the
 * test exercises the action's decision tree: points gate, hearts gate,
 * effect application, and analytics capture.
 *
 * No real database or PostHog calls — pure logic coverage.
 */

// --- Module mocks (hoisted by vitest before any import of the action) -----

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/feature-flag", () => ({
  isEnabled: vi.fn(() => true),
}));

// `vi.hoisted` lets the analytics mock reference a stable spy handle that
// the test body can later inspect. Without it, the factory would close
// over a `vi.fn()` that hasn't been created yet (mocks hoist above imports).
const { captureMock } = vi.hoisted(() => ({
  captureMock: vi.fn(),
}));
vi.mock("@/lib/analytics", () => ({
  default: { capture: captureMock },
}));

// Mock the db module — every chainable update returns `this` so the action
// can call .set().where() without crashing. Factories must be self-contained
// (no top-level variable references) because vi.mock hoists them above the
// test module's `import` statements.
vi.mock("@/db/drizzle", () => {
  const updateChain = {
    set: vi.fn(() => updateChain),
    where: vi.fn(() => updateChain),
  };
  return {
    default: {
      update: vi.fn(() => updateChain),
    },
  };
});

// Mock `getUserProgress` per-test so we control the user's points / hearts.
const getUserProgressMock = vi.fn();
vi.mock("@/db/queries", () => ({
  getUserProgress: () => getUserProgressMock(),
  getUserSubscription: vi.fn(),
}));

// --- Imports (must come after vi.mock) -----------------------------------

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { isEnabled } from "@/lib/feature-flag";
import {
  purchaseHeartsPack,
  purchaseXpBoost,
  purchaseStreakFreeze,
} from "@/actions/shop";
import { MAX_HEARTS } from "@/constants";

// --- Fixture helper -----------------------------------------------------

function fakeUser(overrides: Partial<{
  points: number;
  hearts: number;
  xpBoostUntil: Date | null;
  streakProtectionUntil: Date | null;
}> = {}) {
  return {
    userId: "user_test",
    userName: "Test",
    userImageSrc: "/mascot.svg",
    activeCourseId: 1,
    hearts: MAX_HEARTS,
    points: 0,
    streak: 0,
    lastLoginDate: null,
    streakProtectionUntil: null,
    xpBoostUntil: null,
    pointsWeekly: 0,
    pointsMonthly: 0,
    weeklyResetAt: new Date(),
    monthlyResetAt: new Date(),
    activeCourse: {
      id: 1,
      title: "Test",
      imageSrc: "/test.svg",
    },
    ...overrides,
  };
}

// --- Tests --------------------------------------------------------------

describe("shop chargeAndApply", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({ userId: "user_test" });
    vi.mocked(isEnabled).mockReturnValue(true);
  });

  test("refuses purchase when points < price", async () => {
    getUserProgressMock.mockResolvedValue(fakeUser({ points: 10 }));

    const result = await purchaseStreakFreeze();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Not enough points.");
    }
    expect(captureMock).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  test("refuses purchase when hearts are already full (hearts_pack)", async () => {
    getUserProgressMock.mockResolvedValue(fakeUser({ points: 999, hearts: MAX_HEARTS }));

    const result = await purchaseHeartsPack();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Hearts are already full.");
    }
    expect(captureMock).not.toHaveBeenCalled();
  });

  test("charges points and applies effect on success", async () => {
    getUserProgressMock.mockResolvedValue(
      fakeUser({ points: 200, hearts: 3 })
    );

    const result = await purchaseHeartsPack();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.message).toMatch(/hearts/i);
    }
    expect(captureMock).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "user_test",
        event: "shop_item_purchased",
        properties: expect.objectContaining({
          item_id: "hearts_pack",
          price: 50,
        }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/shop");
  });

  test("returns error when shop_v2 flag is OFF", async () => {
    vi.mocked(isEnabled).mockReturnValue(false);
    getUserProgressMock.mockResolvedValue(fakeUser({ points: 9999 }));

    const result = await purchaseXpBoost();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/unavailable/i);
    }
    expect(captureMock).not.toHaveBeenCalled();
  });

  test("refuses when auth returns no userId", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null });

    const result = await purchaseStreakFreeze();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Unauthorized.");
    }
    expect(captureMock).not.toHaveBeenCalled();
  });
});