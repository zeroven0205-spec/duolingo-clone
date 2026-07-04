"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { MAX_HEARTS, POINTS_TO_REFILL } from "@/constants";
import db from "@/db/drizzle";
import { userProgress, userSubscription } from "@/db/schema";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import posthog from "@/lib/analytics";

const DAY_IN_MS = 86_400_000;
const STREAK_REWARDS = {
  3: { type: "points" as const, value: 10 },
  7: { type: "hearts" as const, value: 1 },
  30: { type: "plus" as const, value: 30 }, // 30 days = 1 month Plus
};

/**
 * Update user streak on login and distribute rewards at milestones
 */
export async function updateStreakAndClaimRewards() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const user = await getUserProgress();
  if (!user) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastLogin = user.lastLoginDate
    ? new Date(
        user.lastLoginDate.getFullYear(),
        user.lastLoginDate.getMonth(),
        user.lastLoginDate.getDate()
      )
    : null;

  let newStreak = user.streak;
  let rewardClaimed: string | null = null;

  if (!lastLogin) {
    // First login ever
    newStreak = 1;
  } else {
    const daysDiff = Math.floor(
      (today.getTime() - lastLogin.getTime()) / DAY_IN_MS
    );

    if (daysDiff === 0) {
      // Already logged in today, no streak update needed
      return { streak: user.streak, rewardClaimed: null, isNewDay: false };
    } else if (daysDiff === 1) {
      // Consecutive day - increment streak
      newStreak = user.streak + 1;
    } else {
      // Streak broken — but if the user bought a Streak Freeze/Shield that's
      // still valid, hold the streak and consume one day of protection.
      const protection = user.streakProtectionUntil;
      if (protection && protection.getTime() > now.getTime()) {
        const streakBefore = user.streak;
        newStreak = user.streak + 1;
        rewardClaimed = "Streak Freeze saved your streak! ❄️";
        await db
          .update(userProgress)
          .set({ streakProtectionUntil: null })
          .where(eq(userProgress.userId, userId));
        posthog.capture({
          distinctId: userId,
          event: "streak_freeze_consumed",
          properties: { streak_before: streakBefore, streak_after: newStreak },
        });
      } else {
        newStreak = 1;
      }
    }
  }

  // Check for reward at this streak milestone
  const reward = STREAK_REWARDS[newStreak as keyof typeof STREAK_REWARDS];
  if (reward) {
    rewardClaimed = await distributeStreakReward(userId, reward);
  }

  // Analytics: milestone celebrations (3 / 7 / 30 / 100 / 365 days).
  // Fired from the server-side action to avoid client-side tracking setup.
  const STREAK_MILESTONES = [3, 7, 30, 100, 365] as const;
  if (
    (STREAK_MILESTONES as readonly number[]).includes(newStreak)
  ) {
    posthog.capture({
      distinctId: userId,
      event: "streak_milestone_reached",
      properties: { milestone: newStreak },
    });
  }

  // Update streak in database
  await db
    .update(userProgress)
    .set({
      streak: newStreak,
      lastLoginDate: now,
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");

  return { streak: newStreak, rewardClaimed, isNewDay: true };
}

/**
 * Distribute streak reward based on type
 */
async function distributeStreakReward(
  userId: string,
  reward: (typeof STREAK_REWARDS)[keyof typeof STREAK_REWARDS]
): Promise<string> {
  switch (reward.type) {
    case "points": {
      const user = await getUserProgress();
      if (user) {
        await db
          .update(userProgress)
          .set({
            points: user.points + reward.value,
          })
          .where(eq(userProgress.userId, userId));
      }
      return `Earned ${reward.value} points!`;
    }

    case "hearts": {
      const user = await getUserProgress();
      if (user) {
        await db
          .update(userProgress)
          .set({
            hearts: Math.min(user.hearts + reward.value, MAX_HEARTS),
          })
          .where(eq(userProgress.userId, userId));
      }
      return `Earned ${reward.value} heart!`;
    }

    case "plus": {
      // Grant 1 month of Plus subscription
      const existingSub = await getUserSubscription();
      if (existingSub?.isActive) {
        // Extend existing subscription
        const newPeriodEnd = new Date(existingSub.stripeCurrentPeriodEnd);
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
        await db
          .update(userSubscription)
          .set({
            stripeCurrentPeriodEnd: newPeriodEnd,
          })
          .where(eq(userSubscription.userId, userId));
      } else {
        // Create a free Plus period (using a special price ID for streak rewards)
        // In production, this would integrate with Stripe
        await db.insert(userSubscription).values({
          userId,
          stripeCustomerId: `streak_reward_${userId}`,
          stripeSubscriptionId: `streak_sub_${userId}`,
          stripePriceId: "streak_plus_monthly",
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * DAY_IN_MS),
        });
      }
      return "1 month of Plus unlocked!";
    }

    default:
      return "Reward claimed!";
  }
}

/**
 * Get current streak status and any unclaimed rewards
 */
export async function getStreakStatus() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await getUserProgress();
  if (!user) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastLogin = user.lastLoginDate
    ? new Date(
        user.lastLoginDate.getFullYear(),
        user.lastLoginDate.getMonth(),
        user.lastLoginDate.getDate()
      )
    : null;

  const isNewDay = !lastLogin || lastLogin.getTime() < today.getTime();
  const nextReward = getNextStreakReward(user.streak);

  return {
    currentStreak: user.streak,
    isNewDay,
    lastLoginDate: user.lastLoginDate,
    nextReward,
    nextRewardDay: nextReward
      ? Object.entries(STREAK_REWARDS).find(
          ([day]) => parseInt(day) > user.streak
        )?.[0]
      : null,
  };
}

function getNextStreakReward(currentStreak: number): string | null {
  const rewardDays = Object.keys(STREAK_REWARDS)
    .map(Number)
    .sort((a, b) => a - b);
  const nextMilestone = rewardDays.find((day) => day > currentStreak);
  if (!nextMilestone) return null;

  const reward = STREAK_REWARDS[nextMilestone as keyof typeof STREAK_REWARDS];
  const rewardLabel = {
    points: `${reward.value} points`,
    hearts: `${reward.value} heart`,
    plus: "1 month Plus",
  };
  return `${nextMilestone} days: ${rewardLabel[reward.type]}`;
}
