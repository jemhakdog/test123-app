// Shared domain types — single source mirroring SCHEMA.sql.

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  is_suspended: 0 | 1;
  created_at: string;
}

export interface Category {
  id: number;
  slug: string;
  label: string;
}

export type ListingStatus = "pending" | "approved" | "rejected" | "sold" | "deleted";

export interface ListingImage {
  id?: number;
  listing_id?: number;
  image_url: string;
  caption?: string | null;
  sort_order?: number;
}

export interface Listing {
  id: number;
  seller_id: number;
  category_id: number;
  title: string;
  description: string;
  price: number | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: number | null;
}

export interface ListingCard {
  id: number;
  title: string;
  price: number | null;
  status: ListingStatus;
  description: string;
  category: { id: number; slug: string; label: string };
  tags: string[];
  images: ListingImage[];
  seller: { id: number; name: string; joined_at?: string };
  review_avg: number | null;
  review_count: number;
  created_at: string;
}

export interface ListingDetail {
  id: number;
  title: string;
  description: string;
  price: number | null;
  status: ListingStatus;
  category: { id: number; slug: string; label: string };
  tags: string[];
  images: ListingImage[];
  seller: { id: number; name: string; joined_at: string };
  review_avg: number | null;
  review_count: number;
  created_at: string;
}


export interface Review {
  id: number;
  listing_id: number;
  author_id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Inquiry {
  id: number;
  listing_id: number;
  listing_title: string;
  counterparty_name: string;
  message: string;
  status: "sent" | "responded";
  created_at: string;
  direction: "received" | "sent";
}

// ---------------------------------------------------------------------------
// Social features
// ---------------------------------------------------------------------------

export interface FollowCounters {
  followers: number;
  following: number;
  isFollowing: boolean;
}

export interface Notification {
  id: number;
  type: 'inquiry_received' | 'inquiry_responded' | 'review' | 'follow' | 'like';
  actor_id: number;
  actor_name: string;
  actor_avatar?: string;
  entity_type?: string;
  entity_id?: number;
  listing_title?: string;
  review_comment?: string;
  is_read: 0 | 1;
  created_at: string;
}

export interface FeedItem {
  id: number;
  type: 'listing' | 'review' | 'follow' | 'inquiry';
  actor: { id: number; name: string };
  title?: string;
  description?: string;
  category?: { label: string };
  price?: number | null;
  review_avg?: number | null;
  review_count?: number;
  comment?: string;
  listing_id?: number;
  is_own: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Social features
// ---------------------------------------------------------------------------

export interface Follow {
  follower_id: number;
  following_id: number;
  created_at: string;
}

export interface Bookmark {
  user_id: number;
  listing_id: number;
  created_at: string;
}

export type NotificationType = 'inquiry_received' | 'inquiry_responded' | 'review' | 'follow' | 'like';

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  actor_id: number;
  actor_name: string;
  entity_type?: string;
  entity_id?: number;
  listing_title?: string;
  review_comment?: string;
  is_read: 0 | 1;
  created_at: string;
}

// Feed items derived from various activities
export interface FeedItem {
  id: number;
  type: 'listing' | 'review' | 'follow' | 'inquiry';
  actor: { id: number; name: string };
  title?: string;
  description?: string;
  category?: { label: string };
  price?: number | null;
  review_avg?: number | null;
  review_count?: number;
  comment?: string;
  is_own: boolean;
  created_at: string;
}
