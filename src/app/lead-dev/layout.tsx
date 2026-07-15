import type { Metadata } from "next";
import { CrmShell } from "@/features/lead-dev/components/CrmShell";

export const metadata: Metadata = {
  title: "Jincong CRM",
  robots: { index: false, follow: false }
};

export default function LeadDevLayout({ children }: { children: React.ReactNode }) {
  return <CrmShell>{children}</CrmShell>;
}
