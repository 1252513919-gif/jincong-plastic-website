"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, CheckCircle2, Factory, Layers3, Mail, Phone, Sparkles, Workflow } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import { catalogProducts, type CatalogProduct } from "@/lib/product-catalog";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

const statIcons = [Factory, Layers3, Sparkles, Workflow];
const keywordPositions = [
  "left-5 top-[20%] md:left-[12%] md:top-[26%]",
  "right-5 top-[22%] md:right-[12%] md:top-[28%]",
  "left-6 bottom-[28%] md:left-[15%] md:bottom-[30%]",
  "right-6 bottom-[27%] md:right-[15%] md:bottom-[31%]"
];

const seriesImageSlugs = [
  "pet-plastic-products",
  "electronic-electrical-plastic-parts",
  "furniture-plastic-fittings",
  "plastic-washers",
  "automotive-plastic-parts"
];

export function HomePage() {
  const { language, copy } = useLanguage();
  const heroProducts = seriesImageSlugs
    .map((slug) => catalogProducts.find((product) => product.category === slug))
    .filter((product): product is CatalogProduct => Boolean(product))
    .slice(0, 4);

  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(56,189,248,0.18),transparent_34rem),linear-gradient(180deg,#ffffff_0%,#f8fbff_54%,#eef7fb_100%)]"
        />
        <div className="absolute inset-0 soft-grid opacity-55" />
        <div className="absolute left-[-16rem] top-10 h-[34rem] w-[34rem] rounded-full bg-sky-100/80 blur-3xl" />
        <div className="absolute right-[-12rem] bottom-0 h-[32rem] w-[32rem] rounded-full bg-blue-100/70 blur-3xl" />

        {copy.hero.keywords.map((keyword: string, index: number) => (
          <motion.span
            key={keyword}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 + index * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-10 hidden rounded-full border border-sky-100 bg-white/78 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur sm:inline-flex ${keywordPositions[index]}`}
          >
            {keyword}
          </motion.span>
        ))}

        <div className="section-shell relative z-20 py-12 text-center lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: -16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm backdrop-blur"
          >
            <Sparkles className="h-4 w-4" />
            {copy.hero.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.28, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 max-w-5xl font-['Microsoft_YaHei','PingFang_SC','Noto_Sans_SC',sans-serif] text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl"
          >
            {copy.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-5 max-w-3xl text-xl font-medium leading-8 text-slate-700 sm:text-2xl"
          >
            {copy.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-5 max-w-[760px] space-y-2 text-sm leading-7 text-slate-600 sm:text-base"
          >
            {copy.hero.descriptionLines.map((line: string) => (
              <p key={line}>{line}</p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.86, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Link
              href={localizedPath(language, "/products")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:bg-sky-700"
            >
              {copy.actions.products}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={localizedPath(language, "/contact")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/88 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50"
            >
              {copy.actions.contact}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-4xl"
          >
            <IndustryHeroVisual products={heroProducts} labels={copy.hero.visualLabels} />
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
              {copy.intro.points.map((point: string) => (
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
            {copy.stats.map((stat, index: number) => {
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
            <h2 className="section-title">
              {language === "zh" ? "五大核心产品系列，按实际加工需求沟通定制" : "Five core product series for practical custom manufacturing"}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-6">
            {copy.series.map((item, index: number) => {
              const seriesProducts = catalogProducts.filter((product) => product.category === item.slug).slice(0, 2);
              return (
                <Reveal
                  key={item.title}
                  delay={index * 0.04}
                  className={`group premium-card rounded-[2rem] p-5 transition duration-300 hover:-translate-y-2 hover:shadow-[0_32px_100px_rgba(15,23,42,0.12)] ${
                    index < 2 ? "lg:col-span-3" : "lg:col-span-2"
                  }`}
                >
                  <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-50 to-white p-4">
                      {seriesProducts[0] && (
                        <Image src={seriesProducts[0].image} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-contain object-center transition duration-500 group-hover:scale-[1.03]" />
                      )}
                    </div>
                    <div className="hidden gap-3 sm:grid">
                      {seriesProducts.slice(1).map((product) => (
                        <div key={product.id} className="relative min-h-24 overflow-hidden rounded-[1.25rem] bg-slate-50 p-3">
                          <Image src={product.image} alt={language === "zh" ? product.nameZh : product.nameEn} fill sizes="180px" className="object-contain object-center" />
                        </div>
                      ))}
                      <div className="rounded-[1.25rem] border border-sky-100 bg-sky-50/80 p-4 text-xs font-semibold leading-5 text-sky-800">
                        {item.tags.join(" / ")}
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="section-shell relative">
          <Reveal>
            <div className="eyebrow">Process</div>
            <h2 className="section-title">{language === "zh" ? "从样品确认到批量生产，我们协助推进" : "From sample confirmation to batch production"}</h2>
          </Reveal>
          <HomeProcessFlow />
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
                {copy.series.map((item) => (
                  <span key={item.title} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                    {item.title}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="premium-card rounded-[2.25rem] p-7 lg:p-9">
              <div className="eyebrow">{language === "zh" ? "联系沟通" : "Contact"}</div>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 lg:text-4xl">
                {language === "zh" ? "有塑料件定制需求？把图纸或样品发给我们" : "Have a custom plastic part requirement?"}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{copy.contact.body}</p>
              <div className="mt-7 grid gap-3 text-sm text-slate-700">
                <span className="flex items-center gap-3"><Phone className="h-4 w-4 text-sky-600" />{copy.contact.phone}: {site.phone}</span>
                <span className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-sky-600" />{copy.contact.wechat}: {site.wechat}</span>
                <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-sky-600" />{copy.contact.email}: {site.email}</span>
              </div>
              <Link href={localizedPath(language, "/contact")} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-sky-700">
                {copy.contact.submit}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function IndustryHeroVisual({ products, labels }: { products: CatalogProduct[]; labels: string[] }) {
  return (
    <div className="premium-card relative overflow-hidden rounded-[2.25rem] p-5 md:p-6">
      <svg className="pointer-events-none absolute inset-x-8 top-8 h-28 w-[calc(100%-4rem)] text-sky-300/70" viewBox="0 0 760 120" fill="none" aria-hidden="true">
        <motion.path
          d="M10 84 C 160 8, 240 108, 380 54 S 610 28, 750 78"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.4, ease: "easeInOut" }}
        />
      </svg>
      <div className="relative mt-10 grid gap-4 md:grid-cols-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            animate={{ y: [0, index % 2 ? -5 : 5, 0] }}
            transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[1.5rem] border border-slate-200 bg-white/88 p-3 shadow-sm"
          >
            <div className="relative aspect-square rounded-[1.1rem] bg-slate-50">
              <Image src={product.image} alt={product.nameZh} fill sizes="180px" className="object-contain object-center" priority={index === 0} />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="relative mt-5 grid gap-3 md:grid-cols-3">
        {labels.map((label) => (
          <div key={label} className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeProcessFlow() {
  const { copy } = useLanguage();
  return (
    <div className="mt-12">
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-4">
          {copy.process.slice(0, 4).map((step: string, index: number) => (
            <FlowNode key={step} index={index} step={step} direction="right" />
          ))}
        </div>
        <div className="ml-auto mr-[12.5%] flex h-12 w-px items-end justify-center bg-sky-200">
          <span className="mb-[-2px] h-2 w-2 rotate-45 border-b border-r border-sky-400" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div />
          {copy.process.slice(4).reverse().map((step: string, offset: number) => (
            <FlowNode key={step} index={6 - offset} step={step} direction="left" />
          ))}
        </div>
      </div>
      <div className="grid gap-0 lg:hidden">
        {copy.process.map((step: string, index: number) => (
          <FlowNode key={step} index={index} step={step} direction="down" />
        ))}
      </div>
    </div>
  );
}

function FlowNode({ index, step, direction }: { index: number; step: string; direction: "right" | "left" | "down" }) {
  return (
    <Reveal delay={index * 0.05} className="relative">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-xs font-semibold text-sky-600">{String(index + 1).padStart(2, "0")}</div>
        <div className="mt-3 text-sm font-semibold leading-6 text-slate-950">{step}</div>
      </div>
      {direction !== "down" && index !== 3 && index !== 6 && (
        <span className={`absolute top-1/2 hidden h-px w-6 bg-sky-300 lg:block ${direction === "right" ? "-right-5" : "-left-5"}`}>
          <span className={`absolute -top-1 h-2 w-2 rotate-45 border-sky-400 ${direction === "right" ? "right-0 border-r border-t" : "left-0 border-b border-l"}`} />
        </span>
      )}
      {direction === "down" && index < 6 && (
        <span className="mx-auto block h-8 w-px bg-sky-300">
          <span className="mx-auto mt-6 block h-2 w-2 rotate-45 border-b border-r border-sky-400" />
        </span>
      )}
    </Reveal>
  );
}
