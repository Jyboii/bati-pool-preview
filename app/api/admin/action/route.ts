import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { gallery, quotes, reviews } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { DEFAULT_GALLERY, sameOrigin } from "@/lib/site-data";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Requête refusée." }, { status: 403 });
  if (!(await isAdmin(request.headers.get("cookie")))) return Response.json({ error: "Accès refusé." }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Action invalide." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (body.kind === "quote" && /^[0-9a-f-]{36}$/.test(id) && ["nouveau", "contacté", "clos"].includes(status)) {
    await getDb().update(quotes).set({ status }).where(eq(quotes.id, id));
    return Response.json({ ok: true });
  }
  if (body.kind === "quote" && body.action === "delete" && /^[0-9a-f-]{36}$/.test(id)) {
    await getDb().delete(quotes).where(eq(quotes.id, id));
    return Response.json({ ok: true });
  }
  if (body.kind === "review" && /^[0-9a-f-]{36}$/.test(id) && ["approved", "rejected"].includes(status)) {
    await getDb().update(reviews).set({ status }).where(eq(reviews.id, id));
    return Response.json({ ok: true });
  }
  if (body.kind === "review" && body.action === "delete" && /^[0-9a-f-]{36}$/.test(id)) {
    await getDb().delete(reviews).where(eq(reviews.id, id));
    return Response.json({ ok: true });
  }
  if (body.kind === "photo" && body.action === "reset" && typeof body.slot === "string" && DEFAULT_GALLERY.some((item) => item.slot === body.slot)) {
    const slot = body.slot;
    await getDb().delete(gallery).where(eq(gallery.slot, slot));
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Action invalide." }, { status: 400 });
}
