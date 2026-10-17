import { env } from "cloudflare:workers";

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params;
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp|avif)$/.test(key) || !env.BUCKET) return new Response("Introuvable", { status: 404 });
  const object = await env.BUCKET.get(key);
  if (!object) return new Response("Introuvable", { status: 404 });
  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
