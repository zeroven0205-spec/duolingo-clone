"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { MAX_HEARTS, MONTH_IN_MS, POINTS_TO_REFILL, WEEK_IN_MS } from "@/constants";
import db from "@/db/drizzle";
import {
  getCourseById,
  getCourseProgress,
  getLessonPercentage,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import posthog from "@/lib/analytics";

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized.");

  const course = await getCourseById(courseId);

  if (!course) throw new Error("Course not found.");

  if (!course.units.length || !course.units[0].lessons.length)
    throw new Error("Course is empty.");

  const existingUserProgress = await getUserProgress();

  if (existingUserProgress) {
    await db
      .update(userProgress)
      .set({
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
      })
      .where(eq(userProgress.userId, userId));

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascot.svg",
  });

  // Track user registration
  posthog.capture({
    distinctId: userId,
    event: "user_registered",
    properties: {
      plan: "free",
      course: course.title,
    },
  });

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized.");

  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

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

  if (isPractice) return { error: "practice" };

  if (!currentUserProgress) throw new Error("User progress not found.");

  if (userSubscription?.isActive) return { error: "subscription" };

  if (currentUserProgress.hearts === 0) return { error: "hearts" };

  const newHearts = Math.max(currentUserProgress.hearts - 1, 0);

  await db
    .update(userProgress)
    .set({
      hearts: newHearts,
    })
    .where(eq(userProgress.userId, userId));

  // Track hearts exhaustion (key conversion point)
  if (newHearts === 0) {
    posthog.capture({
      distinctId: userId,
      event: "hearts_exhausted",
      properties: {
        streak: currentUserProgress.streak,
        courseId: currentUserProgress.activeCourseId,
      },
    });
  }

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};

export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) throw new Error("User progress not found.");
  if (currentUserProgress.hearts === MAX_HEARTS)
    throw new Error("Hearts are already full.");
  if (currentUserProgress.points < POINTS_TO_REFILL)
    throw new Error("Not enough points.");

  await db
    .update(userProgress)
    .set({
      hearts: MAX_HEARTS,
      points: currentUserProgress.points - POINTS_TO_REFILL,
    })
    .where(eq(userProgress.userId, currentUserProgress.userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};

export const completeLesson = async (lessonId: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized.");

  const courseProgress = await getCourseProgress();
  const percentage = await getLessonPercentage();
  const user = await getUserProgress();

  // Bump weekly / monthly counters (rolling windows — reset if stale).
  if (user) {
    const now = new Date();
    const weeklyStale =
      !user.weeklyResetAt ||
      now.getTime() - user.weeklyResetAt.getTime() > WEEK_IN_MS;
    const monthlyStale =
      !user.monthlyResetAt ||
      now.getTime() - user.monthlyResetAt.getTime() > MONTH_IN_MS;

    await db
      .update(userProgress)
      .set({
        pointsWeekly: weeklyStale ? 0 : user.pointsWeekly,
        weeklyResetAt: weeklyStale ? now : user.weeklyResetAt,
        pointsMonthly: monthlyStale ? 0 : user.pointsMonthly,
        monthlyResetAt: monthlyStale ? now : user.monthlyResetAt,
      })
      .where(eq(userProgress.userId, userId));
  }

  // Track lesson completion
  posthog.capture({
    distinctId: userId,
    event: "lesson_completed",
    properties: {
      lessonId,
      courseId: courseProgress?.activeLesson?.unit?.courseId,
      score: percentage,
    },
  });

  return { success: true, percentage };
};
