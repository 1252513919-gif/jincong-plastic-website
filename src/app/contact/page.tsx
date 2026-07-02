import type { Metadata } from "next";
import { ContactPageView } from "@/components/ContactPageView";

export const metadata: Metadata = {
  title: "联系我们 | 注塑加工询盘",
  description: "联系邢台锦聪橡塑有限公司，提交塑料件注塑加工、来图来样定制、小批量试产、OEM代工询盘需求。"
};

export default function ContactPage() {
  return <ContactPageView />;
}
