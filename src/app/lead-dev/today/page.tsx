import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const { start, end, now } = getTodayRange();
  const records = await prisma.followUpRecord.findMany({
    where: {
      status: "PLANNED",
      scheduledAt: { lt: end }
    },
    include: { lead: true },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }]
  });

  const overdue = records.filter((record) => record.scheduledAt && record.scheduledAt < start);
  const today = records.filter((record) => record.scheduledAt && record.scheduledAt >= start && record.scheduledAt < end);
  const unscheduled = records.filter((record) => !record.scheduledAt);

  return (
    <section id="today" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">今日待办</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">需要处理的跟进</h1>
          <p className="mt-1 text-sm text-slate-500">只展示已计划且到期的跟进事项，不触发邮件发送。</p>
        </div>
        <Link href="/lead-dev/follow-ups" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
          查看全部跟进
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="今日待办" value={today.length} />
        <MetricCard label="超期跟进" value={overdue.length} tone="red" />
        <MetricCard label="未设置时间" value={unscheduled.length} />
      </div>

      <TaskGroup title="今日需要跟进" records={today} empty="今天暂无计划跟进。" />
      <TaskGroup title="已超期" records={overdue} empty="暂无超期跟进。" urgent />
      {unscheduled.length > 0 && <TaskGroup title="未设置计划时间" records={unscheduled} empty="暂无未设置时间的任务。" />}

      <p className="text-xs text-slate-400">当前时间：{now.toLocaleString("zh-CN")}</p>
    </section>
  );
}

type FollowUpWithLead = Awaited<ReturnType<typeof prisma.followUpRecord.findMany>>[number] & {
  lead: { id: string; companyName: string; publicPhone: string | null; publicEmail: string | null };
};

function MetricCard({ label, value, tone = "slate" }: { label: string; value: number; tone?: "slate" | "red" }) {
  const valueClass = tone === "red" ? "text-red-700" : "text-slate-950";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}

function TaskGroup({ title, records, empty, urgent = false }: { title: string; records: FollowUpWithLead[]; empty: string; urgent?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-slate-950">{title}</h2>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${urgent ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"}`}>{records.length}</span>
      </div>
      <div className="divide-y divide-slate-100">
        {records.map((record) => (
          <Link key={record.id} href={`/lead-dev/leads/${record.leadId}`} className="block px-4 py-3 hover:bg-blue-50/50">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-950">{record.lead.companyName}</p>
                <p className="mt-1 text-sm text-slate-600">{methodLabel(record.method)} · {record.note || "待跟进"}</p>
                {record.nextAction && <p className="mt-1 text-sm text-slate-500">下一步：{record.nextAction}</p>}
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>{formatDate(record.scheduledAt)}</p>
                <p className="mt-1">{record.lead.publicPhone || record.lead.publicEmail || "暂无联系方式"}</p>
              </div>
            </div>
          </Link>
        ))}
        {records.length === 0 && <p className="px-4 py-6 text-sm text-slate-500">{empty}</p>}
      </div>
    </div>
  );
}

function getTodayRange() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end, now };
}

function methodLabel(value: string) {
  return { EMAIL: "邮件", PHONE: "电话", WECHAT: "微信/企微", VISIT: "拜访", OTHER: "其他" }[value] || value;
}

function formatDate(value?: Date | string | null) {
  if (!value) return "未设置";
  return new Date(value).toLocaleString("zh-CN");
}
