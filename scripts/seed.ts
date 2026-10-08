// Seeds demo data: 1 admin, 2 sellers, 2 buyers, listings in each status, reviews, inquiries.
// Run: npx tsx scripts/seed.ts  (idempotent)
import { getDb } from "../src/lib/db";
import bcrypt from "bcryptjs";

const db = getDb();
const hash = (pw: string) => bcrypt.hashSync(pw, 12);

const users: Array<[string, string, string, "user" | "admin"]> = [
  ["Admin", "admin@capstone.test", "admin123", "admin"],
  ["Alice Seller", "alice@capstone.test", "password123", "user"],
  ["Bob Seller", "bob@capstone.test", "password123", "user"],
  ["Carol Buyer", "carol@capstone.test", "password123", "user"],
  ["Dave Buyer", "dave@capstone.test", "password123", "user"],
];

const ids = new Map<string, number>();
for (const [name, email, pw, role] of users) {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: number } | undefined;
  if (existing) {
    ids.set(email, existing.id);
    continue;
  }
  const res = db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(name, email, hash(pw), role);
  ids.set(email, Number(res.lastInsertRowid));
}

const cat = (slug: string) => (db.prepare("SELECT id FROM categories WHERE slug = ?").get(slug) as { id: number }).id;

const LISTINGS: Array<[string, string, string, number | null, "pending" | "approved" | "rejected" | "sold", string[]]> = [
  ["EduTrack Student Management", "A full-stack web app for schools to manage students, grades, attendance and parent notifications. Built with Next.js, Postgres and Tailwind. Includes role-based dashboards and CSV import.", "web-app", 299, "approved", ["nextjs", "postgres", "tailwind"]],
  ["BudgetBuddy Expense Tracker", "Mobile app that tracks expenses, splits bills with friends and shows spending trends. React Native with a Node API. Offline-first with sync.", "mobile-app", 149, "approved", ["react-native", "node", "offline-first"]],
  ["EduTrack Student Management", "A full-stack web app for schools to manage students, grades, attendance and parent notifications.", "web-app", 249, "pending", ["nextjs"]],
  ["PlantPal IoT Watering System", "Raspberry Pi + sensors that water plants automatically and report moisture levels to a web dashboard. Includes hardware schematics and firmware.", "iot-embedded", null, "approved", ["raspberry-pi", "python", "iot"]],
  ["Image Caption Generator", "Machine learning capstone that generates captions for images using a CNN + LSTM. Trained on Flickr8k, includes Jupyter notebooks and a demo web UI.", "ml-ai", 399, "approved", ["python", "tensorflow", "ml"]],
  ["ChessMatch Online", "Realtime chess with matchmaking, ELO ratings and chat. Node + Socket.IO backend, vanilla JS frontend. Great for showcasing WebSockets.", "game", 199, "rejected", ["node", "socket.io", "javascript"]],
  ["RentFlow Property Management", "Web platform for landlords: tenants, leases, rent collection reminders and maintenance tickets. Full CRUD with an admin dashboard.", "web-app", 349, "sold", ["react", "django", "sqlite"]],
];

for (const [title, desc, slug, price, status, tags] of LISTINGS) {
  const sellerEmail = status === "pending" ? "bob@capstone.test" : status === "rejected" ? "bob@capstone.test" : "alice@capstone.test";
  const existing = db.prepare("SELECT id FROM listings WHERE title = ? AND seller_id = ?").get(title, ids.get(sellerEmail)!) as { id: number } | undefined;
  if (existing) continue;
  const approved_at = status === "approved" || status === "sold" ? new Date().toISOString() : null;
  const approved_by = status === "approved" || status === "sold" ? ids.get("admin@capstone.test") : null;
  const res = db
    .prepare(
      "INSERT INTO listings (seller_id, category_id, title, description, price, status, approved_at, approved_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(ids.get(sellerEmail)!, cat(slug), title, desc, price, status, approved_at, approved_by);
  const listingId = Number(res.lastInsertRowid);
  const insertTag = db.prepare("INSERT OR IGNORE INTO listing_tags (listing_id, tag) VALUES (?, ?)");
  for (const t of tags) insertTag.run(listingId, t.toLowerCase());
}

// Reviews on approved/sold listings by buyers.
const reviewSeed: Array<[number, string, number, string]> = [
  [1, "carol@capstone.test", 5, "Great project, well documented and easy to understand."],
  [1, "dave@capstone.test", 4, "Solid codebase. The CSV import was a nice touch."],
  [4, "carol@capstone.test", 5, "Loved the hardware schematics, very complete."],
  [5, "dave@capstone.test", 4, "Good ML pipeline, notebook is well organized."],
  [7, "carol@capstone.test", 5, "Smooth purchase, seller was responsive."],
];
const insertReview = db.prepare("INSERT OR IGNORE INTO reviews (listing_id, author_id, rating, comment) VALUES (?, ?, ?, ?)");
for (const [listingId, authorEmail, rating, comment] of reviewSeed) {
  insertReview.run(listingId, ids.get(authorEmail)!, rating, comment);
}

// A couple inquiries (buyer -> alice's approved listings).
const inq = db.prepare("INSERT OR IGNORE INTO inquiries (listing_id, buyer_id, message, status) VALUES (?, ?, ?, ?)");
inq.run(1, ids.get("carol@capstone.test")!, "Hi! Is this still available? I'm interested in the Next.js stack.", "sent");
inq.run(4, ids.get("dave@capstone.test")!, "Does this include the 3D printed enclosure files?", "responded");
inq.run(5, ids.get("carol@capstone.test")!, "Can you share the training notebook?", "sent");

// Flag a review for admin demo.
const flag = db.prepare("INSERT OR IGNORE INTO review_flags (review_id, flagger_id, reason) VALUES (?, ?, ?)");
const firstReview = db.prepare("SELECT id FROM reviews WHERE rating = 4 AND comment LIKE '%CSV%'").get() as { id: number } | undefined;
if (firstReview) flag.run(firstReview.id, ids.get("dave@capstone.test")!, "Feels like a generic AI-generated review.");

// System Screenshots Seed
const insertImage = db.prepare("INSERT OR IGNORE INTO listing_images (listing_id, image_url, caption, sort_order) VALUES (?, ?, ?, ?)");
const sampleImages: Array<[number, string, string, number]> = [
  [1, "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", "Student Performance & Analytics Dashboard", 0],
  [1, "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", "Classroom Attendance & Gradebook Module", 1],
  [1, "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80", "Parent Portal & Automated Notification Settings", 2],
  [2, "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80", "Mobile Expense Log & Category Breakdown", 0],
  [2, "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80", "Bill Splitting & Friend Group Balance Sheet", 1],
  [3, "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", "EduTrack System UI Overview", 0],
  [4, "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", "Live Soil Moisture Telemetry & Dashboard", 0],
  [4, "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80", "Raspberry Pi Hardware Schematics & Wiring Diagram", 1],
  [5, "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80", "CNN + LSTM Model Architecture & Web Interface", 0],
  [5, "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80", "Training Loss Curves & Epoch Validation Notebook", 1],
  [6, "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80", "Interactive Real-time Board & Matchmaking Room", 0],
  [7, "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80", "Tenant Lease Tracker & Payment Collection Board", 0],
  [7, "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80", "Maintenance Ticket Pipeline & Admin Controls", 1],
];

for (const [listingId, imgUrl, caption, sortOrder] of sampleImages) {
  insertImage.run(listingId, imgUrl, caption, sortOrder);
}

console.log("Seed complete.");
console.log("  admin:    admin@capstone.test / admin123");
console.log("  alice:    alice@capstone.test / password123  (seller)");
console.log("  bob:      bob@capstone.test / password123    (seller)");
console.log("  carol:    carol@capstone.test / password123  (buyer)");
console.log("  dave:     dave@capstone.test / password123   (buyer)");

