import { EmailDraftType } from "@prisma/client";
import { generateFirstTouchDraft } from "@/features/lead-dev/lib/draft-generator";
import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return withLeadDevApi(async () => {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => null)) as { type?: EmailDraftType } | null;
    const type = payload?.type || "FIRST_TOUCH";
    const lead = await prisma.lead.findUnique({ where: { id }, include: { drafts: true } });
    if (!lead) return jsonError("客户不存在", 404);
    if (!lead.publicEmail) return jsonError("缺少公开邮箱，不能生成邮件草稿");

    const latestVersion =
      lead.drafts.filter((draft) => draft.type === type).reduce((max, draft) => Math.max(max, draft.version), 0) + 1;
    const base = generateFirstTouchDraft({
      companyName: lead.companyName,
      productSummary: lead.productSummary,
      potentialPlasticParts: lead.potentialPlasticParts,
      website: process.env.COMPANY_WEBSITE || "https://www.jincongplastic.com"
    });

    await prisma.emailDraft.create({
      data: {
        leadId: id,
        type,
        recipient: lead.publicEmail,
        subject: type === "FOLLOW_UP" ? `跟进：${base.subject}` : base.subject,
        body: type === "FOLLOW_UP" ? `${base.body}\n\n此前邮件如未转达，也烦请协助转交相关负责人；如无需联系，回复“无需联系”即可。` : base.body,
        status: "DRAFT",
        version: latestVersion,
        idempotencyKey: `${base.idempotencyKey}-${type}-${latestVersion}`
      }
    });

    await prisma.lead.update({
      where: { id },
      data: { personalizationReason: base.personalizationReason }
    });

    return Response.json({ success: true, message: "邮件草稿已生成" });
  });
}
