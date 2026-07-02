import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "注塑定制服务 | 来图来样 小批量试产 OEM代工",
  description: "塑料件注塑定制服务，支持来图来样加工、小批量试产、OEM代工、材料建议、试模试产和批量交付。"
};

export default function CustomInjectionMoldingPage() {
  return <InfoPageView kind="custom" />;
}
