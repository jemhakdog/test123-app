import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getBookmarks } from "@/lib/queries";
import ListingCardGrid from "@/components/ListingCardGrid";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const user = await requireUser();
  const bookmarks = getBookmarks(user.id);

  return (
    <div className="mx-auto max-w-6xl px-[18px] py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] font-headline">Saved Projects</h1>
          <p className="text-[13px] text-[#6B7280]">{bookmarks.length} projects you&apos;ve bookmarked</p>
        </div>
        <Link
          href="/discover"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#4B5563] hover:bg-[#F3F4F6] transition"
        >
          Discover more →
        </Link>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F97171]/10 text-[#F97171]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </div>
          <h3 className="font-bold text-[17px] text-[#111827] font-headline">No saved projects yet</h3>
          <p className="mt-1 text-sm text-[#6B7280]">Bookmark projects you want to come back to later.</p>
          <Link
            href="/discover"
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB] active:scale-95 transition shadow-sm"
          >
            Explore projects →
          </Link>
        </div>
      ) : (
        <ListingCardGrid listings={bookmarks} />
      )}
    </div>
  );
}

