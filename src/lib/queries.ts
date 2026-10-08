import { getDb } from "./db";
import type {
  Category,
  Inquiry,
  ListingCard,
  ListingDetail,
  ListingStatus,
  Review,
  FollowCounters,
  Notification,
} from "./types";

// ---------------------------------------------------------------------------
// Row mappers
// ---------------------------------------------------------------------------

interface ListingRow {
  id: number;
  title: string;
  description: string;
  price: number | null;
  status: ListingStatus;
  created_at: string;
  category_id: number;
  category_slug: string;
  category_label: string;
  tags_json: string | null;
  images_json: string | null;
  seller_id: number;
  seller_name: string;
  seller_joined_at: string;
  seller_suspended: number;
  review_avg: number | null;
  review_count: number;
}

function parseImages(json: string | null) {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((img) => img && typeof img.image_url === "string" && img.image_url.trim() !== "");
  } catch {
    return [];
  }
}

function mapListing(row: ListingRow): ListingCard {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    status: row.status,
    description: row.description,
    category: { id: row.category_id, slug: row.category_slug, label: row.category_label },
    tags: row.tags_json ? JSON.parse(row.tags_json) : [],
    images: parseImages(row.images_json),
    seller: { id: row.seller_id, name: row.seller_name },
    review_avg: row.review_avg,
    review_count: row.review_count,
    created_at: row.created_at,
  };
}

function mapDetail(row: ListingRow): ListingDetail {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    status: row.status,
    category: { id: row.category_id, slug: row.category_slug, label: row.category_label },
    tags: row.tags_json ? JSON.parse(row.tags_json) : [],
    images: parseImages(row.images_json),
    seller: { id: row.seller_id, name: row.seller_name, joined_at: row.seller_joined_at },
    review_avg: row.review_avg,
    review_count: row.review_count,
    created_at: row.created_at,
  };
}

const LISTING_SELECT = `
  SELECT
    l.id, l.title, l.description, l.price, l.status, l.created_at,
    c.id AS category_id, c.slug AS category_slug, c.label AS category_label,
    u.id AS seller_id, u.name AS seller_name, u.created_at AS seller_joined_at, u.is_suspended AS seller_suspended,
    (SELECT json_group_array(tag) FROM listing_tags lt WHERE lt.listing_id = l.id) AS tags_json,
    (SELECT json_group_array(json_object('id', li.id, 'image_url', li.image_url, 'caption', li.caption, 'sort_order', li.sort_order))
     FROM (SELECT * FROM listing_images WHERE listing_id = l.id ORDER BY sort_order ASC, id ASC) li) AS images_json,
    (SELECT AVG(rating) FROM reviews r WHERE r.listing_id = l.id AND r.is_deleted = 0) AS review_avg,
    (SELECT COUNT(*) FROM reviews r WHERE r.listing_id = l.id AND r.is_deleted = 0) AS review_count
  FROM listings l
  JOIN categories c ON c.id = l.category_id
  JOIN users u ON u.id = l.seller_id
`;


// ---------------------------------------------------------------------------
// Public catalog
// ---------------------------------------------------------------------------

export interface SearchParams {
  query?: string;
  category?: string; // slug
  tag?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

const SORTS: Record<string, string> = {
  newest: "l.created_at DESC",
  oldest: "l.created_at ASC",
  price_asc: "CASE WHEN l.price IS NULL THEN 1 ELSE 0 END, l.price ASC",
  price_desc: "CASE WHEN l.price IS NULL THEN 1 ELSE 0 END, l.price DESC",
  rating: "review_avg DESC NULLS LAST, l.created_at DESC",
};

export function searchListings(p: SearchParams): { listings: ListingCard[]; total: number } {
  const db = getDb();
  const where: string[] = ["l.status = 'approved'", "u.is_suspended = 0"];
  const params: unknown[] = [];

  if (p.query) {
    where.push("(l.title LIKE ? OR l.description LIKE ?)");
    const like = `%${p.query}%`;
    params.push(like, like);
  }
  if (p.category) {
    where.push("c.slug = ?");
    params.push(p.category);
  }
  if (p.tag) {
    where.push("EXISTS (SELECT 1 FROM listing_tags lt2 WHERE lt2.listing_id = l.id AND lt2.tag = ?)");
    params.push(p.tag);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const order = SORTS[p.sort ?? "newest"] ?? SORTS.newest;
  const page = Math.max(1, p.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, p.pageSize ?? 12));

  const total = (db.prepare(`SELECT COUNT(*) AS n FROM listings l JOIN categories c ON c.id = l.category_id JOIN users u ON u.id = l.seller_id ${whereSql}`).get(...params) as { n: number }).n;
  const rows = db.prepare(`${LISTING_SELECT} ${whereSql} ORDER BY ${order} LIMIT ? OFFSET ?`).all(...params, pageSize, (page - 1) * pageSize) as ListingRow[];
  return { listings: rows.map(mapListing), total };
}

// ---------------------------------------------------------------------------
// Single listing + reviews
// ---------------------------------------------------------------------------

export function getListingById(id: number): ListingDetail | null {
  const row = getDb().prepare(`${LISTING_SELECT} WHERE l.id = ?`).get(id) as ListingRow | undefined;
  return row ? mapDetail(row) : null;
}

export function getListingRow(id: number): ListingRow | null {
  const row = getDb().prepare(`${LISTING_SELECT} WHERE l.id = ?`).get(id) as ListingRow | undefined;
  return row ?? null;
}

export function getReviewsForListing(listingId: number): Review[] {
  return getDb()
    .prepare(
      `SELECT r.id, r.listing_id, r.author_id, u.name AS author_name, r.rating, r.comment, r.created_at
       FROM reviews r JOIN users u ON u.id = r.author_id
       WHERE r.listing_id = ? AND r.is_deleted = 0
       ORDER BY r.created_at DESC`
    )
    .all(listingId) as Review[];
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export function listCategories(): Category[] {
  return getDb().prepare("SELECT id, slug, label FROM categories ORDER BY label").all() as Category[];
}

// ---------------------------------------------------------------------------
// Dashboard: my listings, my inquiries
// ---------------------------------------------------------------------------

export function getMyListings(userId: number): ListingCard[] {
  return (
    getDb()
      .prepare(`${LISTING_SELECT} WHERE l.seller_id = ? ORDER BY l.created_at DESC`)
      .all([userId]) as ListingRow[]
  ).map(mapListing);
}

export function getInquiriesForUser(userId: number): Inquiry[] {
  const db = getDb();
  const received = db
    .prepare(
      `SELECT i.id, i.listing_id, l.title AS listing_title, u.name AS counterparty_name,
              i.message, i.status, i.created_at, 'received' AS direction
       FROM inquiries i
       JOIN listings l ON l.id = i.listing_id
       JOIN users u ON u.id = i.buyer_id
       WHERE l.seller_id = ?
       ORDER BY i.created_at DESC`
    )
    .all([userId]) as Inquiry[];
  const sent = db
    .prepare(
      `SELECT i.id, i.listing_id, l.title AS listing_title, u.name AS counterparty_name,
              i.message, i.status, i.created_at, 'sent' AS direction
       FROM inquiries i
       JOIN listings l ON l.id = i.listing_id
       JOIN users u ON u.id = l.seller_id
       WHERE i.buyer_id = ?
       ORDER BY i.created_at DESC`
    )
    .all([userId]) as Inquiry[];
  return [...received, ...sent];
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export function adminListListings(status?: ListingStatus): ListingCard[] {
  const where = status ? "WHERE l.status = ?" : "";
  const rows = getDb()
    .prepare(`${LISTING_SELECT} ${where} ORDER BY l.created_at DESC`)
    .all(...(status ? [status] : [])) as ListingRow[];
  return rows.map(mapListing);
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  is_suspended: 0 | 1;
  created_at: string;
}

export function adminListUsers(): AdminUser[] {
  return getDb()
    .prepare("SELECT id, name, email, role, is_suspended, created_at FROM users ORDER BY created_at DESC")
    .all() as AdminUser[];
}

export interface FlaggedReview {
  id: number;
  listing_id: number;
  rating: number;
  comment: string;
  flag_count: number;
  flags: { reason: string; flagger_name: string }[];
}

export function adminFlaggedReviews(): FlaggedReview[] {
  const rows = getDb()
    .prepare(
      `SELECT r.id, r.listing_id, r.rating, r.comment, COUNT(f.id) AS flag_count
       FROM reviews r
       JOIN review_flags f ON f.review_id = r.id
       WHERE r.is_deleted = 0
       GROUP BY r.id
       ORDER BY flag_count DESC`
    )
    .all() as { id: number; listing_id: number; rating: number; comment: string; flag_count: number }[];
  const flagsStmt = getDb().prepare(
    `SELECT f.reason, u.name AS flagger_name FROM review_flags f JOIN users u ON u.id = f.flagger_id WHERE f.review_id = ?`
  );
  return rows.map((r) => ({ ...r, flags: flagsStmt.all(r.id) as { reason: string; flagger_name: string }[] }));
}

// ---------------------------------------------------------------------------
// Social features — follows, bookmarks, notifications, feed, search
// ---------------------------------------------------------------------------

export interface UserSearchResult {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  listing_count: number;
  avg_rating: number | null;
  followers: number;
}

export function searchUsers(query: string, excludingUserId?: number): UserSearchResult[] {
  const db = getDb();
  const like = `%${query}%`;
  const where = excludingUserId ? "WHERE u.id != ? AND" : "WHERE";
  const params: unknown[] = excludingUserId ? [excludingUserId] : [];
  params.push(like, like);
  const rows = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              (SELECT COUNT(*) FROM listings l WHERE l.seller_id = u.id AND l.status = 'approved') AS listing_count,
              (SELECT ROUND(AVG(r.rating), 1) FROM reviews r JOIN listings l ON l.id = r.listing_id WHERE r.author_id = u.id AND r.is_deleted = 0) AS avg_rating,
              (SELECT COUNT(*) FROM follows f WHERE f.following_id = u.id) AS followers
       FROM users u
       ${where} (u.name LIKE ? OR u.email LIKE ?)
       ORDER BY followers DESC, listing_count DESC
       LIMIT 20`
    ).all(...params) as UserSearchResult[];
  return rows;
}

export function getUserProfile(userId: number): {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  listing_count: number;
  review_count: number;
  avg_rating: number | null;
  followers: number;
  following: number;
  isFollowing: boolean;
} | null {
  const row = getDb()
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              (SELECT COUNT(*) FROM listings l WHERE l.seller_id = u.id AND l.status = 'approved') AS listing_count,
              (SELECT COUNT(*) FROM reviews r WHERE r.author_id = u.id AND r.is_deleted = 0) AS review_count,
              (SELECT ROUND(AVG(r.rating), 1) FROM reviews r JOIN listings l ON l.id = r.listing_id WHERE r.author_id = u.id AND r.is_deleted = 0) AS avg_rating,
              (SELECT COUNT(*) FROM follows f WHERE f.following_id = u.id) AS followers,
              (SELECT COUNT(*) FROM follows f WHERE f.follower_id = u.id) AS following,
              (SELECT COUNT(*) FROM follows f WHERE f.follower_id = ?1 AND f.following_id = u.id) AS isFollowing
       FROM users u WHERE u.id = ?2`
    )
    .get(userId, userId) as {
      id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
      listing_count: number;
      review_count: number;
      avg_rating: number | null;
      followers: number;
      following: number;
      isFollowing: number;
    } | undefined;
  return row ? { ...row, isFollowing: !!row.isFollowing } : null;
}

export function getListingsBySeller(sellerId: number): ListingCard[] {
  return (
    getDb()
      .prepare(`${LISTING_SELECT} WHERE l.seller_id = ? AND l.status = 'approved' ORDER BY l.created_at DESC`)
      .all(sellerId) as ListingRow[]
  ).map(mapListing);
}

export function toggleFollow(followerId: number, followingId: number): void {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?").get(followerId, followingId);
  if (existing) {
    db.prepare("DELETE FROM follows WHERE follower_id = ? AND following_id = ?").run(followerId, followingId);
  } else {
    db.prepare("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)").run(followerId, followingId);
    // Notify about new follower
    db.prepare(
      `INSERT INTO notifications (user_id, type, actor_id, entity_type, entity_id)
       VALUES (?, 'follow', ?, 'user', ?)`
    ).run(followingId, followerId, followingId);
  }
}

export function isFollowing(followerId: number, followingId: number): boolean {
  return !!getDb().prepare("SELECT id FROM follows WHERE follower_id = ? AND following_id = ?").get(followerId, followingId);
}

export function getBookmarks(userId: number): ListingCard[] {
  const db = getDb();
  const rows = db
    .prepare(
      `${LISTING_SELECT}
       INNER JOIN bookmarks b ON b.listing_id = l.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`
    )
    .all(userId) as ListingRow[];
  return rows.map(mapListing);
}

export function toggleBookmark(userId: number, listingId: number): void {
  const db = getDb();
  const existing = db.prepare("SELECT 1 FROM bookmarks WHERE user_id = ? AND listing_id = ?").get(userId, listingId);
  if (existing) {
    db.prepare("DELETE FROM bookmarks WHERE user_id = ? AND listing_id = ?").run(userId, listingId);
  } else {
    db.prepare("INSERT INTO bookmarks (user_id, listing_id) VALUES (?, ?)").run(userId, listingId);
  }
}

export function isBookmarked(userId: number, listingId: number): boolean {
  return !!getDb().prepare("SELECT 1 FROM bookmarks WHERE user_id = ? AND listing_id = ?").get(userId, listingId);
}

export function getNotifications(userId: number, limit: number = 30): Notification[] {
  return getDb()
    .prepare(
      `SELECT n.id, n.type, n.actor_id, u.name AS actor_name, n.entity_type, n.entity_id,
              l.title AS listing_title,
              r.comment AS review_comment,
              n.is_read, n.created_at
       FROM notifications n
       JOIN users u ON u.id = n.actor_id
       LEFT JOIN listings l ON n.entity_type = 'listing' AND n.entity_id = l.id
       LEFT JOIN reviews r ON n.entity_type = 'review' AND n.entity_id = r.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT ?`
    )
    .all(userId, limit) as unknown as Notification[];
}

export function markAllNotificationsRead(userId: number): void {
  getDb().prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?").run(userId);
}

export function getUnreadNotificationCount(userId: number): number {
  return (getDb().prepare("SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0").get(userId) as { count: number }).count;
}

export function createActivityNotification(userId: number, type: NonNullable<Notification['type']>, actorId: number, entityType?: string, entityId?: number): void {
  const db = getDb();
  // Don't notify about own actions
  if (userId === actorId) return;
  db.prepare(
    `INSERT INTO notifications (user_id, type, actor_id, entity_type, entity_id)
     VALUES (?, ?, ?, ?, ?)`
  ).run(userId, type, actorId, entityType || null, entityId || null);
}

// Activity feed — posts from followed users + your own activity
export function getActivityFeed(userId: number, page: number = 1, pageSize: number = 20): { items: any[]; total: number } {
  const db = getDb();
  // Get IDs of people this user follows
  const followedIds: number[] = db
    .prepare("SELECT following_id FROM follows WHERE follower_id = ?")
    .all([userId])
    .map((f: any) => f.following_id);

  // Build feed from:
  // 1. Listings from followed users
  // 2. Reviews by followed users
  // 3. Own listings
  // 4. Own inquiries
  const parts: string[] = [];
  const params: unknown[] = [];

  if (followedIds.length > 0) {
    const placeholders = followedIds.map(() => "?").join(",");
    // Listings from followed users
    parts.push(`
      SELECT l.id, 'listing' AS feed_type, u.id AS actor_id, u.name AS actor_name,
             l.title, l.description, l.price, l.category_id,
             l.created_at AS feed_created_at,
             NULL AS review_comment, NULL AS review_id, 0 AS is_own,
             (SELECT json_group_array(json_object('id', li.id, 'image_url', li.image_url, 'caption', li.caption, 'sort_order', li.sort_order))
              FROM (SELECT * FROM listing_images WHERE listing_id = l.id ORDER BY sort_order ASC, id ASC) li) AS images_json
      FROM listings l
      JOIN users u ON u.id = l.seller_id
      WHERE l.seller_id IN (${placeholders}) AND l.status = 'approved'
    `);
    params.push(...followedIds);

    // Reviews from followed users
    parts.push(`
      SELECT r.id, 'review' AS feed_type, u.id AS actor_id, u.name AS actor_name,
             NULL AS title, l.title AS description, NULL AS price, l.category_id,
             r.created_at AS feed_created_at,
             r.comment AS review_comment, r.id AS review_id, 0 AS is_own
      FROM reviews r
      JOIN listings l ON l.id = r.listing_id
      JOIN users u ON u.id = r.author_id
      WHERE r.author_id IN (${placeholders}) AND r.is_deleted = 0
    `);
    params.push(...followedIds);
  }

  // Own listings
  parts.push(`
    SELECT l.id, 'listing' AS feed_type, u.id AS actor_id, u.name AS actor_name,
           l.title, l.description, l.price, l.category_id,
           l.created_at AS feed_created_at,
           NULL AS review_comment, NULL AS review_id, 1 AS is_own,
           (SELECT json_group_array(json_object('id', li.id, 'image_url', li.image_url, 'caption', li.caption, 'sort_order', li.sort_order))
            FROM (SELECT * FROM listing_images WHERE listing_id = l.id ORDER BY sort_order ASC, id ASC) li) AS images_json
    FROM listings l
    JOIN users u ON u.id = l.seller_id
    WHERE l.seller_id = ? AND l.status = 'approved'
  `);
  params.push(userId);

  const unionSql = parts.join(" UNION ALL ");
  const orderBySql = "ORDER BY feed_created_at DESC LIMIT ? OFFSET ?";
  const countSql = `SELECT COUNT(*) AS total FROM (${unionSql})`;

  const total = (db.prepare(countSql).get(...params) as { total: number }).total;
  const rows = db.prepare(`${unionSql} ${orderBySql}`).all(...params, pageSize, (page - 1) * pageSize) as Array<{
    id: number;
    feed_type: string;
    actor_id: number;
    actor_name: string;
    title?: string;
    description?: string;
    price?: number | null;
    category_id?: number;
    feed_created_at: string;
    review_comment?: string;
    review_id?: number;
    is_own: number;
    images_json?: string;
  }>;

  // Enrich with category and images
  const items = rows.map((r) => {
    const cat = r.category_id ? db.prepare("SELECT label FROM categories WHERE id = ?").get(r.category_id) as { label: string } | undefined : undefined;
    const images = r.images_json ? parseImages(r.images_json) : [];
    return {
      id: r.id,
      type: r.feed_type as any,
      actor: { id: r.actor_id, name: r.actor_name },
      title: r.title,
      description: r.description,
      price: r.price ?? null,
      category: cat ? { label: cat.label } : undefined,
      images,
      review_comment: r.review_comment,
      listing_id: r.feed_type === 'listing' ? r.id : undefined,
      is_own: r.is_own === 1,
      created_at: r.feed_created_at,
    };
  });

  return { items, total };
}
