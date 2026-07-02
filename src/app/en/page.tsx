import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Injection Molding & Custom Plastic Parts Factory",
  description:
    "Xingtai Jincong Rubber & Plastic Co., Ltd. provides injection molding, custom plastic parts, OEM processing, small-batch trial production and direct factory supply."
};

export default function EnglishHomePage() {
  return <HomePage />;
}
