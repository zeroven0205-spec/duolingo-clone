import { PostHog } from "posthog-node";

// Server-side PostHog client
const posthog = new PostHog(process.env.POSTHOG_API_KEY || "phc_test", {
  host: process.env.POSTHOG_HOST || "https://app.posthog.com",
  flushAt: 20,
  flushInterval: 10000,
});

export default posthog;

// Key events for the app
export const Events = {
  USER_REGISTERED: "user_registered",
  LESSON_COMPLETED: "lesson_completed",
  SUBSCRIPTION_STARTED: "subscription_started",
  HEARTS_EXHAUSTED: "hearts_exhausted",
  STREAK_UPDATED: "streak_updated",
  CHURN_RISK: "churn_risk",
} as const;

export type EventName = (typeof Events)[keyof typeof Events];
