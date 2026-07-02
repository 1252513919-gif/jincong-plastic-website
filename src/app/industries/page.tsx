import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "应用行业 | 汽配 电子电器 家具 宠物用品",
  description: "注塑加工产品应用于汽车配套、电子电器、家具配件、宠物用品、仪器仪表和工业设备等行业。"
};

export default function IndustriesPage() {
  return <InfoPageView kind="industries" />;
}
