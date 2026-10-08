import { searchListings, listCategories } from "@/lib/queries";
import ListingCardGrid from "@/components/ListingCardGrid";
import SearchControls from "@/components/SearchControls";

export const dynamic = "force-dynamic";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const { listings, total } = searchListings({
    query: sp.q,
    category: sp.category,
    tag: sp.tag,
    sort: sp.sort || "rating",
  });
  const categories = listCategories();

  return (
    <div className="mx-auto max-w-6xl px-[18px] py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] font-headline">Discover Projects</h1>
        <p className="text-[13px] text-[#6B7280]">Explore trending capstone projects across all categories</p>
      </div>

      <SearchControls categories={categories} current={sp} total={total} />

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6] text-xl">🔍</div>
          <h3 className="text-base font-bold text-[#111827] font-headline">No projects found</h3>
          <p className="mt-1 text-sm text-[#6B7280]">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <ListingCardGrid listings={listings} />
      )}
    </div>
  );
}

