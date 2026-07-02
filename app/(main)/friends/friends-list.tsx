"use client";

import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Friend {
  id: number;
  userId: string;
  userName: string;
  userImageSrc: string;
  streak: number;
  points: number;
}

export function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/friends");
      const data = await res.json();
      setFriends(data.friends || []);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    if (!searchId.trim()) return;

    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresseeId: searchId }),
      });

      if (res.ok) {
        alert("Friend request sent!");
        setSearchId("");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send request");
      }
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add Friend Section */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Add Friend
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter user ID to add friend"
            value={searchId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchId(e.target.value)}
            className="flex h-10 w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button onClick={sendFriendRequest}>Send Request</Button>
        </div>
      </div>

      {/* Friends List */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Your Friends ({friends.length})
        </h2>
        {friends.length === 0 ? (
          <p className="text-gray-500">No friends yet. Add some!</p>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={friend.userImageSrc || "/mascot.svg"}
                    alt={friend.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{friend.userName}</div>
                    <div className="text-sm text-gray-500">
                      🔥 {friend.streak} day streak • {friend.points} points
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
