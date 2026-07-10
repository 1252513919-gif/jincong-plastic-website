import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/features/lead-dev/lib/prisma";
import { LeadDetailActions } from "@/features/lead-dev/components/LeadDetailActions";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      drafts: { orderBy: { createdAt: "desc" } },
      logs: { orderBy: { createdAt: "desc" }, take: 20 }
    }
  });
  if (!lead) notFound();

  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/lead-dev/leads" className="text-sm font-semibold text-sky-700">返回客户列表</Link>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{lead.companyName}</h1>
                <p className="mt-2 text-sm text-slate-600">{lead.industry || "未填写行业"} / {lead.region || "未填写地区"}</p>
              </div>
              <div className="flex gap-2">
                <Badge>{lead.status}</Badge>
                <Badge>{lead.contactVerificationStatus}</Badge>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Info label="官网" value={lead.website} />
              <Info label="公开邮箱" value={lead.publicEmail} />
              <Info label="电话" value={lead.publicPhone} />
              <Info label="联系人" value={lead.contactPerson} />
              <Info label="来源 URL" value={lead.sourceUrl} />
              <Info label="联系方式来源" value={lead.contactSourceUrl} />
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-950">官网研究摘要</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{lead.websiteSnapshot || "尚未记录官网研究结果。"}</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Info label="主营产品摘要" value={lead.productSummary} large />
              <Info label="可能需要的塑料件" value={lead.potentialPlasticParts} large />
              <Info label="个性化依据" value={lead.personalizationReason} large />
              <Info label="备注" value={lead.notes} large />
            </div>
          </div>
          <LeadDetailActions lead={JSON.parse(JSON.stringify(lead))} />
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">邮件草稿</h2>
          <div className="mt-4 space-y-4">
            {lead.drafts.map((draft) => (
              <div key={draft.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{draft.type} / v{draft.version}</p>
                    <p className="mt-1 text-sm text-slate-600">{draft.recipient}</p>
                  </div>
                  <Badge>{draft.status}</Badge>
                </div>
                <p className="mt-3 font-semibold text-slate-950">{draft.subject}</p>
                <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{draft.body}</pre>
              </div>
            ))}
            {lead.drafts.length === 0 && <p className="text-sm text-slate-500">暂无草稿。</p>}
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">发送日志</h2>
          <div className="mt-4 space-y-3">
            {lead.logs.map((log) => (
              <div key={log.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {log.status} / intended: {log.intendedRecipient} / actual: {log.actualRecipient} / {log.createdAt.toLocaleString("zh-CN")}
              </div>
            ))}
            {lead.logs.length === 0 && <p className="text-sm text-slate-500">暂无发送日志。</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{children}</span>;
}

function Info({ label, value, large }: { label: string; value?: string | null; large?: boolean }) {
  return (
    <div className={large ? "md:col-span-1" : ""}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{value || "-"}</p>
    </div>
  );
}
