import type { MetadataRoute } from "next";
import { cities } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!process.env.SITE_PUBLIC_URL) return [];
  const base = process.env.SITE_PUBLIC_URL.replace(/\/$/, "");
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...cities.map((city) => ({ url: `${base}/${city.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...cities.map((city) => ({ url: `${base}/${city.buildingSlug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${base}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
