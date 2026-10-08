import { requireAdmin } from "@/lib/auth";
import { adminListListings, adminListUsers, adminFlaggedReviews } from "@/lib/queries";
import { formatPrice, StatusBadge } from "@/components/ui";
import { moderateListingAction, toggleSuspendAction, adminDeleteReviewAction } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const pending = adminListListings("pending");
  const users = adminListUsers();
  const flagged = adminFlaggedReviews();

  return (
    <div className="mx-auto max-w-6xl px-[18px] py-8 space-y-8">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#111827] font-headline">Admin Control Center</h1>
            <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#3B82F6] border border-[#BFDBFE]/60">
              Root Authority
            </span>
          </div>
          <p className="mt-1 text-[13px] text-[#6B7280]">
            Moderate submitted project listings, manage user account permissions, and resolve flagged content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-sm font-semibold text-[#4B5563] hover:bg-[#F3F4F6] transition"
          >
            ← My Dashboard
          </Link>
        </div>
      </div>

      {/* Moderation queue */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#111827] font-headline">Pending Review Queue</h2>
            <p className="text-[13px] text-[#6B7280]">Project listings waiting for approval</p>
          </div>
          <span className="rounded-full bg-[#FBBF24]/12 border border-[#FBBF24]/30 px-3.5 py-1 text-xs font-bold text-[#D97706]">
            {pending.length} pending
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#34D399]/15 text-[#059669] font-bold">
              ✓
            </div>
            <p className="font-bold text-[#111827] font-headline">All caught up!</p>
            <p className="text-xs text-[#6B7280] mt-1">No pending project listings require moderation right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((l) => (
              <div key={l.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition hover:border-[#BFDBFE]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Link href={`/listings/${l.id}`} className="text-[16px] font-bold text-[#111827] font-headline hover:text-[#3B82F6] transition">
                        {l.title}
                      </Link>
                      <span className="rounded-lg bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-medium text-[#4B5563]">
                        {l.category.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      Submitted by <strong className="text-[#111827]">{l.seller.name}</strong> · {formatPrice(l.price)} ·{" "}
                      {new Date(l.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-2.5 line-clamp-2 text-[13px] text-[#4B5563]">{l.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={moderateListingAction} className="flex gap-2">
                      <input type="hidden" name="listing_id" value={l.id} />
                      <button
                        name="action"
                        value="approve"
                        className="inline-flex min-h-[44px] items-center rounded-xl bg-[#3B82F6] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#2563EB] active:scale-95 transition"
                      >
                        Approve
                      </button>
                      <button
                        name="action"
                        value="reject"
                        className="inline-flex min-h-[44px] items-center rounded-xl border border-[#EF4444]/30 bg-[#FEF2F2] px-5 py-2 text-xs font-semibold text-[#EF4444] hover:bg-[#FEE2E2] active:scale-95 transition"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#111827] font-headline">User Management</h2>
          <p className="text-[13px] text-[#6B7280]">Directory of all registered marketplace accounts</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                <tr>
                  <th className="px-[18px] py-3.5">Name</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-[18px] py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F9FAFB] transition min-h-[52px]">
                    <td className="px-[18px] py-4 font-semibold text-[#111827]">{u.name}</td>
                    <td className="px-4 py-4 text-[#6B7280]">{u.email}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${u.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-[#F3F4F6] text-[#4B5563]"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {u.is_suspended ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EF4444]/12 border border-[#EF4444]/30 px-3 py-0.5 text-xs font-semibold text-[#DC2626]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]"></span>
                          suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#34D399]/12 border border-[#34D399]/30 px-3 py-0.5 text-xs font-semibold text-[#059669]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]"></span>
                          active
                        </span>
                      )}
                    </td>
                    <td className="px-[18px] py-4 text-right">
                      <form action={toggleSuspendAction}>
                        <input type="hidden" name="user_id" value={u.id} />
                        <button
                          disabled={u.id === admin.id}
                          className="min-h-[36px] rounded-xl border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B5563] hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-40 transition"
                        >
                          {u.is_suspended ? "Restore User" : "Suspend"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Flagged reviews */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#111827] font-headline">Flagged Reviews</h2>
          <p className="text-[13px] text-[#6B7280]">Community reports requiring moderation</p>
        </div>

        {flagged.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <p className="text-sm text-[#6B7280]">No flagged reviews reported by community members.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {flagged.map((r) => (
              <div key={r.id} className="rounded-2xl border border-[#EF4444]/20 bg-white p-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#EF4444]/12 border border-[#EF4444]/30 px-3 py-1 text-xs font-bold text-[#DC2626]">
                      {r.flag_count} flag{r.flag_count > 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-semibold text-[#111827]">
                      Listing #{r.listing_id} · Rating: {r.rating}/5
                    </span>
                  </div>
                  <form action={adminDeleteReviewAction}>
                    <input type="hidden" name="review_id" value={r.id} />
                    <button className="min-h-[36px] rounded-xl border border-[#EF4444]/30 bg-[#FEF2F2] px-4 py-1.5 text-xs font-semibold text-[#EF4444] hover:bg-[#FEE2E2] transition">
                      Delete Review
                    </button>
                  </form>
                </div>
                <p className="mt-3 text-[14px] text-[#4B5563] bg-[#F9FAFB] rounded-xl p-3.5 border border-[#E5E7EB]">&ldquo;{r.comment}&rdquo;</p>
                <div className="mt-3 space-y-1">
                  {r.flags.map((f, i) => (
                    <p key={i} className="text-xs text-[#6B7280]">
                      <span className="font-semibold text-[#111827]">{f.flagger_name}:</span> {f.reason}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

