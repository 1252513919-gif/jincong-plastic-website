import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";
import { LeadImportPanel } from "@/features/lead-dev/components/LeadImportPanel";
import {
  deriveContactStatus,
  leadContactStatuses,
  leadMatchLevels,
  leadSourceTypes,
  matchLevelFromPriority,
  parseLeadNotes
} from "@/features/lead-dev/lib/lead-metadata";

export const dynamic = "force-dynamic";

export default async function LeadListPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const industry = params.industry?.trim();
  const region = params.region?.trim();
  const sourceType = params.sourceType?.trim();
  const contactStatus = params.contactStatus?.trim();
  const matchLevel = params.matchLevel?.trim();
  const verification = params.verification?.trim();

  const rawLeads = await prisma.lead.findMany({
    where: {
      ...(q ? { companyName: { contains: q } } : {}),
      ...(industry ? { industry: { contains: industry } } : {}),
      ...(region ? { region: { contains: region } } : {}),
      ...(verification ? { contactVerificationStatus: verification as never } : {})
    },
    orderBy: { updatedAt: "desc" },
    take: 500,
    include: { drafts: { select: { id: true, status: true, type: true } } }
  });

  const leads = rawLeads
    .map((lead) => {
      const parsed = parseLeadNotes(lead.notes);
      return {
        ...lead,
        sourceType: parsed.metadata.sourceType || "",
        wechat: parsed.metadata.wechat || "",
        visibleNotes: parsed.visibleNotes,
        contactStatus: deriveContactStatus(lead.status, parsed.metadata.contactStatus),
        matchLevel: matchLevelFromPriority(lead.priority)
      };
    })
    .filter((lead) => !sourceType || lead.sourceType === sourceType)
    .filter((lead) => !contactStatus || lead.contactStatus === contactStatus)
    .filter((lead) => !matchLevel || lead.matchLevel === matchLevel);

  const exportHref = `/api/lead-dev/export${buildQuery(params)}`;

  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">客户线索池</h1>
            <p className="mt-2 text-sm text-slate-600">批量导入、去重、筛选和导出线索；邮件功能保留，但不会自动发送。</p>
          </div>
          <a href={exportHref} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900">批量导出 CSV</a>
        </div>

        <form className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4 xl:grid-cols-7">
          <input name="q" defaultValue={q} placeholder="搜索企业名称" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <input name="industry" defaultValue={industry} placeholder="行业" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <input name="region" defaultValue={region} placeholder="地区" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <select name="sourceType" defaultValue={sourceType} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option value="">全部来源</option>
            {leadSourceTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select name="contactStatus" defaultValue={contactStatus} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option value="">全部联系状态</option>
            {leadContactStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select name="matchLevel" defaultValue={matchLevel} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option value="">全部匹配等级</option>
            {leadMatchLevels.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">筛选</button>
        </form>

        <LeadImportPanel />

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4">企业</th>
                <th className="px-5 py-4">行业 / 地区</th>
                <th className="px-5 py-4">来源</th>
                <th className="px-5 py-4">联系人</th>
                <th className="px-5 py-4">电话 / 微信</th>
                <th className="px-5 py-4">邮箱</th>
                <th className="px-5 py-4">联系状态</th>
                <th className="px-5 py-4">匹配等级</th>
                <th className="px-5 py-4">最后核验</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-5 py-4 font-semibold text-slate-950">
                    <Link href={`/lead-dev/leads/${lead.id}`}>{lead.companyName}</Link>
                    {lead.website && <p className="mt-1 text-xs font-normal text-slate-500">{lead.website}</p>}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{lead.industry || "-"} / {lead.region || "-"}</td>
                  <td className="px-5 py-4 text-slate-600">
                    <Badge>{lead.sourceType || "未标注"}</Badge>
                    {lead.sourceUrl && <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">{lead.sourceUrl}</p>}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{lead.contactPerson || "-"}</td>
                  <td className="px-5 py-4 text-slate-600">{lead.publicPhone || "-"}<br />{lead.wechat || "-"}</td>
                  <td className="px-5 py-4 text-slate-600">{lead.publicEmail || "-"}</td>
                  <td className="px-5 py-4"><Badge>{lead.contactStatus}</Badge></td>
                  <td className="px-5 py-4"><Badge>{lead.matchLevel}</Badge></td>
                  <td className="px-5 py-4 text-slate-600">{lead.contactVerifiedAt ? lead.contactVerifiedAt.toLocaleDateString("zh-CN") : "-"}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-sm text-slate-500">没有符合条件的线索。</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

function buildQuery(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const key of ["q", "industry", "region", "sourceType", "contactStatus", "matchLevel", "verification"]) {
    const value = params[key]?.trim();
    if (value) query.set(key, value);
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}
