import { prisma } from "@/features/lead-dev/lib/prisma";
import { QueueActions, QueueDraftActions } from "@/features/lead-dev/components/QueueActions";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  const setting = await prisma.systemSetting.upsert({ where: { id: "lead-dev" }, update: {}, create: { id: "lead-dev", testMode: true } });
  const drafts = await prisma.emailDraft.findMany({
    where: { status: { in: ["PENDING_REVIEW", "APPROVED"] } },
    orderBy: [{ status: "desc" }, { createdAt: "asc" }],
    include: { lead: true },
    take: 50
  });
  const sentToday = await prisma.emailLog.count({ where: { status: "SENT", createdAt: { gte: startOfToday() } } });
  const testRecipientStatus = getTestRecipientStatus();
  const smtpPassStatus = getSmtpPassStatus();

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">邮件辅助</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">邮件草稿</h1>
          <p className="mt-1 text-sm text-slate-500">每次只允许发送一封已批准邮件；客户线索、跟进和今日待办优先。</p>
        </div>
      </div>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
        TEST_MODE=true 时，最终收件人会替换为 TEST_RECIPIENT，不会发送到真实客户邮箱。
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card label="测试模式" value={setting.testMode ? "ON" : "OFF"} />
        <Card label="今日额度" value={`${sentToday}/${setting.dailySendLimit}`} />
        <Card label="TEST_RECIPIENT" value={testRecipientStatus} />
        <Card label="SMTP_PASS" value={smtpPassStatus} />
      </div>
        <QueueActions />
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div key={draft.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">客户名称：{draft.lead.companyName}</p>
                  <p className="mt-1 text-sm text-slate-600">收件人：{draft.recipient}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">草稿状态：{draft.status}</span>
              </div>
              <p className="mt-4 text-sm text-slate-500">创建时间：{draft.createdAt.toLocaleString("zh-CN")}</p>
              <p className="mt-3 font-semibold text-slate-950">邮件主题：{draft.subject}</p>
              <div className="mt-3 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">邮件正文</p>
                <pre className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{draft.body}</pre>
              </div>
              <QueueDraftActions draftId={draft.id} status={draft.status} />
            </div>
          ))}
          {drafts.length === 0 && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">暂无待审核或已批准草稿。</p>}
        </div>
    </section>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function getTestRecipientStatus() {
  const value = process.env.TEST_RECIPIENT?.trim().toLowerCase();
  if (!value || value === "test@example.com" || value.endsWith("@example.com") || value.endsWith("@example.test")) return "占位值";
  return "有效";
}

function getSmtpPassStatus() {
  const value = process.env.SMTP_PASS?.trim();
  if (!value || value === "腾讯企业邮箱客户端专用密码" || value.toLowerCase().includes("placeholder")) return "未配置";
  return "已配置";
}
