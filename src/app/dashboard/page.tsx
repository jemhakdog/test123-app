import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getActivityFeed, getUnreadNotificationCount, getListingsBySeller } from "@/lib/queries";
import { formatPrice } from "@/components/ui";

export const dynamic = "force-dynamic";

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function ActivityPost({ item }: { item: any }) {
  const hasImages = item.images && item.images.length > 0;
  const primaryImage = hasImages ? item.images[0] : null;

  return (
    <Link
      href={`/listings/${item.listing_id}`}
      className="block rounded-2xl border border-[#E5E7EB] bg-white p-[18px] transition-all duration-200 hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.99]"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-bold text-white shadow-xs">
          {item.actor.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-[#4B5563]">
            <span className="font-semibold text-[#111827]">{item.actor.name}</span>
            {item.type === 'listing' && <> posted a new project</>}
            {item.type === 'review' && <> reviewed a project</>}
          </p>
          <p className="mt-1 text-[15px] font-bold text-[#111827] font-headline truncate">{item.title}</p>
          
          {/* Screenshot/Image Preview */}
          {primaryImage && (
            <div className="relative mt-2.5 aspect-video w-full overflow-hidden rounded-xl bg-[#F3F4F6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={primaryImage.image_url}
                alt={primaryImage.caption || item.title}
                className="h-full w-full object-cover"
              />
              {hasImages && item.images.length > 1 && (
                <span className="absolute bottom-2 right-2 rounded-full bg-black/65 backdrop-blur-md px-2 py-0.5 text-[11px] font-semibold text-white">
                  📷 {item.images.length}
                </span>
              )}
            </div>
          )}
          
          <p className="mt-1 text-[13px] text-[#6B7280] line-clamp-2 leading-relaxed">{item.description}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[11px] text-[#9CA3AF]">{timeAgo(item.created_at)}</span>
            {item.category && <span className="text-[11px] font-medium text-[#3B82F6] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">{item.category.label}</span>}
            {item.price !== null && item.price !== undefined && <span className="text-xs font-bold text-[#111827]">{formatPrice(item.price)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const feed = getActivityFeed(user.id);
  const myListings = getListingsBySeller(user.id);
  const unread = getUnreadNotificationCount(user.id);

  return (
    <div className="mx-auto max-w-2xl px-[18px] py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] font-headline">Your Feed</h1>
          <p className="text-[13px] text-[#6B7280]">Latest activity from people you follow</p>
        </div>
        <Link href="/discover" className="inline-flex min-h-[44px] items-center text-xs font-semibold text-[#3B82F6] hover:text-[#2563EB]">
          Discover →
        </Link>
      </div>

      {/* Compose box */}
      <Link href="/listings/new" className="block rounded-2xl border border-[#E5E7EB] bg-white p-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#BFDBFE] transition">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-bold text-white shadow-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-h-[44px] flex items-center rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[14px] text-[#9CA3AF] hover:bg-white hover:border-[#D1D5DB] transition">
            Share a project or create a listing...
          </div>
        </div>
      </Link>

      {/* Stats strip */}
      <div className="grid grid-cols-3 divide-x divide-[#E5E7EB] rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="p-4 text-center">
          <p className="text-xl font-bold text-[#111827] font-headline">{myListings.length}</p>
          <p className="text-xs text-[#6B7280]">Your posts</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-xl font-bold text-[#111827] font-headline">{feed.total}</p>
          <p className="text-xs text-[#6B7280]">Feed items</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-xl font-bold text-[#3B82F6] font-headline">{unread}</p>
          <p className="text-xs text-[#6B7280]">New alerts</p>
        </div>
      </div>

      {/* Feed */}
      {feed.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </div>
          <h3 className="font-bold text-[17px] text-[#111827] font-headline">Start following people!</h3>
          <p className="mt-1 text-sm text-[#6B7280]">Follow other users to see their projects and reviews in your feed.</p>
          <Link
            href="/discover"
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB] active:scale-95 transition shadow-sm"
          >
            Explore projects →
          </Link>
        </div>
      ) : (
        <div className="space-y-[18px]">
          {feed.items.map((item: any) => (
            <ActivityPost key={`${item.id}-${item.type}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

