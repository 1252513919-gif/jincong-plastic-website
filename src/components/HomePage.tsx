"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Factory, Layers3, Mail, Phone, Sparkles, Workflow } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import { catalogProducts } from "@/lib/product-catalog";
import { site } from "@/lib/site";
import { HomeHero } from "./home/HomeHero";
import { Reveal } from "./Reveal";

const statIcons = [Factory, Layers3, Sparkles, Workflow];

export function HomePage() {
  const { language, copy } = useLanguage();
  return (
    <>
      <HomeHero />

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
