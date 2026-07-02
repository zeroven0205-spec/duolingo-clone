import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, lte, asc } from "drizzle-orm";

import db from "@/db/drizzle";
import { userWords } from "@/db/schema-word-progress";

/**
 * GET /api/review-queue
 * Returns words due for review based on spaced repetition algorithm
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Get words due for review (nextReview <= now)
  const dueWords = await db.query.userWords.findMany({
    where: eq(userWords.userId, userId),
    orderBy: [asc(userWords.nextReview)],
  });

  // Filter to only those due
  const wordsForReview = dueWords.filter(
    (word) => new Date(word.nextReview) <= now
  );

  // Also include some new words if user has fewer than 5 due
  const newWords = dueWords.filter(
    (word) => word.box === 0 && new Date(word.nextReview) > now
  );

  const combined = [...wordsForReview, ...newWords].slice(0, 10);

  return NextResponse.json({
    words: combined.map((w) => ({
      id: w.id,
      word: w.word,
      translation: w.translation,
      box: w.box,
      easeFactor: w.easeFactor / 10, // convert back to decimal
      isNew: w.box === 0,
    })),
    dueCount: wordsForReview.length,
    newCount: newWords.length,
  });
}

/**
 * POST /api/review-queue
 * Submit a review result and get updated card state
 */
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { wordId, correct, responseTimeMs } = body;

  if (!wordId || correct === undefined) {
    return NextResponse.json(
      { error: "Missing wordId or correct" },
      { status: 400 }
    );
  }

  const word = await db.query.userWords.findFirst({
    where: eq(userWords.id, wordId),
  });

  if (!word) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }

  // Calculate new box based on spaced repetition
  const now = new Date();
  let newBox: number;
  let newEaseFactor: number;
  let nextReview: Date;

  const easeFactor = word.easeFactor / 10;
  const boxIntervals = [1, 3, 7, 14, 30];

  if (correct) {
    newBox = Math.min(word.box + 1, 4);
    newEaseFactor = Math.min(easeFactor + 0.1, 2.5);
    const interval = boxIntervals[newBox];
    nextReview = addDays(now, Math.round(interval * newEaseFactor));
  } else {
    newBox = 0;
    newEaseFactor = Math.max(easeFactor - 0.2, 1.3);
    nextReview = addDays(now, 1);
  }

  // Update word in database
  await db
    .update(userWords)
    .set({
      box: newBox,
      easeFactor: Math.round(newEaseFactor * 10),
      nextReview,
      lastReview: now,
      correctCount: correct ? word.correctCount + 1 : word.correctCount,
      incorrectCount: correct ? word.incorrectCount : word.incorrectCount + 1,
    })
    .where(eq(userWords.id, wordId));

  return NextResponse.json({
    wordId,
    newBox,
    easeFactor: newEaseFactor,
    nextReview,
    correct,
  });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
