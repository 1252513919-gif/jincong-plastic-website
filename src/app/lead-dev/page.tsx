import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";
import { deriveContactStatus, parseLeadNotes } from "@/features/lead-dev/lib/lead-metadata";

export const dynamic = "force-dynamic";

export default async function LeadDevDashboardPage() {
  const now = new Date();
  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  const [leads, pendingReview, approved, overdueFollowUps, todayTodoCount, todayTasks, recentRecords] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        companyName: true,
        industry: true,
        region: true,
        status: true,
        priority: true,
        notes: true,
        updatedAt: true
      }
    }),
    prisma.emailDraft.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.emailDraft.count({ where: { status: "APPROVED" } }),
    prisma.followUpRecord.count({ where: { status: "PLANNED", scheduledAt: { lt: now } } }),
    prisma.followUpRecord.count({ where: { status: "PLANNED", scheduledAt: { gte: todayStart, lt: todayEnd } } }),
    prisma.followUpRecord.findMany({
      where: { status: "PLANNED", scheduledAt: { gte: todayStart, lt: todayEnd } },
      include: { lead: { select: { id: true, companyName: true } } },
      orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
      take: 6
    }),
    prisma.followUpRecord.findMany({
      include: { lead: { select: { id: true, companyName: true } } },
      orderBy: [{ createdAt: "desc" }],
      take: 7
    })
  ]);

  const enrichedLeads = leads.map((lead) => {
    const metadata = parseLeadNotes(lead.notes).metadata;
    return {
      ...lead,
      contactStatus: deriveContactStatus(lead.status, metadata.contactStatus),
      sourceType: metadata.sourceType || "未标注"
    };
  });

  const waitingContact = enrichedLeads.filter((lead) => lead.contactStatus === "待联系").length;
  const interested = enrichedLeads.filter((lead) => lead.contactStatus === "有意向").length;
  const quotePending = pendingReview + approved;

  const priorityMetrics = [
    { label: "待联系", value: waitingContact, href: "/lead-dev/leads?contactStatus=待联系", tone: "blue" },
    { label: "超期跟进", value: overdueFollowUps, href: "/lead-dev/follow-ups", tone: "red" },
    { label: "有意向", value: interested, href: "/lead-dev/leads?contactStatus=有意向", tone: "green" },
    { label: "待报价", value: quotePending, href: "/lead-dev/queue", tone: "amber" },
    { label: "今日待办", value: todayTodoCount, href: "/lead-dev/follow-ups#today", tone: "slate" }
  ];

  const stageRows = [
    { label: "待联系", value: waitingContact },
    { label: "已联系", value: enrichedLeads.filter((lead) => lead.contactStatus === "已联系").length },
    { label: "已回复", value: enrichedLeads.filter((lead) => lead.contactStatus === "已回复").length },
    { label: "有意向", value: interested },
    { label: "暂无需求", value: enrichedLeads.filter((lead) => lead.contactStatus === "暂无需求").length },
    { label: "拒绝联系", value: enrichedLeads.filter((lead) => lead.contactStatus === "拒绝联系").length }
  ].filter((row) => row.value > 0);

  const recentLeads = enrichedLeads.slice(0, 6);
  const sourceDistribution = topDistribution(enrichedLeads.map((lead) => lead.sourceType));
  const industryDistribution = topDistribution(enrichedLeads.map((lead) => lead.industry || "未填写行业"));

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">客户开发工作台</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">今天需要优先处理的线索</h1>
        </div>
        <Link href="/lead-dev/leads" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50">
          查看客户线索
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {priorityMetrics.map((metric) => (
          <Link key={metric.label} href={metric.href} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className={`mb-4 h-1.5 w-10 rounded-full ${toneBar(metric.tone)}`} />
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{metric.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="客户阶段漏斗" subtitle="按当前联系状态统计，不包含虚拟转化率">
          <div className="space-y-3">
            {stageRows.map((row) => (
              <FunnelRow key={row.label} label={row.label} value={row.value} total={Math.max(enrichedLeads.length, 1)} />
            ))}
            {stageRows.length === 0 && <EmptyLine>暂无阶段数据</EmptyLine>}
          </div>
        </Panel>

        <Panel title="今日任务" subtitle="来自已计划的跟进记录">
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <Link key={task.id} href={`/lead-dev/leads/${task.leadId}`} className="block rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm hover:bg-blue-50">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-semibold text-slate-900">{task.lead.companyName}</span>
                  <span className="whitespace-nowrap text-xs text-slate-500">{methodLabel(task.method)}</span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{task.note || task.nextAction || "待跟进"}</p>
              </Link>
            ))}
            {todayTasks.length === 0 && <EmptyLine>今天没有计划跟进</EmptyLine>}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="最近客户" subtitle="按最近更新时间排序">
          <div className="divide-y divide-slate-100">
            {recentLeads.map((lead) => (
              <Link key={lead.id} href={`/lead-dev/leads/${lead.id}`} className="flex items-center justify-between gap-3 py-3 text-sm hover:text-blue-700">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">{lead.companyName}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{lead.industry || "未填写行业"} / {lead.region || "未填写地区"}</p>
                </div>
                <StatusPill>{lead.contactStatus}</StatusPill>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="近期沟通" subtitle="电话、微信、邮件、拜访等跟进记录">
          <div className="space-y-2">
            {recentRecords.map((record) => (
              <Link key={record.id} href={`/lead-dev/leads/${record.leadId}`} className="grid grid-cols-[88px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm hover:bg-slate-50">
                <span className="text-xs font-medium text-slate-500">{methodLabel(record.method)}</span>
                <span className="truncate font-semibold text-slate-900">{record.lead.companyName}</span>
                <span className="whitespace-nowrap text-xs text-slate-500">{formatDate(record.scheduledAt || record.createdAt)}</span>
              </Link>
            ))}
            {recentRecords.length === 0 && <EmptyLine>暂无近期沟通</EmptyLine>}
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DistributionCard title="来源分布" rows={sourceDistribution} total={Math.max(enrichedLeads.length, 1)} />
        <DistributionCard title="行业分布" rows={industryDistribution} total={Math.max(enrichedLeads.length, 1)} />
      </div>
    </section>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-950">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function FunnelRow({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{value} / {percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.max(4, percentage)}%` }} />
      </div>
    </div>
  );
}

function DistributionCard({ title, rows, total }: { title: string; rows: Array<[string, number]>; total: number }) {
  return (
    <Panel title={title} subtitle="按当前客户资料统计">
      <div className="space-y-3">
        {rows.map(([label, value], index) => {
          const percentage = Math.round((value / total) * 100);
          return (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-slate-700">{label}</span>
                <span className="whitespace-nowrap text-slate-500">{value} / {percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${index % 2 === 0 ? "bg-blue-500" : "bg-slate-400"}`} style={{ width: `${Math.max(4, percentage)}%` }} />
              </div>
            </div>
          );
        })}
        {rows.length === 0 && <EmptyLine>暂无数据</EmptyLine>}
      </div>
    </Panel>
  );
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{children}</span>;
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500">{children}</p>;
}

function topDistribution(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfToday() {
  const date = startOfToday();
  date.setDate(date.getDate() + 1);
  return date;
}

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("zh-CN");
}

function methodLabel(value: string) {
  return { EMAIL: "邮件", PHONE: "电话", WECHAT: "微信", VISIT: "拜访", OTHER: "其他" }[value] || value;
}

function toneBar(tone: string) {
  return {
    blue: "bg-blue-500",
    red: "bg-rose-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    slate: "bg-slate-400"
  }[tone] || "bg-blue-500";
}
