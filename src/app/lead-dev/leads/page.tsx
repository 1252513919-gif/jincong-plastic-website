import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";
import {
  deriveContactStatus,
  leadContactStatuses,
  leadMatchLevels,
  leadSourceTypes,
  matchLevelFromPriority,
  parseLeadNotes
} from "@/features/lead-dev/lib/lead-metadata";

export const dynamic = "force-dynamic";

const pageSize = 50;

export default async function LeadListPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const industry = params.industry?.trim();
  const region = params.region?.trim();
  const sourceType = params.sourceType?.trim();
  const contactStatus = params.contactStatus?.trim();
  const matchLevel = params.matchLevel?.trim();
  const verification = params.verification?.trim();
  const page = Math.max(1, Number(params.page || "1") || 1);

  const rawLeads = await prisma.lead.findMany({
    where: {
      ...(q ? { companyName: { contains: q } } : {}),
      ...(industry ? { industry: { contains: industry } } : {}),
      ...(region ? { region: { contains: region } } : {}),
      ...(verification ? { contactVerificationStatus: verification as never } : {})
    },
    orderBy: { updatedAt: "desc" },
    take: 2000,
    include: {
      drafts: { select: { id: true, status: true, type: true } },
      followUpRecords: { orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }], take: 1 }
    }
  });

  const filteredLeads = rawLeads
    .map((lead) => {
      const parsed = parseLeadNotes(lead.notes);
      return {
        ...lead,
        sourceType: parsed.metadata.sourceType || "",
        wechat: parsed.metadata.wechat || "",
        visibleNotes: parsed.visibleNotes,
        contactStatus: deriveContactStatus(lead.status, parsed.metadata.contactStatus),
        matchLevel: matchLevelFromPriority(lead.priority),
        latestFollowUp: lead.followUpRecords[0]
      };
    })
    .filter((lead) => !sourceType || lead.sourceType === sourceType)
    .filter((lead) => !contactStatus || lead.contactStatus === contactStatus)
    .filter((lead) => !matchLevel || lead.matchLevel === matchLevel);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * pageSize;
  const leads = filteredLeads.slice(skip, skip + pageSize);
  const exportHref = `/api/lead-dev/export${buildQuery(params)}`;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">客户线索池</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">客户线索</h1>
          <p className="mt-1 text-sm text-slate-500">按行业、地区、来源、联系状态和匹配等级筛选；邮件功能保留为辅助。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">列设置</button>
          <a href={exportHref} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            批量导出 CSV
          </a>
        </div>
      </div>

      <form className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-4 xl:grid-cols-7">
        <input name="q" defaultValue={q} placeholder="搜索企业名称" className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
        <input name="industry" defaultValue={industry} placeholder="行业" className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
        <input name="region" defaultValue={region} placeholder="地区" className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
        <select name="sourceType" defaultValue={sourceType} className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
          <option value="">全部来源</option>
          {leadSourceTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select name="contactStatus" defaultValue={contactStatus} className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
          <option value="">全部联系状态</option>
          {leadContactStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select name="matchLevel" defaultValue={matchLevel} className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
          <option value="">全部匹配等级</option>
          {leadMatchLevels.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button className="h-10 rounded-xl bg-slate-950 px-3 text-sm font-semibold text-white shadow-sm">筛选</button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm text-slate-500">
          <span>共 {filteredLeads.length} 条，当前第 {safePage}/{totalPages} 页</span>
          <span className="font-medium text-slate-700">批量选择：勾选后可导出给企业微信跟进</span>
        </div>
        <div data-crm-table-scroll className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[1280px] border-separate border-spacing-0 text-left text-sm">
            <thead className="sticky top-0 z-20 bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="sticky left-0 z-30 w-10 border-b border-slate-200 bg-slate-50 px-3 py-3">
                  <input type="checkbox" aria-label="批量选择" />
                </th>
                <th className="sticky left-10 z-30 min-w-[220px] max-w-[260px] border-b border-slate-200 bg-slate-50 px-4 py-3">企业</th>
                <th className="border-b border-slate-200 px-4 py-3">行业/地区</th>
                <th className="border-b border-slate-200 px-4 py-3">来源</th>
                <th className="border-b border-slate-200 px-4 py-3">联系人</th>
                <th className="border-b border-slate-200 px-4 py-3">电话/邮箱</th>
                <th className="border-b border-slate-200 px-4 py-3">联系状态</th>
                <th className="border-b border-slate-200 px-4 py-3">匹配等级</th>
                <th className="border-b border-slate-200 px-4 py-3">最后跟进</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="group cursor-pointer hover:bg-blue-50/40">
                  <td className="sticky left-0 z-10 border-b border-slate-100 bg-white px-3 py-3 group-hover:bg-blue-50">
                    <input type="checkbox" aria-label={`选择 ${lead.companyName}`} />
                  </td>
                  <td className="sticky left-10 z-10 min-w-[220px] max-w-[260px] border-b border-slate-100 bg-white px-4 py-3 group-hover:bg-blue-50">
                    <Link href={`/lead-dev/leads/${lead.id}`} className="line-clamp-2 font-semibold leading-5 text-slate-950 hover:text-blue-700">
                      {lead.companyName}
                    </Link>
                    {lead.website && <p className="mt-1 truncate text-xs text-slate-500">{lead.website}</p>}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                    <p className="whitespace-nowrap">{lead.industry || "-"}</p>
                    <p className="mt-1 whitespace-nowrap text-xs text-slate-500">{lead.region || "-"}</p>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                    <Badge>{lead.sourceType || "未标注"}</Badge>
                    {lead.sourceUrl && <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">{lead.sourceUrl}</p>}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                    <p className="whitespace-nowrap">{lead.contactPerson || "-"}</p>
                    {lead.wechat && <p className="mt-1 whitespace-nowrap text-xs text-slate-500">微信：{lead.wechat}</p>}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                    <p className="whitespace-nowrap">{lead.publicPhone || "-"}</p>
                    <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">{lead.publicEmail || "-"}</p>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3"><Badge tone="blue">{lead.contactStatus}</Badge></td>
                  <td className="border-b border-slate-100 px-4 py-3"><Badge>{lead.matchLevel}</Badge></td>
                  <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                    <p className="whitespace-nowrap">{formatDate(lead.latestFollowUp?.scheduledAt || lead.lastContactedAt)}</p>
                    <p className="mt-1 whitespace-nowrap text-xs text-slate-500">{lead.latestFollowUp?.status || lead.followUpStatus || "-"}</p>
                  </td>
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
          <PaginationLink disabled={safePage <= 1} params={params} page={safePage - 1}>上一页</PaginationLink>
          <span className="text-slate-500">每页 {pageSize} 条</span>
          <PaginationLink disabled={safePage >= totalPages} params={params} page={safePage + 1}>下一页</PaginationLink>
        </div>
      </div>
    </section>
  );
}

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "blue" }) {
  const classes = tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{children}</span>;
}

function PaginationLink({
  children,
  disabled,
  params,
  page
}: {
  children: React.ReactNode;
  disabled: boolean;
  params: Record<string, string | undefined>;
  page: number;
}) {
  const href = `/lead-dev/leads${buildQuery({ ...params, page: String(page) })}`;
  if (disabled) {
    return <span className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-300">{children}</span>;
  }
  return <Link href={href} className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">{children}</Link>;
}

function buildQuery(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const key of ["q", "industry", "region", "sourceType", "contactStatus", "matchLevel", "verification", "page"]) {
    const value = params[key]?.trim();
    if (value) query.set(key, value);
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("zh-CN");
}
