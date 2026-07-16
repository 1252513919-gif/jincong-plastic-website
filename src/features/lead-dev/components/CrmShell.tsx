"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  CalendarCheck,
  FileText,
  Inbox,
  LayoutList,
  Menu,
  Search,
  Settings,
  ShieldOff,
  Upload,
  UsersRound,
  X
} from "lucide-react";
import { LeadDevLogoutButton } from "@/features/lead-dev/components/LeadDevLogoutButton";

const navItems = [
  { href: "/lead-dev", label: "仪表盘", icon: BarChart3 },
  { href: "/lead-dev/leads", label: "客户线索", icon: UsersRound },
  { href: "/lead-dev/follow-ups", label: "跟进中心", icon: LayoutList },
  { href: "/lead-dev/follow-ups#today", label: "今日待办", icon: CalendarCheck },
  { href: "/lead-dev/queue", label: "邮件草稿", icon: Inbox },
  { href: "/lead-dev/suppression", label: "拒绝名单", icon: ShieldOff },
  { href: "/lead-dev/leads#lead-import-export", label: "导入导出", icon: Upload },
  { href: "/lead-dev/queue#settings", label: "系统设置", icon: Settings }
];

export function CrmShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLogin = pathname === "/lead-dev/login";

  if (isLogin) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const activeItem = navItems.find((item) =>
    item.href === "/lead-dev" ? pathname === item.href : pathname.startsWith(item.href.split("#")[0])
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside
        style={{ width: 220 }}
        className="fixed inset-y-0 left-0 z-40 hidden w-[220px] border-r border-slate-800 bg-slate-950 px-3 py-4 text-white lg:block"
      >
        <CrmBrand />
        <CrmNav pathname={pathname} />
        <div className="absolute bottom-4 left-3 right-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Safety</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">TEST_MODE=true，仅允许测试收件人，CRM 无定时发送任务。</p>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden">
          <div className="h-full w-[280px] bg-slate-950 px-3 py-4 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <CrmBrand compact />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl border border-white/10 p-2 text-slate-300"
                aria-label="关闭菜单"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <CrmNav pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-56">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
              aria-label="打开菜单"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Jincong CRM</p>
              <h2 className="truncate text-base font-semibold tracking-[-0.02em] text-slate-950">
                {activeItem?.label ?? "客户开发后台"}
              </h2>
            </div>
            <div className="ml-auto hidden min-w-[280px] max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
              <Search className="h-4 w-4" />
              <span className="text-slate-400">CRM 搜索</span>
              <input
                aria-label="CRM 搜索"
                placeholder="搜索客户、联系人、邮箱"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <Link
              href="/lead-dev/leads#lead-import-export"
              className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 sm:inline-flex"
            >
              快速导入
            </Link>
            <div className="hidden rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:block">
              TEST_MODE=true
            </div>
            <LeadDevLogoutButton />
          </div>
        </header>

        <main className="px-3 py-4 sm:px-5 lg:px-6">{children}</main>
      </div>
    </div>
  );
}

function CrmBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/lead-dev" className={`block rounded-2xl bg-white/[0.04] ${compact ? "p-3" : "p-4"}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Jincong</p>
      <h1 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white">CRM</h1>
      {!compact && <p className="mt-1 text-xs leading-5 text-slate-400">线索池与客户跟进</p>}
    </Link>
  );
}

function CrmNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="mt-4 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const baseHref = item.href.split("#")[0];
        const active = baseHref === "/lead-dev" ? pathname === baseHref : pathname.startsWith(baseHref);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
              active ? "bg-white text-slate-950" : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
