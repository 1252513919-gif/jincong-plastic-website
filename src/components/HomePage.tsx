"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import { FloatingModelShowcase } from "./home/FloatingModelShowcase";
import { HomeHero } from "./home/HomeHero";
import { Reveal } from "./Reveal";

const homeCopy = {
  zh: {
    introEyebrow: "Factory Direct",
    introTitle: "围绕塑料零部件定制，把需求确认清楚再生产",
    introText:
      "锦聪橡塑面向有图纸、样品、产品图片或塑料件定制需求的客户，提供来图来样加工、小批量试产、OEM/ODM 和批量生产配合。首页保留核心信息，具体工厂画面、流程和应用场景放到对应页面查看。",
    points: ["来图来样沟通", "小批量试产", "模具配套评估", "批量生产配合"],
    ctaTitle: "有塑料件定制需求？把图纸或样品发给我们",
    cta: "提交定制需求"
  },
  en: {
    introEyebrow: "Factory Direct",
    introTitle: "Clear requirement review before custom plastic part production",
    introText:
      "Jincong Plastic works with customers who have drawings, samples, product photos or custom plastic part requirements. We support drawing and sample based production, small-batch trials, OEM/ODM and batch manufacturing cooperation.",
    points: ["Drawing and sample review", "Small-batch trial production", "Tooling support review", "Batch production cooperation"],
    ctaTitle: "Have a custom plastic part requirement?",
    cta: "Submit Custom Request"
  }
} as const;

export function HomePage() {
  const { language } = useLanguage();
  const copy = homeCopy[language];

  return (
    <>
      <HomeHero />

      <section id="home-intro" className="relative overflow-hidden bg-white py-16 lg:py-20">
        <div className="section-shell">
          <Reveal className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <div className="eyebrow">{copy.introEyebrow}</div>
              <h2 className="section-title">{copy.introTitle}</h2>
              <p className="section-copy">{copy.introText}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.points.map((point) => (
                <div key={point} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                  <CheckCircle2 className="h-5 w-5 text-sky-600" />
                  <div className="mt-4 text-base font-semibold text-slate-950">{point}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <FloatingModelShowcase />

      <section className="bg-white py-14">
        <div className="section-shell">
          <Reveal className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.06)] md:p-9">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="eyebrow">Inquiry</div>
                <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
                  {copy.ctaTitle}
                </h2>
              </div>
              <Link
                href={localizedPath(language, "/contact")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-sky-700"
              >
                {copy.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
