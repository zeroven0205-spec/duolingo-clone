/**
 * Spaced Repetition Algorithm (Leitner Box System)
 *
 * Based on the forgetting curve, items are reviewed at increasing intervals:
 * - Box 0: New words (review every day)
 * - Box 1: Learned (review every 3 days)
 * - Box 2: Familiar (review every 7 days)
 * - Box 3: Known (review every 14 days)
 * - Box 4: Mastered (review every 30 days)
 */

export type CardBox = 0 | 1 | 2 | 3 | 4;

export interface WordCard {
  id: string;
  word: string;
  translation: string;
  box: CardBox;
  nextReview: Date;
  easeFactor: number; // SM-18: 2.5 default, min 1.3, max 2.5
  lastReview: Date | null;
  correctCount: number;
  incorrectCount: number;
}

export interface ReviewResult {
  card: WordCard;
  correct: boolean;
  newBox: CardBox;
  nextReviewDate: Date;
}

// Box intervals in days
const BOX_INTERVALS: Record<CardBox, number> = {
  0: 1,
  1: 3,
  2: 7,
  3: 14,
  4: 30,
};

// Minimum ease factor (SM-18)
const MIN_EASE = 1.3;
const MAX_EASE = 2.5;
const DEFAULT_EASE = 2.5;

/**
 * Calculate the next review time based on current card state and answer correctness
 */
export function calculateNextReview(
  card: WordCard,
  correct: boolean,
  overrideEase?: number
): ReviewResult {
  const now = new Date();
  let newBox: CardBox;
  let newEase: number;

  if (correct) {
    // Move card up one box (max box 4)
    newBox = Math.min(card.box + 1, 4) as CardBox;
    const interval = BOX_INTERVALS[newBox];
    const easeFactor = overrideEase ?? card.easeFactor;

    // Increase ease factor slightly for correct answers (SM-18)
    newEase = Math.min(easeFactor + 0.1, MAX_EASE);

    // Calculate next review date
    const nextReview = addDays(now, Math.round(interval * easeFactor));

    return {
      card: {
        ...card,
        box: newBox,
        nextReview,
        easeFactor: newEase,
        lastReview: now,
        correctCount: card.correctCount + 1,
      },
      correct: true,
      newBox,
      nextReviewDate: nextReview,
    };
  } else {
    // Move card back to box 0 (reset)
    newBox = 0;
    const easeFactor = overrideEase ?? card.easeFactor;

    // Decrease ease factor for incorrect answers (SM-18)
    newEase = Math.max(easeFactor - 0.2, MIN_EASE);

    // Review again immediately (or tomorrow)
    const nextReview = addDays(now, 1);

    return {
      card: {
        ...card,
        box: newBox,
        nextReview,
        easeFactor: newEase,
        lastReview: now,
        incorrectCount: card.incorrectCount + 1,
      },
      correct: false,
      newBox,
      nextReviewDate: nextReview,
    };
  }
}

/**
 * Get cards that are due for review
 */
export function getDueCards(cards: WordCard[], limit = 10): WordCard[] {
  const now = new Date();
  return cards
    .filter((card) => card.nextReview <= now)
    .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime())
    .slice(0, limit);
}

/**
 * Create a new word card (for adding new vocabulary)
 */
export function createWordCard(
  id: string,
  word: string,
  translation: string
): WordCard {
  const now = new Date();
  return {
    id,
    word,
    translation,
    box: 0,
    nextReview: now,
    easeFactor: DEFAULT_EASE,
    lastReview: null,
    correctCount: 0,
    incorrectCount: 0,
  };
}

/**
 * Calculate retention rate based on review history
 */
export function calculateRetention(card: WordCard): number {
  const total = card.correctCount + card.incorrectCount;
  if (total === 0) return 0;
  return Math.round((card.correctCount / total) * 100);
}

/**
 * Get box label for UI display
 */
export function getBoxLabel(box: CardBox): string {
  const labels: Record<CardBox, string> = {
    0: "New",
    1: "Learning",
    2: "Familiar",
    3: "Known",
    4: "Mastered",
  };
  return labels[box];
}

/**
 * Add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
