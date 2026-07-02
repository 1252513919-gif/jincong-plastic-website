import type { Metadata } from "next";
import { InfoPageView } from "@/components/InfoPageView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `${site.englishName} focuses on injection molding, custom plastic parts, OEM processing and direct factory supply.`
};

export default function EnglishAboutPage() {
  return <InfoPageView kind="about" />;
}
