import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import { getUnreadNotificationCount } from "@/lib/queries";
import NotificationBell from "@/components/NotificationBell";
import DarkModeToggle from "@/components/DarkModeToggle";

export default async function Nav() {
  const user = await getSession();
  const unread = user ? getUnreadNotificationCount(user.id) : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md transition-all shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <nav className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-[18px]">
        <Link href="/" className="flex items-center gap-2.5 group min-h-[44px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3B82F6] text-white font-bold shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
            C
          </div>
          <span className="hidden text-lg font-bold tracking-tight text-[#111827] sm:inline font-headline">
            Capstone<span className="text-[#3B82F6]">Hub</span>
          </span>
          <span className="text-lg font-bold tracking-tight text-[#111827] sm:hidden font-headline">
            CH
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1.5 md:flex">
          <Link href="/discover" className="min-h-[44px] inline-flex items-center rounded-xl px-3.5 py-2 text-[14px] font-medium text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] transition">
            Discover
          </Link>
          <Link href="/saved" className="min-h-[44px] inline-flex items-center rounded-xl px-3.5 py-2 text-[14px] font-medium text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] transition">
            Saved
          </Link>
          <Link href="/search/users" className="min-h-[44px] inline-flex items-center rounded-xl px-3.5 py-2 text-[14px] font-medium text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] transition">
            People
          </Link>
          <DarkModeToggle />
          <Link href="/about" className="min-h-[44px] inline-flex items-center rounded-xl px-3.5 py-2 text-[14px] font-medium text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] transition">
            About
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {user ? (
            <>
              {/* Mobile notification bell */}
              <div className="md:hidden">
                <NotificationBell unreadCount={unread} />
              </div>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="min-h-[40px] inline-flex items-center rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="min-h-[44px] inline-flex items-center rounded-xl px-3 py-2 text-[14px] font-medium text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] transition"
              >
                Feed
              </Link>
              <Link
                href="/listings/new"
                className="hidden min-h-[44px] rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2563EB] active:scale-95 transition sm:inline-flex items-center"
              >
                + Post
              </Link>
              <NotificationBell hidden={false} unreadCount={unread} />
              <Link
                href={`/profile/${user.id}`}
                className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6] transition"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-xs font-bold text-white shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </Link>
              <form action={logoutAction}>
                <button className="min-h-[44px] rounded-xl px-2.5 py-2 text-xs font-medium text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#4B5563] transition">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="min-h-[44px] inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] transition"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="min-h-[44px] inline-flex items-center rounded-xl bg-[#3B82F6] px-4.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2563EB] active:scale-95 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

