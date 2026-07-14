import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";

const methods = ["EMAIL", "PHONE", "WECHAT", "VISIT", "OTHER"] as const;

type Payload = {
  method?: string;
  scheduledAt?: string;
  note?: string;
  nextAction?: string;
};

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return withLeadDevApi(async () => {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => null)) as Payload | null;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return jsonError("客户不存在", 404);

    const method = normalizeMethod(payload?.method);
    if (!method) return jsonError("跟进方式不正确");

    const scheduledAt = parseOptionalDate(payload?.scheduledAt);
    if (scheduledAt === "INVALID") return jsonError("计划跟进时间不正确");

    const note = emptyToNull(payload?.note);
    const nextAction = emptyToNull(payload?.nextAction);

    const record = await prisma.$transaction(async (tx) => {
      const created = await tx.followUpRecord.create({
        data: {
          leadId: id,
          method,
          status: "PLANNED",
          scheduledAt,
          note,
          nextAction
        }
      });
      await tx.lead.update({
        where: { id },
        data: {
          followUpAt: scheduledAt,
          followUpMethod: methodLabel(method),
          followUpStatus: "待跟进",
          followUpNote: note || nextAction
        }
      });
      return created;
    });

    return Response.json({ success: true, message: "跟进记录已创建", recordId: record.id });
  });
}

function normalizeMethod(value: string | undefined) {
  const upper = (value || "EMAIL").toUpperCase();
  return methods.includes(upper as (typeof methods)[number]) ? (upper as (typeof methods)[number]) : null;
}

function parseOptionalDate(value: string | undefined) {
  if (!value?.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "INVALID" : date;
}

function emptyToNull(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function methodLabel(method: (typeof methods)[number]) {
  return {
    EMAIL: "邮件",
    PHONE: "电话",
    WECHAT: "微信",
    VISIT: "拜访",
    OTHER: "其他"
  }[method];
}
