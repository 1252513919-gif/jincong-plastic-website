import { NextResponse } from "next/server";
import {
  createSessionCookie,
  getAdminPasswordHash,
  getAdminUsername,
  hasAdminPasswordConfigured,
  sessionCookieOptions,
  verifyPassword
} from "@/features/lead-dev/lib/auth";
import { checkLoginRateLimit, clearLoginRateLimit, recordFailedLogin } from "@/features/lead-dev/lib/login-rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rateLimitKey = getLoginRateLimitKey(request);
  const rateLimit = checkLoginRateLimit(rateLimitKey);
  if (!rateLimit.ok) {
    return NextResponse.json({ success: false, error: "登录尝试过多，请稍后再试" }, { status: 429 });
  }

  const payload = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = String(payload?.username ?? "").trim();
  const password = String(payload?.password ?? "");

  if (!hasAdminPasswordConfigured()) {
    return NextResponse.json({ success: false, error: "后台管理员环境变量尚未配置" }, { status: 503 });
  }

  const expectedUser = getAdminUsername();
  const expectedHash = getAdminPasswordHash();
  const valid = username === expectedUser && (await verifyPassword(password, expectedHash));
  if (!valid) {
    recordFailedLogin(rateLimitKey);
    return NextResponse.json({ success: false, error: "账号或密码错误" }, { status: 401 });
  }

  clearLoginRateLimit(rateLimitKey);
  const response = NextResponse.json({ success: true });
  response.cookies.set("lead_dev_session", await createSessionCookie(username), sessionCookieOptions());
  return response;
}

function getLoginRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "local";
}
