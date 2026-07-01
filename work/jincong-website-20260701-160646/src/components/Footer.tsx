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
    <footer className="border-t border-white/10 bg-graphite-950">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="text-lg font-semibold text-white">{site.name}</div>
          <div className="mt-2 text-sm uppercase tracking-[0.18em] text-steel-500">{site.englishName}</div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-steel-300">
            专注塑料件注塑加工、来图来样定制、小批量试产与 OEM 代工，面向汽配、电子电器、家具、宠物用品等行业提供稳定交付。
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">快速入口</div>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-steel-300 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">联系信息</div>
          <div className="mt-4 grid gap-3 text-sm text-steel-300">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-electric-400" />
              {site.phone}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-electric-400" />
              {site.email}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-electric-400" />
              {site.location}
            </span>
          </div>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-electric-400/35 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-electric-400/15"
          >
            <Send className="h-4 w-4" />
            提交定制需求
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-steel-500">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
