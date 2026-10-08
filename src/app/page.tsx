import { searchListings, listCategories } from "@/lib/queries";
import ListingCardGrid from "@/components/ListingCardGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const trending = searchListings({ sort: "rating", pageSize: 9 });
  const categories = listCategories();

  return (
    <div className="space-y-[36px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '36px 36px' }}></div>
        </div>
        <div className="mx-auto max-w-6xl px-[18px] py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
              <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse"></span>
              Gesture-Native Project Marketplace
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl font-headline">
              Discover & Share Capstone Projects
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-blue-100 sm:text-[17px]">
              Browse peer-reviewed capstone projects, connect with student developers, and explore verified academic codebases.
            </p>
            
            {/* Search bar */}
            <form action="/" method="GET" className="mx-auto mt-8 flex max-w-lg gap-2">
              <input
                name="q"
                defaultValue={sp.q}
                placeholder="Search projects, tags, or categories..."
                className="flex-1 min-h-[48px] rounded-xl border-0 bg-white px-5 py-3 text-[15px] text-[#111827] shadow-[0_4px_12px_rgba(0,0,0,0.08)] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-3 focus:ring-white/40 transition duration-200"
              />
              <button
                type="submit"
                className="min-h-[48px] inline-flex items-center justify-center rounded-xl bg-[#111827] px-6 py-3 text-sm font-semibold text-white hover:bg-black shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-95 transition duration-200"
              >
                Search
              </button>
            </form>

            {/* Quick stats */}
            <div className="mt-8 flex items-center justify-center gap-8 text-white/90">
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-headline">{trending.total}</p>
                <p className="text-xs text-blue-100">Projects</p>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-headline">{categories.length}</p>
                <p className="text-xs text-blue-100">Categories</p>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white font-headline">Free</p>
                <p className="text-xs text-blue-100">to explore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills (TouchFlow Filter Chips: #EFF6FF fill, #3B82F6 text, pill-shaped) */}
      <section className="bg-white border-y border-[#E5E7EB] py-3">
        <div className="mx-auto max-w-6xl px-[18px]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Link
              href="/"
              className="shrink-0 inline-flex items-center justify-center min-h-[36px] rounded-full bg-[#3B82F6] px-4 py-1.5 text-xs font-semibold text-white transition active:scale-95"
            >
              All Categories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/?category=${encodeURIComponent(cat.slug)}`}
                className="shrink-0 inline-flex items-center justify-center min-h-[36px] rounded-full bg-[#EFF6FF] border border-[#BFDBFE]/60 px-4 py-1.5 text-xs font-semibold text-[#3B82F6] hover:bg-[#DBEAFE] transition active:scale-95"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Trending Section */}
      <section className="mx-auto max-w-6xl px-[18px]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#111827] font-headline flex items-center gap-2">
              <span className="text-[#F97171]">🔥</span> Trending Projects
            </h2>
            <p className="text-xs text-[#6B7280]">Top-rated projects curated by the community</p>
          </div>
          <Link href="/discover" className="inline-flex items-center min-h-[44px] px-2 text-sm font-semibold text-[#3B82F6] hover:text-[#2563EB]">
            View all →
          </Link>
        </div>

        {trending.listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5DB] bg-white p-[36px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6] text-xl">🔍</div>
            <h3 className="text-base font-bold text-[#111827] font-headline">No projects yet</h3>
            <p className="mt-1 text-sm text-[#6B7280]">Be the first to share a capstone project!</p>
            <Link
              href="/register"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2563EB] active:scale-95 transition"
            >
              Get Started →
            </Link>
          </div>
        ) : (
          <ListingCardGrid listings={trending.listings} />
        )}
      </section>

      {/* Features Strip */}
      <section className="bg-white border-y border-[#E5E7EB] py-12">
        <div className="mx-auto max-w-6xl px-[18px]">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: "🔍", title: "Discover Fast", desc: "Thumb-friendly navigation with fluid filtering across verified categories." },
              { icon: "💬", title: "Direct Contact", desc: "Instant inquiry dialogs to message creators and negotiate capstones directly." },
              { icon: "⭐", title: "Showcase & Sell", desc: "List your project, receive ratings, and build your engineering reputation." },
            ].map((item, i) => (
              <div key={i} className="text-center p-4">
                <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#3B82F6] text-2xl shadow-xs">{item.icon}</div>
                <h3 className="font-bold text-[#111827] text-[17px] font-headline">{item.title}</h3>
                <p className="mt-2 text-sm text-[#4B5563] max-w-xs mx-auto leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-[18px]">
        <div className="rounded-2xl bg-[#111827] p-8 sm:p-12 text-center text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <h2 className="text-2xl font-bold sm:text-3xl font-headline">Ready to showcase your work?</h2>
          <p className="mt-3 mx-auto max-w-lg text-[15px] text-[#9CA3AF]">
            Join the community of student developers sharing their best capstone projects. Free to list, free to explore.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2563EB] shadow-md active:scale-95 transition"
            >
              Start Selling Free
            </Link>
            <Link
              href="/discover"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition active:scale-95"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

