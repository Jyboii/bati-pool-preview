import { headers } from "next/headers";
import { ArrowUpRight } from "lucide-react";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { quotes, reviews } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { getGalleryItems } from "@/lib/site-data";
import AdminLogin from "./admin-login";
import AdminPanel, { Logout } from "./admin-panel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administration | Bâti Pool", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const requestHeaders = await headers();
  const authenticated = await isAdmin(requestHeaders.get("cookie"));
  if (!authenticated) return <div className="admin-shell"><header className="admin-header"><a href="/">BÂTI<span>’POOL</span></a><nav><a href="/">Retour au site</a></nav></header><AdminLogin /></div>;
  const [quoteRows, reviewRows, photos] = await Promise.all([
    getDb().select().from(quotes).orderBy(desc(quotes.createdAt)).limit(100),
    getDb().select().from(reviews).orderBy(desc(reviews.createdAt)).limit(100),
    getGalleryItems(),
  ]);
  return <div className="admin-shell"><header className="admin-header"><a href="/">BÂTI<span>’POOL</span></a><nav><a className="admin-site-link" href="/">Voir le site <ArrowUpRight size={16} aria-hidden="true" /></a><Logout /></nav></header><AdminPanel quotes={quoteRows} reviews={reviewRows} photos={photos} /></div>;
}
