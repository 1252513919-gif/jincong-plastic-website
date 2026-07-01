"use client";

import Link from "next/link";
import Image from "next/image";
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
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/78 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={site.name}>
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Image
              src="/images/logo/jincong-logo.jpg"
              alt={`${site.name} Logo`}
              fill
              sizes="44px"
              className="scale-[1.42] object-cover object-[center_28%]"
              priority
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-slate-950 sm:text-base">{site.name}</span>
            <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.2em] text-slate-500">
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
                  active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-slate-950">
            <Globe2 className="h-4 w-4" />
            EN
          </button>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            发送询盘
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-950 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="打开菜单"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white/96 px-5 py-4 shadow-lg backdrop-blur-xl lg:hidden">
          <nav className="grid gap-2" aria-label="移动端导航">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
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
