import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";

export default async function FollowUpsPage() {
  const leads = await prisma.lead.findMany({
    where: {
      status: "CONTACTED",
      hasFollowedUp: false,
      repliedAt: null,
      followUpAt: { not: null },
      followUpStatus: "待跟进"
    },
    orderBy: { followUpAt: "asc" }
  });

  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold text-slate-950">跟进中心</h1>
        <p className="mt-2 text-sm text-slate-600">这里显示已经发送首封邮件、尚未回复、且已创建待跟进任务的客户。</p>
        <div className="mt-6 space-y-4">
          {leads.map((lead) => (
            <Link key={lead.id} href={`/lead-dev/leads/${lead.id}`} className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{lead.companyName}</p>
                  <p className="mt-2 text-sm text-slate-600">上次联系：{lead.lastContactedAt?.toLocaleString("zh-CN") || "-"}</p>
                  <p className="mt-1 text-sm text-slate-600">跟进时间：{lead.followUpAt?.toLocaleString("zh-CN") || "-"}</p>
                  {lead.followUpNote && <p className="mt-2 text-sm leading-6 text-slate-600">{lead.followUpNote}</p>}
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{lead.followUpMethod || "邮件"} / {lead.followUpStatus || "待跟进"}</span>
              </div>
            </Link>
          ))}
          {leads.length === 0 && <p className="rounded-3xl bg-white p-6 text-sm text-slate-500">暂无待跟进任务。</p>}
        </div>
      </div>
    </section>
  );
}
