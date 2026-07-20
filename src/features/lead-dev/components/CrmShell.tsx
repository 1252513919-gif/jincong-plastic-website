"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  CalendarCheck,
  ChevronDown,
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

const navSections = [
  {
    label: "工作台",
    items: [
      { href: "/lead-dev", label: "仪表盘", icon: BarChart3 },
      { href: "/lead-dev/today", label: "今日待办", icon: CalendarCheck }
    ]
  },
  {
    label: "客户",
    items: [
      { href: "/lead-dev/leads", label: "客户线索", icon: UsersRound },
      { href: "/lead-dev/follow-ups", label: "跟进中心", icon: LayoutList }
    ]
  },
  {
    label: "邮件",
    items: [
      { href: "/lead-dev/queue", label: "邮件草稿", icon: Inbox },
      { href: "/lead-dev/suppression", label: "拒绝名单", icon: ShieldOff }
    ]
  },
  {
    label: "数据",
    items: [
      { href: "/lead-dev/import-export", label: "导入导出", icon: Upload },
      { href: "/lead-dev/settings", label: "系统设置", icon: Settings }
    ]
  }
];

const navItems = navSections.flatMap((section) => section.items);

export function CrmShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLogin = pathname === "/lead-dev/login";

  if (isLogin) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const activeItem = navItems.find((item) => isActivePath(pathname, item.href));

  return (
    <div className="crm-layout min-h-screen bg-[#f5f7fa] text-slate-950">
      <aside className="crm-sidebar w-[220px] border-r border-slate-800 bg-[#0b1220] px-3 py-4 text-white">
        <CrmBrand />
        <CrmNav pathname={pathname} />
        <CrmAccount />
      </aside>

      {menuOpen && (
        <div className="crm-mobile-drawer fixed inset-0 z-50 bg-slate-950/45">
          <div className="h-full w-[292px] bg-[#0b1220] px-3 py-4 text-white shadow-2xl">
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
            <CrmNav
              pathname={pathname}
              onNavigate={() => {
                setMenuOpen(false);
              }}
            />
            <CrmAccount compact />
          </div>
        </div>
      )}

      <div className="crm-main min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="crm-mobile-menu-button rounded-xl border border-slate-200 p-2 text-slate-700"
              aria-label="打开菜单"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Jincong CRM</p>
              <h2 className="truncate text-base font-semibold tracking-[-0.02em] text-slate-950">
                {activeItem?.label ?? "客户开发后台"}
              </h2>
            </div>

            <form action="/lead-dev/leads" className="crm-top-search ml-auto min-w-[260px] max-w-xl flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              <Search className="h-4 w-4 shrink-0" />
              <input
                name="q"
                aria-label="CRM 搜索"
                placeholder="搜索客户、联系人、邮箱"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </form>

            <Link
              href="/lead-dev/import-export"
              prefetch
              className="crm-toolbar-action rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              导入客户
            </Link>
            <Link
              href="/lead-dev/today"
              prefetch
              className="crm-toolbar-action rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              今日待办
            </Link>
            <div className="crm-toolbar-account items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              管理员
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
            <LeadDevLogoutButton />
          </div>
        </header>

        <main className="min-w-0 px-3 py-4 sm:px-5 lg:px-6">{children}</main>
      </div>
    </div>
  );
}

function CrmBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/lead-dev" className={`block rounded-2xl border border-white/10 bg-white/[0.04] ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950">
          JC
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[-0.02em] text-white">Jincong CRM</p>
          <p className="mt-0.5 text-[11px] text-slate-400">客户线索与跟进</p>
        </div>
      </div>
    </Link>
  );
}

function CrmNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="mt-5 space-y-5">
      {navSections.map((section) => (
        <div key={section.label}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{section.label}</p>
          <div className="mt-2 space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  onClick={onNavigate}
                  className={`group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium ${
                    active
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-blue-600" : "bg-transparent group-hover:bg-slate-500"}`} />
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function isActivePath(pathname: string, href: string) {
  return href === "/lead-dev" ? pathname === href : pathname.startsWith(href);
}

function CrmAccount({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`crm-account mt-auto rounded-2xl border border-white/10 bg-white/[0.04] ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">管</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">管理员</p>
          <p className="mt-0.5 text-xs text-emerald-300">TEST_MODE=true</p>
        </div>
      </div>
    </div>
  );
}
