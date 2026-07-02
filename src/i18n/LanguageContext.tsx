"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { content } from "./site-content";
import { getLocaleFromPath, type Locale } from "./routing";

type LanguageContextValue = {
  language: Locale;
  setLanguage: (locale: Locale) => void;
  toggleLanguage: () => void;
  copy: (typeof content)[Locale];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("jincong-language");
      if (saved === "zh" || saved === "en") return saved;
      return getLocaleFromPath(window.location.pathname);
    }
    return getLocaleFromPath(pathname || "/");
  });

  const setLanguage = (locale: Locale) => {
    setLanguageState(locale);
    window.localStorage.setItem("jincong-language", locale);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === "zh" ? "en" : "zh"),
      copy: content[language]
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
