import { env } from "cloudflare:workers";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!env.SITE_PUBLIC_URL) return [];
  const base = env.SITE_PUBLIC_URL.replace(/\/$/, "");
  return [{ url: base, changeFrequency: "monthly", priority: 1 }, { url: `${base}/confidentialite`, changeFrequency: "yearly", priority: 0.2 }];
}
