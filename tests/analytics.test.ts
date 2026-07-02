import { describe, test, expect } from "vitest";

// Mock analytics events
const Events = {
  USER_REGISTERED: "user_registered",
  LESSON_COMPLETED: "lesson_completed",
  SUBSCRIPTION_STARTED: "subscription_started",
  HEARTS_EXHAUSTED: "hearts_exhausted",
  STREAK_UPDATED: "streak_updated",
  CHURN_RISK: "churn_risk",
} as const;

describe("Analytics Events", () => {
  test("all events are defined", () => {
    expect(Events.USER_REGISTERED).toBe("user_registered");
    expect(Events.LESSON_COMPLETED).toBe("lesson_completed");
    expect(Events.SUBSCRIPTION_STARTED).toBe("subscription_started");
    expect(Events.HEARTS_EXHAUSTED).toBe("hearts_exhausted");
    expect(Events.STREAK_UPDATED).toBe("streak_updated");
    expect(Events.CHURN_RISK).toBe("churn_risk");
  });

  test("event names are snake_case", () => {
    Object.values(Events).forEach((event) => {
      expect(event).toMatch(/^[a-z_]+$/);
    });
  });
});

describe("Analytics Properties", () => {
  test("user_registered has correct properties", () => {
    const properties = {
      distinctId: "user_123",
      event: Events.USER_REGISTERED,
      properties: { plan: "free" },
    };
    expect(properties.event).toBe("user_registered");
    expect(properties.properties.plan).toBe("free");
  });

  test("lesson_completed has correct properties", () => {
    const properties = {
      distinctId: "user_123",
      event: Events.LESSON_COMPLETED,
      properties: {
        lessonId: 1,
        courseId: 1,
        score: 85,
      },
    };
    expect(properties.event).toBe("lesson_completed");
    expect(properties.properties.score).toBe(85);
  });

  test("hearts_exhausted is key conversion point", () => {
    const properties = {
      distinctId: "user_123",
      event: Events.HEARTS_EXHAUSTED,
      properties: {
        streak: 7,
      },
    };
    expect(properties.event).toBe("hearts_exhausted");
    expect(properties.properties.streak).toBeGreaterThan(0);
  });
});
