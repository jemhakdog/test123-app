import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-[18px] py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl font-headline">
          Help &amp; <span className="text-[#3B82F6]">Support</span>
        </h1>
        <p className="mt-2 text-[14px] text-[#6B7280]">Get help with common issues and find your way around.</p>
      </div>

      {/* Quick Links */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[#111827] font-headline">Quick Help</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: "🚀", title: "Getting Started", href: "/about", desc: "Learn what CapstoneHub is and how to use it." },
            { icon: "📋", title: "Frequently Asked Questions", href: "/faq", desc: "Answers to the most common questions." },
            { icon: "✏️", title: "Creating a Listing", href: "/listings/new", desc: "Step-by-step guide to posting your project." },
            { icon: "⚠️", title: "Report an Issue", href: "#contact", desc: "Something isn't right? Flag it or contact us." },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="group block rounded-2xl border border-[#E5E7EB] bg-white p-[18px] transition duration-200 hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-[#111827] text-[15px] font-headline group-hover:text-[#3B82F6] transition">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-[#6B7280]">{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 className="mb-4 text-xl font-bold text-[#111827] font-headline">Getting Started Checklist</h2>
        <ol className="space-y-3.5 text-[14px] text-[#4B5563]">
          <li className="flex gap-3 items-center">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#3B82F6]">1</span>
            <span><strong>Create an account</strong> — sign up with your email and password.</span>
          </li>
          <li className="flex gap-3 items-center">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#3B82F6]">2</span>
            <span><strong>Complete your profile</strong> — update your name and bio so others know who you are.</span>
          </li>
          <li className="flex gap-3 items-center">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#3B82F6]">3</span>
            <span><strong>Browse the feed</strong> — explore trending projects on the Discover page.</span>
          </li>
          <li className="flex gap-3 items-center">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#3B82F6]">4</span>
            <span><strong>List your project</strong> — click &apos;+ Post&apos; and fill in your project details.</span>
          </li>
          <li className="flex gap-3 items-center">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#3B82F6]">5</span>
            <span><strong>Follow others</strong> — build your network by following sellers whose work you admire.</span>
          </li>
        </ol>
      </section>

      {/* Troubleshooting */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <h2 className="mb-4 text-xl font-bold text-[#111827] font-headline">Troubleshooting</h2>
        <div className="space-y-3">
          {[
            { title: "My listing isn't showing up", fix: "New listings go through admin approval first. Check your dashboard for the pending status badge." },
            { title: "Can't send an inquiry", fix: "You must be logged in, and the seller must not be suspended. Also, you can only inquire about approved listings." },
            { title: "Notifications not appearing", fix: "Check your notification bell in the navbar. Notifications show inquiries, reviews, follows, and likes." },
            { title: "Listing was rejected", fix: "Review the rejection reason, then edit your listing and resubmit. Edits trigger a new admin review." },
          ].map((item, i) => (
            <details key={i} className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] open:bg-white transition">
              <summary className="cursor-pointer px-4 py-3 text-[14px] font-bold text-[#111827] font-headline list-none">{item.title}</summary>
              <div className="border-t border-[#E5E7EB] px-4 py-3 text-[13px] text-[#4B5563]">{item.fix}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="rounded-2xl bg-[#111827] p-8 text-center text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <h2 className="text-2xl font-bold font-headline">Still need help?</h2>
        <p className="mt-2 text-[14px] text-[#9CA3AF]">Contact our support team and we&apos;ll get back to you within 24 hours.</p>
        <Link href="/register" className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#3B82F6] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB] active:scale-95 transition shadow-sm">
          Get in Touch
        </Link>
      </section>
    </div>
  );
}

