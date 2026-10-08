import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { searchUsers } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SearchUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const query = (sp.q || "").trim();
  
  let results: any[] = [];
  
  if (query) {
    const user = await requireUser();
    results = searchUsers(query, user.id);
  }

  return (
    <div className="mx-auto max-w-3xl px-[18px] py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] font-headline">Find People</h1>
        <p className="text-[13px] text-[#6B7280]">Search by name or email to discover other users</p>
      </div>

      {/* Search Form */}
      <form method="GET">
        <div className="flex gap-2.5">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name or email address..."
            className="flex-1 min-h-[48px] rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-[15px] text-[#111827] placeholder:text-[#9CA3AF] transition duration-200 hover:border-[#D1D5DB] focus:border-[#3B82F6] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#3B82F6]/12"
          />
          <button
            type="submit"
            className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-[#3B82F6] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB] active:scale-95 transition shadow-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      {!query ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-sm text-[#6B7280]">Type a name or email to find creators and students</p>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-sm text-[#6B7280]">No users found matching &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((u: any) => (
            <li key={u.id}>
              <Link
                href={`/profile/${u.id}`}
                className="group block rounded-2xl border border-[#E5E7EB] bg-white p-[18px] transition duration-200 hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6] text-lg font-bold text-white shadow-xs">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#111827] text-[16px] font-headline group-hover:text-[#3B82F6] transition truncate">{u.name}</p>
                    <p className="text-xs text-[#6B7280]">{u.email}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-[#9CA3AF]">
                      <span className="font-medium text-[#4B5563]">{u.listing_count} project{u.listing_count !== 1 ? "s" : ""}</span>
                      <span>•</span>
                      <span className="font-medium text-[#4B5563]">{u.followers} follower{u.followers !== 1 ? "s" : ""}</span>
                      {u.avg_rating && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[#FBBF24] font-medium">★ {u.avg_rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 hidden sm:block">
                    <span className="rounded-full bg-[#F3F4F6] px-3.5 py-1 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                      {u.role}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

