"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { MAX_HEARTS, MONTH_IN_MS, WEEK_IN_MS } from "@/constants";
import { isEnabled } from "@/lib/feature-flag";
import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";

export const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized.");

  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  if (!currentUserProgress) throw new Error("User progress not found.");

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) throw new Error("Challenge not found.");

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });

  const isPractice = !!existingChallengeProgress;

  if (
    currentUserProgress.hearts === 0 &&
    !isPractice &&
    !userSubscription?.isActive
  )
    return { error: "hearts" };

  if (isPractice) {
    await db
      .update(challengeProgress)
      .set({
        completed: true,
      })
      .where(eq(challengeProgress.id, existingChallengeProgress.id));

    await applyPointsAward(userId, currentUserProgress, /* challengeXp */ 10);

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
    return;
  }

  await db.insert(challengeProgress).values({
    challengeId,
    userId,
    completed: true,
  });

  await applyPointsAward(userId, currentUserProgress, /* challengeXp */ 10);

  revalidatePath("/learn");
  revalidatePath("/lesson");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};

/**
 * Award XP for completing a challenge.
 *
 * - `xp_boost` flag must be ON and `userProgress.xpBoostUntil` must be in the
 *   future to trigger the 2× multiplier. Either condition fails = base XP.
 * - Weekly / monthly counters are lazily reset when stale.
 * - On a successful boost, `xpBoostUntil` is consumed (set to NULL) so the
 *   boost is one-shot.
 */
async function applyPointsAward(
  userId: string,
  user: typeof userProgress.$inferSelect,
  challengeXp: number
) {
  const now = new Date();
  const boostActive =
    isEnabled("xp_boost") &&
    !!user.xpBoostUntil &&
    user.xpBoostUntil.getTime() > now.getTime();
  const xpAward = boostActive ? challengeXp * 2 : challengeXp;
  const weeklyStale =
    !user.weeklyResetAt ||
    now.getTime() - user.weeklyResetAt.getTime() > WEEK_IN_MS;
  const monthlyStale =
    !user.monthlyResetAt ||
    now.getTime() - user.monthlyResetAt.getTime() > MONTH_IN_MS;

  await db
    .update(userProgress)
    .set({
      points: user.points + xpAward,
      pointsWeekly: weeklyStale ? xpAward : user.pointsWeekly + xpAward,
      pointsMonthly: monthlyStale ? xpAward : user.pointsMonthly + xpAward,
      ...(boostActive ? { xpBoostUntil: null } : {}),
    })
    .where(eq(userProgress.userId, userId));
}
