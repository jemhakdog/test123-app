import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-[18px] py-8 sm:py-12 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl font-headline">
          About <span className="text-[#3B82F6]">CapstoneHub</span>
        </h1>
        <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-[#6B7280]">
          A gesture-native marketplace where students and developers buy, sell, and discover capstone projects with comfortable one-handed navigation and fluid touch interactions.
        </p>
      </div>

      {/* What is this */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 className="mb-3 flex items-center gap-2.5 text-lg font-bold text-[#111827] font-headline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#3B82F6] text-sm">📋</span>
          What is CapstoneHub?
        </h2>
        <p className="text-[14px] leading-relaxed text-[#4B5563]">
          CapstoneHub is a platform for showcasing completed academic projects — your capstone thesis, graduation project, or research prototype. 
          Sellers list their work with a description, category, and optional price. Buyers browse, inquire, and connect directly with sellers.
        </p>
      </section>

      {/* How it works */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-[#111827] font-headline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#3B82F6] text-sm">⚡</span>
          How It Works
        </h2>
        <div className="space-y-4">
          {[
            { icon: "📝", title: "List Your Project", desc: "Create a listing with a title, description, category, tags, and optional pricing." },
            { icon: "✅", title: "Admin Approval", desc: "Our team reviews submissions to maintain quality. Once approved, your listing goes live." },
            { icon: "🔍", title: "Discover & Browse", desc: "Explore trending projects across categories using our visual discovery feed." },
            { icon: "💬", title: "Connect Directly", desc: "Send inquiries to sellers and negotiate terms outside the platform." },
            { icon: "⭐", title: "Rate & Review", desc: "After engagement, leave honest reviews to help build community trust." },
          ].map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] text-xl">{step.icon}</div>
              <div>
                <h3 className="font-bold text-[#111827] text-[15px] font-headline">{step.title}</h3>
                <p className="text-[13px] text-[#6B7280] mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-[#111827] font-headline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#3B82F6] text-sm">👥</span>
          User Types
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 text-center">
            <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#3B82F6] text-white font-bold">B</div>
            <h3 className="font-bold text-[15px] text-[#111827] font-headline">Buyers</h3>
            <p className="mt-1 text-xs text-[#6B7280]">Browse, inquire, review, and save favorite projects.</p>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 text-center">
            <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#34D399] text-white font-bold">S</div>
            <h3 className="font-bold text-[15px] text-[#111827] font-headline">Sellers</h3>
            <p className="mt-1 text-xs text-[#6B7280]">List projects, manage inquiries, and build your reputation.</p>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 text-center">
            <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#8B5CF6] text-white font-bold">A</div>
            <h3 className="font-bold text-[15px] text-[#111827] font-headline">Admins</h3>
            <p className="mt-1 text-xs text-[#6B7280]">Moderate listings, manage users, and maintain platform quality.</p>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-[#111827] font-headline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FBBF24]/20 text-[#D97706] text-sm">📜</span>
          Community Guidelines
        </h2>
        <ul className="space-y-2.5 text-[14px] text-[#4B5563]">
          <li className="flex gap-2.5 items-center"><span className="text-[#34D399] font-bold">✓</span> Projects must be original work by the seller</li>
          <li className="flex gap-2.5 items-center"><span className="text-[#34D399] font-bold">✓</span> Accurate descriptions and specifications are required</li>
          <li className="flex gap-2.5 items-center"><span className="text-[#34D399] font-bold">✓</span> Be respectful and constructive in all reviews</li>
          <li className="flex gap-2.5 items-center"><span className="text-[#EF4444] font-bold">✗</span> No copyrighted material or unlicensed code</li>
          <li className="flex gap-2.5 items-center"><span className="text-[#EF4444] font-bold">✗</span> No fraudulent, misleading, or deceptive listings</li>
          <li className="flex gap-2.5 items-center"><span className="text-[#EF4444] font-bold">✗</span> Harassment or spam results in immediate suspension</li>
        </ul>
      </section>

      {/* CTA */}
      <div className="rounded-2xl bg-[#111827] p-8 text-center text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <h2 className="text-2xl font-bold font-headline">Ready to share your work?</h2>
        <p className="mt-2 text-[14px] text-[#9CA3AF]">Join thousands of students and developers discovering capstone projects.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#3B82F6] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB] active:scale-95 transition">
            Get Started Free
          </Link>
          <Link href="/discover" className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/20 active:scale-95 transition">
            Browse Projects
          </Link>
        </div>
      </div>
    </div>
  );
}

