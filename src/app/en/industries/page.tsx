import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "Industries | Automotive Electronics Furniture Pet Products",
  description: "Custom injection molded plastic parts for automotive, electronics, furniture, pet products, instrumentation and equipment."
};

export default function EnglishIndustriesPage() {
  return <InfoPageView kind="industries" />;
}
