"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { content } from "@/i18n/site-content";
import { getLocaleFromPath, localizedPath } from "@/i18n/routing";
import { site } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const copy = content[locale];

  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="section-shell py-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-6 shadow-[0_28px_100px_rgba(15,23,42,0.08)] md:grid md:grid-cols-[1.25fr_0.85fr_1fr] md:gap-8 lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-200/35 blur-3xl" />
          <div className="relative">
            <div className="text-lg font-semibold text-slate-950">
              {locale === "zh" ? site.name : site.englishName}
            </div>
            <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">Jincong Manufacturing</div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{copy.footer.summary}</p>
            <Link
              href={localizedPath(locale, "/contact")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              <Send className="h-4 w-4" />
              {copy.contact.submit}
            </Link>
          </div>

          <div className="relative mt-8 md:mt-0">
            <div className="text-sm font-semibold text-slate-950">{locale === "zh" ? "快速入口" : "Quick Links"}</div>
            <div className="mt-4 grid gap-3">
              {copy.nav.slice(1, 6).map((item) => (
                <Link
                  key={item.href}
                  href={localizedPath(locale, item.href)}
                  className="text-sm text-slate-600 transition hover:text-sky-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mt-8 md:mt-0">
            <div className="text-sm font-semibold text-slate-950">{locale === "zh" ? "联系信息" : "Contact"}</div>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <span className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                {site.phone}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-600" />
                {site.email}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-600" />
                {site.location}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {locale === "zh" ? site.name : site.englishName}. All rights reserved.
      </div>
    </footer>
  );
}
