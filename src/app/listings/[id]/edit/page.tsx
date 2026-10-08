import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listCategories } from "@/lib/queries";
import ListingForm from "@/components/ListingForm";

export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const listingId = Number(id);

  const listing = getDb()
    .prepare("SELECT id, seller_id, title, description, category_id, price, status FROM listings WHERE id = ?")
    .get(listingId) as
    | { id: number; seller_id: number; title: string; description: string; category_id: number; price: number | null; status: string }
    | undefined;
  if (!listing || listing.status === "deleted") notFound();
  if (listing.seller_id !== user.id && user.role !== "admin") notFound();

  const tags = (
    getDb().prepare("SELECT tag FROM listing_tags WHERE listing_id = ?").all(listingId) as { tag: string }[]
  ).map((t) => t.tag);

  const images = getDb()
    .prepare("SELECT id, image_url, caption, sort_order FROM listing_images WHERE listing_id = ? ORDER BY sort_order ASC")
    .all(listingId) as { id: number; image_url: string; caption: string | null; sort_order: number }[];

  const categories = listCategories();

  return (
    <div className="mx-auto max-w-2xl px-[18px] py-8 space-y-4">
      <Link href="/dashboard" className="inline-flex min-h-[44px] items-center text-xs font-semibold text-[#3B82F6] hover:text-[#2563EB] transition">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-[#111827] font-headline">Edit Listing</h1>
      <ListingForm
        categories={categories}
        isAdmin={user.role === "admin"}
        initial={{
          id: listing.id,
          title: listing.title,
          description: listing.description,
          category_id: listing.category_id,
          price: listing.price,
          tags,
          images,
        }}
      />
    </div>
  );
}


