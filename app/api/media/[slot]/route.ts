import { eq } from "drizzle-orm";
import { getDb, hasDbConfig } from "@/db";
import { gallery } from "@/db/schema";
import { DEFAULT_GALLERY } from "@/lib/site-data";

export async function GET(_request: Request, context: { params: Promise<{ slot: string }> }) {
  const { slot } = await context.params;
  if (!DEFAULT_GALLERY.some((item) => item.slot === slot)) return new Response("Introuvable", { status: 404 });
  if (!hasDbConfig()) return new Response("Stockage indisponible", { status: 503 });
  const [image] = await getDb().select({ imageData: gallery.imageData, mimeType: gallery.mimeType })
    .from(gallery).where(eq(gallery.slot, slot)).limit(1);
  if (!image) return new Response("Introuvable", { status: 404 });
  return new Response(Buffer.from(image.imageData, "base64"), {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
