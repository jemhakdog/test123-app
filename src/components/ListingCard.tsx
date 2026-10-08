import Link from "next/link";
import type { ListingCard as ListingCardT } from "@/lib/types";
import { formatPrice, Stars } from "./ui";

const CATEGORY_ICONS: Record<string, string> = {
  "web-app": "💻",
  "mobile-app": "📱",
  "ml-ai": "🤖",
  "game": "🎮",
  "iot-embedded": "⚡",
  "data-analysis": "📊",
  "other": "📦",
};

export default function ListingCard({ listing }: { listing: ListingCardT }) {
  const primaryImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-250 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.99]"
    >
      <div>
        {/* Screenshot Image Preview Header */}
        <div className="relative mb-3.5 aspect-video w-full overflow-hidden rounded-xl bg-[#F3F4F6]">
          {primaryImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={primaryImage.image_url}
                alt={primaryImage.caption || listing.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {listing.images.length > 1 && (
                <span className="absolute bottom-2 right-2 rounded-full bg-black/65 backdrop-blur-md px-2 py-0.5 text-[11px] font-semibold text-white">
                  📷 {listing.images.length}
                </span>
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EFF6FF] via-[#F9FAFB] to-[#EEF2F6] text-center p-3">
              <span className="text-3xl mb-1">{CATEGORY_ICONS[listing.category.slug] || "💻"}</span>
              <span className="text-[11px] font-semibold text-[#9CA3AF]">System Preview</span>
            </div>
          )}

          {/* Category overlay pill */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-[#3B82F6] border border-white/60 shadow-xs">
              {listing.category.label}
            </span>
          </div>
        </div>

        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-[17px] font-bold text-[#111827] font-headline group-hover:text-[#3B82F6] transition-colors duration-200 line-clamp-1">
            {listing.title}
          </h3>
          <span className="shrink-0 text-[16px] font-bold text-[#111827] font-headline">
            {formatPrice(listing.price)}
          </span>
        </div>

        <p className="mb-3.5 line-clamp-2 text-[13px] leading-relaxed text-[#4B5563]">
          {listing.description}
        </p>

        {listing.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {listing.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[12px] font-medium text-[#4B5563]">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-3 text-[13px] text-[#6B7280]">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#3B82F6]"></span>
          <span className="font-medium text-[#4B5563]">{listing.seller.name}</span>
        </span>
        {listing.review_count > 0 ? (
          <span className="flex items-center gap-1">
            <Stars rating={listing.review_avg ?? 0} size="text-xs" />
            <span className="font-semibold text-[#111827]">({listing.review_count})</span>
          </span>
        ) : (
          <span className="text-[#9CA3AF]">New listing</span>
        )}
      </div>
    </Link>
  );
}


