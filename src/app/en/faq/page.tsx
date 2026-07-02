import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "FAQ | Custom Injection Molding",
  description: "Common questions about injection molding, custom plastic parts, trial production, OEM, material selection and delivery."
};

export default function EnglishFAQPage() {
  return <InfoPageView kind="faq" />;
}
