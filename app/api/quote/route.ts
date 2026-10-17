import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { quotes } from "@/db/schema";
import { cleanText, rateLimit, sameOrigin, SERVICE_OPTIONS } from "@/lib/site-data";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Requête refusée." }, { status: 403 });
  if (await rateLimit(request, "quote", 5, 3600)) return Response.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Formulaire invalide." }, { status: 400 });
  }
  if (body.website) return Response.json({ ok: true });

  const name = cleanText(body.name, 100);
  const city = cleanText(body.city, 100);
  const service = cleanText(body.service, 100);
  const details = cleanText(body.details, 2000);
  const email = cleanText(body.email, 180).toLowerCase();
  const phone = cleanText(body.phone, 40);
  if (
    name.length < 2 || city.length < 2 || details.length < 8 ||
    !SERVICE_OPTIONS.some((option) => option === service) ||
    (!email && !phone) ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    (phone && !/^[+\d\s().-]{7,40}$/.test(phone))
  ) return Response.json({ error: "Vérifiez les informations saisies." }, { status: 400 });

  const id = crypto.randomUUID();
  try {
    await getDb().insert(quotes).values({ id, createdAt: Date.now(), name, email: email || null, phone: phone || null, city, service, details });
  } catch {
    return Response.json({ error: "La demande n'a pas pu être enregistrée. Réessayez." }, { status: 500 });
  }

  if (env.RESEND_API_KEY && env.RESEND_FROM_EMAIL) {
    try {
      const alertResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": id,
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL,
          to: ["carpereira76@gmail.com"],
          subject: `Nouvelle demande de devis Bâti Pool — ${service}`,
          text: `Nom : ${name}\nVille : ${city}\nService : ${service}\nEmail : ${email || "Non renseigné"}\nTéléphone : ${phone || "Non renseigné"}\n\nProjet :\n${details}\n\nRéférence : ${id}`,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (!alertResponse.ok) console.warn("Alerte email non envoyée", alertResponse.status);
    } catch {
      // The quote is already saved and remains available in the admin area.
    }
  }

  return Response.json({ ok: true, id }, { status: 201 });
}
