import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "工厂实力 | 注塑加工能力",
  description: "展示邢台锦聪橡塑有限公司注塑加工、材料选择、试产、批量生产与交付配合能力。"
};

export default function FactoryCapabilityPage() {
  return <InfoPageView locale="zh" kind="factory" />;
}
