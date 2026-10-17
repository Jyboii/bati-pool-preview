import { env } from "cloudflare:workers";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const publicUrl = env.SITE_PUBLIC_URL;
  if (!publicUrl) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }], sitemap: `${publicUrl.replace(/\/$/, "")}/sitemap.xml` };
}
