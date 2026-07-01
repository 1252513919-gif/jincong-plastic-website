import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "应用行业 | 汽配 电子电器 家具 宠物用品",
  description: "邢台锦聪橡塑有限公司注塑加工产品应用于汽车配套、电子电器、家具配件、宠物用品、机械连接等行业。"
};

export default function IndustriesPage() {
  return (
    <PageHero
      eyebrow="Industries"
      title="应用行业"
      description="页面结构已预留，可继续扩展汽车配套、电子电器、家具配件、宠物用品和机械连接等行业案例。"
    />
  );
}
