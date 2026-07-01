"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Globe2 } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/products", label: "产品中心" },
  { href: "/custom-injection-molding", label: "注塑定制" },
  { href: "/industries", label: "应用行业" },
  { href: "/factory-capability", label: "工厂实力" },
  { href: "/about", label: "关于我们" },
  { href: "/faq", label: "FAQ" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-graphite-950/78 backdrop-blur-2xl">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={site.name}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-electric-400/40 bg-white/10 text-sm font-bold text-white shadow-glow">
            JC
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white sm:text-base">{site.name}</span>
            <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.2em] text-steel-300">
              Rubber & Plastic
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition ${
                  active ? "bg-white/10 text-white" : "text-steel-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-sm text-steel-300 transition hover:border-white/25 hover:text-white">
            <Globe2 className="h-4 w-4" />
            EN
          </button>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-graphite-950 transition hover:bg-electric-400"
          >
            发送询盘
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-md border border-white/10 text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="打开菜单"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-graphite-950/96 px-5 py-4 lg:hidden">
          <nav className="grid gap-2" aria-label="移动端导航">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm text-steel-300 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-graphite-950"
            >
              发送询盘
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
