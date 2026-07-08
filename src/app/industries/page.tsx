import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "应用行业 | 汽车 电子电气 家具 宠物用品",
  description: "注塑加工产品可应用于汽车配件、电子电气、家具配件、宠物用品、仪器仪表和其他定制塑料结构件。"
};

export default function IndustriesPage() {
  return <InfoPageView kind="industries" />;
}
