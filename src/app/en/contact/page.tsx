import type { Metadata } from "next";
import { ContactPageView } from "@/components/ContactPageView";

export const metadata: Metadata = {
  title: "Contact Us | Injection Molding Inquiry",
  description: "Contact Xingtai Jincong Rubber & Plastic Co., Ltd. for custom plastic injection molding and OEM inquiries."
};

export default function EnglishContactPage() {
  return <ContactPageView locale="en" />;
}
