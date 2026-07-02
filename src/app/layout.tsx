import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name}｜注塑加工｜塑料件定制｜OEM/ODM`,
    template: `%s | ${site.name}`
  },
  description:
    "邢台锦聪橡塑有限公司提供注塑加工、塑料件定制、来图来样加工、小批量试产、OEM/ODM、工厂直供服务，覆盖宠物用品、电子电气、家具配件、平垫系列、汽车塑料件等多行业塑料零部件。",
  keywords: site.keywords,
  icons: {
    icon: "/images/logo/jincong-logo.jpg",
    shortcut: "/images/logo/jincong-logo.jpg"
  },
  openGraph: {
    title: `${site.name}｜注塑加工｜塑料件定制｜OEM/ODM`,
    description: "来图来样加工、小批量试产、OEM/ODM、工厂直供。",
    images: ["/images/hero-injection-factory.png"],
    locale: "zh_CN",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <LanguageProvider>
          <SmoothScroll />
          <SiteHeader />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
