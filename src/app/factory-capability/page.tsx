import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "关于锦聪 | 工厂介绍与加工能力",
  description: "了解邢台锦聪橡塑有限公司的注塑加工、塑料件定制、样品确认、小批量试产和批量供货配合能力。"
};

export default function FactoryCapabilityPage() {
  return <InfoPageView kind="about" />;
}
