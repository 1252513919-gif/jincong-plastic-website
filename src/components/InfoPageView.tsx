import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDot, Factory, Layers3, Workflow } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { content } from "@/i18n/site-content";
import { localizedPath, type Locale } from "@/i18n/routing";

type PageKind = "custom" | "industries" | "factory" | "about" | "faq";

type InfoPageViewProps = {
  locale: Locale;
  kind: PageKind;
};

const pageIcons = [Factory, Layers3, Workflow, CheckCircle2, CircleDot, Factory];

export function InfoPageView({ locale, kind }: InfoPageViewProps) {
  const copy = content[locale];
  const page = copy.pages[kind];

  const intro =
    kind === "about"
      ? copy.about
      : {
          title:
            kind === "custom"
              ? locale === "zh"
                ? "把图纸、样品和试产需求变成可执行的加工方案"
                : "Turn drawings, samples and trial needs into a workable production plan"
              : kind === "industries"
                ? locale === "zh"
                  ? "围绕多行业常用塑料件提供定制加工"
                  : "Custom plastic parts for multiple practical industry scenarios"
                : kind === "factory"
                  ? locale === "zh"
                    ? "以直接沟通、材料建议和稳定交付支撑订单"
                    : "Direct communication, material advice and stable delivery"
                  : locale === "zh"
                    ? "常见问题帮助客户更快准备询盘信息"
                    : "Common questions to help prepare a better inquiry",
          body:
            kind === "faq"
              ? page.description
              : locale === "zh"
                ? "我们不把注塑加工讲成复杂概念，而是围绕材料、结构、数量、交期和交付方式逐项确认，让客户更清楚每一步如何推进。"
                : "We keep injection molding practical: material, structure, quantity, delivery and packaging are reviewed step by step."
        };

  const primaryItems =
    kind === "industries"
      ? copy.industries
      : kind === "custom" || kind === "factory"
        ? copy.capabilities
        : kind === "faq"
          ? [
              locale === "zh" ? "可以做小批量试产吗？可以，适合新品验证和批量生产前确认。" : "Can you support small-batch trials? Yes, for validation before batch production.",
              locale === "zh" ? "没有完整图纸可以沟通吗？可以先提供样品、照片、尺寸和用途。" : "No complete drawing? Sample photos, dimensions and application notes are enough to start.",
              locale === "zh" ? "支持哪些材料？常见 PP、PE、ABS、POM、PC、PVC 等。" : "Materials include PP, PE, ABS, POM, PC, PVC and more."
            ]
          : copy.intro.points;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description}>
        <Link
          href={localizedPath(locale, "/contact")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700"
        >
          {copy.actions.quote}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      <section className="py-20 lg:py-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <Reveal>
            <div className="eyebrow">{kind === "faq" ? "Questions" : "Capability"}</div>
            <h2 className="section-title">{intro.title}</h2>
            <p className="section-copy">{intro.body}</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {primaryItems.map((item, index) => {
              const Icon = pageIcons[index % pageIcons.length];
              return (
                <Reveal key={item} delay={index * 0.04} className="premium-card rounded-[1.75rem] p-6 transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.1)]">
                  <Icon className="h-5 w-5 text-sky-600" />
                  <p className="mt-5 text-sm font-semibold leading-7 text-slate-800">{item}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="section-shell">
          <Reveal>
            <div className="eyebrow">Workflow</div>
            <h2 className="section-title">{locale === "zh" ? "从需求沟通到包装交付" : "From requirement review to delivery"}</h2>
          </Reveal>
          <div className="mt-10 grid gap-3 md:grid-cols-7">
            {copy.process.map((step, index) => (
              <Reveal key={step} delay={index * 0.03} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-sm">
                <div className="text-xs font-semibold text-sky-600">0{index + 1}</div>
                <div className="mt-4 text-sm font-semibold leading-6 text-slate-950">{step}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
