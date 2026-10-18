import { getDb } from "@/db";
import { gallery } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { cleanText, DEFAULT_GALLERY, sameOrigin } from "@/lib/site-data";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Requête refusée." }, { status: 403 });
  if (!(await isAdmin(request.headers.get("cookie")))) return Response.json({ error: "Accès refusé." }, { status: 401 });
  const form = await request.formData();
  const slot = form.get("slot");
  const file = form.get("file");
  const alt = cleanText(form.get("alt"), 180);
  if (typeof slot !== "string" || !DEFAULT_GALLERY.some((item) => item.slot === slot) || !(file instanceof File) || !IMAGE_TYPES.includes(file.type) || file.size > 1_000_000 || file.size < 100 || alt.length < 10) {
    return Response.json({ error: "Choisissez une image JPG, PNG, WebP ou AVIF de moins de 1 Mo et renseignez sa description." }, { status: 400 });
  }
  const imageData = Buffer.from(await file.arrayBuffer()).toString("base64");
  const updatedAt = Date.now();
  try {
    await getDb().insert(gallery).values({ slot, imageData, mimeType: file.type, alt, updatedAt })
      .onDuplicateKeyUpdate({ set: { imageData, mimeType: file.type, alt, updatedAt } });
  } catch {
    return Response.json({ error: "La photo n'a pas pu être enregistrée." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
