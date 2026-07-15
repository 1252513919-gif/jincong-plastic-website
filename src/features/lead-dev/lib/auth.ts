import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const leadDevSessionCookie = "lead_dev_session";

export type LeadDevSession = {
  username: string;
  exp: number;
};

export async function createSessionCookie(username: string) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  const payload = base64UrlEncode(JSON.stringify({ username, exp }));
  const signature = sign(payload, getSessionSecret());
  return `${payload}.${signature}`;
}

export function verifySessionCookie(value: string | undefined): LeadDevSession | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload, getSessionSecret());
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as LeadDevSession;
    if (!session.username || session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getLeadDevSession() {
  const cookieStore = await cookies();
  return verifySessionCookie(cookieStore.get(leadDevSessionCookie)?.value);
}

export async function requireLeadDevSession() {
  const session = await getLeadDevSession();
  if (!session) {
    throw new LeadDevAuthError();
  }
  return session;
}

export async function requireLeadDevApiSession() {
  try {
    return await requireLeadDevSession();
  } catch (error) {
    if (error instanceof LeadDevAuthError) {
      return null;
    }
    throw error;
  }
}

export function unauthorizedJson() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

export function getAdminUsername() {
  return normalizeCredentialEnvValue(process.env.LEAD_DEV_ADMIN_USERNAME) || "admin";
}

export function getAdminPasswordHash() {
  return normalizeCredentialEnvValue(process.env.LEAD_DEV_ADMIN_PASSWORD_HASH);
}

export function hasAdminPasswordConfigured() {
  return Boolean(getAdminPasswordHash() && getSessionSecret({ throwIfMissing: false }));
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [algorithm, iterationsRaw, salt, expected] = encodedHash.split("$");
  if (algorithm !== "pbkdf2_sha256" || !iterationsRaw || !salt || !expected) return false;
  const iterations = Number(iterationsRaw);
  const actual = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");
  return timingSafeEqual(actual, expected);
}

export function hashPassword(password: string) {
  const iterations = 120_000;
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");
  return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  };
}

export class LeadDevAuthError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

function getSessionSecret(options: { throwIfMissing: boolean } = { throwIfMissing: true }) {
  const secret = normalizeCredentialEnvValue(process.env.LEAD_DEV_SESSION_SECRET);
  if (!secret) {
    if (!options.throwIfMissing) return "";
    throw new Error("LEAD_DEV_SESSION_SECRET is not configured");
  }
  return secret;
}

function normalizeCredentialEnvValue(value: string | undefined) {
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

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function timingSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
