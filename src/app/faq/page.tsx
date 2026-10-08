export const dynamic = "force-dynamic";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-[18px] py-8 sm:py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl font-headline">
          Frequently Asked <span className="text-[#3B82F6]">Questions</span>
        </h1>
        <p className="mt-2 text-[14px] text-[#6B7280]">Everything you need to know about navigating CapstoneHub.</p>
      </div>

      <div className="space-y-3">
        {[
          {
            q: "What is CapstoneHub?",
            a: "CapstoneHub is a peer-to-peer marketplace where students and developers can list, discover, and inquire about capstone and graduation projects. We facilitate connections — transactions happen directly between users.",
          },
          {
            q: "How do I list a project for sale?",
            a: "Sign up, go to your dashboard, and click 'Post New Listing'. Fill in the title, description, category, tags, and optional price. Your listing will be reviewed by an admin before going live.",
          },
          {
            q: "Is there a fee to use the platform?",
            a: "No. Listing, browsing, inquiring, and reviewing are all completely free. We don't process payments — everything happens directly between buyers and sellers.",
          },
          {
            q: "How do I contact a seller?",
            a: "On any listing page, click 'Request Purchase' to send an inquiry. The seller will see it on their dashboard and can respond or mark it as handled.",
          },
          {
            q: "Can I review a project I didn't buy?",
            a: "Yes. Any logged-in user who has visited a listing page can leave one review per project. Reviews are visible immediately but can be flagged for moderation.",
          },
          {
            q: "What happens if my listing is rejected?",
            a: "Rejected listings come with a reason. You can edit and resubmit — edits trigger a new review cycle. Repeated violations may lead to account suspension.",
          },
          {
            q: "How does following work?",
            a: "You can follow other users to see their new listings and reviews in your feed. Go to any profile page and click the Follow button. Unfollow anytime.",
          },
          {
            q: "How do I save projects?",
            a: "Click the bookmark icon on any listing card. Saved projects appear on your /saved page. You can also use Discover to browse trending projects across all categories.",
          },
          {
            q: "Can I report inappropriate content?",
            a: "Yes. Click the flag button below any review to submit a moderation report. Admins review all flags and take appropriate action.",
          },
          {
            q: "What are the community guidelines?",
            a: "Projects must be original work. Descriptions must be accurate. Be respectful in all interactions. Copyrighted material you don't own, fraud, and spam are prohibited.",
          },
        ].map((item, i) => (
          <details key={i} className="group rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] open:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition">
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-[18px] min-h-[52px] text-[15px] font-bold text-[#111827] font-headline list-none">
              {item.q}
              <svg className="h-5 w-5 shrink-0 text-[#9CA3AF] group-open:rotate-180 group-open:text-[#3B82F6] transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="border-t border-[#F3F4F6] px-[18px] pb-[18px] pt-3 text-[14px] leading-relaxed text-[#4B5563]">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

