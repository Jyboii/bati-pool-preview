import { getDb } from "@/db";
import { reviews } from "@/db/schema";
import { cleanText, rateLimit, sameOrigin } from "@/lib/site-data";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Requête refusée." }, { status: 403 });
  if (await rateLimit(request, "review", 3, 3600)) return Response.json({ error: "Réessayez plus tard." }, { status: 429 });
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Formulaire invalide." }, { status: 400 });
  }
  if (body.website) return Response.json({ ok: true });
  const author = cleanText(body.author, 80);
  const city = cleanText(body.city, 80);
  const message = cleanText(body.message, 1200);
  const rating = Number(body.rating);
  if (author.length < 2 || message.length < 12 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Vérifiez votre avis avant l'envoi." }, { status: 400 });
  }
  try {
    await getDb().insert(reviews).values({ id: crypto.randomUUID(), createdAt: Date.now(), author, city: city || null, rating, message });
  } catch {
    return Response.json({ error: "L'avis n'a pas pu être enregistré." }, { status: 500 });
  }
  return Response.json({ ok: true }, { status: 201 });
}
