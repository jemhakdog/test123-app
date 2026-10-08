"use client";
import { useState } from "react";
import { toggleBookmarkAction } from "@/lib/actions";

export default function BookmarkButton({ listingId, initialBookmarked }: { listingId: number; initialBookmarked: boolean }) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  async function handleBookmark() {
    setBookmarked(!bookmarked);
    await toggleBookmarkAction(listingId);
  }

  return (
    <form action={handleBookmark}>
      <button
        type="submit"
        aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
          bookmarked
            ? "text-[#F97171] bg-[#F97171]/10 hover:bg-[#F97171]/20"
            : "text-[#9CA3AF] hover:text-[#F97171] hover:bg-[#F9FAFB] active:bg-[#F3F4F6]"
        }`}
      >
        <svg className="h-6 w-6" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </form>
  );
}

