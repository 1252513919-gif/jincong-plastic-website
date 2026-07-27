"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { localizedPath } from "@/i18n/routing";
import { FloatingModelShowcase } from "./home/FloatingModelShowcase";
import { HomeHero } from "./home/HomeHero";
import { Reveal } from "./Reveal";
import StarBorder from "./StarBorder";

const homeCopy = {
  zh: {
    introEyebrow: "Factory Direct",
    introTitle: "围绕塑料零部件定制，把需求确认清楚再生产",
    introText:
      "锦聪橡塑面向有图纸、样品、产品图片或塑料件定制需求的客户，提供来图来样加工、小批量试产、OEM/ODM 和批量生产配合。首页保留核心信息，具体工厂画面、流程和应用场景放到对应页面查看。",
    points: ["来图来样沟通", "小批量试产", "模具配套评估", "批量生产配合"],
    capabilityEyebrow: "Manufacturing Scenes",
    capabilityTitle: "把图纸、样品和使用要求落到实际生产细节",
    capabilityText:
      "首页保留真实制造场景，方便客户快速判断我们是否适合沟通。具体产品仍需要结合结构、材料、尺寸、数量和使用环境确认。",
    capabilityCards: [
      {
        image: "/images/factory/capability-injection-molding.png",
        label: "01 / 注塑加工",
        title: "按结构和材料确认加工方式",
        text: "围绕塑料外壳、卡扣、垫片、连接件等零部件，先确认结构、材料和使用要求，再沟通试样或生产。"
      },
      {
        image: "/images/factory/capability-mass-production.png",
        label: "02 / 小批量到批量",
        title: "适合试产、补充供应和长期配套",
        text: "支持小批量试产，也可根据订单节奏配合批量供货，适合中小批量塑料件定制项目。"
      },
      {
        image: "/images/factory/capability-quality-control.png",
        label: "03 / 交付沟通",
        title: "样品确认后推进包装发货",
        text: "从图纸或样品沟通，到材料、颜色、数量和包装要求确认，尽量把细节前置，减少反复。"
      }
    ],
    bridgeTitle: "从产品图片、样品或图纸开始沟通",
    bridgeText:
      "如果暂时没有完整图纸，也可以先提供清晰产品图片、尺寸、材料偏好和预计数量，我们会先判断是否适合注塑加工或配套生产。",
    bridgeItems: ["产品图片", "实物样品", "尺寸要求", "材料颜色", "预计数量", "使用场景"],
    ctaTitle: "有塑料件定制需求？把图纸或样品发给我们",
    cta: "提交定制需求"
  },
  en: {
    introEyebrow: "Factory Direct",
    introTitle: "Clear requirement review before custom plastic part production",
    introText:
      "Jincong Plastic works with customers who have drawings, samples, product photos or custom plastic part requirements. We support drawing and sample based production, small-batch trials, OEM/ODM and batch manufacturing cooperation.",
    points: ["Drawing and sample review", "Small-batch trial production", "Tooling support review", "Batch production cooperation"],
    capabilityEyebrow: "Manufacturing Scenes",
    capabilityTitle: "Turning drawings, samples and usage details into practical production checks",
    capabilityText:
      "The homepage keeps real manufacturing scenes so customers can quickly understand our communication and production direction. Each project is reviewed by structure, material, size, quantity and application.",
    capabilityCards: [
      {
        image: "/images/factory/capability-injection-molding.png",
        label: "01 / Injection Molding",
        title: "Review structure and material before production",
        text: "For housings, clips, washers, connectors and other plastic parts, we review structure, material and application before sampling or production."
      },
      {
        image: "/images/factory/capability-mass-production.png",
        label: "02 / Trial to Batch",
        title: "Suitable for trial runs and batch supply",
        text: "We support small-batch trial production and batch supply based on order rhythm, especially for practical custom plastic part projects."
      },
      {
        image: "/images/factory/capability-quality-control.png",
        label: "03 / Delivery Review",
        title: "Confirm samples before packaging and delivery",
        text: "From drawings or samples to materials, colors, quantity and packaging, we keep key details clear before production."
      }
    ],
    bridgeTitle: "Start with product photos, samples or drawings",
    bridgeText:
      "If drawings are not ready, clear product photos, dimensions, material preference and estimated quantity are enough for an initial manufacturability discussion.",
    bridgeItems: ["Product photos", "Physical samples", "Dimensions", "Material / color", "Quantity", "Application"],
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

      <section className="home-capability-section">
        <div className="section-shell">
          <Reveal className="home-capability-section__heading">
            <div className="eyebrow">{copy.capabilityEyebrow}</div>
            <h2>{copy.capabilityTitle}</h2>
            <p>{copy.capabilityText}</p>
          </Reveal>

          <div className="home-capability-grid">
            {copy.capabilityCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.06} className="home-capability-card">
                <div className="home-capability-card__image">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="home-capability-card__body">
                  <span>{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-inquiry-bridge">
        <div className="section-shell">
          <Reveal className="home-inquiry-bridge__panel">
            <div>
              <div className="eyebrow">Project Review</div>
              <h2>{copy.bridgeTitle}</h2>
              <p>{copy.bridgeText}</p>
            </div>
            <div className="home-inquiry-bridge__tags">
              {copy.bridgeItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="section-shell">
          <Reveal>
            <StarBorder
              className="home-final-cta rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.06)] md:p-9"
              color="rgba(56, 189, 248, 0.56)"
              speed="8s"
            >
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
            </StarBorder>
          </Reveal>
        </div>
      </section>
    </>
  );
}
