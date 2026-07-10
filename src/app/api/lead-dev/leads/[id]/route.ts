import { getEmailDomain } from "@/features/lead-dev/lib/email-validation";
import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return withLeadDevApi(async () => {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => null)) as { action?: string; contactSourceUrl?: string } | null;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return jsonError("客户不存在", 404);

    if (payload?.action === "verifyContact") {
      if (!lead.publicEmail) return jsonError("没有公开邮箱，不能标记 VERIFIED");
      if (!payload.contactSourceUrl?.trim()) return jsonError("必须填写联系方式来源 URL");
      await prisma.lead.update({
        where: { id },
        data: {
          contactVerificationStatus: "VERIFIED",
          contactSourceUrl: payload.contactSourceUrl.trim(),
          contactVerifiedAt: new Date()
        }
      });
      return Response.json({ success: true, message: "联系方式已标记 VERIFIED" });
    }

    if (payload?.action === "doNotContact") {
      await prisma.lead.update({
        where: { id },
        data: { status: "DO_NOT_CONTACT", doNotContactReason: "手动设为不再联系" }
      });
      if (lead.publicEmail) {
        await prisma.suppressionList.upsert({
          where: { type_value: { type: "EMAIL", value: lead.publicEmail.toLowerCase() } },
          update: {},
          create: { type: "EMAIL", value: lead.publicEmail.toLowerCase(), reason: "MANUAL", sourceLeadId: id }
        });
        const domain = getEmailDomain(lead.publicEmail);
        if (domain) {
          await prisma.suppressionList.upsert({
            where: { type_value: { type: "DOMAIN", value: domain } },
            update: {},
            create: { type: "DOMAIN", value: domain, reason: "MANUAL", sourceLeadId: id }
          });
        }
      }
      return Response.json({ success: true, message: "已加入不再联系" });
    }

    return jsonError("未知操作");
  });
}
