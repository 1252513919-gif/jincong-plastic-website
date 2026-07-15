import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FollowUpsPage() {
  const now = new Date();
  const records = await prisma.followUpRecord.findMany({
    include: { lead: true },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }]
  });

  const planned = records.filter((record) => record.status === "PLANNED" && (!record.scheduledAt || record.scheduledAt >= now));
  const overdue = records.filter((record) => record.status === "PLANNED" && record.scheduledAt && record.scheduledAt < now);
  const completed = records.filter((record) => record.status === "COMPLETED");
  const cancelled = records.filter((record) => record.status === "CANCELLED");

  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-slate-950">跟进中心</h1>
        <p className="mt-2 text-sm text-slate-600">这里按独立跟进记录展示待跟进、已逾期、已完成和已取消任务，历史记录不会被新的计划覆盖。</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <RecordGroup title="待跟进" records={planned} tone="sky" />
          <RecordGroup title="已逾期" records={overdue} tone="amber" />
          <RecordGroup title="已完成" records={completed} tone="emerald" />
          <RecordGroup title="已取消" records={cancelled} tone="slate" />
        </div>
      </div>
    </section>
  );
}

type RecordWithLead = Awaited<ReturnType<typeof prisma.followUpRecord.findMany>>[number] & {
  lead: { id: string; companyName: string; lastContactedAt: Date | null };
};

function RecordGroup({ title, records, tone }: { title: string; records: RecordWithLead[]; tone: "sky" | "amber" | "emerald" | "slate" }) {
  const toneClass = {
    sky: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-700"
  }[tone];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>{records.length}</span>
      </div>
      <div className="mt-4 space-y-3">
        {records.map((record) => (
          <Link key={record.id} href={`/lead-dev/leads/${record.leadId}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{record.lead.companyName}</p>
                <p className="mt-1 text-sm text-slate-600">{methodLabel(record.method)} / {statusLabel(record.status)}</p>
                <p className="mt-1 text-sm text-slate-600">计划：{formatDate(record.scheduledAt) || "-"}</p>
                <p className="mt-1 text-sm text-slate-600">完成：{formatDate(record.completedAt) || "-"}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{formatDate(record.createdAt)}</span>
            </div>
            {record.note && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{record.note}</p>}
            {record.nextAction && <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-500">下一步：{record.nextAction}</p>}
          </Link>
        ))}
        {records.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">暂无记录。</p>}
      </div>
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
