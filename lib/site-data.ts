import { env } from "cloudflare:workers";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { gallery, reviews } from "@/db/schema";
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
  const items = env.DB ? await getDb().select().from(gallery) : [];
  return DEFAULT_GALLERY.map((item) => {
    const override = items.find((entry) => entry.slot === item.slot);
    return {
      ...item,
      src: override ? `/api/media/${encodeURIComponent(override.objectKey)}` : item.src,
      alt: override?.alt || item.alt,
    };
  });
}

export async function getPublishedReviews() {
  if (!env.DB) return [];
  return getDb()
    .select()
    .from(reviews)
    .where(eq(reviews.status, "approved"))
    .orderBy(desc(reviews.createdAt))
    .limit(6);
}

export async function getPublishedReviewStats() {
  if (!env.DB) return { count: 0, averageRating: 0 };
  const row = await env.DB.prepare("SELECT COUNT(*) AS count, AVG(rating) AS average_rating FROM reviews WHERE status = 'approved'")
    .first<{ count: number; average_rating: number | null }>();
  return { count: Number(row?.count || 0), averageRating: Number(row?.average_rating || 0) };
}

export function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

export async function rateLimit(request: Request, kind: string, maximum: number, windowSeconds: number) {
  if (!env.DB) return false;
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${env.ADMIN_SESSION_SECRET || "local"}:${ip}`),
  );
  const key = `${kind}:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  const now = Math.floor(Date.now() / 1000);
  const expires = now + windowSeconds;
  await env.DB.prepare(
    `INSERT INTO rate_limits (key, count, expires_at) VALUES (?, 1, ?)
     ON CONFLICT(key) DO UPDATE SET
     count = CASE WHEN expires_at < ? THEN 1 ELSE count + 1 END,
     expires_at = CASE WHEN expires_at < ? THEN excluded.expires_at ELSE expires_at END`,
  ).bind(key, expires, now, now).run();
  const row = await env.DB.prepare("SELECT count FROM rate_limits WHERE key = ?").bind(key).first<{ count: number }>();
  return Number(row?.count || 0) > maximum;
}
