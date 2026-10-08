"use client";
import { useEffect, useState } from "react";
import { markNotificationsReadAction } from "@/lib/actions";
import Link from "next/link";
import type { Notification } from "@/lib/types";

export default function NotificationBell({ unreadCount, hidden }: { unreadCount: number; hidden?: boolean }) {
  const [open, setOpen] = useState(hidden);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(data))
      .catch(() => {});
  }, [open]);

  async function handleOpen() {
    setOpen(true);
    const formData = new FormData();
    await fetch("/api/notifications/read", { method: "POST", body: formData });
  }

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const iconForType = (type: string) => {
    switch (type) {
      case "inquiry_received": return "💬";
      case "inquiry_responded": return "📨";
      case "review": return "⭐";
      case "follow": return "👤";
      case "like": return "❤️";
      default: return "🔔";
    }
  };

  const textForType = (n: Notification) => {
    switch (n.type) {
      case "inquiry_received": return `Someone inquired about ${n.listing_title || "your listing"}`;
      case "inquiry_responded": return `${n.actor_name} responded to your inquiry`;
      case "review": return `${n.actor_name} reviewed a listing`;
      case "follow": return `${n.actor_name} started following you`;
      case "like": return `${n.actor_name} liked your listing`;
      default: return "New activity";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl text-[#4B5563] hover:bg-[#F3F4F6] transition active:scale-95"
        title="Notifications"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#F97171] text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-13 z-50 w-80 sm:w-96 rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#F3F4F6] px-[18px] py-3.5">
              <h3 className="font-bold text-[15px] text-[#111827] font-headline">Notifications</h3>
              <span className="text-xs font-semibold text-[#3B82F6] bg-[#EFF6FF] px-2 py-0.5 rounded-full">{notifications.length}</span>
            </div>

            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[13px] text-[#9CA3AF]">No notifications yet</p>
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto divide-y divide-[#F3F4F6]">
                {notifications.map((n) => (
                  <li key={n.id} className={`px-[18px] py-3.5 min-h-[52px] transition ${
                    n.is_read ? "bg-white" : "bg-[#EFF6FF] border-l-[3px] border-[#3B82F6]"
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-base">{iconForType(n.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] ${n.is_read ? "text-[#4B5563]" : "text-[#111827] font-semibold"}`}>
                          {textForType(n)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{timeAgo(n.created_at)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link href="/notifications" className="block px-[18px] py-3 text-center text-xs font-semibold text-[#3B82F6] hover:bg-[#EFF6FF] transition border-t border-[#F3F4F6]">
              View all notifications →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

