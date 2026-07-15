import { NextRequest, NextResponse } from "next/server";

const cookieName = "lead_dev_session";
const crmHost = "crm.jincongplastic.com";
const publicHosts = new Set(["www.jincongplastic.com", "jincongplastic.com"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = normalizeHost(request.headers.get("host"));
  const isLeadDevPage = pathname === "/lead-dev" || pathname.startsWith("/lead-dev/");
  const isLeadDevApi = pathname.startsWith("/api/lead-dev/");
  const isCrmHost = host === crmHost;
  const shouldEnforcePublicIsolation = process.env.CRM_HOST_ENFORCEMENT === "true";

  if (isCrmHost && pathname === "/") {
    const valid = await verifySession(request.cookies.get(cookieName)?.value);
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = valid ? "/lead-dev" : "/lead-dev/login";
    targetUrl.search = "";
    return withNoIndex(NextResponse.redirect(targetUrl));
  }

  if (isCrmHost && !isLeadDevPage && !isLeadDevApi) {
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = "/lead-dev/login";
    targetUrl.search = "";
    return withNoIndex(NextResponse.redirect(targetUrl));
  }

  if (shouldEnforcePublicIsolation && publicHosts.has(host) && (isLeadDevPage || isLeadDevApi)) {
    return withNoIndex(new NextResponse("Not Found", { status: 404 }));
  }

  if (!isLeadDevPage && !isLeadDevApi) return NextResponse.next();
  if (pathname === "/api/lead-dev/auth/login") return NextResponse.next();

  const valid = await verifySession(request.cookies.get(cookieName)?.value);
  if (pathname === "/lead-dev/login") {
    if (!valid) return withNoIndex(NextResponse.next());
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/lead-dev";
    dashboardUrl.search = "";
    return withNoIndex(NextResponse.redirect(dashboardUrl));
  }

  if (valid) return withNoIndex(NextResponse.next());

  if (isLeadDevApi) {
    return withNoIndex(NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }));
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/lead-dev/login";
  loginUrl.searchParams.set("next", pathname);
  return withNoIndex(NextResponse.redirect(loginUrl));
}

export const config = {
  matcher: ["/", "/lead-dev/:path*", "/api/lead-dev/:path*", "/((?!_next/static|_next/image|favicon.ico|images|templates|.*\\..*).*)"]
};

async function verifySession(value: string | undefined) {
  if (!value) return false;
  const secret = normalizeEnvValue(process.env.LEAD_DEV_SESSION_SECRET);
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

function normalizeHost(value: string | null) {
  return (value ?? "").split(":")[0].toLowerCase();
}

function normalizeEnvValue(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === `"` && last === `"`) || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1).trim();
    }
  }
  return trimmed;
}

function withNoIndex(response: NextResponse) {
  response.headers.set("x-robots-tag", "noindex, nofollow");
  return response;
}
