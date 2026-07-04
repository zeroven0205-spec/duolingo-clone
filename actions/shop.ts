"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import {
  MAX_HEARTS,
  SHOP_CATALOG,
  type ShopItemId,
} from "@/constants";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { getUserProgress } from "@/db/queries";
import { isEnabled } from "@/lib/feature-flag";
import posthog from "@/lib/analytics";

const DAY_IN_MS = 86_400_000;

class ShopError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopError";
  }
}

/**
 * Resolve the user's current state or throw — every shop action needs both.
 */
async function requireUserAndItem(itemId: ShopItemId) {
  const { userId } = await auth();
  if (!userId) throw new ShopError("Unauthorized.");

  const item = SHOP_CATALOG.find((entry) => entry.id === itemId);
  if (!item) throw new ShopError("Unknown shop item.");

  const user = await getUserProgress();
  if (!user) throw new ShopError("User progress not found.");

  return { userId, item, user };
}

/**
 * Apply the item's effect to the user — single source of truth for what
 * each shop item actually does. Keeps the action handlers tiny.
 */
async function applyItemEffect(
  userId: string,
  user: typeof userProgress.$inferSelect,
  itemId: ShopItemId
) {
  const now = new Date();

  switch (itemId) {
    case "streak_freeze": {
      const expiresAt = new Date(now.getTime() + DAY_IN_MS);
      await db
        .update(userProgress)
        .set({ streakProtectionUntil: expiresAt })
        .where(eq(userProgress.userId, userId));
      return;
    }

    case "streak_shield": {
      const expiresAt = new Date(now.getTime() + 7 * DAY_IN_MS);
      await db
        .update(userProgress)
        .set({ streakProtectionUntil: expiresAt })
        .where(eq(userProgress.userId, userId));
      return;
    }

    case "xp_boost": {
      // Boost applies to the next lesson; expire in one day as a backstop.
      const expiresAt = new Date(now.getTime() + DAY_IN_MS);
      await db
        .update(userProgress)
        .set({ xpBoostUntil: expiresAt })
        .where(eq(userProgress.userId, userId));
      return;
    }

    case "hearts_pack": {
      // Refuse when the user is already at the cap — no point charging
      // points for nothing. Mirrors the behaviour of `refillHearts` which
      // also blocks when hearts === MAX_HEARTS.
      if (user.hearts >= MAX_HEARTS) {
        throw new ShopError("Hearts are already full.");
      }
      await db
        .update(userProgress)
        .set({ hearts: Math.min(user.hearts + 5, MAX_HEARTS) })
        .where(eq(userProgress.userId, userId));
      return;
    }

    default: {
      // Exhaustiveness guard — if a new item is added without a case, this fails to type-check.
      const _exhaustive: never = itemId;
      throw new ShopError(`Unhandled item: ${String(_exhaustive)}`);
    }
  }
}

function revalidateShopPaths() {
  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
}

async function chargeAndApply(
  itemId: ShopItemId,
  successMessage: string
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  try {
    if (!isEnabled("shop_v2")) {
      throw new ShopError("Shop is temporarily unavailable.");
    }
    const { userId, item, user } = await requireUserAndItem(itemId);
    if (user.points < item.price) {
      throw new ShopError("Not enough points.");
    }
    const pointsRemaining = user.points - item.price;
    await db
      .update(userProgress)
      .set({ points: pointsRemaining })
      .where(eq(userProgress.userId, userId));
    await applyItemEffect(userId, user, itemId);
    revalidateShopPaths();
    posthog.capture({
      distinctId: userId,
      event: "shop_item_purchased",
      properties: { item_id: itemId, price: item.price, points_remaining: pointsRemaining },
    });
    return { success: true, message: successMessage };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Purchase failed.",
    };
  }
}

export const purchaseStreakFreeze = async () =>
  chargeAndApply("streak_freeze", "Streak Freeze activated — 1 day protected");

export const purchaseStreakShield = async () =>
  chargeAndApply(
    "streak_shield",
    "Streak Shield activated — 7 days protected"
  );

export const purchaseXpBoost = async () =>
  chargeAndApply("xp_boost", "XP Boost activated — next lesson is 2×");

export const purchaseHeartsPack = async () =>
  chargeAndApply("hearts_pack", "Hearts pack opened — +5 hearts");