"use server";

import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { clearSessionCookie, createSession, getSession, setSessionCookie } from "@/lib/auth";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fail(error: string, fieldErrors?: Record<string, string>): ActionResult {
  return { ok: false, error, fieldErrors };
}

async function extractListingImages(formData: FormData): Promise<{ image_url: string; caption?: string }[]> {
  const images: { image_url: string; caption?: string }[] = [];

  // 1. Process files if uploaded
  const files = formData.getAll("image_files") as File[];
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (files && files.length > 0) {
    for (const file of files) {
      if (file && typeof file === "object" && "size" in file && file.size > 0 && typeof file.arrayBuffer === "function") {
        try {
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          const ext = path.extname(file.name) || ".png";
          const safeName = `ss-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
          const filePath = path.join(uploadDir, safeName);
          const buffer = Buffer.from(await file.arrayBuffer());
          fs.writeFileSync(filePath, buffer);
          images.push({ image_url: `/uploads/${safeName}`, caption: file.name.replace(/\.[^/.]+$/, "") });
        } catch (err) {
          console.error("Error saving upload:", err);
        }
      }
    }
  }

  // 2. Process JSON array of images / URLs
  const imagesJsonStr = String(formData.get("images") ?? "").trim();
  if (imagesJsonStr) {
    try {
      const parsed = JSON.parse(imagesJsonStr);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item && typeof item.image_url === "string" && item.image_url.trim()) {
            images.push({
              image_url: item.image_url.trim(),
              caption: typeof item.caption === "string" ? item.caption.trim() : "",
            });
          }
        }
      }
    } catch {}
  }

  // 3. Process direct single URL input if supplied as fallback
  const singleUrl = String(formData.get("image_url") ?? "").trim();
  if (singleUrl && !images.some((img) => img.image_url === singleUrl)) {
    images.push({ image_url: singleUrl, caption: String(formData.get("image_caption") ?? "").trim() });
  }

  return images;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function registerAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 80) errors.name = "Name must be 2-80 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
  if (password.length < 8 || password.length > 256) errors.password = "Password must be 8-256 characters";
  if (Object.keys(errors).length) return fail("validation_failed", errors);

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return fail("email_taken", { email: "Email already registered" });

  const hash = bcrypt.hashSync(password, 12);
  const res = db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')").run(name, email, hash);
  const user = { id: Number(res.lastInsertRowid), name, email, role: "user" as const };
  await setSessionCookie(createSession(user));
  redirect("/dashboard");
}

export async function loginAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const row = getDb().prepare("SELECT id, name, email, role, is_suspended, password_hash FROM users WHERE email = ?").get(email) as
    | { id: number; name: string; email: string; role: "user" | "admin"; is_suspended: number; password_hash: string }
    | undefined;

  if (!row || !bcrypt.compareSync(password, row.password_hash)) return fail("invalid_credentials");
  if (row.is_suspended) return fail("account_suspended");

  await setSessionCookie(createSession({ id: row.id, name: row.name, email: row.email, role: row.role }));
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/");
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

export async function createListingAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category_id = Number(formData.get("category_id"));
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = priceRaw === "" ? null : Number(priceRaw);
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8);

  const errors: Record<string, string> = {};
  if (title.length < 3 || title.length > 120) errors.title = "Title must be 3-120 characters";
  if (description.length < 20 || description.length > 5000) errors.description = "Description must be 20-5000 characters";
  if (!Number.isInteger(category_id)) errors.category_id = "Choose a category";
  if (price !== null && (!Number.isFinite(price) || price < 0)) errors.price = "Price must be 0 or more";
  for (const t of tags) if (t.length > 30) errors.tags = "Each tag max 30 characters";
  if (Object.keys(errors).length) return fail("validation_failed", errors);

  const db = getDb();
  const category = db.prepare("SELECT id FROM categories WHERE id = ?").get(category_id);
  if (!category) return fail("invalid_category");

  const images = await extractListingImages(formData);
  const status = user.role === "admin" ? "approved" : "pending";
  const tx = db.transaction(() => {
    const res = db
      .prepare(
        `INSERT INTO listings (seller_id, category_id, title, description, price, status, approved_at, approved_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        user.id,
        category_id,
        title,
        description,
        price,
        status,
        status === "approved" ? new Date().toISOString() : null,
        status === "approved" ? user.id : null
      );
    const listingId = Number(res.lastInsertRowid);
    const insertTag = db.prepare("INSERT OR IGNORE INTO listing_tags (listing_id, tag) VALUES (?, ?)");
    for (const t of tags) insertTag.run(listingId, t);

    const insertImg = db.prepare("INSERT INTO listing_images (listing_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)");
    images.forEach((img, idx) => {
      insertImg.run(listingId, img.image_url, img.caption || null, idx);
    });

    return listingId;
  });
  const listingId = tx();
  void listingId; // id is returned by tx(); revalidation below covers freshness

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/discover");
  return { ok: true, message: status === "approved" ? "Listing created and approved." : "Listing submitted for approval." };
}

export async function updateListingAction(listingId: number, prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");

  const db = getDb();
  const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(listingId) as
    | { id: number; seller_id: number; status: string }
    | undefined;
  if (!listing || listing.status === "deleted") return fail("not_found");
  if (listing.seller_id !== user.id && user.role !== "admin") return fail("forbidden");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category_id = Number(formData.get("category_id"));
  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = priceRaw === "" ? null : Number(priceRaw);
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8);

  const errors: Record<string, string> = {};
  if (title.length < 3 || title.length > 120) errors.title = "Title must be 3-120 characters";
  if (description.length < 20 || description.length > 5000) errors.description = "Description must be 20-5000 characters";
  if (!Number.isInteger(category_id)) errors.category_id = "Choose a category";
  if (price !== null && (!Number.isFinite(price) || price < 0)) errors.price = "Price must be 0 or more";
  if (Object.keys(errors).length) return fail("validation_failed", errors);

  const images = await extractListingImages(formData);
  const status = user.role === "admin" ? listing.status : "pending"; // content edit -> re-approval
  db.transaction(() => {
    db.prepare(
      `UPDATE listings SET title = ?, description = ?, category_id = ?, price = ?, status = ?, updated_at = ? WHERE id = ?`
    ).run(title, description, category_id, price, status, new Date().toISOString(), listingId);
    
    db.prepare("DELETE FROM listing_tags WHERE listing_id = ?").run(listingId);
    const insertTag = db.prepare("INSERT OR IGNORE INTO listing_tags (listing_id, tag) VALUES (?, ?)");
    for (const t of tags) insertTag.run(listingId, t);

    db.prepare("DELETE FROM listing_images WHERE listing_id = ?").run(listingId);
    const insertImg = db.prepare("INSERT INTO listing_images (listing_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)");
    images.forEach((img, idx) => {
      insertImg.run(listingId, img.image_url, img.caption || null, idx);
    });
  })();

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/discover");
  revalidatePath(`/listings/${listingId}`);
  return { ok: true, message: status === "pending" ? "Changes submitted for re-approval." : "Listing updated." };
}

export async function deleteListingAction(listingId: number): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");

  const db = getDb();
  const listing = db.prepare("SELECT seller_id, status FROM listings WHERE id = ?").get(listingId) as
    | { seller_id: number; status: string }
    | undefined;
  if (!listing) return fail("not_found");
  if (listing.seller_id !== user.id && user.role !== "admin") return fail("forbidden");
  if (listing.status === "deleted") return fail("already_deleted");

  db.prepare("UPDATE listings SET status = 'deleted', updated_at = ? WHERE id = ?").run(new Date().toISOString(), listingId);
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/listings/${listingId}`);
  return { ok: true, message: "Listing deleted." };
}

// ---------------------------------------------------------------------------
// Inquiries
// ---------------------------------------------------------------------------

export async function createInquiryAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");

  const listing_id = Number(formData.get("listing_id"));
  const message = String(formData.get("message") ?? "").trim();

  if (!Number.isInteger(listing_id)) return fail("validation_failed", { listing_id: "Invalid listing" });
  if (message.length < 1 || message.length > 2000) return fail("validation_failed", { message: "Message must be 1-2000 characters" });

  const db = getDb();
  const listing = db
    .prepare("SELECT l.seller_id, l.status, u.is_suspended AS seller_suspended FROM listings l JOIN users u ON u.id = l.seller_id WHERE l.id = ?")
    .get(listing_id) as { seller_id: number; status: string; seller_suspended: number } | undefined;
  if (!listing || listing.status !== "approved") return fail("listing_not_available");
  if (listing.seller_id === user.id) return fail("cannot_inquire_own");
  if (listing.seller_suspended) return fail("seller_unavailable");

  db.prepare(
    `INSERT INTO inquiries (listing_id, buyer_id, message, status) VALUES (?, ?, ?, 'sent')
     ON CONFLICT(listing_id, buyer_id) DO UPDATE SET message = excluded.message, updated_at = datetime('now')`
  ).run(listing_id, user.id, message);

  revalidatePath("/dashboard");
  return { ok: true, message: "Inquiry sent to seller." };
}

export async function respondInquiryAction(formData: FormData): Promise<void> {
  const user = await getSession();
  if (!user) return;

  const inquiryId = Number(formData.get("inquiry_id"));
  const db = getDb();
  const inquiry = db
    .prepare("SELECT i.id, l.seller_id FROM inquiries i JOIN listings l ON l.id = i.listing_id WHERE i.id = ?")
    .get(inquiryId) as { id: number; seller_id: number } | undefined;
  if (!inquiry || (inquiry.seller_id !== user.id && user.role !== "admin")) return;

  db.prepare("UPDATE inquiries SET status = 'responded', updated_at = datetime('now') WHERE id = ?").run(inquiryId);
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Reviews + flags
// ---------------------------------------------------------------------------

export async function createReviewAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");

  const listing_id = Number(formData.get("listing_id"));
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!Number.isInteger(listing_id)) return fail("validation_failed", { listing_id: "Invalid listing" });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return fail("validation_failed", { rating: "Rating must be 1-5 stars" });
  if (comment.length < 1 || comment.length > 2000) return fail("validation_failed", { comment: "Comment must be 1-2000 characters" });

  const db = getDb();
  const listing = db.prepare("SELECT seller_id, status FROM listings WHERE id = ?").get(listing_id) as
    | { seller_id: number; status: string }
    | undefined;
  if (!listing || listing.status !== "approved") return fail("listing_not_available");
  if (listing.seller_id === user.id) return fail("cannot_review_own");

  try {
    db.prepare("INSERT INTO reviews (listing_id, author_id, rating, comment) VALUES (?, ?, ?, ?)").run(listing_id, user.id, rating, comment);
  } catch {
    return fail("already_reviewed");
  }

  revalidatePath(`/listings/${listing_id}`);
  return { ok: true, message: "Review posted." };
}

export async function flagReviewAction(reviewId: number, prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");

  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 1 || reason.length > 500) return fail("validation_failed", { reason: "Reason must be 1-500 characters" });

  const db = getDb();
  const review = db.prepare("SELECT author_id FROM reviews WHERE id = ?").get(reviewId) as { author_id: number } | undefined;
  if (!review) return fail("not_found");
  if (review.author_id === user.id) return fail("cannot_flag_own");

  try {
    db.prepare("INSERT INTO review_flags (review_id, flagger_id, reason) VALUES (?, ?, ?)").run(reviewId, user.id, reason);
  } catch {
    return fail("already_flagged");
  }

  revalidatePath(`/listings/${formData.get("listing_id")}`);
  return { ok: true, message: "Review flagged for moderation." };
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export async function moderateListingAction(formData: FormData): Promise<void> {
  const user = await getSession();
  if (!user || user.role !== "admin") return;

  const listingId = Number(formData.get("listing_id"));
  const action = String(formData.get("action"));
  if (action !== "approve" && action !== "reject") return;

  const db = getDb();
  const listing = db.prepare("SELECT id FROM listings WHERE id = ?").get(listingId) as { id: number } | undefined;
  if (!listing) return;

  db.prepare(
    action === "approve"
      ? "UPDATE listings SET status = 'approved', approved_at = ?, approved_by = ?, updated_at = ? WHERE id = ?"
      : "UPDATE listings SET status = 'rejected', updated_at = ? WHERE id = ?"
  ).run(action === "approve" ? new Date().toISOString() : new Date().toISOString(), action === "approve" ? user.id : undefined, new Date().toISOString(), listingId);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/listings/${listingId}`);
}

export async function toggleSuspendAction(formData: FormData): Promise<void> {
  const admin = await getSession();
  if (!admin || admin.role !== "admin") return;

  const userId = Number(formData.get("user_id"));
  if (admin.id === userId) return;

  const db = getDb();
  const target = db.prepare("SELECT is_suspended FROM users WHERE id = ?").get(userId) as { is_suspended: number } | undefined;
  if (!target) return;

  db.prepare("UPDATE users SET is_suspended = ? WHERE id = ?").run(target.is_suspended ? 0 : 1, userId);
  revalidatePath("/admin");
}

export async function adminDeleteReviewAction(formData: FormData): Promise<void> {
  const admin = await getSession();
  if (!admin || admin.role !== "admin") return;

  const reviewId = Number(formData.get("review_id"));
  const db = getDb();
  const review = db.prepare("SELECT listing_id FROM reviews WHERE id = ?").get(reviewId) as { listing_id: number } | undefined;
  if (!review) return;

  db.prepare("UPDATE reviews SET is_deleted = 1 WHERE id = ?").run(reviewId);
  revalidatePath("/admin");
  revalidatePath(`/listings/${review.listing_id}`);
}

// ---------------------------------------------------------------------------
// Social features — follows, bookmarks, notifications
// ---------------------------------------------------------------------------
import { createActivityNotification, toggleFollow as _toggleFollow, toggleBookmark as _toggleBookmark, getNotifications, markAllNotificationsRead } from "@/lib/queries";

export async function toggleFollowAction(followingId: number): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");
  if (user.id === followingId) return fail("cannot_follow_self");
  _toggleFollow(user.id, followingId);
  revalidatePath(`/profile/${followingId}`);
  revalidatePath("/dashboard");
  return { ok: true, message: !isFollowingDb(user.id, followingId) ? "Unfollowed." : "Now following!" };
}

function isFollowingDb(followerId: number, followingId: number): boolean {
  return !!getDb().prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?").get(followerId, followingId);
}

export async function toggleBookmarkAction(listingId: number): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");
  _toggleBookmark(user.id, listingId);
  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/saved");
  return { ok: true, message: isBookmarkedDb(user.id, listingId) ? "Saved!" : "Removed from saved." };
}

function isBookmarkedDb(userId: number, listingId: number): boolean {
  return !!getDb().prepare("SELECT id FROM bookmarks WHERE user_id = ? AND listing_id = ?").get(userId, listingId);
}

export async function markNotificationsReadAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");
  markAllNotificationsRead(user.id);
  revalidatePath("/notifications");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export async function updateProfileAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const user = await getSession();
  if (!user) return fail("unauthorized");

  const name = String(formData.get("name") ?? "").trim();
  const current_password = String(formData.get("current_password") ?? "");
  const new_password = String(formData.get("new_password") ?? "");

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 80) errors.name = "Name must be 2-80 characters";
  if (Object.keys(errors).length) return fail("validation_failed", errors);

  const db = getDb();
  const row = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(user.id) as { password_hash: string };

  if (new_password) {
    if (new_password.length < 8 || new_password.length > 256) {
      return fail("validation_failed", { new_password: "New password must be 8-256 characters" });
    }
    if (!current_password || !bcrypt.compareSync(current_password, row.password_hash)) {
      return fail("current_password_incorrect");
    }
    db.prepare("UPDATE users SET name = ?, password_hash = ? WHERE id = ?").run(name, bcrypt.hashSync(new_password, 12), user.id);
  } else {
    db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, user.id);
  }

  revalidatePath("/profile");
  return { ok: true, message: "Profile updated." };
}
