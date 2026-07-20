import Link from "next/link";
import { LeadImportPanel } from "@/features/lead-dev/components/LeadImportPanel";

export const dynamic = "force-dynamic";

export default function ImportExportPage() {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">导入导出</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">客户线索导入与导出</h1>
          <p className="mt-1 text-sm text-slate-500">导入前只做预览和校验；确认导入不会生成草稿，也不会发送邮件。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/templates/lead-import-template.csv" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            下载 CSV 模板
          </a>
          <a href="/api/lead-dev/export" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            导出全部客户
          </a>
          <Link href="/lead-dev/leads" className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
            返回客户列表
          </Link>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <LeadImportPanel />
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
          <h2 className="font-semibold text-slate-950">导入规则</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>必须使用 CRM 标准 CSV 表头。</li>
            <li>系统会按公司名称、官网和邮箱做自动去重。</li>
            <li>邮箱格式异常会在预览中提示。</li>
            <li>任何导入操作都不会自动审核或发送邮件。</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
