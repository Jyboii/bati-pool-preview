import { desc, eq, sql } from "drizzle-orm";
import { getDb, hasDbConfig } from "@/db";
import { gallery, rateLimits, reviews } from "@/db/schema";
export { SERVICE_OPTIONS } from "./services";

export const DEFAULT_GALLERY = [
  {
    slot: "terrasse",
    src: "/piscine-terrasse.jpg",
    alt: "Piscine extérieure et plage en dalles réalisée par Bâti Pool",
    title: "Piscine & terrasse",
    label: "Piscine extérieure",
  },
  {
    slot: "jardin",
    src: "/piscine-jardin.jpg",
    alt: "Piscine extérieure aménagée dans un jardin par Bâti Pool",
    title: "Un bassin dans le jardin",
    label: "Piscine extérieure",
  },
  {
    slot: "interieure",
    src: "/piscine-interieure.jpg",
    alt: "Piscine intérieure et espace sauna réalisés par Bâti Pool",
    title: "Un espace intérieur",
    label: "Piscine intérieure",
  },
] as const;

export async function getGalleryItems() {
  const items = hasDbConfig() ? await getDb().select({ slot: gallery.slot, alt: gallery.alt, updatedAt: gallery.updatedAt }).from(gallery) : [];
  return DEFAULT_GALLERY.map((item) => {
    const override = items.find((entry) => entry.slot === item.slot);
    return {
      ...item,
      src: override ? `/api/media/${override.slot}?v=${override.updatedAt}` : item.src,
      alt: override?.alt || item.alt,
    };
  });
}

export async function getPublishedReviews() {
  if (!hasDbConfig()) return [];
  return getDb()
    .select()
    .from(reviews)
    .where(eq(reviews.status, "approved"))
    .orderBy(desc(reviews.createdAt))
    .limit(6);
}

export async function getPublishedReviewStats() {
  if (!hasDbConfig()) return { count: 0, averageRating: 0 };
  const [row] = await getDb().select({
    count: sql<number>`count(*)`,
    averageRating: sql<number | null>`avg(${reviews.rating})`,
  }).from(reviews).where(eq(reviews.status, "approved"));
  return { count: Number(row?.count || 0), averageRating: Number(row?.averageRating || 0) };
}

export function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

export async function rateLimit(request: Request, kind: string, maximum: number, windowSeconds: number) {
  if (!hasDbConfig()) return false;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${process.env.ADMIN_SESSION_SECRET || "local"}:${ip}`),
  );
  const key = `${kind}:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  const now = Math.floor(Date.now() / 1000);
  const expires = now + windowSeconds;
  await getDb().insert(rateLimits).values({ key, count: 1, expiresAt: expires })
    .onDuplicateKeyUpdate({
      set: {
        count: sql`IF(${rateLimits.expiresAt} < ${now}, 1, ${rateLimits.count} + 1)`,
        expiresAt: sql`IF(${rateLimits.expiresAt} < ${now}, ${expires}, ${rateLimits.expiresAt})`,
      },
    });
  const [row] = await getDb().select({ count: rateLimits.count }).from(rateLimits).where(eq(rateLimits.key, key));
  return Number(row?.count || 0) > maximum;
}
