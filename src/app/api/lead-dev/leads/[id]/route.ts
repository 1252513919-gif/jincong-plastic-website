import { getEmailDomain, isValidEmail, normalizeEmail } from "@/features/lead-dev/lib/email-validation";
import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import {
  buildLeadNotes,
  normalizeContactStatus,
  normalizeSourceType,
  parseLeadNotes,
  priorityFromMatchLevel,
  statusFromContactStatus
} from "@/features/lead-dev/lib/lead-metadata";
import { prisma } from "@/features/lead-dev/lib/prisma";

type LeadActionPayload = {
  action?: string;
  companyName?: string;
  region?: string;
  industry?: string;
  website?: string;
  publicEmail?: string;
  publicPhone?: string;
  contactPerson?: string;
  sourceType?: string;
  sourceUrl?: string;
  wechat?: string;
  contactSourceUrl?: string;
  status?: string;
  contactStatus?: string;
  matchLevel?: string;
  contactVerifiedAt?: string;
  contactVerificationStatus?: string;
  productSummary?: string;
  potentialPlasticParts?: string;
  personalizationReason?: string;
  notes?: string;
};

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return withLeadDevApi(async () => {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => null)) as LeadActionPayload | null;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return jsonError("客户不存在", 404);

    if (payload?.action === "updateProfile") {
      const email = normalizeEmail(payload.publicEmail);
      if (email && !isValidEmail(email)) return jsonError("邮箱格式不正确");
      const parsedNotes = parseLeadNotes(lead.notes);
      const contactStatus = normalizeContactStatus(payload.contactStatus);

      await prisma.lead.update({
        where: { id },
        data: {
          companyName: payload.companyName?.trim() || lead.companyName,
          region: emptyToNull(payload.region),
          industry: emptyToNull(payload.industry),
          website: emptyToNull(payload.website),
          publicEmail: email || null,
          publicPhone: emptyToNull(payload.publicPhone),
          contactPerson: emptyToNull(payload.contactPerson),
          sourceUrl: emptyToNull(payload.sourceUrl),
          priority: priorityFromMatchLevel(payload.matchLevel),
          status: contactStatus ? statusFromContactStatus(contactStatus) : lead.status,
          contactVerifiedAt: parseDateOrNull(payload.contactVerifiedAt),
          notes: buildLeadNotes(parsedNotes.visibleNotes, {
            ...parsedNotes.metadata,
            sourceType: normalizeSourceType(payload.sourceType),
            wechat: emptyToUndefined(payload.wechat),
            contactStatus: contactStatus || parsedNotes.metadata.contactStatus
          })
        }
      });
      return Response.json({ success: true, message: "客户资料已保存" });
    }

    if (payload?.action === "updateResearch") {
      const parsedNotes = parseLeadNotes(lead.notes);
      await prisma.lead.update({
        where: { id },
        data: {
          productSummary: emptyToNull(payload.productSummary),
          potentialPlasticParts: emptyToNull(payload.potentialPlasticParts),
          personalizationReason: emptyToNull(payload.personalizationReason),
          notes: buildLeadNotes(payload.notes, parsedNotes.metadata),
          status: lead.status === "NEW" ? "RESEARCHED" : lead.status
        }
      });
      return Response.json({ success: true, message: "研究信息已保存" });
    }

    if (payload?.action === "updateStatus") {
      const allowed = ["NEW", "RESEARCHED", "CONTACTED", "REPLIED", "BOUNCED", "REJECTED", "DO_NOT_CONTACT"];
      if (!payload.status || !allowed.includes(payload.status)) return jsonError("生命周期状态不正确");
      await prisma.lead.update({
        where: { id },
        data: { status: payload.status as never }
      });
      return Response.json({ success: true, message: "生命周期状态已保存" });
    }

    if (payload?.action === "updateContactVerification") {
      const allowed = ["UNVERIFIED", "VERIFIED", "INVALID", "STALE"];
      if (!payload.contactVerificationStatus || !allowed.includes(payload.contactVerificationStatus)) return jsonError("联系方式验证状态不正确");
      if (payload.contactVerificationStatus === "VERIFIED") {
        if (!lead.publicEmail) return jsonError("没有公开邮箱，不能标记 VERIFIED");
        if (!payload.contactSourceUrl?.trim()) return jsonError("必须填写联系方式来源 URL");
      }
      await prisma.lead.update({
        where: { id },
        data: {
          contactVerificationStatus: payload.contactVerificationStatus as never,
          contactSourceUrl: payload.contactSourceUrl?.trim() || null,
          contactVerifiedAt: payload.contactVerificationStatus === "VERIFIED" ? new Date() : null
        }
      });
      return Response.json({ success: true, message: "联系方式验证状态已保存" });
    }

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
        const email = lead.publicEmail.toLowerCase();
        await prisma.suppressionList.upsert({
          where: { type_value: { type: "EMAIL", value: email } },
          update: {},
          create: { type: "EMAIL", value: email, reason: "MANUAL", sourceLeadId: id }
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

function emptyToNull(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function emptyToUndefined(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function parseDateOrNull(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}
