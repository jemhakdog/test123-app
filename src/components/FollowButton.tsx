"use client";
import { useState } from "react";
import { toggleFollowAction } from "@/lib/actions";

export default function FollowButton({ userId, initialFollowing }: { userId: number; initialFollowing: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    setLoading(true);
    setFollowing(!following);
    await toggleFollowAction(userId);
    setLoading(false);
  }

  return (
    <form action={handleFollow}>
      <button
        type="submit"
        disabled={loading}
        className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-40 ${
          following
            ? "border border-[#E5E7EB] bg-[#F3F4F6] text-[#3B82F6] hover:bg-[#E5E7EB]"
            : "bg-[#3B82F6] text-white shadow-sm hover:bg-[#2563EB]"
        }`}
      >
        {loading ? "..." : following ? "Following" : "Follow"}
      </button>
    </form>
  );
}

