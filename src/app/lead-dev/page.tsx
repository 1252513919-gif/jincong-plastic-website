import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeadDevDashboardPage() {
  const [total, pendingResearch, unverified, pendingReview, approved, sentToday, replied, bounced, suppressed] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { contactVerificationStatus: { not: "VERIFIED" } } }),
    prisma.emailDraft.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.emailDraft.count({ where: { status: "APPROVED" } }),
    prisma.emailLog.count({ where: { status: "SENT", createdAt: { gte: startOfToday() } } }),
    prisma.lead.count({ where: { status: "REPLIED" } }),
    prisma.lead.count({ where: { status: "BOUNCED" } }),
    prisma.suppressionList.count()
  ]);

  const cards = [
    ["潜在客户总数", total],
    ["待研究", pendingResearch],
    ["未验证联系方式", unverified],
    ["待审核草稿", pendingReview],
    ["已批准草稿", approved],
    ["今日已发送", sentToday],
    ["已回复", replied],
    ["退信", bounced],
    ["拒绝联系名单", suppressed]
  ];

  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">客户开发仪表盘</h1>
            <p className="mt-2 text-sm text-slate-600">默认测试模式。所有邮件必须先审核，当前不会直接群发。</p>
          </div>
          <Link href="/lead-dev/leads" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">进入客户列表</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}
