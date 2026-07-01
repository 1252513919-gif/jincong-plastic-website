export type Locale = "zh" | "en";

const routes = [
  "/",
  "/products",
  "/custom-injection-molding",
  "/industries",
  "/factory-capability",
  "/about",
  "/contact",
  "/faq"
] as const;

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh";
}

export function stripLocale(pathname: string) {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.replace(/^\/en/, "") || "/";
  return pathname || "/";
}

export function localizedPath(locale: Locale, pathname: string) {
  const cleanPath = stripLocale(pathname);
  if (locale === "zh") return cleanPath;
  return cleanPath === "/" ? "/en" : `/en${cleanPath}`;
}

export function isKnownRoute(pathname: string) {
  return routes.includes(stripLocale(pathname) as (typeof routes)[number]);
}
