import type { NextRequest } from "next/server";
import { toCsv } from "@/features/lead-dev/lib/csv";
import { withLeadDevApi } from "@/features/lead-dev/lib/api";
import { deriveContactStatus, matchLevelFromPriority, parseLeadNotes } from "@/features/lead-dev/lib/lead-metadata";
import { prisma } from "@/features/lead-dev/lib/prisma";

export async function GET(request: NextRequest) {
  return withLeadDevApi(async () => {
    const params = request.nextUrl.searchParams;
    const q = params.get("q")?.trim();
    const industry = params.get("industry")?.trim();
    const region = params.get("region")?.trim();
    const sourceType = params.get("sourceType")?.trim();
    const contactStatus = params.get("contactStatus")?.trim();
    const matchLevel = params.get("matchLevel")?.trim();
    const verification = params.get("verification")?.trim();
    const leads = await prisma.lead.findMany({
      where: {
        ...(q ? { companyName: { contains: q } } : {}),
        ...(industry ? { industry: { contains: industry } } : {}),
        ...(region ? { region: { contains: region } } : {}),
        ...(verification ? { contactVerificationStatus: verification as never } : {})
      },
      orderBy: { updatedAt: "desc" },
      take: 2000
    });
    const columns = [
      "companyName",
      "region",
      "industry",
      "sourceType",
      "website",
      "sourceUrl",
      "publicPhone",
      "contactPerson",
      "wechat",
      "publicEmail",
      "contactVerifiedAt",
      "contactStatus",
      "matchLevel",
      "productCategory",
      "contactVerificationStatus",
      "productSummary",
      "potentialPlasticParts",
      "notes"
    ];
    const rows = leads
      .map((lead) => {
        const parsed = parseLeadNotes(lead.notes);
        return {
        ...lead,
        sourceType: parsed.metadata.sourceType || "",
        wechat: parsed.metadata.wechat || "",
        contactVerifiedAt: lead.contactVerifiedAt ? lead.contactVerifiedAt.toISOString().slice(0, 10) : "",
        contactStatus: deriveContactStatus(lead.status, parsed.metadata.contactStatus),
        matchLevel: matchLevelFromPriority(lead.priority),
        notes: parsed.visibleNotes
        };
      })
      .filter((lead) => !sourceType || lead.sourceType === sourceType)
      .filter((lead) => !contactStatus || lead.contactStatus === contactStatus)
      .filter((lead) => !matchLevel || lead.matchLevel === matchLevel);
    return new Response(toCsv(rows, columns), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=lead-export.csv"
      }
    });
  });
}
