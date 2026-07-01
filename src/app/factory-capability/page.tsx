import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "工厂实力 | 注塑加工能力",
  description: "展示邢台锦聪橡塑有限公司注塑加工、模具配合、试产、批量生产与质量控制能力。"
};

export default function FactoryCapabilityPage() {
  return (
    <PageHero
      eyebrow="Factory Capability"
      title="工厂实力"
      description="页面结构已预留，可继续补充设备、车间、模具、质检、仓储和生产流程图片。"
    />
  );
}
