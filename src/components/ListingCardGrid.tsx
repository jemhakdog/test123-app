import Link from "next/link";
import { formatPrice, StatusBadge } from "@/components/ui";

export default function ListingCardGrid({ listings }: { listings: any[] }) {
  const tags = (listing: any) => listing.tags?.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => (
        <Link
          key={l.id}
          href={`/listings/${l.id}`}
          className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-250 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.99]"
        >
          <div>
            {/* Card top bar */}
            <div className="flex items-center justify-between mb-3">
              <StatusBadge status={l.status} />
              <span className="text-[16px] font-bold text-[#3B82F6] font-headline">{formatPrice(l.price)}</span>
            </div>

            {/* Content */}
            <h3 className="font-bold text-[#111827] text-[17px] font-headline line-clamp-2 group-hover:text-[#3B82F6] transition-colors duration-200">
              {l.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#4B5563]">
              {l.description}
            </p>
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {tags(l)?.map((tag: string) => (
                <span key={tag} className="rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[11px] font-medium text-[#4B5563]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-[11px] font-bold text-white shadow-xs">
                {l.seller.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-[13px] font-medium text-[#4B5563] truncate max-w-[100px]">{l.seller.name}</span>
            </div>
            {(l.review_avg || l.review_count > 0) && (
              <div className="flex items-center gap-1 text-[13px] text-[#FBBF24]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="font-semibold text-[#111827]">{l.review_avg?.toFixed(1) ?? 'N/A'}</span>
                <span className="text-[#9CA3AF]">({l.review_count})</span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

