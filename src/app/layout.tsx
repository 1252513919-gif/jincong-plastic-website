/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
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
    images: ["/images/logo/jincong-logo.jpg"],
    locale: "zh_CN",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
