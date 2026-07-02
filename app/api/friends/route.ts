import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq, and, or } from "drizzle-orm";

import db from "@/db/drizzle";
import { friendships } from "@/db/schema-social";
import { userProgress } from "@/db/schema";

/**
 * GET /api/friends - Get user's friends list
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get accepted friendships where user is either requester or addressee
  const friends = await db.query.friendships.findMany({
    where: and(
      or(
        eq(friendships.requesterId, userId),
        eq(friendships.addresseeId, userId)
      ),
      eq(friendships.status, "accepted")
    ),
    with: {
      requester: true,
      addressee: true,
    },
  });

  // Transform to show the other user, not yourself
  const friendList = friends.map((f) => {
    const other = f.requesterId === userId ? f.addressee : f.requester;
    return {
      id: f.id,
      userId: other.userId,
      userName: other.userName,
      userImageSrc: other.userImageSrc,
      streak: other.streak,
      points: other.points,
    };
  });

  return NextResponse.json({ friends: friendList });
}

/**
 * POST /api/friends - Send a friend request
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { addresseeId } = await request.json();
  if (!addresseeId) {
    return NextResponse.json(
      { error: "addresseeId is required" },
      { status: 400 }
    );
  }

  if (addresseeId === userId) {
    return NextResponse.json(
      { error: "Cannot add yourself as friend" },
      { status: 400 }
    );
  }

  // Check if friendship already exists
  const existing = await db.query.friendships.findFirst({
    where: or(
      and(
        eq(friendships.requesterId, userId),
        eq(friendships.addresseeId, addresseeId)
      ),
      and(
        eq(friendships.requesterId, addresseeId),
        eq(friendships.addresseeId, userId)
      )
    ),
  });

  if (existing) {
    return NextResponse.json(
      { error: "Friendship already exists", status: existing.status },
      { status: 400 }
    );
  }

  // Create friend request
  await db.insert(friendships).values({
    requesterId: userId,
    addresseeId,
    status: "pending",
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

/**
 * PATCH /api/friends - Accept or reject friend request
 */
export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requesterId, action } = await request.json();
  if (!requesterId || !action) {
    return NextResponse.json(
      { error: "requesterId and action are required" },
      { status: 400 }
    );
  }

  if (!["accepted", "rejected"].includes(action)) {
    return NextResponse.json(
      { error: "action must be 'accepted' or 'rejected'" },
      { status: 400 }
    );
  }

  // Verify this request was sent TO the current user
  const friendship = await db.query.friendships.findFirst({
    where: and(
      eq(friendships.requesterId, requesterId),
      eq(friendships.addresseeId, userId),
      eq(friendships.status, "pending")
    ),
  });

  if (!friendship) {
    return NextResponse.json(
      { error: "Friend request not found" },
      { status: 404 }
    );
  }

  await db
    .update(friendships)
    .set({ status: action })
    .where(eq(friendships.id, friendship.id));

  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/friends - Remove a friend
 */
export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { friendId } = await request.json();
  if (!friendId) {
    return NextResponse.json(
      { error: "friendId is required" },
      { status: 400 }
    );
  }

  // Delete any friendship between these users
  await db.delete(friendships).where(
    or(
      and(
        eq(friendships.requesterId, userId),
        eq(friendships.addresseeId, friendId)
      ),
      and(
        eq(friendships.requesterId, friendId),
        eq(friendships.addresseeId, userId)
      )
    )
  );

  return NextResponse.json({ success: true });
}
