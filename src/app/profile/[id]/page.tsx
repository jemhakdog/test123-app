import { requireUser } from "@/lib/auth";
import { getUserProfile, getListingsBySeller, isFollowing } from "@/lib/queries";
import FollowButton from "@/components/FollowButton";
import ListingCardGrid from "@/components/ListingCardGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);
  const profile = getUserProfile(userId);
  
  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-[18px] py-12 text-center">
        <h1 className="text-2xl font-bold text-[#111827] font-headline">User not found</h1>
        <Link href="/" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-[#3B82F6] hover:text-[#2563EB]">← Back home</Link>
      </div>
    );
  }

  const user = await requireUser();
  const listings = getListingsBySeller(userId);
  const showingOwn = user && user.id === userId;
  const followingStatus = user ? isFollowing(user.id, userId) : false;

  const timeAgo = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="mx-auto max-w-4xl px-[18px] py-6 sm:py-8 space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#3B82F6] text-3xl font-bold text-white shadow-md sm:h-24 sm:w-24">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-[#111827] font-headline">{profile.name}</h1>
                <p className="text-[13px] text-[#6B7280]">Joined {timeAgo(profile.created_at)}</p>
              </div>
              {!showingOwn && (
                <FollowButton userId={userId} initialFollowing={followingStatus} />
              )}
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-4 divide-x divide-[#E5E7EB] rounded-2xl border border-[#E5E7EB] overflow-hidden bg-[#F9FAFB]">
              <div className="p-3.5 text-center">
                <p className="text-lg font-bold text-[#111827] font-headline">{profile.listing_count}</p>
                <p className="text-[11px] uppercase font-semibold tracking-wider text-[#6B7280]">Projects</p>
              </div>
              <div className="p-3.5 text-center">
                <p className="text-lg font-bold text-[#111827] font-headline">{profile.followers}</p>
                <p className="text-[11px] uppercase font-semibold tracking-wider text-[#6B7280]">Followers</p>
              </div>
              <div className="p-3.5 text-center">
                <p className="text-lg font-bold text-[#111827] font-headline">{profile.following}</p>
                <p className="text-[11px] uppercase font-semibold tracking-wider text-[#6B7280]">Following</p>
              </div>
              <div className="p-3.5 text-center">
                <p className="text-lg font-bold text-[#111827] font-headline">
                  {profile.avg_rating ? profile.avg_rating.toFixed(1) : '—'}
                </p>
                <p className="text-[11px] uppercase font-semibold tracking-wider text-[#6B7280]">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-[#111827] font-headline">
          Projects ({listings.length})
        </h2>
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <p className="text-sm text-[#6B7280]">No projects listed yet.</p>
          </div>
        ) : (
          <ListingCardGrid listings={listings} />
        )}
      </div>
    </div>
  );
}

