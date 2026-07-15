"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LanguageProvider } from "@/i18n/LanguageContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCrmRoute = pathname.startsWith("/lead-dev");

  if (isCrmRoute) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <SmoothScroll />
      <SiteHeader />
      <main>{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
