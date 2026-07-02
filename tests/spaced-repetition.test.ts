import { describe, test, expect } from "vitest";
import { calculateNextReview, createWordCard, getBoxLabel } from "@/lib/spaced-repetition";

describe("Spaced Repetition Algorithm", () => {
  test("createWordCard returns card with box 0", () => {
    const card = createWordCard("1", "hello", "你好");
    expect(card.box).toBe(0);
    expect(card.word).toBe("hello");
    expect(card.translation).toBe("你好");
    expect(card.easeFactor).toBe(2.5);
  });

  test("correct answer moves card up one box", () => {
    const card = createWordCard("1", "hello", "你好");
    const result = calculateNextReview(card, true);
    expect(result.correct).toBe(true);
    expect(result.newBox).toBe(1);
  });

  test("incorrect answer resets card to box 0", () => {
    const card = { ...createWordCard("1", "hello", "你好"), box: 3 as const };
    const result = calculateNextReview(card, false);
    expect(result.correct).toBe(false);
    expect(result.newBox).toBe(0);
  });

  test("correct answer on box 4 stays at box 4 (max)", () => {
    const card = { ...createWordCard("1", "hello", "你好"), box: 4 as const, easeFactor: 2.5 };
    const result = calculateNextReview(card, true);
    expect(result.newBox).toBe(4);
  });

  test("ease factor increases on correct answer", () => {
    const card = { ...createWordCard("1", "hello", "你好"), easeFactor: 2.4 };
    const result = calculateNextReview(card, true);
    expect(result.card.easeFactor).toBe(2.5); // 2.4 + 0.1 = 2.5
  });

  test("ease factor decreases on incorrect answer", () => {
    const card = { ...createWordCard("1", "hello", "你好"), easeFactor: 2.5 };
    const result = calculateNextReview(card, false);
    expect(result.card.easeFactor).toBeLessThan(2.5);
  });

  test("getBoxLabel returns correct label", () => {
    expect(getBoxLabel(0)).toBe("New");
    expect(getBoxLabel(1)).toBe("Learning");
    expect(getBoxLabel(2)).toBe("Familiar");
    expect(getBoxLabel(3)).toBe("Known");
    expect(getBoxLabel(4)).toBe("Mastered");
  });
});
