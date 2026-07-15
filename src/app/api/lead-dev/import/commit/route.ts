import { parseLeadCsvPreview } from "@/features/lead-dev/lib/csv";
import { isValidEmail } from "@/features/lead-dev/lib/email-validation";
import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import {
  buildLeadNotes,
  normalizeContactStatus,
  normalizeSourceType,
  priorityFromMatchLevel,
  statusFromContactStatus
} from "@/features/lead-dev/lib/lead-metadata";
import { prisma } from "@/features/lead-dev/lib/prisma";

export async function POST(request: Request) {
  return withLeadDevApi(async () => {
    const payload = (await request.json().catch(() => null)) as { csv?: string } | null;
    const preview = parseLeadCsvPreview(String(payload?.csv ?? ""));
    if (preview.errors.length > 0) return jsonError("CSV 存在错误，请先修正后再导入");

    let created = 0;
    let skipped = 0;
    for (const row of preview.validRows) {
      const existing = await prisma.lead.findFirst({
        where: {
          OR: [
            { companyName: row.companyName },
            ...(row.publicEmail ? [{ publicEmail: row.publicEmail }] : []),
            ...(row.website ? [{ website: row.website }] : [])
          ]
        }
      });
      if (existing) {
        skipped += 1;
        continue;
      }
      await prisma.lead.create({
        data: {
          companyName: row.companyName,
          region: row.region || null,
          industry: row.industry || null,
          website: row.website || null,
          publicEmail: row.publicEmail || null,
          publicPhone: row.publicPhone || null,
          contactPerson: row.contactPerson || null,
          sourceUrl: row.sourceUrl || null,
          priority: priorityFromMatchLevel(row.matchLevel),
          productCategory: row.productCategory || null,
          status: row.contactStatus ? statusFromContactStatus(row.contactStatus) : "NEW",
          contactVerifiedAt: parseDateOrNull(row.contactVerifiedAt),
          notes: buildLeadNotes(row.notes, {
            sourceType: normalizeSourceType(row.sourceType),
            wechat: row.wechat || undefined,
            contactStatus: normalizeContactStatus(row.contactStatus) || undefined
          }),
          contactVerificationStatus: row.publicEmail && !isValidEmail(row.publicEmail) ? "INVALID" : "UNVERIFIED"
        }
      });
      created += 1;
    }

    return Response.json({ success: true, created, skipped });
  });
}

function parseDateOrNull(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
