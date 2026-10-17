import { clearAdminCookie } from "@/lib/admin-auth";
import { sameOrigin } from "@/lib/site-data";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Requête refusée." }, { status: 403 });
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearAdminCookie(request) } });
}
