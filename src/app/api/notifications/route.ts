import { requireUser } from "@/lib/auth";
import { getNotifications } from "@/lib/queries";

export async function GET() {
  try {
    const user = await requireUser();
    const notifications = getNotifications(user.id, 30);
    return Response.json(notifications);
  } catch {
    return Response.json([], { status: 401 });
  }
}

export async function POST() {
  try {
    const user = await requireUser();
    import("@/lib/actions").then((m) => m.markNotificationsReadAction(null, new FormData()));
  } catch {}
  return Response.json({ ok: true });
}
