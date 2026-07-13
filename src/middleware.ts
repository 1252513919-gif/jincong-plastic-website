import { NextRequest, NextResponse } from "next/server";

const cookieName = "lead_dev_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLeadDevPage = pathname === "/lead-dev" || pathname.startsWith("/lead-dev/");
  const isLeadDevApi = pathname.startsWith("/api/lead-dev/");

  if (!isLeadDevPage && !isLeadDevApi) return NextResponse.next();
  if (pathname === "/api/lead-dev/auth/login") return NextResponse.next();

  const valid = await verifySession(request.cookies.get(cookieName)?.value);
  if (pathname === "/lead-dev/login") {
    if (!valid) return NextResponse.next();
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/lead-dev";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  if (valid) return NextResponse.next();

  if (isLeadDevApi) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/lead-dev/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/lead-dev/:path*", "/api/lead-dev/:path*"]
};

async function verifySession(value: string | undefined) {
  if (!value) return false;
  const secret = process.env.LEAD_DEV_SESSION_SECRET;
  if (!secret) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = await sign(payload, secret);
  if (signature !== expected) return false;

  try {
    const session = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) as { exp?: number };
    return typeof session.exp === "number" && session.exp >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
