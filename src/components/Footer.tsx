import Link from "next/link";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { site } from "@/lib/site";

const footerLinks = [
  { href: "/products", label: "产品中心" },
  { href: "/custom-injection-molding", label: "注塑定制服务" },
  { href: "/factory-capability", label: "工厂实力" },
  { href: "/contact", label: "联系我们" }
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-shell py-12">
        <div className="grid gap-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 md:grid-cols-[1.35fr_0.85fr_1fr] lg:p-8">
          <div>
            <div className="text-lg font-semibold text-slate-950">{site.name}</div>
            <div className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-500">{site.englishName}</div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              专注塑料件注塑加工、来图来样定制、小批量试产与 OEM 代工，面向汽配、电子电器、家具、宠物用品等行业提供稳定交付。
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <Send className="h-4 w-4" />
              提交定制需求
            </Link>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-950">快速入口</div>
            <div className="mt-4 grid gap-3">
              {footerLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-slate-600 transition hover:text-sky-700">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-950">联系信息</div>
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
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
