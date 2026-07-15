"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Inbox, ListChecks, ShieldOff, UsersRound } from "lucide-react";
import { LeadDevLogoutButton } from "@/features/lead-dev/components/LeadDevLogoutButton";

const navItems = [
  { href: "/lead-dev", label: "仪表盘", icon: BarChart3 },
  { href: "/lead-dev/leads", label: "客户线索", icon: UsersRound },
  { href: "/lead-dev/follow-ups", label: "跟进中心", icon: ListChecks },
  { href: "/lead-dev/queue", label: "邮件草稿", icon: Inbox },
  { href: "/lead-dev/suppression", label: "拒绝名单", icon: ShieldOff }
];

export function CrmShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/lead-dev/login";

  if (isLogin) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const activeItem = navItems.find((item) =>
    item.href === "/lead-dev" ? pathname === item.href : pathname.startsWith(item.href)
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200/80 bg-white/90 px-5 py-6 shadow-[12px_0_40px_rgba(15,23,42,0.04)] backdrop-blur-xl lg:block">
        <Link href="/lead-dev" className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Jincong CRM</p>
          <h1 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">客户开发后台</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">线索、跟进、导入导出与开发信审核</p>
        </Link>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/lead-dev" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Safety</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">TEST_MODE 保持开启，邮件发送仅允许测试收件人。</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                <FileText className="h-3.5 w-3.5" />
                CRM Workspace
              </p>
              <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {activeItem?.label ?? "客户开发后台"}
              </h2>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:block">
                TEST_MODE=true
              </div>
              <LeadDevLogoutButton />
            </div>
          </div>

          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map((item) => {
              const active = item.href === "/lead-dev" ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                    active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
