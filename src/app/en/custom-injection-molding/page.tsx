import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";

export const metadata: Metadata = {
  title: "Custom Injection Molding | OEM and Small Batch",
  description: "Custom plastic injection molding based on drawings and samples, with small-batch trial production and OEM support."
};

export default function EnglishCustomInjectionMoldingPage() {
  return <InfoPageView kind="custom" />;
}
