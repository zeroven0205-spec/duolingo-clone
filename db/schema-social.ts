import { relations } from "drizzle-orm";
import {
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { userProgress } from "./schema";

export const friendships = pgTable(
  "friendships",
  {
    id: serial("id").primaryKey(),
    requesterId: text("requester_id")
      .references(() => userProgress.userId, { onDelete: "cascade" })
      .notNull(),
    addresseeId: text("addressee_id")
      .references(() => userProgress.userId, { onDelete: "cascade" })
      .notNull(),
    status: text("status").notNull().default("pending"), // pending | accepted | rejected
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.requesterId, table.addresseeId] }),
  })
);

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  requester: one(userProgress, {
    fields: [friendships.requesterId],
    references: [userProgress.userId],
    relationName: "requester",
  }),
  addressee: one(userProgress, {
    fields: [friendships.addresseeId],
    references: [userProgress.userId],
    relationName: "addressee",
  }),
}));
