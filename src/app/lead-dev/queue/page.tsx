import { prisma } from "@/features/lead-dev/lib/prisma";
import { QueueActions } from "@/features/lead-dev/components/QueueActions";

export default async function QueuePage() {
  const setting = await prisma.systemSetting.upsert({ where: { id: "lead-dev" }, update: {}, create: { id: "lead-dev", testMode: true } });
  const drafts = await prisma.emailDraft.findMany({
    where: { status: "APPROVED" },
    orderBy: { approvedAt: "asc" },
    include: { lead: true },
    take: 50
  });
  const sentToday = await prisma.emailLog.count({ where: { status: "SENT", createdAt: { gte: startOfToday() } } });

  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-semibold text-slate-950">发送队列</h1>
        <p className="mt-2 text-sm text-slate-600">本地 MVP 每次只允许发送一封已批准邮件。默认 TEST_MODE=true，实际收件人为 TEST_RECIPIENT。</p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Card label="测试模式" value={setting.testMode ? "ON" : "OFF"} />
          <Card label="今日额度" value={`${sentToday}/${setting.dailySendLimit}`} />
          <Card label="暂停" value={setting.paused ? "YES" : "NO"} />
          <Card label="停止全部" value={setting.stopAllSending ? "YES" : "NO"} />
        </div>
        <QueueActions />
        <div className="mt-6 space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">{draft.lead.companyName} / {draft.recipient}</p>
              <p className="mt-2 font-semibold text-slate-950">{draft.subject}</p>
              <p className="mt-2 text-sm text-slate-600">批准时间：{draft.approvedAt?.toLocaleString("zh-CN") || "-"}</p>
            </div>
          ))}
          {drafts.length === 0 && <p className="rounded-3xl bg-white p-6 text-sm text-slate-500">暂无已批准草稿。</p>}
        </div>
      </div>
    </section>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p></div>;
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}
