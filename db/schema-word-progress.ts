import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { userProgress } from "./schema";

export const wordBoxLevels = ["NEW", "LEARNING", "FAMILIAR", "KNOWN", "MASTERED"] as const;
export type WordBoxLevel = (typeof wordBoxLevels)[number];

export const userWords = pgTable("user_words", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => userProgress.userId, {
      onDelete: "cascade",
    })
    .notNull(),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
  language: text("language").notNull().default("spanish"),

  // Leitner box system (0-4)
  box: integer("box").notNull().default(0),
  easeFactor: integer("ease_factor").notNull().default(25), // stored as int (25 = 2.5)
  nextReview: timestamp("next_review").notNull().defaultNow(),
  lastReview: timestamp("last_review"),

  // Stats
  correctCount: integer("correct_count").notNull().default(0),
  incorrectCount: integer("incorrect_count").notNull().default(0),

  // Status
  isLearned: boolean("is_learned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userWordsRelations = relations(userWords, ({ one }) => ({
  user: one(userProgress, {
    fields: [userWords.userId],
    references: [userProgress.userId],
  }),
}));

// Challenge-specific word review tracking
export const challengeWords = pgTable("challenge_words", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull(),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
  audioSrc: text("audio_src"),
});

// User's word review history for analytics
export const wordReviewLog = pgTable("word_review_log", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => userProgress.userId, {
      onDelete: "cascade",
    })
    .notNull(),
  wordId: integer("word_id")
    .references(() => userWords.id, {
      onDelete: "cascade",
    })
    .notNull(),
  correct: boolean("correct").notNull(),
  responseTimeMs: integer("response_time_ms"),
  boxBefore: integer("box_before").notNull(),
  boxAfter: integer("box_after").notNull(),
  reviewedAt: timestamp("reviewed_at").notNull().defaultNow(),
});
