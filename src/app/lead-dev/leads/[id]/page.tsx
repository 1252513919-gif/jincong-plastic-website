import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";
import { LeadDetailActions } from "@/features/lead-dev/components/LeadDetailActions";
import { deriveContactStatus, matchLevelFromPriority, parseLeadNotes } from "@/features/lead-dev/lib/lead-metadata";

export const dynamic = "force-dynamic";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      drafts: { orderBy: { createdAt: "desc" } },
      logs: { orderBy: { createdAt: "desc" }, take: 20 },
      followUpRecords: { orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }] }
    }
  });

  if (!lead) {
    return (
      <section className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Lead Detail</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">未找到该客户</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">当前客户 ID 在本地客户开发数据库中不存在，可能已被删除，或列表链接不是稳定客户 ID。</p>
          <Link href="/lead-dev/leads" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
            返回客户列表
          </Link>
        </div>
      </section>
    );
  }

  const safeLead = JSON.parse(JSON.stringify(lead));
  const parsedNotes = parseLeadNotes(lead.notes);
  const contactStatus = deriveContactStatus(lead.status, parsedNotes.metadata.contactStatus);
  const matchLevel = matchLevelFromPriority(lead.priority);

  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/lead-dev/leads" className="text-sm font-semibold text-sky-700">
          返回客户列表
        </Link>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-sky-700">企业名称</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{lead.companyName}</h1>
                  <p className="mt-2 text-sm text-slate-600">
                    {lead.industry || "未填写行业"} / {lead.region || "未填写地区"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{lead.status}</Badge>
                  <Badge>{lead.contactVerificationStatus}</Badge>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Info label="行业" value={lead.industry} />
                <Info label="地区" value={lead.region} />
                <Info label="官网" value={lead.website} />
                <Info label="客户来源" value={parsedNotes.metadata.sourceType || "未标注"} />
                <Info label="来源网址" value={lead.sourceUrl} />
                <Info label="联系人" value={lead.contactPerson} />
                <Info label="电话" value={lead.publicPhone} />
                <Info label="微信 / 企业微信" value={parsedNotes.metadata.wechat} />
                <Info label="邮箱" value={lead.publicEmail} />
                <Info label="联系状态" value={contactStatus} />
                <Info label="匹配等级" value={matchLevel} />
                <Info label="生命周期状态" value={lead.status} />
                <Info label="最后核验时间" value={formatDate(lead.contactVerifiedAt)} />
                <Info label="联系方式验证状态" value={lead.contactVerificationStatus} />
                <Info label="联系方式来源" value={lead.contactSourceUrl} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">客户研究信息</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Info label="主营产品摘要" value={lead.productSummary} large />
                <Info label="可能需要的塑料件" value={lead.potentialPlasticParts} large />
                <Info label="个性化依据" value={lead.personalizationReason} large />
                <Info label="官网公开页面摘要" value={lead.websiteSnapshot || "尚未记录官网研究结果。"} large />
                <Info label="备注" value={parsedNotes.visibleNotes} large />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">开发信草稿记录</h2>
              <div className="mt-4 space-y-4">
                {lead.drafts.map((draft) => (
                  <div key={draft.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{draft.type} / v{draft.version}</p>
                        <p className="mt-1 text-sm text-slate-600">{draft.recipient || "-"}</p>
                      </div>
                      <Badge>{draft.status}</Badge>
                    </div>
                    <p className="mt-3 font-semibold text-slate-950">{draft.subject}</p>
                    <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{draft.body}</pre>
                  </div>
                ))}
                {lead.drafts.length === 0 && <p className="text-sm text-slate-500">暂无开发信草稿。</p>}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">跟进记录</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Info label="上次联系时间" value={formatDate(lead.lastContactedAt)} />
                <Info label="是否已跟进" value={lead.hasFollowedUp ? "是" : "否"} />
                <Info label="回复时间" value={formatDate(lead.repliedAt)} />
                <Info label="当前跟进任务" value={lead.followUpAt ? `${lead.followUpMethod || "邮件"} / ${lead.followUpStatus || "待跟进"} / ${formatDate(lead.followUpAt)}` : null} />
                <Info label="当前跟进备注" value={lead.followUpNote} large />
              </div>
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold text-slate-950">跟进历史</h3>
                {lead.followUpRecords.map((record) => (
                  <div key={record.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-slate-950">{methodLabel(record.method)} / {statusLabel(record.status)}</span>
                      <span className="text-xs text-slate-500">创建：{formatDate(record.createdAt)}</span>
                    </div>
                    <p className="mt-2">计划时间：{formatDate(record.scheduledAt) || "-"}</p>
                    <p>完成时间：{formatDate(record.completedAt) || "-"}</p>
                    {record.note && <p className="mt-2 whitespace-pre-wrap">备注：{record.note}</p>}
                    {record.nextAction && <p className="mt-1 whitespace-pre-wrap">下一步：{record.nextAction}</p>}
                  </div>
                ))}
                {lead.followUpRecords.length === 0 && <p className="text-sm text-slate-500">暂无独立跟进历史。</p>}
              </div>
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-semibold text-slate-950">发送日志</h3>
                {lead.logs.map((log) => (
                  <div key={log.id} className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {log.status} / intended: {log.intendedRecipient} / actual: {log.actualRecipient} / {formatDate(log.createdAt)}
                  </div>
                ))}
                {lead.logs.length === 0 && <p className="text-sm text-slate-500">暂无发送日志。</p>}
              </div>
            </div>
          </div>
          <LeadDetailActions lead={safeLead} />
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

function formatDate(value?: Date | string | null) {
  if (!value) return null;
  return new Date(value).toLocaleString("zh-CN");
}

function methodLabel(value: string) {
  return { EMAIL: "邮件", PHONE: "电话", WECHAT: "微信", VISIT: "拜访", OTHER: "其他" }[value] || value;
}

function statusLabel(value: string) {
  return { PLANNED: "待跟进", COMPLETED: "已完成", CANCELLED: "已取消" }[value] || value;
}
