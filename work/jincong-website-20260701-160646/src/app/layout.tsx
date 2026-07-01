import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} | 注塑加工厂家 | 塑料件定制 OEM 代工`,
    template: `%s | ${site.name}`
  },
  description: "邢台锦聪橡塑有限公司是一家塑料件注塑加工厂家，支持来图来样定制、小批量试产、OEM代工、工厂直供，产品涵盖塑料平垫/垫片、汽车塑料件、电子电器塑料件、宠物用品塑料件、家具塑料配件。",
  keywords: site.keywords,
  openGraph: {
    title: `${site.name} | 注塑加工厂家`,
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
        <SiteHeader />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
