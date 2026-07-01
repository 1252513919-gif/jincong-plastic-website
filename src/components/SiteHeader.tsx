"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Globe2, Menu, X } from "lucide-react";
import { useState } from "react";
import { content } from "@/i18n/site-content";
import { getLocaleFromPath, localizedPath, stripLocale } from "@/i18n/routing";
import { site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const copy = content[locale];
  const [open, setOpen] = useState(false);
  const targetLocale = locale === "zh" ? "en" : "zh";
  const cleanPath = stripLocale(pathname);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/70 bg-white/82 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link href={localizedPath(locale, "/")} className="flex min-w-0 items-center gap-3" aria-label={site.name}>
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.1)]">
            <Image
              src="/images/logo/jincong-logo.jpg"
              alt={`${site.name} Logo`}
              fill
              sizes="44px"
              className="scale-[1.38] object-cover object-[center_30%]"
              priority
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-slate-950 sm:text-base">
              {locale === "zh" ? site.name : "Jincong Rubber & Plastic"}
            </span>
            <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Injection Molding
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={locale === "zh" ? "主导航" : "Primary navigation"}>
          {copy.nav.map((item) => {
            const href = localizedPath(locale, item.href);
            const active = item.href === "/" ? cleanPath === "/" : cleanPath.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={href}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  active
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={localizedPath(targetLocale, cleanPath)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-slate-950"
          >
            <Globe2 className="h-4 w-4" />
            {copy.altLang}
          </Link>
          <Link
            href={localizedPath(locale, "/contact")}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            {copy.actions.quote}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-sm lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={locale === "zh" ? "打开菜单" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white/96 px-5 py-4 shadow-lg backdrop-blur-xl lg:hidden">
          <nav className="grid gap-2" aria-label={locale === "zh" ? "移动端导航" : "Mobile navigation"}>
            {copy.nav.map((item) => (
              <Link
                key={item.href}
                href={localizedPath(locale, item.href)}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Link
                href={localizedPath(targetLocale, cleanPath)}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                <Globe2 className="h-4 w-4" />
                {copy.altLang}
              </Link>
              <Link
                href={localizedPath(locale, "/contact")}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
              >
                {copy.actions.quote}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
