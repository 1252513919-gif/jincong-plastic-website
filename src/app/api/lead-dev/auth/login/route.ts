import { NextResponse } from "next/server";
import {
  createSessionCookie,
  getAdminUsername,
  hasAdminPasswordConfigured,
  sessionCookieOptions,
  verifyPassword
} from "@/features/lead-dev/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = String(payload?.username ?? "").trim();
  const password = String(payload?.password ?? "");

  if (!hasAdminPasswordConfigured()) {
    return NextResponse.json({ success: false, error: "后台管理员环境变量尚未配置" }, { status: 503 });
  }

  const expectedUser = getAdminUsername();
  const expectedHash = process.env.LEAD_DEV_ADMIN_PASSWORD_HASH || "";
  const valid = username === expectedUser && (await verifyPassword(password, expectedHash));
  if (!valid) {
    return NextResponse.json({ success: false, error: "账号或密码错误" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("lead_dev_session", await createSessionCookie(username), sessionCookieOptions());
  return response;
}
