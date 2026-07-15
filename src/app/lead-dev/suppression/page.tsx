import { prisma } from "@/features/lead-dev/lib/prisma";
import { SuppressionForm } from "@/features/lead-dev/components/SuppressionForm";

export const dynamic = "force-dynamic";

export default async function SuppressionPage() {
  const rows = await prisma.suppressionList.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <section className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold text-slate-950">永久拒绝联系名单</h1>
        <p className="mt-2 text-sm text-slate-600">退订、拒绝、退信或手动加入后，即使删除客户，也不能再次发送。</p>
        <SuppressionForm />
        <div className="mt-6 space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
              <span className="font-semibold text-slate-950">{row.type}</span> / {row.value} / {row.reason}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
