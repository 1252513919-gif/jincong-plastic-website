"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import { CapabilityTicker } from "./CapabilityTicker";
import { GradientButton } from "./GradientButton";
import { getHeroContent } from "./hero-content";
import "@/styles/home-hero.css";

const lineCount = 20;

export function HomeHero() {
  const { language } = useLanguage();
  const content = getHeroContent(language);

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <HeroBackgroundVideo />
      <SideLines side="left" />
      <SideLines side="right" />

      <div className="home-hero__inner">
        <div className="home-hero__content">
          <div className="home-hero__top-ticker">
            <CapabilityTicker items={content.ticker} />
          </div>

          <h1 className="home-hero__title" id="home-hero-title">
            <span>{content.headline[0]}</span>
            <span>{content.headline[1]}</span>
            <span className="home-hero__title-emphasis">
              {content.headline[2]}
            </span>
          </h1>

          <p className="home-hero__description">{content.description}</p>

          <div className="home-hero__actions">
            <GradientButton href={localizedPath(language, "/contact")}>
              {content.primaryCta}
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
            </GradientButton>
            <Link
              className="home-hero__secondary-button"
              href={localizedPath(language, "/products")}
            >
              {content.secondaryCta}
            </Link>
          </div>
        </div>

      </div>

      <div className="home-hero__capability-strip">
        <CapabilityTicker
          items={content.capabilities}
          label={content.capabilityLabel}
          variant="strip"
        />
      </div>

      <a
        className="home-hero__scroll-cue"
        href="#home-intro"
        aria-label={language === "zh" ? "向下浏览" : "Scroll to introduction"}
      >
        <ArrowDown aria-hidden="true" size={18} strokeWidth={1.8} />
      </a>
      <div className="home-hero__progressive-blur" aria-hidden="true" />
    </section>
  );
}

function HeroBackgroundVideo() {
  return (
    <div className="home-hero__video-bg" aria-hidden="true">
      <video
        src="/images/factory/hero-background.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="home-hero__video-overlay" />
    </div>
  );
}

function SideLines({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`home-hero__side-lines home-hero__side-lines--${side}`}
      aria-hidden="true"
    >
      {Array.from({ length: lineCount }, (_, index) => (
        <span
          key={index}
          style={{
            width: `${60 + index * 10}px`,
            animationDelay: `${index * 0.25}s`
          }}
        />
      ))}
    </div>
  );
}
