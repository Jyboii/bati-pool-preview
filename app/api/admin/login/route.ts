import { adminCookie, validAdminCredentials } from "@/lib/admin-auth";
import { cleanText, rateLimit, sameOrigin } from "@/lib/site-data";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Requête refusée." }, { status: 403 });
  if (await rateLimit(request, "admin", 8, 900)) return Response.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Identifiants invalides." }, { status: 400 });
  }
  const email = cleanText(body.email, 180);
  const password = typeof body.password === "string" ? body.password : "";
  if (!(await validAdminCredentials(email, password))) {
    return Response.json({ error: "Identifiants invalides." }, { status: 401 });
  }
  return Response.json({ ok: true }, { headers: { "Set-Cookie": await adminCookie(request) } });
}
