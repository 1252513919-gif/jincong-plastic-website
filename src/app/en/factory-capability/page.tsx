import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "Factory Capability | Injection Molding Support",
  description: "Factory capability for material selection, trial production, batch injection molding and stable delivery."
};

export default function EnglishFactoryCapabilityPage() {
  return <InfoPageView locale="en" kind="factory" />;
}
