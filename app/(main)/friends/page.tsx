import { redirect } from "next/navigation";

import { getUserProgress } from "@/db/queries";
import { FriendsList } from "./friends-list";

export default async function FriendsPage() {
  const userProgress = await getUserProgress();

  if (!userProgress) {
    redirect("/courses");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Friends</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <FriendsList />
      </div>
    </div>
  );
}
