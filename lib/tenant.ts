import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import {
  tenants,
  tenantMembers,
  classrooms,
  classroomEnrollments,
  assignments,
  assignmentSubmissions,
} from "@/db/schema-tenant";

/**
 * Get the tenant ID for the current user
 */
export async function getUserTenantId(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const membership = await db.query.tenantMembers.findFirst({
    where: eq(tenantMembers.userId, userId),
  });

  return membership?.tenantId ?? null;
}

/**
 * Get user's role in their tenant
 */
export async function getUserTenantRole(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const membership = await db.query.tenantMembers.findFirst({
    where: eq(tenantMembers.userId, userId),
  });

  return membership?.role ?? null;
}

/**
 * Check if user is a teacher in any classroom
 */
export async function isTeacher(): Promise<boolean> {
  const role = await getUserTenantRole();
  return role === "teacher" || role === "admin" || role === "Teacher" || role === "Admin";
}

/**
 * Get classrooms for a teacher
 */
export async function getTeacherClassrooms(teacherId: string) {
  return db.query.classrooms.findMany({
    where: eq(classrooms.teacherId, teacherId),
    orderBy: (classrooms, { desc }) => [desc(classrooms.createdAt)],
  });
}

/**
 * Get students in a classroom with their progress
 */
export async function getClassroomStudents(classroomId: string) {
  const enrollments = await db.query.classroomEnrollments.findMany({
    where: eq(classroomEnrollments.classroomId, classroomId),
    with: {
      // This would need proper relation setup
    },
  });

  return enrollments;
}

/**
 * Generate a short invite code for classroom
 */
export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
