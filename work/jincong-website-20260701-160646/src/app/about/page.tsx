import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于我们",
  description: `${site.name}专注塑料件注塑加工、来图来样定制、小批量试产、OEM代工与工厂直供。`
};

export default function AboutPage() {
  return (
    <PageHero
      eyebrow="About"
      title="关于邢台锦聪橡塑有限公司"
      description="页面结构已预留，可继续补充企业介绍、发展历程、服务客户、工厂照片和资质信息。"
    />
  );
}
