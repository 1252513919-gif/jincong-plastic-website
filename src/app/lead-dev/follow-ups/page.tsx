import Link from "next/link";
import { prisma } from "@/features/lead-dev/lib/prisma";
import { addWorkingDays } from "@/features/lead-dev/lib/sending-rules";

export default async function FollowUpsPage() {
  const leads = await prisma.lead.findMany({
    where: { status: "CONTACTED", hasFollowedUp: false, repliedAt: null },
    include: { drafts: true },
    orderBy: { lastContactedAt: "asc" }
  });
  const now = new Date();
  const due = leads.filter((lead) => lead.lastContactedAt && addWorkingDays(lead.lastContactedAt, 5) <= now);

  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold text-slate-950">跟进中心</h1>
        <p className="mt-2 text-sm text-slate-600">这里只显示已联系、未回复、未跟进且满 5 个工作日的客户。</p>
        <div className="mt-6 space-y-4">
          {due.map((lead) => (
            <Link key={lead.id} href={`/lead-dev/leads/${lead.id}`} className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-slate-950">{lead.companyName}</p>
              <p className="mt-2 text-sm text-slate-600">上次联系：{lead.lastContactedAt?.toLocaleString("zh-CN")}</p>
            </Link>
          ))}
          {due.length === 0 && <p className="rounded-3xl bg-white p-6 text-sm text-slate-500">暂无到期跟进客户。</p>}
        </div>
      </div>
    </section>
  );
}
