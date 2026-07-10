import { NextResponse } from "next/server";
import { sessionCookieOptions } from "@/features/lead-dev/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("lead_dev_session", "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
