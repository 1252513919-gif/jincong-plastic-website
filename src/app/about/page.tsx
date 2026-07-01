import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于我们",
  description: `${site.name}专注塑料件注塑加工、来图来样定制、小批量试产、OEM代工与工厂直供。`
};

export default function AboutPage() {
  return <InfoPageView locale="zh" kind="about" />;
}
