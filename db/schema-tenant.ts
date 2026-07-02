import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Tenants (schools, companies, etc.)
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // URL-friendly identifier
  plan: text("plan").notNull().default("free"), // free | school | enterprise
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tenantsRelations = relations(tenants, ({ many }) => ({
  members: many(tenantMembers),
}));

// Tenant members (users within an organization)
export const tenantMembers = pgTable(
  "tenant_members",
  {
    tenantId: uuid("tenant_id")
      .references(() => tenants.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id").notNull(),
    role: text("role").notNull().default("student"), // admin | teacher | student
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.tenantId, table.userId] }),
  })
);

export const tenantMembersRelations = relations(tenantMembers, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantMembers.tenantId],
    references: [tenants.id],
  }),
}));

// Classrooms within a tenant
export const classrooms = pgTable("classrooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // e.g., "Grade 10 English"
  description: text("description"),
  teacherId: text("teacher_id").notNull(), // Clerk user ID
  courseId: integer("course_id").notNull(), // Which course this classroom uses
  inviteCode: text("invite_code").notNull().unique(), // 6-char code
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [classrooms.tenantId],
    references: [tenants.id],
  }),
  enrollments: many(classroomEnrollments),
}));

// Student enrollments in a classroom
export const classroomEnrollments = pgTable(
  "classroom_enrollments",
  {
    classroomId: uuid("classroom_id")
      .references(() => classrooms.id, { onDelete: "cascade" })
      .notNull(),
    studentId: text("student_id").notNull(), // Clerk user ID
    enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.classroomId, table.studentId] }),
  })
);

export const classroomEnrollmentsRelations = relations(
  classroomEnrollments,
  ({ one }) => ({
    classroom: one(classrooms, {
      fields: [classroomEnrollments.classroomId],
      references: [classrooms.id],
    }),
  })
);

// Assignments (homework/tasks)
export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  classroomId: uuid("classroom_id")
    .references(() => classrooms.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  courseId: integer("course_id").notNull(), // Which course to complete
  targetProgress: integer("target_progress").notNull().default(100), // % completion target
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  classroom: one(classrooms, {
    fields: [assignments.classroomId],
    references: [classrooms.id],
  }),
  submissions: many(assignmentSubmissions),
}));

// Student submissions for assignments
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .references(() => assignments.id, { onDelete: "cascade" })
    .notNull(),
  studentId: text("student_id").notNull(),
  progress: integer("progress").notNull().default(0), // % completed
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  feedback: text("feedback"), // Teacher feedback
});

export const assignmentSubmissionsRelations = relations(
  assignmentSubmissions,
  ({ one }) => ({
    assignment: one(assignments, {
      fields: [assignmentSubmissions.assignmentId],
      references: [assignments.id],
    }),
  })
);
