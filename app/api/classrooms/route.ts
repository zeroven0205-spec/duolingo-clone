import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import db from "@/db/drizzle";
import { classrooms, tenantMembers } from "@/db/schema-tenant";
import { generateInviteCode } from "@/lib/tenant";

/**
 * GET /api/classrooms - List teacher's classrooms
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a teacher
  const membership = await db.query.tenantMembers.findFirst({
    where: eq(tenantMembers.userId, userId),
  });

  if (!membership || !["teacher", "admin"].includes(membership.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const teacherClassrooms = await db.query.classrooms.findMany({
    where: eq(classrooms.teacherId, userId),
    orderBy: (classrooms, { desc }) => [desc(classrooms.createdAt)],
  });

  return NextResponse.json({ classrooms: teacherClassrooms });
}

/**
 * POST /api/classrooms - Create a new classroom
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a teacher
  const membership = await db.query.tenantMembers.findFirst({
    where: eq(tenantMembers.userId, userId),
  });

  if (!membership || !["teacher", "admin"].includes(membership.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, courseId } = body;

  if (!name || !courseId) {
    return NextResponse.json(
      { error: "Name and course ID are required" },
      { status: 400 }
    );
  }

  const inviteCode = generateInviteCode();

  const [newClassroom] = await db
    .insert(classrooms)
    .values({
      tenantId: membership.tenantId,
      name,
      description,
      teacherId: userId,
      courseId,
      inviteCode,
    })
    .returning();

  return NextResponse.json({ classroom: newClassroom }, { status: 201 });
}
