import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById, getReviewsForListing, isBookmarked } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { formatPrice, StatusBadge, Stars } from "@/components/ui";
import InquiryModal from "@/components/InquiryModal";
import ReviewForm from "@/components/ReviewForm";
import FlagButton from "@/components/FlagButton";
import BookmarkButton from "@/components/BookmarkButton";
import ScreenshotGallery from "@/components/ScreenshotGallery";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listingId = Number(id);
  const listing = getListingById(listingId);
  const user = await getSession();

  if (!listing) notFound();

  // Visibility: public only if approved; owner/admin can see their own pending/rejected.
  const canView = listing.status === "approved" || (user && (user.id === listing.seller.id || user.role === "admin"));
  if (!canView) notFound();

  const reviews = getReviewsForListing(listingId);
  const isOwner = user?.id === listing.seller.id;
  const isBookmarkedState = user ? isBookmarked(user.id, listingId) : false;
  const showInquiry = !!user && !isOwner && listing.status === "approved";
  const showReviewForm = !!user && !isOwner && listing.status === "approved";

  return (
    <div className="mx-auto max-w-5xl px-[18px] py-8">
      <Link href="/" className="inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold text-[#6B7280] hover:text-[#3B82F6] transition mb-4">
        <span>←</span>
        <span>Back to Browse Listings</span>
      </Link>

      <div className="mt-2 grid gap-[24px] lg:grid-cols-[2fr_1fr]">
        {/* Main column */}
        <div className="space-y-[24px]">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-6">
            <div>
              <div className="mb-3.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#3B82F6] border border-[#BFDBFE]/50 min-h-[32px]">
                  {listing.category.label}
                </span>
                <StatusBadge status={listing.status} />
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl font-headline">{listing.title}</h1>
                {user && <BookmarkButton listingId={listingId} initialBookmarked={isBookmarkedState} />}
              </div>
              
              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                <span>Posted on {new Date(listing.created_at).toLocaleDateString()}</span>
                {listing.review_count > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Stars rating={listing.review_avg ?? 0} />
                      <span className="font-semibold text-[#111827]">
                        {listing.review_avg?.toFixed(1)} ({listing.review_count} review{listing.review_count > 1 ? "s" : ""})
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Dedicated Screenshots Gallery */}
            <div className="border-t border-[#F3F4F6] pt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">System Screenshots</h3>
                {listing.images.length > 0 && (
                  <span className="text-xs text-[#6B7280]">{listing.images.length} {listing.images.length === 1 ? "image" : "images"}</span>
                )}
              </div>
              <ScreenshotGallery images={listing.images} title={listing.title} />
            </div>

            <div className="border-t border-[#F3F4F6] pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2.5">Project Overview</h3>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#374151]">{listing.description}</p>
            </div>


            {listing.tags.length > 0 && (
              <div className="mt-6 border-t border-[#F3F4F6] pt-4 flex flex-wrap gap-2">
                {listing.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/?tag=${encodeURIComponent(t)}`}
                    className="inline-flex items-center rounded-lg bg-[#F3F4F6] px-3 py-1.5 text-xs font-medium text-[#4B5563] hover:bg-[#EFF6FF] hover:text-[#3B82F6] transition min-h-[32px]"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h2 className="mb-4 text-lg font-bold text-[#111827] font-headline">Community Reviews ({reviews.length})</h2>
            {showReviewForm && <div className="mb-6"><ReviewForm listingId={listingId} /></div>}
            
            {reviews.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#9CA3AF]">
                No reviews posted for this project yet.
              </div>
            ) : (
              <ul className="divide-y divide-[#F3F4F6]">
                {reviews.map((r) => (
                  <li key={r.id} className="py-4 first:pt-0 last:pb-0 min-h-[52px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stars rating={r.rating} />
                        <span className="text-sm font-semibold text-[#111827]">{r.author_name}</span>
                      </div>
                      <span className="text-xs text-[#9CA3AF]">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-[14px] text-[#4B5563] leading-relaxed">{r.comment}</p>
                    {user && user.id !== r.author_id && (
                      <div className="mt-2">
                        <FlagButton reviewId={r.id} listingId={listingId} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-[18px]">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Listing Price</span>
            <div className="mt-1 text-3xl font-extrabold text-[#111827] font-headline">{formatPrice(listing.price)}</div>
            
            {listing.status === "approved" && (
              <div className="mt-5">
                {showInquiry ? (
                  <InquiryModal listingId={listingId} />
                ) : isOwner ? (
                  <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-3.5 text-center text-xs font-medium text-[#4B5563]">
                    This is your active listing
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex min-h-[48px] items-center justify-center w-full rounded-xl bg-[#3B82F6] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#2563EB] active:scale-98 transition"
                  >
                    Log In to Inquire
                  </Link>
                )}
              </div>
            )}
            {listing.status === "pending" && (
              <p className="mt-3.5 rounded-xl bg-[#FBBF24]/12 border border-[#FBBF24]/30 p-3 text-xs font-medium text-[#D97706]">
                ⏳ Pending admin approval — not publicly visible yet.
              </p>
            )}
            {listing.status === "rejected" && (
              <p className="mt-3.5 rounded-xl bg-[#EF4444]/12 border border-[#EF4444]/30 p-3 text-xs font-medium text-[#DC2626]">
                ✕ This listing was rejected by a moderator.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Seller Details</h3>
            <Link href={`/profile/${listing.seller.id}`} className="group block min-h-[44px]">
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-white font-bold text-sm shadow-xs">
                  {listing.seller.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#111827] group-hover:text-[#3B82F6] transition">{listing.seller.name}</p>
                  <p className="text-xs text-[#6B7280]">View Profile • Joined {new Date(listing.seller.joined_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
            {isOwner && (
              <Link
                href={`/listings/${listingId}/edit`}
                className="mt-4 flex min-h-[44px] items-center justify-center w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-center text-xs font-semibold text-[#4B5563] hover:bg-[#F3F4F6] transition"
              >
                Edit Listing Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

