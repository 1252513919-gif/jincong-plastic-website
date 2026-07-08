import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于锦聪 | 注塑加工与塑料零部件定制",
  description: `${site.name}从事注塑加工与塑料零部件定制，支持来图来样加工、小批量试产、OEM/ODM 定制和工厂直连沟通。`
};

export default function AboutPage() {
  return <InfoPageView kind="about" />;
}
