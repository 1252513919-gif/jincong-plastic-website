import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { getEmailDomain, isValidEmail } from "@/features/lead-dev/lib/email-validation";
import { prisma } from "@/features/lead-dev/lib/prisma";

export async function POST(request: Request) {
  return withLeadDevApi(async () => {
    const payload = (await request.json().catch(() => null)) as { value?: string; type?: "EMAIL" | "DOMAIN"; reason?: "UNSUBSCRIBE" | "REJECTED" | "BOUNCED" | "MANUAL" } | null;
    const raw = String(payload?.value ?? "").trim().toLowerCase();
    if (!raw) return jsonError("缺少邮箱或域名");
    const type = payload?.type || (isValidEmail(raw) ? "EMAIL" : "DOMAIN");
    const value = type === "EMAIL" ? raw : raw.replace(/^@/, "");
    if (type === "EMAIL" && !isValidEmail(value)) return jsonError("邮箱格式不正确");
    if (type === "DOMAIN" && !getEmailDomain(`x@${value}`)) return jsonError("域名格式不正确");
    await prisma.suppressionList.upsert({
      where: { type_value: { type, value } },
      update: { reason: payload?.reason || "MANUAL" },
      create: { type, value, reason: payload?.reason || "MANUAL" }
    });
    return Response.json({ success: true });
  });
}
