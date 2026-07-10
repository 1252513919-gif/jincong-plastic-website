import type { Metadata } from "next";
import Link from "next/link";
import { LeadDevLogoutButton } from "@/features/lead-dev/components/LeadDevLogoutButton";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

export default function LeadDevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white/95 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Lead Development</p>
            <h2 className="text-lg font-semibold text-slate-950">本地企业客户开发系统</h2>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
            <Link href="/lead-dev">仪表盘</Link>
            <Link href="/lead-dev/leads">客户</Link>
            <Link href="/lead-dev/queue">发送队列</Link>
            <Link href="/lead-dev/follow-ups">跟进</Link>
            <Link href="/lead-dev/suppression">拒绝联系名单</Link>
            <LeadDevLogoutButton />
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
