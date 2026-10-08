import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listCategories } from "@/lib/queries";
import ListingForm from "@/components/ListingForm";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const user = await requireUser();
  const categories = listCategories();
  return (
    <div className="mx-auto max-w-2xl px-[18px] py-8 space-y-4">
      <Link href="/dashboard" className="inline-flex min-h-[44px] items-center text-xs font-semibold text-[#3B82F6] hover:text-[#2563EB] transition">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-[#111827] font-headline">New Listing</h1>
      <ListingForm categories={categories} isAdmin={user.role === "admin"} />
    </div>
  );
}

