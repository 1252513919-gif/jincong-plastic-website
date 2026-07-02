"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, CheckCircle2, Factory, Layers3, Mail, Phone, Sparkles, Workflow } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

const ManufacturingScene = dynamic(
  () => import("@/components/ManufacturingScene").then((module) => module.ManufacturingScene),
  {
    ssr: false,
    loading: () => <div className="h-72 rounded-[2rem] bg-gradient-to-br from-white via-slate-50 to-sky-100" />
  }
);

const statIcons = [Factory, Layers3, Sparkles, Workflow];

const keywordPositions = [
  "left-4 top-[18%] md:left-[10%] md:top-[24%]",
  "right-3 top-[20%] md:right-[11%] md:top-[25%]",
  "left-6 bottom-[25%] md:left-[14%] md:bottom-[26%]",
  "right-6 bottom-[24%] md:right-[14%] md:bottom-[27%]",
  "left-1/2 top-[13%] -translate-x-1/2 md:top-[15%]",
  "left-[8%] top-[50%] md:left-[20%]",
  "right-[7%] top-[51%] md:right-[20%]"
];

export function HomePage() {
  const { language, copy } = useLanguage();

  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
        <div className="absolute inset-0 soft-grid opacity-70" />
        <div className="absolute left-[-14rem] top-12 h-[34rem] w-[34rem] rounded-full bg-sky-200/45 blur-3xl" />
        <div className="absolute right-[-12rem] top-20 h-[32rem] w-[32rem] rounded-full bg-orange-100/70 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-cyan-100/70 blur-3xl" />

        {copy.hero.keywords.map((keyword, index) => (
          <motion.span
            key={keyword}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35 + index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-10 hidden rounded-full border border-slate-200/80 bg-white/75 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur sm:inline-flex ${keywordPositions[index]}`}
          >
            {keyword}
          </motion.span>
        ))}

        <div className="section-shell relative z-20 py-14 text-center lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-5xl"
          >
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/78 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              {copy.hero.eyebrow}
            </div>
            <h1 className="mx-auto mt-8 max-w-5xl font-['Microsoft_YaHei','PingFang_SC','Noto_Sans_SC',sans-serif] text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              {copy.hero.title}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-xl font-medium leading-8 text-slate-700 sm:text-2xl">
              {copy.hero.subtitle}
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{copy.hero.description}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={localizedPath(language, "/products")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] transition hover:-translate-y-1 hover:bg-sky-700"
              >
                {copy.actions.products}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localizedPath(language, "/contact")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/85 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50"
              >
                {copy.actions.contact}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-3xl"
          >
            <div className="premium-card relative overflow-hidden rounded-[2.25rem] p-4 md:p-5">
              <div className="absolute inset-0 noise-overlay opacity-15" />
              <div className="relative hidden h-64 md:block">
                <ManufacturingScene />
              </div>
              <div className="relative grid gap-3 md:grid-cols-3">
                {copy.hero.visualLabels.map((label) => (
                  <div key={label} className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <a
          href="#home-intro"
          aria-label={language === "zh" ? "向下浏览" : "Scroll down"}
          className="absolute bottom-6 left-1/2 z-30 grid h-12 w-12 -translate-x-1/2 animate-bounce place-items-center rounded-full border border-slate-200 bg-white/85 text-slate-700 shadow-lg backdrop-blur transition hover:bg-sky-50"
        >
          <ArrowDown className="h-5 w-5" />
        </a>
      </section>

      <section id="home-intro" className="relative overflow-hidden py-20 lg:py-28">
        <div className="section-shell">
          <Reveal className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <div className="eyebrow">{copy.intro.eyebrow}</div>
              <h2 className="section-title">{copy.intro.title}</h2>
              <p className="section-copy">{copy.intro.body}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.intro.points.map((point) => (
                <div key={point} className="premium-card rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.11)]">
                  <CheckCircle2 className="h-5 w-5 text-sky-600" />
                  <div className="mt-4 text-base font-semibold text-slate-950">{point}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h3 className="text-2xl font-semibold text-slate-950">{copy.intro.customerTitle}</h3>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">{copy.intro.customerText}</p>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {copy.stats.map((stat, index) => {
              const Icon = statIcons[index] ?? Sparkles;
              return (
                <Reveal key={stat.label} delay={index * 0.04} className="premium-card rounded-[1.75rem] p-6 transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(14,165,233,0.12)]">
                  <Icon className="h-6 w-6 text-sky-600" />
                  <div className="mt-5 text-4xl font-semibold text-slate-950">{stat.value}</div>
                  <div className="mt-2 font-semibold text-slate-800">{stat.label}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{stat.note}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <Reveal>
            <div className="eyebrow">Product Series</div>
            <h2 className="section-title">{language === "zh" ? "五大产品方向，按实际加工需求沟通定制" : "Five product directions for practical custom manufacturing"}</h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {copy.series.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 0.04}
                className={`group premium-card min-h-52 rounded-[2rem] p-6 transition duration-300 hover:-translate-y-2 hover:shadow-[0_32px_100px_rgba(15,23,42,0.12)] ${
                  index === 0 || index === 5 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-600" />
                </div>
                <h3 className="mt-7 text-2xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="absolute inset-0 soft-grid opacity-50" />
        <div className="section-shell relative">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <Reveal>
              <div className="eyebrow">Capability / Process</div>
              <h2 className="section-title">{language === "zh" ? "材料、试产、代工和交付流程清楚可沟通" : "Clear discussion from material and trial runs to delivery"}</h2>
              <p className="section-copy">{copy.pages.custom.description}</p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {copy.capabilities.map((item, index) => (
                <Reveal key={item} delay={index * 0.03} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
                  <CheckCircle2 className="h-5 w-5 text-sky-600" />
                  <p className="mt-4 text-sm font-semibold leading-6 text-slate-800">{item}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-7">
            {copy.process.map((step, index) => (
              <Reveal key={step} delay={index * 0.03} className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-xs font-semibold text-sky-600">0{index + 1}</div>
                <div className="mt-4 text-sm font-semibold leading-6 text-slate-950">{step}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <Reveal className="premium-card rounded-[2.25rem] p-7 lg:p-9">
              <div className="eyebrow">Applications</div>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 lg:text-4xl">
                {language === "zh" ? "面向多行业常用塑料零部件需求" : "Plastic parts for multi-industry applications"}
              </h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {copy.series.slice(0, 5).map((item) => (
                  <span key={item.title} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    {item.title}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative overflow-hidden rounded-[2.25rem] bg-slate-950 p-7 text-white shadow-[0_34px_110px_rgba(15,23,42,0.2)] lg:p-9">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/25 blur-3xl" />
              <div className="absolute -bottom-28 left-8 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
              <div className="relative">
                <div className="text-sm uppercase tracking-[0.22em] text-sky-200">Direct Contact</div>
                <h2 className="mt-4 text-3xl font-semibold lg:text-4xl">{copy.contact.title}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">{copy.contact.body}</p>
                <div className="mt-7 grid gap-3 text-sm text-slate-200">
                  <span className="flex items-center gap-3"><Phone className="h-4 w-4 text-sky-300" />{site.phone}</span>
                  <span className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-sky-300" />{copy.contact.wechat}: {site.wechat}</span>
                  <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-sky-300" />{site.email}</span>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href={localizedPath(language, "/contact")} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-1 hover:bg-sky-50">
                    {copy.contact.submit}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href={localizedPath(language, "/products")} className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10">
                    {copy.actions.products}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
