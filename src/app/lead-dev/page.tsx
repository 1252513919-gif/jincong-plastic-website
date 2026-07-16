import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";
import { deriveContactStatus, parseLeadNotes } from "@/features/lead-dev/lib/lead-metadata";

export const dynamic = "force-dynamic";

export default async function LeadDevDashboardPage() {
  const now = new Date();
  const todayStart = startOfToday();
  const weekStart = startOfWeek();

  const [leads, pendingReview, approved, sentToday, overdueFollowUps, todayTodos, recentRecords] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        companyName: true,
        industry: true,
        status: true,
        priority: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.emailDraft.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.emailDraft.count({ where: { status: "APPROVED" } }),
    prisma.emailLog.count({ where: { status: "SENT", createdAt: { gte: todayStart } } }),
    prisma.followUpRecord.count({ where: { status: "PLANNED", scheduledAt: { lt: now } } }),
    prisma.followUpRecord.count({
      where: { status: "PLANNED", scheduledAt: { gte: todayStart, lt: endOfToday() } }
    }),
    prisma.followUpRecord.findMany({
      include: { lead: { select: { id: true, companyName: true } } },
      orderBy: [{ createdAt: "desc" }],
      take: 6
    })
  ]);

  const contacted = leads.filter((lead) => ["CONTACTED", "REPLIED"].includes(lead.status)).length;
  const replied = leads.filter((lead) => lead.status === "REPLIED").length;
  const waitingContact = leads.filter((lead) => lead.status === "NEW" || lead.status === "RESEARCHED").length;
  const interested = leads.filter((lead) => deriveContactStatus(lead.status, parseLeadNotes(lead.notes).metadata.contactStatus) === "有意向").length;
  const thisWeekNew = leads.filter((lead) => lead.createdAt >= weekStart).length;
  const quotePending = pendingReview + approved;
  const sourceDistribution = topDistribution(
    leads.map((lead) => parseLeadNotes(lead.notes).metadata.sourceType || "未标注")
  );
  const industryDistribution = topDistribution(leads.map((lead) => lead.industry || "未填写行业"));

  const cards = [
    ["客户总数", leads.length],
    ["本周新增", thisWeekNew],
    ["待联系", waitingContact],
    ["已联系", contacted],
    ["已回复", replied],
    ["有意向", interested],
    ["待报价", quotePending],
    ["超期跟进", overdueFollowUps],
    ["今日待办", todayTodos],
    ["今日已发送", sentToday]
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">CRM 仪表盘</h1>
          <p className="mt-1 text-sm text-slate-500">客户来源、跟进状态和草稿审核集中概览。TEST_MODE 保持开启。</p>
        </div>
        <Link href="/lead-dev/leads" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          进入客户线索
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.2fr]">
        <DistributionCard title="来源分布" rows={sourceDistribution} />
        <DistributionCard title="行业分布" rows={industryDistribution} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-950">近期活动</h2>
            <Link href="/lead-dev/follow-ups" className="text-xs font-semibold text-slate-500 hover:text-slate-950">
              查看跟进中心
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {recentRecords.map((record) => (
              <Link
                key={record.id}
                href={`/lead-dev/leads/${record.leadId}`}
                className="block rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-slate-900">{record.lead.companyName}</span>
                  <span className="whitespace-nowrap text-xs text-slate-500">{statusLabel(record.status)}</span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {methodLabel(record.method)} / 下次跟进：{formatDate(record.scheduledAt) || "-"}
                </p>
              </Link>
            ))}
            {recentRecords.length === 0 && <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">暂无近期活动。</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function DistributionCard({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  const max = Math.max(...rows.map(([, value]) => value), 1);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate text-slate-600">{label}</span>
              <span className="font-semibold text-slate-900">{value}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-900" style={{ width: `${Math.max(8, (value / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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

function startOfWeek() {
  const date = startOfToday();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date;
}

function formatDate(value?: Date | string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("zh-CN");
}

function methodLabel(value: string) {
  return { EMAIL: "邮件", PHONE: "电话", WECHAT: "微信", VISIT: "拜访", OTHER: "其他" }[value] || value;
}

function statusLabel(value: string) {
  return { PLANNED: "待跟进", COMPLETED: "已完成", CANCELLED: "已取消" }[value] || value;
}
