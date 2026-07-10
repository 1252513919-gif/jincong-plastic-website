import { inferPlasticParts } from "@/features/lead-dev/lib/draft-generator";
import { jsonError, withLeadDevApi } from "@/features/lead-dev/lib/api";
import { prisma } from "@/features/lead-dev/lib/prisma";
import { extractReadableText, fetchPublicText } from "@/features/lead-dev/lib/ssrf";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return withLeadDevApi(async () => {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => null)) as { sourceUrl?: string } | null;
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return jsonError("客户不存在", 404);
    const sourceUrl = payload?.sourceUrl || lead.sourceUrl || lead.website;
    if (!sourceUrl) return jsonError("缺少官网或来源 URL");

    const result = await fetchPublicText(sourceUrl);
    const text = extractReadableText(result.text);
    const summary = text.slice(0, 600);
    const parts = inferPlasticParts(`${lead.industry || ""} ${lead.productSummary || ""} ${summary}`);
    await prisma.lead.update({
      where: { id },
      data: {
        status: "RESEARCHED",
        sourceUrl: result.finalUrl,
        websiteSnapshot: summary,
        productSummary: lead.productSummary || summary.slice(0, 120),
        potentialPlasticParts: parts.join("、"),
        personalizationReason: `根据公开页面内容匹配：${parts.join("、")}`,
        lastResearchAt: new Date()
      }
    });
    return Response.json({ success: true, message: "官网研究摘要已记录" });
  });
}
