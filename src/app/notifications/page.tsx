import { requireUser } from "@/lib/auth";
import { getNotifications } from "@/lib/queries";

export const dynamic = "force-dynamic";

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (Math.floor(seconds / 60) < 60) return `${Math.floor(seconds / 60)}m ago`;
  if (Math.floor(seconds / 3600) < 24) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const ICONS: Record<string, string> = {
  inquiry_received: "💬",
  inquiry_responded: "📨",
  review: "⭐",
  follow: "👤",
  like: "❤️",
};

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = getNotifications(user.id);

  return (
    <div className="mx-auto max-w-2xl px-[18px] py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] font-headline">Notifications</h1>
        <p className="text-[13px] text-[#6B7280]">Stay updated on purchases, inquiries, and interactions</p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <p className="text-sm text-[#6B7280]">No notifications yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n: any) => (
            <li
              key={n.id}
              className={`flex items-start gap-3.5 rounded-2xl p-[18px] min-h-[52px] transition shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${
                n.is_read
                  ? "bg-white border border-[#E5E7EB]"
                  : "bg-[#EFF6FF] border border-[#BFDBFE] border-l-4 border-l-[#3B82F6]"
              }`}
            >
              <span className="mt-0.5 text-xl shrink-0">{ICONS[n.type] || "🔔"}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] ${n.is_read ? "text-[#4B5563]" : "font-semibold text-[#111827]"}`}>
                  {n.type === "follow" && <><strong>{n.actor_name}</strong> started following you</>}
                  {n.type === "inquiry_received" && <>Someone inquired about <strong>{n.listing_title}</strong></>}
                  {n.type === "inquiry_responded" && <><strong>{n.actor_name}</strong> responded to your inquiry</>}
                  {n.type === "review" && <><strong>{n.actor_name}</strong> reviewed a listing</>}
                  {n.type === "like" && <><strong>{n.actor_name}</strong> liked your listing</>}
                </p>
                <p className="mt-1 text-[11px] text-[#9CA3AF]">{timeAgo(n.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

