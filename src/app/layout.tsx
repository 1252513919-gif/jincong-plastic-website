import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} | 注塑加工与塑料件定制工厂`,
    template: `%s | ${site.name}`
  },
  description:
    "邢台锦聪橡塑有限公司专注塑料件注塑加工、来图来样定制、小批量试产、OEM代工和工厂直供，产品覆盖塑料平垫、汽车塑料件、电子电器塑料件、宠物用品塑料件、家具塑料配件等。",
  keywords: site.keywords,
  icons: {
    icon: "/images/logo/jincong-logo.jpg",
    shortcut: "/images/logo/jincong-logo.jpg"
  },
  openGraph: {
    title: `${site.name} | 注塑加工与塑料件定制工厂`,
    description: "来图来样定制、小批量试产、OEM代工、工厂直供。",
    images: ["/images/hero-injection-factory.png"],
    locale: "zh_CN",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <SmoothScroll />
        <SiteHeader />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
