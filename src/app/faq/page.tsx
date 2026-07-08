import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "常见问题 | 注塑加工定制 FAQ",
  description: "注塑加工、来图来样定制、小批量试产、OEM/ODM、材料选择、报价和交期相关常见问题。"
};

export default function FAQPage() {
  return <InfoPageView kind="faq" />;
}
