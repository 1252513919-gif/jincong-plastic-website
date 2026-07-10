import { getEmailDomain } from "@/features/lead-dev/lib/email-validation";
import { canApproveDraft } from "@/features/lead-dev/lib/sending-rules";
import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return withLeadDevApi(async () => {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => null)) as { action?: string; subject?: string; body?: string } | null;
    const draft = await prisma.emailDraft.findUnique({ where: { id }, include: { lead: true } });
    if (!draft) return jsonError("草稿不存在", 404);

    if (payload?.action === "submitReview") {
      await prisma.emailDraft.update({
        where: { id },
        data: { status: "PENDING_REVIEW", subject: payload.subject || draft.subject, body: payload.body || draft.body }
      });
      return Response.json({ success: true, message: "已提交待审核" });
    }

    if (payload?.action === "approve") {
      const domain = getEmailDomain(draft.recipient);
      const suppressed = await prisma.suppressionList.findFirst({
        where: {
          OR: [
            { type: "EMAIL", value: draft.recipient.toLowerCase() },
            ...(domain ? [{ type: "DOMAIN" as const, value: domain }] : [])
          ]
        }
      });
      const approval = canApproveDraft({
        recipient: draft.recipient,
        contactVerificationStatus: draft.lead.contactVerificationStatus,
        contactSourceUrl: draft.lead.contactSourceUrl,
        suppressed: Boolean(suppressed)
      });
      if (!approval.ok) return jsonError(approval.reason || "不能批准");
      if (!["PENDING_REVIEW", "DRAFT", "FAILED"].includes(draft.status)) return jsonError("当前状态不能批准");
      await prisma.emailDraft.update({
        where: { id },
        data: { status: "APPROVED", approvedAt: new Date() }
      });
      return Response.json({ success: true, message: "草稿已批准，等待发送" });
    }

    if (payload?.action === "reject") {
      await prisma.emailDraft.update({ where: { id }, data: { status: "REJECTED" } });
      return Response.json({ success: true, message: "草稿已拒绝" });
    }

    if (payload?.action === "cancel") {
      await prisma.emailDraft.update({ where: { id }, data: { status: "CANCELLED" } });
      return Response.json({ success: true, message: "草稿已取消" });
    }

    return jsonError("未知操作");
  });
}
