import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";

type Payload = {
  action?: string;
  note?: string;
  nextAction?: string;
};

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return withLeadDevApi(async () => {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => null)) as Payload | null;
    const record = await prisma.followUpRecord.findUnique({ where: { id }, include: { lead: true } });
    if (!record) return jsonError("跟进记录不存在", 404);

    if (payload?.action === "complete") {
      const now = new Date();
      await prisma.$transaction([
        prisma.followUpRecord.update({
          where: { id },
          data: {
            status: "COMPLETED",
            completedAt: now,
            note: emptyToNull(payload.note) ?? record.note,
            nextAction: emptyToNull(payload.nextAction) ?? record.nextAction
          }
        }),
        prisma.lead.update({
          where: { id: record.leadId },
          data: {
            lastContactedAt: now,
            hasFollowedUp: true,
            followUpStatus: "已完成",
            followUpNote: emptyToNull(payload.note) ?? record.note
          }
        })
      ]);
      return Response.json({ success: true, message: "跟进记录已完成" });
    }

    if (payload?.action === "cancel") {
      await prisma.$transaction([
        prisma.followUpRecord.update({
          where: { id },
          data: {
            status: "CANCELLED",
            note: emptyToNull(payload.note) ?? record.note,
            nextAction: emptyToNull(payload.nextAction) ?? record.nextAction
          }
        }),
        prisma.lead.update({
          where: { id: record.leadId },
          data: {
            followUpStatus: "已取消",
            followUpNote: emptyToNull(payload.note) ?? record.note
          }
        })
      ]);
      return Response.json({ success: true, message: "跟进记录已取消" });
    }

    return jsonError("未知跟进操作");
  });
}

function emptyToNull(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
