import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";
import { LeadImportPanel } from "@/features/lead-dev/components/LeadImportPanel";

export const dynamic = "force-dynamic";

export default async function LeadListPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const status = params.status?.trim();
  const verification = params.verification?.trim();
  const leads = await prisma.lead.findMany({
    where: {
      ...(q ? { companyName: { contains: q } } : {}),
      ...(status ? { status: status as never } : {}),
      ...(verification ? { contactVerificationStatus: verification as never } : {})
    },
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { drafts: { select: { id: true, status: true, type: true } } }
  });

  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">客户列表</h1>
            <p className="mt-2 text-sm text-slate-600">导入不会生成草稿，也不会发送邮件；需在详情页逐个研究和审核。</p>
          </div>
          <a href="/api/lead-dev/export" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900">导出 CSV</a>
        </div>
        <form className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
          <input name="q" defaultValue={q} placeholder="搜索企业名称" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <select name="status" defaultValue={status} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option value="">全部状态</option>
            {["NEW", "RESEARCHED", "CONTACTED", "REPLIED", "BOUNCED", "REJECTED", "DO_NOT_CONTACT"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select name="verification" defaultValue={verification} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
            <option value="">全部验证状态</option>
            {["UNVERIFIED", "VERIFIED", "INVALID", "STALE"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">筛选</button>
        </form>
        <LeadImportPanel />
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4">企业</th>
                <th className="px-5 py-4">行业/地区</th>
                <th className="px-5 py-4">邮箱</th>
                <th className="px-5 py-4">生命周期</th>
                <th className="px-5 py-4">联系方式</th>
                <th className="px-5 py-4">草稿</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-5 py-4 font-semibold text-slate-950"><Link href={`/lead-dev/leads/${lead.id}`}>{lead.companyName}</Link></td>
                  <td className="px-5 py-4 text-slate-600">{lead.industry || "-"} / {lead.region || "-"}</td>
                  <td className="px-5 py-4 text-slate-600">{lead.publicEmail || "-"}</td>
                  <td className="px-5 py-4"><Badge>{lead.status}</Badge></td>
                  <td className="px-5 py-4"><Badge>{lead.contactVerificationStatus}</Badge></td>
                  <td className="px-5 py-4 text-slate-600">{lead.drafts.length}</td>
                </tr>
              ))}
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
