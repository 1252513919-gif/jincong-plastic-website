"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Globe2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath, stripLocale } from "@/i18n/routing";
import { site } from "@/lib/site";
import "@/styles/home-hero.css";

export function SiteHeader() {
  const pathname = usePathname();
  const { language, copy, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const cleanPath = stripLocale(pathname);
  const quoteLabel =
    language === "zh" ? copy.actions.quote : "Request a Quote";

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="site-header-editorial">
      <div className="site-header-editorial__inner">
        <Link
          href={localizedPath(language, "/")}
          className="site-header-editorial__brand"
          aria-label={site.name}
        >
          <span className="site-header-editorial__wordmark">
            Jincong Plastic
          </span>
          <span className="site-header-editorial__descriptor">
            {language === "zh" ? site.name : "Injection Molding"}
          </span>
        </Link>

        <nav
          className="site-header-editorial__nav"
          aria-label={language === "zh" ? "主导航" : "Primary navigation"}
        >
          {copy.nav.map((item) => {
            const href = localizedPath(language, item.href);
            const active =
              item.href === "/"
                ? cleanPath === "/"
                : cleanPath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={href}
                className={`site-header-editorial__nav-link${
                  active ? " is-active" : ""
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-header-editorial__actions">
          <button
            type="button"
            onClick={toggleLanguage}
            className="site-header-editorial__language"
          >
            <Globe2 aria-hidden="true" size={16} strokeWidth={1.8} />
            {copy.altLang}
          </button>
          <Link
            href={localizedPath(language, "/contact")}
            className="site-header-editorial__quote"
          >
            {quoteLabel}
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
          </Link>
        </div>

        <button
          type="button"
          className="site-header-editorial__menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-label={
            language === "zh"
              ? open
                ? "关闭菜单"
                : "打开菜单"
              : open
                ? "Close menu"
                : "Open menu"
          }
          aria-expanded={open}
          aria-controls="site-mobile-menu"
        >
          <span>{language === "zh" ? "菜单" : "Menu"}</span>
          {open ? (
            <X aria-hidden="true" size={17} />
          ) : (
            <Menu aria-hidden="true" size={17} />
          )}
        </button>
      </div>

      <div
        className={`site-header-editorial__drawer${open ? " is-open" : ""}`}
        id="site-mobile-menu"
        aria-hidden={!open}
      >
        <nav
          className="site-header-editorial__drawer-nav"
          aria-label={language === "zh" ? "移动端导航" : "Mobile navigation"}
        >
          {copy.nav.map((item, index) => (
            <Link
              key={item.href}
              href={localizedPath(language, item.href)}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${80 + index * 35}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-editorial__drawer-footer">
          <button
            type="button"
            onClick={() => {
              toggleLanguage();
              setOpen(false);
            }}
            tabIndex={open ? 0 : -1}
          >
            <Globe2 aria-hidden="true" size={17} />
            {copy.altLang}
          </button>
          <Link
            href={localizedPath(language, "/contact")}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {quoteLabel}
            <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
          <p>© {new Date().getFullYear()} Jincong Plastic</p>
        </div>
      </div>
    </header>
  );
}
