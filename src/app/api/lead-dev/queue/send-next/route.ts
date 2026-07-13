import { EmailDraftType } from "@prisma/client";
import { getEmailDomain, isValidEmail } from "@/features/lead-dev/lib/email-validation";
import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";
import { sendLeadDevMail } from "@/features/lead-dev/lib/send-mail";
import { addWorkingDays, isWithinSendingWindow } from "@/features/lead-dev/lib/sending-rules";

export const runtime = "nodejs";

export async function POST() {
  return withLeadDevApi(async () => {
    const now = new Date();
    const setting = await prisma.systemSetting.upsert({
      where: { id: "lead-dev" },
      update: {},
      create: { id: "lead-dev", testMode: true }
    });

    if (setting.stopAllSending) return jsonError("已开启停止全部发送");
    if (setting.paused) return jsonError("发送已暂停");
    if (!isWithinSendingWindow(now, setting.timezone)) return jsonError("当前不在允许发送时间：周一至周五 09:00-17:30");
    if (setting.nextAllowedSendAt && now < setting.nextAllowedSendAt) return jsonError(`发送间隔未到，下次允许时间：${setting.nextAllowedSendAt.toLocaleString("zh-CN")}`);

    const sentToday = await prisma.emailLog.count({
      where: { status: "SENT", createdAt: { gte: startOfToday() } }
    });
    if (sentToday >= setting.dailySendLimit) return jsonError(`今日发送额度已用完：${setting.dailySendLimit}`);

    const draft = await prisma.emailDraft.findFirst({
      where: { status: "APPROVED" },
      orderBy: { approvedAt: "asc" },
      include: { lead: true }
    });
    if (!draft) return jsonError("没有已批准草稿");

    if (!isValidEmail(draft.recipient)) return jsonError("收件人邮箱格式不正确");
    if (draft.lead.contactVerificationStatus !== "VERIFIED") return jsonError("联系方式未 VERIFIED");
    if (["REPLIED", "BOUNCED", "REJECTED", "DO_NOT_CONTACT"].includes(draft.lead.status)) return jsonError("客户状态禁止发送");

    const domain = getEmailDomain(draft.recipient);
    const suppressed = await prisma.suppressionList.findFirst({
      where: {
        OR: [
          { type: "EMAIL", value: draft.recipient.toLowerCase() },
          ...(domain ? [{ type: "DOMAIN" as const, value: domain }] : [])
        ]
      }
    });
    if (suppressed) return jsonError("该邮箱或域名在拒绝联系名单中");

    const testModeEnabled = process.env.TEST_MODE !== "false";
    const previousSent = await prisma.emailLog.findFirst({
      where: testModeEnabled
        ? {
            status: "SENT",
            draftId: draft.id
          }
        : {
            status: "SENT",
            intendedRecipient: draft.recipient,
            type: draft.type
          }
    });
    if (previousSent) return jsonError("该邮箱同类型邮件已发送过，禁止重复发送");

    const claimed = await prisma.emailDraft.updateMany({
      where: { id: draft.id, status: "APPROVED" },
      data: { status: "SENDING" }
    });
    if (claimed.count !== 1) return jsonError("草稿已被其他请求处理，请刷新");

    try {
      const mail = await sendLeadDevMail({
        intendedRecipient: draft.recipient,
        subject: draft.subject,
        body: draft.body
      });
      const nextAllowedSendAt = minutesFromNow(randomInt(setting.minSendIntervalMinutes, setting.maxSendIntervalMinutes));
      await prisma.$transaction([
        prisma.emailDraft.update({
          where: { id: draft.id },
          data: { status: "SENT", sentAt: now }
        }),
        prisma.emailLog.create({
          data: {
            leadId: draft.leadId,
            draftId: draft.id,
            type: draft.type,
            intendedRecipient: mail.intendedRecipient,
            actualRecipient: mail.actualRecipient,
            subject: draft.subject,
            body: draft.body,
            status: "SENT",
            testMode: mail.testMode,
            smtpUser: mail.smtpUser,
            idempotencyKey: draft.idempotencyKey,
            sentAt: now
          }
        }),
        prisma.lead.update({
          where: { id: draft.leadId },
          data: {
            status: "CONTACTED",
            lastContactedAt: now,
            ...(draft.type === EmailDraftType.FIRST_TOUCH
              ? {
                  followUpAt: addWorkingDays(now, 3),
                  followUpMethod: "邮件",
                  followUpStatus: "待跟进",
                  followUpNote: "首封邮件已发送，等待客户回复；如无回复按计划跟进。"
                }
              : {}),
            ...(draft.type === EmailDraftType.FOLLOW_UP ? { hasFollowedUp: true } : {})
          }
        }),
        prisma.systemSetting.update({
          where: { id: "lead-dev" },
          data: { lastSentAt: now, nextAllowedSendAt }
        })
      ]);
      return Response.json({ success: true, message: `已发送到 ${mail.actualRecipient}${mail.testMode ? "（测试模式）" : ""}` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "发送失败";
      await prisma.$transaction([
        prisma.emailDraft.update({ where: { id: draft.id }, data: { status: "FAILED" } }),
        prisma.emailLog.create({
          data: {
            leadId: draft.leadId,
            draftId: draft.id,
            type: draft.type,
            intendedRecipient: draft.recipient,
            actualRecipient: process.env.TEST_MODE !== "false" ? process.env.TEST_RECIPIENT || "" : draft.recipient,
            subject: draft.subject,
            body: draft.body,
            status: "FAILED",
            testMode: process.env.TEST_MODE !== "false",
            smtpUser: process.env.SMTP_USER,
            errorMessage: message,
            idempotencyKey: `${draft.idempotencyKey}-failed-${Date.now()}`
          }
        })
      ]);
      return jsonError(message, 502);
    }
  });
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function minutesFromNow(minutes: number) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}
