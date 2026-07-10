import { toCsv } from "@/features/lead-dev/lib/csv";
import { withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";

export async function GET() {
  return withLeadDevApi(async () => {
    const leads = await prisma.lead.findMany({ orderBy: { updatedAt: "desc" } });
    const columns = [
      "companyName",
      "region",
      "industry",
      "website",
      "publicEmail",
      "publicPhone",
      "contactPerson",
      "sourceUrl",
      "priority",
      "productCategory",
      "status",
      "contactVerificationStatus",
      "productSummary",
      "potentialPlasticParts",
      "notes"
    ];
    return new Response(toCsv(leads, columns), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=lead-export.csv"
      }
    });
  });
}
