import { getEmailDomain } from "@/features/lead-dev/lib/email-validation";
import { canApproveDraft } from "@/features/lead-dev/lib/sending-rules";
import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";

const REVIEW_TERMINAL_STATUSES = ["SENT", "REJECTED", "FAILED", "CANCELLED"];

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
      if (REVIEW_TERMINAL_STATUSES.includes(draft.status)) return jsonError("当前状态不能再次审核");
      if (draft.status !== "PENDING_REVIEW") return jsonError("只有待审核草稿可以批准");

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
      const approved = await prisma.emailDraft.updateMany({
        where: { id, status: "PENDING_REVIEW" },
        data: { status: "APPROVED", approvedAt: new Date() }
      });
      if (approved.count !== 1) return jsonError("草稿状态已变化，请刷新后重试");
      return Response.json({ success: true, message: "草稿已批准，等待发送" });
    }

    if (payload?.action === "reject") {
      if (REVIEW_TERMINAL_STATUSES.includes(draft.status)) return jsonError("当前状态不能再次审核");
      if (draft.status !== "PENDING_REVIEW") return jsonError("只有待审核草稿可以拒绝");
      const rejected = await prisma.emailDraft.updateMany({
        where: { id, status: "PENDING_REVIEW" },
        data: { status: "REJECTED" }
      });
      if (rejected.count !== 1) return jsonError("草稿状态已变化，请刷新后重试");
      return Response.json({ success: true, message: "草稿已拒绝" });
    }

    if (payload?.action === "cancel") {
      await prisma.emailDraft.update({ where: { id }, data: { status: "CANCELLED" } });
      return Response.json({ success: true, message: "草稿已取消" });
    }

    return jsonError("未知操作");
  });
}
