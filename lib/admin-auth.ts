const COOKIE_NAME = "bati_pool_admin";
const ONE_WEEK = 60 * 60 * 24 * 7;

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256(value: string) {
  return toHex(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

async function signature(payload: string) {
  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) return "";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))));
}

export async function validAdminCredentials(email: string, password: string) {
  if (!process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32 || !process.env.ADMIN_EMAIL) return false;
  const expectedEmail = process.env.ADMIN_EMAIL.toLowerCase();
  const actualHash = await sha256(password);
  return email.toLowerCase() === expectedEmail && constantTimeEqual(actualHash, process.env.ADMIN_PASSWORD_HASH);
}

export async function adminCookie(request: Request) {
  const expiry = Math.floor(Date.now() / 1000) + ONE_WEEK;
  const payload = String(expiry);
  const signed = await signature(payload);
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE_NAME}=${payload}.${signed}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${ONE_WEEK}${secure}`;
}

export function clearAdminCookie(request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`;
}

export async function isAdmin(cookieHeader: string | null) {
  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) return false;
  const token = cookieHeader?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!token) return false;
  const [expiry, signed] = token.split(".");
  if (!expiry || !signed || !/^\d+$/.test(expiry) || Number(expiry) < Date.now() / 1000) return false;
  return constantTimeEqual(await signature(expiry), signed);
}
